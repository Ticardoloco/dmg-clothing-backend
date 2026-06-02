import { Router } from "express";
import { deleteUser, getUserProfile, getUsersProfile, loginUser, logoutUser, registerUser, updateUserProfile, updateUserStatus } from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";
// import { adminOnly } from "../middleware/adminMiddleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/Profiles").get(getUsersProfile);
router.route("/logout").post(protect, logoutUser);
router.route("/profile").get(protect, getUserProfile);
router.route("/update").put(protect, updateUserProfile);
router.route("/update-status/:id").patch(protect, updateUserStatus);
router.route("/delete/:id").delete(protect, deleteUser);

export default router;