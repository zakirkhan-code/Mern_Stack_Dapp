import mongoose from "mongoose";
import { Book } from "./bookTypes";

const BookScheme = new mongoose.Schema<Book>({
    title:{
        type:String,
        require:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    file:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export default mongoose.model<Book>("Book",BookScheme)