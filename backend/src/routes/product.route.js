import { Router } from "express";
import { deleteProduct, getProducts, postProduct, updateProduct } from "../controllers/product.controller.js";

const router = Router();

// route
router.route("/create").post(postProduct);
router.route("/get").get(getProducts);
router.route("/update/:id").patch(updateProduct);
router.route("/delete/:id").delete(deleteProduct);

export default router;