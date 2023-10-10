import { Request, Response, NextFunction } from "express";
import { Schema, model } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  photo: string;
  role: string;
  userJWTs: string[];
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  active: boolean;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    default: "user",
  },
  password: {
    type: String,
    select: false,
  },
  userJWTs: { type: [String], select: false },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword: string,
  userPassword: string
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = model("User", userSchema);

export { User, IUser };
