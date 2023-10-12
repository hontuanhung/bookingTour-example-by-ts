import { signup } from "./authController";
import { Request, Response, NextFunction } from "express";
import { Tour } from "../models/tourModel";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";
import multer from "multer";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import sharp from "sharp";

interface CustomRequest extends Request {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    filename: string;
  };
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

const multerStorage = multer.memoryStorage();

const muterFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: muterFilter,
});

export const uploadTourImgs = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

export const resizeTourImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.files);
    // if (!req.files || !req.files.imageCover || !req.files.images) return next();
    // req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    // await sharp(req.files.imageCover[0].buffer)
    //   .resize(2000, 1333)
    //   .toFormat("jpeg")
    //   .jpeg({ quality: 90 })
    //   .toFile(`public/img/tours/${req.body.imageCover}`);

    // req.body.images = [];
    // await Promise.all(
    //   req.files.images.map(async (file, i) => {
    //     const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
    //     await sharp(file.buffer)
    //       .resize(2000, 1333)
    //       .toFormat("jpeg")
    //       .jpeg({ quality: 90 })
    //       .toFile(`public/img/tours/${filename}`);
    //     req.body.images.push(filename);
    //   })
    // );

    // console.log(req.body);
    next();
  }
);

exports.getAllTours = getAll(Tour);
exports.getTour = getOne(Tour, { path: "reviews" });
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);
