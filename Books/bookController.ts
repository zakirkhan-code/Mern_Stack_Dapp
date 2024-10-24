import { NextFunction, Request, Response } from "express";


const createBook = async(req:Request,res:Response,next:NextFunction)=>{
    console.log("Files",req.files);
    
    res.json({message:"OK"})
}

export {createBook}