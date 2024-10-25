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
        res.json({ message: "OK", uploadResult });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return next(new Error("Failed to upload image to Cloudinary"));
    }
};

export { createBook };
