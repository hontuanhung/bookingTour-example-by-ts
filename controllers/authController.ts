import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import cron from "node-cron";

import signupFeat from "./authFeatures/signup";
import loginFeat from "./authFeatures/login";
import verifyFeat from "./authFeatures/verify";
import forgotPasswordFeat from "./authFeatures/forgotPassword";
import protectFeat from "./authFeatures/protect";
import resetPasswordFeat from "./authFeatures/resetPassword";
import updatePasswordFeat from "./authFeatures/updatePassword";

import { User } from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

interface CustomRequest extends Request {
  user?: any;
}

const removeExpredJWT = cron.schedule(
  "*/5 * * * *",
  async () => {
    let users = await User.find().select("+userJWTs");
    let currentDateStamp: number = Math.floor(Date.now() * 0.001);
    for (const el of users) {
      for (const [index, val] of el.userJWTs.entries()) {
        const decoded: any = jwt.decode(val);
        if (decoded.exp < currentDateStamp) {
          el.userJWTs.splice(index, 1);
        }
      }
      await el.save();
    }
  },
  {
    scheduled: true,
  }
);
removeExpredJWT.start();

export const restrictTo = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    // roles['admin', 'lead-guide']
    if (roles.includes(req.user.role)) {
      return next();
    }
    next(
      new AppError("You do not have permission to perform this action", 403) //403~ forbidden
    );
  };
};

export const signup = catchAsync(signupFeat);
export const login = catchAsync(loginFeat);
export const verifyEmail = catchAsync(verifyFeat);
export const forgotPassword = catchAsync(forgotPasswordFeat);
export const resetPassword = catchAsync(resetPasswordFeat);
export const protect = catchAsync(protectFeat);
export const updatePassword = catchAsync(updatePasswordFeat);

export const testFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
