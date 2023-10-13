import express, { Express, Request, Response, NextFunction } from "express";

import morgan from "morgan";
import cookieParser from "cookie-parser";

import { tourRouter } from "./routes/tourRoutes";
import { userRouter } from "./routes/userRoutes";
import globalErrorHandler from "./controllers/errorController";

const app: Express = express();

// const touer: Router = Router();
console.log(`===Enviroment: ${process.env.NODE_ENV}===`);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "15kb" }));
app.use(cookieParser());

// app.use(multer().array(""));
app.use(express.static(`${__dirname}/public`));

interface CustomRequest extends Request {
  requestTime?: any;
}

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);

export { app };
