import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

interface CustomRequest extends Request {
  user?: any;
}

export const getOne = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log(req.user);
    let query = User.findById(req.params.id);
    // if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  }
);
