import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    try {
        const user = await userModel.findOne({ email });

        if (user) {
            const error = createHttpError(400, "User already exists with this email");
            return next(error);
        }
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error occurred while checking user existence"));
    }

    const passHash = await bcrypt.hash(password, 10);

    let newUser: User | null = null;
    try {
        newUser = await userModel.create({
            name,
            email,
            password: passHash,
        });
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error occurred while creating the user"));
    }

    try {
        const token = sign({ sub: newUser._id }, config.jwt_secrets as string, {
            expiresIn: '7d',
            algorithm: 'HS384',
        });

        res.status(201).json({ accessToken: token });
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error occurred while generating the token"));
    }
};


const UserLogin = async (req: Request, res: Response, next: NextFunction)=>{
    const {email,password} = req.body;

    if (!email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }
    const user = await userModel.findOne({email})

    try {

        if (!user) {
            const error = createHttpError(400, "User cannot exists with this email");
            return next(error);
        }

    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error occurred while checking user existence"));
    }

    const isMatch = await bcrypt.compare(password,user.password)

    try {
        if(!isMatch)
            {
                const error = createHttpError(400, "Password cannot be matched");
                return next(error);
            }
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error occurred while checking user Password"));
    }

    try {
        const token = sign({ sub: user._id }, config.jwt_secrets as string, {
            expiresIn: '7d',
            algorithm: 'HS384',
        });

        res.status(201).json({ accessToken: token });
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error occurred while generating the token"));
    }

}


export {createUser,UserLogin}