import { Model, Schema, model } from "mongoose";

import bcrypt from "bcryptjs";
import crypto from "crypto";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  photo: string;
  role: string;
  userJWTs: string[];
  passwordChangedAt: Date;
  emailToken: string;
  emailTokenExpires: number;
  inactiveAccount: boolean;
  active: boolean;
}

type UserModel = Model<IUser>;

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
  emailToken: String,
  emailTokenExpires: Date,
  inactiveAccount: {
    type: Boolean,
    default: true,
    select: false,
  },
  active: {
    type: Boolean,
    default: false,
    select: false,
  },
});

userSchema.pre("save", async function (next: any): Promise<void> {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre(/^find/, function (this: IUser & UserModel, next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createEmailToken = function (): string {
  const resetToken: string = crypto.randomBytes(32).toString("hex");
  this.emailToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.emailTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (
  tokenExpires: number
): boolean {
  if (Math.round(Number(this.passwordChangedAt) * 0.001) > tokenExpires) {
    return true;
  }
  return false;
};

const User = model<IUser>("User", userSchema);

export { User, IUser };
