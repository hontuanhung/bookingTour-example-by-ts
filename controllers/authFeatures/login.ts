import { Request, Response, NextFunction } from "express";

import validator from "../../utils/validator";
import { User } from "../../models/userModel";
import AppError from "../../utils/appError";

import jwt from "jsonwebtoken";
import config from "../../config";

function signToken(id: string): string {
  return jwt.sign({ id: id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

export = async (req: Request, res: Response, next: NextFunction) => {
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
};
