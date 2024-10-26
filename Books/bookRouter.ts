import express from "express"
import { createBook, DeleteBook, GetBooks, GetSingleBook, UpdateBook } from "./bookController";
import multer from "multer";
import path from "path";
import authorization from "../middlewares/authorization";


const BookRouter = express.Router()

const upload = multer({
    dest:path.resolve(__dirname,"../../public/data/uploads"),
    limits:{fileSize:3e7}
})

BookRouter.post('/',authorization,upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1}
]),createBook)

BookRouter.patch('/:bookId',authorization,upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1}
]),UpdateBook)

BookRouter.get('/',GetBooks)

BookRouter.get('/:bookId',GetSingleBook)

BookRouter.delete('/:bookId',authorization,DeleteBook)


export default BookRouter;