import { Router } from "express";
import { createContact, deleteContact, getAllContacts } from "../controllers/contact.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/create").post(protect, createContact);
router.route("/all").get(protect, getAllContacts);
router.route("/delete/:id").delete(protect, deleteContact);

export default router;