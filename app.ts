import express, { Express } from "express";

import morgan from "morgan";
import multer from "multer";

import { tourRouter } from "./routes/tourRoutes";
import { userRouter } from "./routes/userRoutes";
import { globalErrorHandler } from "./controllers/errorController";

const app: Express = express();

// const touer: Router = Router();
console.log(`===Enviroment: ${process.env.NODE_ENV}===`);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "15kb" }));

app.use(multer().array(""));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);

export { app };
