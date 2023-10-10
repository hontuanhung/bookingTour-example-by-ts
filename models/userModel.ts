import { Request, Response, NextFunction } from "express";
import { Schema, model } from "mongoose";

import validator from "validator";
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
    require: [true, "Please tell us your name"],
    trim: true,
  },
  email: {
    type: String,
    require: [true, "Please provide us your email"],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email"],
    // unique: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    require: [true, "Please provide a password"],
    minlength: 8,
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

const User = model("User", userSchema);

export { User, IUser };
