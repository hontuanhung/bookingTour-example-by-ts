import { Router } from "express";
import { protect, restrictTo } from "../controllers/authController";
import {
  creatReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTourUserIds,
  updateReview,
  validateBeforeReview,
} from "../controllers/reviewController";

("./../controllers/authController");

const reviewRouter: Router = Router({ mergeParams: true });

reviewRouter.use(protect);

reviewRouter
  .route("/")
  .get(getAllReviews)
  .post(
    restrictTo("user", "admin"),
    validateBeforeReview,
    setTourUserIds,
    creatReview
  );

reviewRouter
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), validateBeforeReview, updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

export default reviewRouter;
