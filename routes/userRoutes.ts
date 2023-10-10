import express, { Express, Request, Response, Router } from "express";
import { signup } from "./../controllers/authController";

const userRouter: Router = Router();

userRouter.route("/signup").post(signup);

export { userRouter };
