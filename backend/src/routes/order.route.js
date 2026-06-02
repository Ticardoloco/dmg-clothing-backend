import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getMyOrders, getSingleOrder, updateOrderStatus, updatePaymentStatus } from "../controllers/order.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/create").post(protect, createOrder);
router.route("/orders").get(protect, getAllOrders);
router.route("/my-orders").get(protect, getMyOrders);
router.route("/:id").get(protect, getSingleOrder);
router.route("/update/:id").patch(protect, updateOrderStatus);
router.route("/delete/:id").delete(protect, deleteOrder);
router.route("/update-payment/:id").patch(protect, updatePaymentStatus);

export default router;