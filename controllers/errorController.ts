import { Request, Response, NextFunction } from "express";

import AppError from "../utils/appError";
import config from "../config";

// export const globalErrorHandler = (
//   err: AppError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // console.log(err.statusCode);
//   res.status(err.statusCode).json({
//     err,
//     message: err.message,
//     stack: err.stack,
//   });
// };
const sendErrorDev = (err: AppError, res: Response) => {
  // console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleCastErrorDB = (err: AppError) => {
  const message: string = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = (err: AppError) => {
  const value: any = err.errmsg.match(/(["'])(\\?.)*?\1/);
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: AppError) => {
  const errors: any = Object.values(err.errors).map((el: any) => el.message);
  const message: string = `invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (err: AppError) =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = (err: AppError) =>
  new AppError("Your token has expried! Please log in again.", 401);

const sendErrorProd = (err: AppError, res: Response) => {
  // Oerational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500; //500~ internal server error
  err.status = err.status || "error";

  if (config.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (config.NODE_ENV === "production") {
    let error: any = { ...err }; //clone err
    console.log(err);
    /* if (error.status === 'error') error = handleCastErrorDB(error); */
    if (error.code === 11000) error = handleDuplicateDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError")
      error = handleJWTExpiredError(error);
    sendErrorProd(error, res);
  }
};
