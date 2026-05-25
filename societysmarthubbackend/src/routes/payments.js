import { Router } from "express";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { uploadPaymentScreenshot } from "../middleware/upload.js";
import {
  submitPayment,
  getMyPayments,
  getAllPayments,
  reviewPayment,
} from "../controllers/paymentController.js";

const router = Router();

// All routes require authentication
router.use(auth);

// ─── USER routes ───────────────────────────────────────────────────
router.post("/", permit("user"), uploadPaymentScreenshot, submitPayment);
router.get("/my", permit("user"), getMyPayments);

// ─── ADMIN routes ──────────────────────────────────────────────────
router.get("/", permit("society_admin"), getAllPayments);
router.patch("/:paymentId/review", permit("society_admin"), reviewPayment);

export default router;
