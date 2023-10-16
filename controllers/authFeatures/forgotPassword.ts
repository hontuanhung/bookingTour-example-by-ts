import { Request, Response, NextFunction } from "express";
import validator from "../../utils/validator";
import Email from "../../utils/email";
import AppError from "../../utils/appError";
import { User } from "../../models/userModel";

export = async (req: Request, res: Response, next: NextFunction) => {
  validator(req.body, {
    email: { required: true, type: "string", isEmail: true },
  });

  // 1) Get user based on POSTed email
  const user: any = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken: string = user.createEmailToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL: string = `${req.protocol}://${req.get(
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
};
