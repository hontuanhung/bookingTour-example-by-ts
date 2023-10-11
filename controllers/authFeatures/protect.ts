import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

import AppError from "../../utils/appError";
import { User } from "../../models/userModel";
import config from "../../config";

interface CustomRequest extends Request {
  user?: any;
}

export = async (req: CustomRequest, res: Response, next: NextFunction) => {
  // 1) Getting token and check of it's there
  let token: string = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get accesss.", 401)
    );
  }

  // 2) Verification token
  const decoded: any = await jwt.verify(token, config.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser: any = await User.findById(decoded.id).select("+userJWTs");

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does not longer exist.",
        401
      )
    );
  }

  // DTO
  if (!currentUser.userJWTs.includes(token)) {
    return next(new AppError("Token does not match", 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
};
