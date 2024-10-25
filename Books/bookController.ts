import { NextFunction, Request, Response } from "express";
import path from "path";
import cloudinary from "../config/cloudinary";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Files", req.files);
    const file = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeTypes = file.coverImage[0].mimetype.split('/').at(-1);
    const fileName = file.coverImage[0].filename; 
    const filePath = path.resolve(__dirname, "../../public/data/uploads", fileName);

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            public_id: fileName,
            folder: "Book-covers",
            format: coverImageMimeTypes
        });

        console.log("Upload result", uploadResult);
        res.json({ message: "IMAGE IS OK", uploadResult });
    } catch (error) {
        console.error("Cloudinary upload Image error:", error);
        return next(new Error("Failed to upload Image to Cloudinary"));
    }


    const BookName = file.file[0].filename;
    const BookPath = path.resolve(__dirname,"../../public/data/uploads",BookName);

    try {
        const uploadBooks = await cloudinary.uploader.upload(BookPath,{
            resource_type:"raw",
            filename_override: BookName,
            folder: "Book-Pdf",
            format:"pdf"
        })
        console.log("Upload Book PDF", uploadBooks);
        res.json({ message: "Book PDF IS OK", uploadBooks });
    } catch (error) {
        console.error("Cloudinary upload BOOK PDF error:", error);
        return next(new Error("Failed to upload BOOK PDF to Cloudinary"));
    }

};

export { createBook };
