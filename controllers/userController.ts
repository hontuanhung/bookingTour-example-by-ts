import { Request, Response, NextFunction } from "express";

import multer from "multer";
import sharp from "sharp";

import { User } from "../models/userModel";
import { deleteOne, getAll, getOne, updateOne } from "./handlerFactory";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import validator from "../utils/validator";
import { validate } from "./validateController";

interface CustomRequest extends Request {
  user?: any;
}

const filterObj = (obj: any, ...allowedFields: string[]): any => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const multerStorage = multer.memoryStorage();

// const multerFilter = (req: Request, file: Express.Multer.File, cb: any) => {
const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  }
);

export const getMe = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  req.params.id = req.user.id;
  console.log(req.cookies);
  next();
};

export const updateMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log(req.file);
    console.log(req.body);

    //  1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword",
          400
        )
      );
    }

    validate("updateMe", req.body, next);
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody: any = filterObj(req.body, "name", "email");
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser: any = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    await updatedUser.save();

    res.status(200).json({
      satus: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
    });
  }
);

export const validateBeforeUpdateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError("This route is not for password updates.", 400));
    }
    validate("updateUser", req.body, next);
    next();
  }
);

export const getAllUser = getAll(User);
export const getUser = getOne(User);
// Do NOT update passwords with this
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
