import { Router } from "express";
import { getUserProfile, getUsersProfile, loginUser, logoutUser, registerUser, updateUserProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/Profiles").get(getUsersProfile);
router.route("/logout").post(protect, logoutUser);
router.route("/profile").get(protect, getUserProfile);
router.route("/update").put(protect, updateUserProfile);

export default router;