import express from "express"
import { createUser, UserLogin } from "./userController";


const UserRouter = express.Router()

UserRouter.post('/register',createUser)

UserRouter.post('/login',UserLogin)

export default UserRouter;