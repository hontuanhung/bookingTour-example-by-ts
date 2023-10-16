import { protect, restrictTo } from "./../controllers/authController";
import { Router } from "express";
import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getDistances,
  getMonthlyPlan,
  getTour,
  getTourStats,
  getToursWithin,
  resizeTourImages,
  updateTour,
  uploadTourImgs,
  validateBeforeCreateTour,
  validateBeforeUpdateTour,
} from "../controllers/tourController";
import reviewRoutes from "./reviewRoutes";
import {
  creatReview,
  setTourUserIds,
  validateBeforeReview,
} from "../controllers/reviewController";

const tourRouter: Router = Router();

tourRouter.use("/:tourId/reviews", reviewRoutes);
tourRouter
  .route("/:tourId/reviews")
  .post(
    restrictTo("user", "admin"),
    validateBeforeReview,
    setTourUserIds,
    creatReview
  );

tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/top-5-cheap").get(aliasTopTours, getAllTours);
tourRouter
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

tourRouter
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);

tourRouter.route("/distances/:latlng/unit/:unit").get(getDistances);

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

export default tourRouter;
