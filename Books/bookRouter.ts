import express from "express"
import { createBook } from "./bookController";


const BookRouter = express.Router()

BookRouter.post('/',createBook)


export default BookRouter;