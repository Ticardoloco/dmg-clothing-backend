import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { deleteSubscriber, getAllSubscribers, subscribeToMailingList, updateSubscriberStatus } from "../controllers/mailinglist.controller.js";

const router = Router();

router.route("/subscribe").post(subscribeToMailingList);
router.route("/all").get(protect, getAllSubscribers);
router.route("/delete/:id").delete(protect, deleteSubscriber);
router.route("/update-status/:id").patch(protect, updateSubscriberStatus);



export default router;