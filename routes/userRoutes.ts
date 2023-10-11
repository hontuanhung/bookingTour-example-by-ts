import { restrictTo, updatePassword } from "./../controllers/authController";
import { Router } from "express";
import {
  login,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  protect,
  testFunction,
} from "../controllers/authController";
import {
  deleteMe,
  deleteUser,
  getAllUser,
  getUser,
  resizeUserPhoto,
  updateMe,
  updateUser,
  uploadUserPhoto,
  validateBeforeUpdateUser,
} from "../controllers/userController";

const userRouter: Router = Router();

userRouter.post("/signup", signup);
userRouter.patch("/verify/:token", verifyEmail);
userRouter.post("/login", login);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
userRouter.post("/test", testFunction);

userRouter.use(protect);

userRouter.patch("/updatePassword", updatePassword);

userRouter.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
userRouter.delete("/deleteMe", deleteMe);

userRouter.use(restrictTo("admin"));

userRouter.route("/").get(getAllUser);
userRouter
  .route("/:id")
  .get(getUser)
  .patch(validateBeforeUpdateUser, updateUser)
  .delete(deleteUser);

export { userRouter };
