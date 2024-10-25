import { NextFunction, Request, Response } from "express";
import path from "path";
import cloudinary from "../config/cloudinary";
import bookModal from "./bookModal";
import fs from "fs";
import { AuthRequest } from "../middlewares/authorization";

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

export { createBook };
