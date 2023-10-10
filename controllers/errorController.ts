import { Request, Response, NextFunction } from "express";

import AppError from "../utils/appError";

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(err.statusCode);
  res.status(err.statusCode).json({
    err,
    message: err.message,
    stack: err.stack,
  });
};
