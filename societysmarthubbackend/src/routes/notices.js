import { Router } from "express";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { uploadNoticeFiles } from "../middleware/upload.js";
import {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  togglePin,
} from "../controllers/noticeController.js";

const router = Router();

// All routes require authentication
router.use(auth);

// --- Read routes (society_admin + user + guard can read) ---
router.get("/", permit("society_admin", "user", "guard"), getNotices);
router.get("/:noticeId", permit("society_admin", "user", "guard"), getNoticeById);

// --- Write routes (only society_admin) ---
router.post("/", permit("society_admin"), uploadNoticeFiles, createNotice);
router.patch("/:noticeId", permit("society_admin"), uploadNoticeFiles, updateNotice);
router.delete("/:noticeId", permit("society_admin"), deleteNotice);
router.patch("/:noticeId/pin", permit("society_admin"), togglePin);

export default router;
