import { Request, Response, NextFunction } from "express";
import { Tour } from "../models/tourModel";

export async function getAllTour(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tours = await Tour.find();
  // console.log(tours);
  res.status(200).json({
    status: "success",
    tours,
  });
}
