import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req:Request,res:Response,next:NextFunction)=>{

    const{name,email,password} = req.body;

    if(!name||!email||!password)
    {
        const error = createHttpError(400,"All field are Required")
        return next(error)
    }

    const user = await userModel.findOne({email})

    if(user)
    {
        const error = createHttpError(400,"user already exist in this email")
        return next(error)
    }

    const passHash = await bcrypt.hash(password,10)

    const newUser = userModel.create({
        name,
        email,
        password:passHash
    })

    const token = sign({sub:(await newUser)._id},config.jwt_secrets as string,{
        expiresIn:'7d',
        algorithm:'HS384'
    })

    res.json({accessToken: token})
}

export {createUser}