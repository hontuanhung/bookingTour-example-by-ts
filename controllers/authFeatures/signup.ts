import { Request, Response, NextFunction } from "express";
import validator from "../../utils/validator";
import { User } from "../../models/userModel";
import Email from "../../utils/email";
import { validate } from "../validateController";

export = async (req: Request, res: Response, next: NextFunction) => {
  validate("signup", req.body, next);

  const newUser: any = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    photo: req.body.photo,
    role: req.body.role,
  });

  const token: string = newUser.createEmailToken();
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
