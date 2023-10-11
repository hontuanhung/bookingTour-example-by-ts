import { Request, Response, NextFunction } from "express";
import validator from "../../utils/validator";
import { User } from "../../models/userModel";
import Email from "../../utils/email";

export = async (req: Request, res: Response, next: NextFunction) => {
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

  const newUser: any = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    photo: req.body.photo,
    role: req.body.role,
  });
  console.log(newUser);

  const token = newUser.createEmailToken();
  newUser.save();

  const verifyURL: string = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verify/${token}`;
  await new Email(newUser, verifyURL).sendWelcome();

  res.status(201).json({
    status: "success",
    msg: "Your sign up was successful. Please verify your email by clicking the link in the email we sent you before signing in to our service later",
  });
};