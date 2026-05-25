import { Router } from "express";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { uploadComplaintImages } from "../middleware/upload.js";
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintStats,
} from "../controllers/complaintController.js";

const router = Router();

router.use(auth);

// ─── USER routes ─────────────────────────────────────────────────────────────
// Submit a new complaint (with image upload)
router.post("/", permit("user", "society_admin"), uploadComplaintImages, createComplaint);

// Get own complaints (user sees only theirs)
router.get("/my", permit("user", "society_admin"), getMyComplaints);

// ─── ADMIN routes ─────────────────────────────────────────────────────────────
// Stats (open/resolved counts etc.)
router.get("/stats", permit("society_admin"), getComplaintStats);

// Get all complaints for the society (with filters + pagination)
router.get("/", permit("society_admin"), getAllComplaints);

// Update status / assign / remarks
router.patch("/:complaintId/status", permit("society_admin"), updateComplaintStatus);

// ─── Shared ──────────────────────────────────────────────────────────────────
// Get single complaint — user sees own, admin sees any in society
router.get("/:complaintId", permit("user", "society_admin"), getComplaintById);

export default router;
