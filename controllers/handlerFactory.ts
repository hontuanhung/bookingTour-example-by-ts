import { Request, Response, NextFunction } from "express";

import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import APIFeatures from "../utils/apiFeatures";
import { Model } from "mongoose";

export const getAll = (Model: Model<any>, popOptions?: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // EXECUTE QUERY
    console.log(req.query);
    //To allow for nested GET reviews on tour
    let filter: object = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features: APIFeatures = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    if (popOptions)
      features.query.populate({
        path: "tour",
        select: "name",
      });
    const docs: any = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        docs,
      },
    });
  });

export const getOne = (Model: Model<any>, popOptions?: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query: any = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc: any = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

export const createOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: any = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const updateOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const docChanged = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!docChanged) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: docChanged,
      },
    });
  });

export const deleteOne =
  (Model: Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.id);
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  };

export default {};
