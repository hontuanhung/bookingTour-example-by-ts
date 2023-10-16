import { Request, Response, NextFunction } from "express";

import { Review } from "./../models/reviewModel";
import catchAsync from "./../utils/catchAsync";
import validator from "../utils/validator";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";

interface CustomRequest extends Request {
  user?: any;
}

export const setTourUserIds = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  req.body.user = req.user.id;
  req.body.tour = req.params.tourId;
  next();
};

export const validateBeforeReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    validator(req.body, {
      review: { required: true, type: "string" },
      rating: { type: "number", min: 1, max: 5 },
    });
    next();
  }
);

export const getAllReviews = getAll(Review, {
  path: "tour",
  select: "name",
});
export const getReview = getOne(Review);
export const creatReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
