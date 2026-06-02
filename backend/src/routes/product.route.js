import { Router } from "express";
import { deleteProduct, getProducts, postProduct, updateProduct } from "../controllers/product.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// route
router.route("/create").post(protect, postProduct);
router.route("/products").get(getProducts);
router.route("/update/:id").patch(protect, updateProduct);
router.route("/delete/:id").delete(protect, deleteProduct);

export default router;