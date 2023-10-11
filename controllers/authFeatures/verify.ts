import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { User } from "../../models/userModel";

export = async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken: string = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // ba23606f6bfdc059f4b8d0180a8c3ef406b33ee2f49182f433e63443e22e1610
  const user: any = await User.findOne({
    emailToken: hashedToken /* , emailTokenExpires: { $gt: Date.now() } */,
  });
  console.log(user);
  // if (!user) {
  //   next(new AppError("Token is invalid or has expired", 400));
  // }
  // new User({}).save({});

  // user.active = true;
  // user.emailToken = undefined;
  // user.emailTokenExpires = undefined;

  // user.save();

  // res.status(200).json({
  //   status: "success",
  // });
};
