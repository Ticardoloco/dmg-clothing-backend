import { Router } from "express";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/dashboard", protect, adminOnly, (req, res) => {
    res.json({message: "Welcome to the admin dashboard"});
});

export default router;