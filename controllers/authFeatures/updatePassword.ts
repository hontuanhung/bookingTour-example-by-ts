import { Request, Response, NextFunction } from "express";
import { User } from "../../models/userModel";
import validator from "../../utils/validator";
import AppError from "../../utils/appError";

interface CustomRequest extends Request {
  user?: any;
}

export = async (req: CustomRequest, res: Response, next: NextFunction) => {
  validator(req.body, {
    currentPassword: { required: true, type: "string" },
    newPassword: { required: true, type: "string", minlength: 8 },
    newPasswordConfirm: { required: true, type: "string" },
  });

  const user: any = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your password is incorrect!", 401));
  }
  // 3) If so, update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;

  await user.save();

  res.status(200).json({
    status: "success",
  });
};
