import { Request, Response, NextFunction } from "express";

import validator from "../../utils/validator";
import crypto from "crypto";
import { User } from "../../models/userModel";
import AppError from "../../utils/appError";

export = async (req: Request, res: Response, next: NextFunction) => {
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
};
