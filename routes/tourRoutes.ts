import { protect, restrictTo } from "./../controllers/authController";
import express, { Express, Request, Response, Router } from "express";
import {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  resizeTourImages,
  updateTour,
  uploadTourImgs,
  validateBeforeCreateTour,
  validateBeforeUpdateTour,
} from "../controllers/tourController";

const tourRouter: Router = Router();

tourRouter
  .route("/")
  .get(getAllTours)
  .post(
    protect,
    restrictTo("admin", "lead-guide"),
    uploadTourImgs,
    resizeTourImages,
    validateBeforeCreateTour,
    createTour
  );

tourRouter
  .route("/:id")
  .get(getTour)
  .patch(
    protect,
    restrictTo("admin", "lead-guide"),
    validateBeforeUpdateTour,
    uploadTourImgs,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

export { tourRouter };
