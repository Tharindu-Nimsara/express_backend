import express from 'express';
import { createUser, loginUser } from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.post("/",createUser) // localhost:5000/users
userRouter.post("/login",loginUser) // localhost:5000/users/login


export default userRouter;
