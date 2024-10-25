import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { config } from "../config/config";
import { verify } from "jsonwebtoken";


export interface AuthRequest extends Request{
    userId : string
}
const authorization = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.header("Authorization");
    if(!token)
    {
        return next(createHttpError(201,"Token are required"))
    }


    try {
        const parseToken = token.split(' ')[1];
        const decoded = verify(parseToken,config.jwt_secrets as string) 

        const _req = req as AuthRequest;
        _req.userId = decoded.sub as string;
        next();
    } catch (error) {
        console.log(error)
        return next(createHttpError(401,"Token expired"))
    }

}

export default authorization;