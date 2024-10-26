import { NextFunction, Request, Response } from "express";
import path from "path";
import cloudinary from "../config/cloudinary";
import bookModal from "./bookModal";
import fs from "fs";
import { AuthRequest } from "../middlewares/authorization";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const {title,genre} = req.body;
    console.log("Files", req.files);
    const file = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeTypes = file.coverImage[0].mimetype.split('/').at(-1);
    const fileName = file.coverImage[0].filename; 
    const filePath = path.resolve(__dirname, "../../public/data/uploads", fileName);


    const BookName = file.file[0].filename;
    const BookPath = path.resolve(__dirname,"../../public/data/uploads",BookName);

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            public_id: fileName,
            folder: "Book-covers",
            format: coverImageMimeTypes
        });

        const uploadBooks = await cloudinary.uploader.upload(BookPath,{
            resource_type:"raw",
            filename_override: BookName,
            folder: "Book-Pdf",
            format:"pdf"
        })

        const _req = req as AuthRequest;
        console.log("User ID:", _req.userId); // Add this line for debugging


        const newBook = await bookModal.create({
            title,
            genre,
            author: _req.userId, // This should be the correct user ID
            coverImage: uploadResult.secure_url,
            file: uploadBooks.secure_url,
        });
        

        await fs.promises.unlink(filePath)
        await fs.promises.unlink(BookPath)

        // console.log("Upload result", uploadResult);
        // console.log("Upload Book PDF", uploadBooks);
        console.log("Id : ",_req);
        
        res.status(201).json({ id:newBook._id });
    } catch (error) {
        console.error("Cloudinary upload Image and book pdf error:", error);
        return next(new Error("Failed to upload Image and book pdf  to Cloudinary"));
    }
};

const UpdateBook = async (req: Request, res: Response, next: NextFunction)=>{
    const {title,genre} = req.body;
    const bookId = req.params.bookId;

    const book = await bookModal.findOne({_id:bookId})
    if(!book)
    {
        return next(createHttpError(404,"Book not found"))
    }
    const _req = req as AuthRequest;
    if(book.author.toString()!==_req.userId)
    {
        return next(createHttpError(404,"You cannot update this Book"))
    }
    const files = req.files as {[fieldname:string]:Express.Multer.File[]}

    let completeCoverImage= "";
    if(files.coverImage)
    {
        const filename = files.coverImage[0].filename;
        const coverMimetype = files.coverImage[0].mimetype.split('/').at(-1);
        const filePath = path.resolve(__dirname,'../../public/data/uploads',filename);
        completeCoverImage = `${filename}.${coverMimetype}`
        completeCoverImage=filename;
        const uploadResult = await cloudinary.uploader.upload(filePath,{
            filename_override:completeCoverImage,
            folder:"Book-covers",
            format:coverMimetype,
        });

        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filePath)
    }

    if(files.file)
        {
            const bookName = files.file[0].filename;
            const filePath = path.resolve(__dirname,'../../public/data/uploads',bookName);
            completeCoverImage = `${bookName}`
            completeCoverImage=bookName;
            const uploadBook = await cloudinary.uploader.upload(filePath,{
                resource_type:'raw',
                filename_override:completeCoverImage,
                folder:"Book-Pdf",
                format:'pdf',
            });
    
            completeCoverImage = uploadBook.secure_url;
            await fs.promises.unlink(filePath)
        }

        const updateBook = await bookModal.findOneAndUpdate({_id:bookId,},{
            title:title,
            genre:genre,
            coverImage:completeCoverImage?completeCoverImage:book.coverImage,
            file:completeCoverImage?completeCoverImage:book.file,
        },
    {
        new:true
    });

    res.json({updateBook})
}

const GetBooks = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const book = await bookModal.find()

        res.json(book)
    } catch (error) {
        console.log(error);
        
        return next(createHttpError(500,"Error while getting a book"))
    }
}

const GetSingleBook = async (req:Request,res:Response,next:NextFunction)=>{
    const bookId = req.params.bookId;
    try {
        const book = await bookModal.findOne({_id:bookId})
        if(!book)
        {
            return next(createHttpError(401,"Book is not found"))
        }
        res.json({book})
    } catch (error) {
        console.log(error);
        return next(createHttpError(500,"Error while getting book"))
    }
}

const DeleteBook = async (req:Request,res:Response,next:NextFunction)=>{

    const bookId = req.params.bookId;
    const book = await bookModal.findOne({_id:bookId})
    if(!book)
    {
        return next(createHttpError(404,"Book cannot Be found"))
    }
    
}

export { createBook , UpdateBook , GetBooks , GetSingleBook , DeleteBook};
