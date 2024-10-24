import { NextFunction, Request, Response } from "express";


const createUser = async (req:Request,res:Response,next:NextFunction)=>{
    res.json("Hello Zakir Kiya hal hai thek ho")
}

export {createUser}