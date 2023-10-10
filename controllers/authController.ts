import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import cron, { schedule } from "node-cron";

import { User, IUser } from "../models/userModel";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import validator from "../utils/validator";

function signToken(id: string): string {
  return jwt.sign({ id: id }, "1d", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
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
      // console.log(el);
    }
  },
  {
    scheduled: true,
  }
);
removeExpredJWT.start();

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    validator(req.body, {
      name: { required: true, type: "string" },
      email: { required: true, type: "string", isEmail: true },
      password: {
        required: true,
        type: "string",
        minlength: [8, "Your password must be at least 8 characters long."],
      },
      passwordConfirm: { required: true, type: "string" },
      photo: { type: "string" },
      role: { type: "string", enum: ["user", "guide", "lead-guide", "admin"] },
    });

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      photo: req.body.photo,
      role: req.body.role,
    });
    console.log(newUser);

    const token: string = signToken(newUser._id);
    newUser.userJWTs.push(token);
    await newUser.save();

    interface CookieOptions {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
    }

    const cookieOptions: CookieOptions = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }
    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  }
);
