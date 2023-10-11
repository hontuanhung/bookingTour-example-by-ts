import express, { Express, Request, Response, Router } from "express";
import {
  login,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  testFunction,
} from "./../controllers/authController";

const userRouter: Router = Router();

userRouter.route("/signup").post(signup);
userRouter.route("/very/:token").patch(verifyEmail);
userRouter.route("/login").post(login);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword/:token").patch(resetPassword);
userRouter.route("/test").post(testFunction);

export { userRouter };
