import express, { Express, Request, Response, NextFunction } from "express";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import globalErrorHandler from "./controllers/errorController";
import AppError from "./utils/appError";

const app: Express = express();

app.use(helmet());

console.log(`===Enviroment: ${process.env.NODE_ENV}===`);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter: RateLimitRequestHandler = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests fromt this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "15kb" }));

app.use(cookieParser());
app.use(mongoSanitize());
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
app.use("/api/v1/reviews", reviewRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
