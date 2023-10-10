import express, { Express, Request, Response, Router } from "express";
import { login, signup } from "./../controllers/authController";

const userRouter: Router = Router();

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);

export { userRouter };
