import express, { Express, Request, Response, Router } from "express";
import { getAllTour } from "../controllers/tourController";

const tourRouter: Router = Router();

tourRouter.route("/").get(getAllTour);

export { tourRouter };
