import { resetPassword } from "../authController";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { User } from "../../models/userModel";
import AppError from "../../utils/appError";

interface CustomRequest extends Request {
  isVerify?: true;
}

export = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const hashedToken: string = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user: any = await User.findOne({
    emailToken: hashedToken,
    // emailTokenExpires: { $gt: Date.now() },
    inactiveAccount: true,
  });
  if (!user) {
    next(new AppError("Token is invalid or has expired", 400));
  }
  new User({}).save({});

  user.inactiveAccount = false;
  user.active = true;
  user.emailToken = undefined;
  user.emailTokenExpires = undefined;
  req.isVerify = true;
  user.save();

  res.status(200).json({
    status: "success",
  });
};
