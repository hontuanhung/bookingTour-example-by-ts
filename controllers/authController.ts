import { Request, Response, NextFunction } from "express";
import config from "../config";

import jwt from "jsonwebtoken";
import cron from "node-cron";
import crypto from "crypto";

import { User } from "../models/userModel";

import catchAsync from "../utils/catchAsync";
import validator from "../utils/validator";
import AppError from "../utils/appError";
import Email from "../utils/email";

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

    const newUser: any = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      photo: req.body.photo,
      role: req.body.role,
    });

    const token: string = crypto.randomBytes(32).toString("hex");

    const verifyURL: string = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/verify/${newUser._id}}`;
    await new Email(newUser, verifyURL).sendWelcome();

    res.status(201).json({
      status: "success",
      msg: "Your sign up was successful. Please verify your email by clicking the link in the email we sent you before signing in to our service later",
    });
  }
);

export const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken: string = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user: any = await User.findOne({
      emailToken: hashedToken,
      emailTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      next(new AppError("Token is invalid or has expired", 400));
    }

    user.active = true;
    user.emailToken = undefined;
    user.emailTokenExpires = undefined;

    user.save();

    res.status(200).json({
      status: "success",
    });
  }
);

export const login = catchAsync(async (req, res, next) => {
  validator(req.body, {
    email: { required: true, type: "string", isEmail: true },
    password: {
      required: true,
      type: "string",
      minlength: [8, "Your password must be at least 8 characters long."],
    },
  });

  const { email, password } = req.body;

  const user: any = await User.findOne({ email: email }).select(
    "+password +userJWTs"
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token: string = signToken(user._id);
  user.userJWTs.push(token);
  await user.save();

  interface CookieOptions {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  }

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  validator(req.body, {
    email: { required: true, type: "string", isEmail: true },
  });

  const user: any = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  const resetToken = user.createEmailToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  validator(req.body, {
    password: {
      required: true,
      type: "string",
      minlength: [8, "Your password must be at least 8 characters long"],
    },
    passwordConfirm: { required: true, type: "string" },
  });

  const hashedToken: string = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user: any = await User.findOne({
    emailToken: hashedToken,
    emailTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.emailToken = undefined;
  user.emailTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

export const testFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resetToken = crypto.randomBytes(32);
  const tokenString = resetToken.toString("hex");

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  res.status(200).json({
    status: "success",
    // token: token,
  });
};
