import { Router } from "express";
import auth from "../middleware/auth.js";
import { uploadProfilePic } from "../middleware/upload.js";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  requestDeactivation,
  getMyDeactivationRequest,
  cancelDeactivationRequest,
  getDashboardSummary,
  updateMyPreferences,
} from "../controllers/profileController.js";

const router = Router();

// All routes require authentication (any role can access)
router.use(auth);

// GET /api/profile/dashboard-summary
router.get("/dashboard-summary", getDashboardSummary);

// GET /api/profile — get my profile
router.get("/", getMyProfile);

// PATCH /api/profile — update my profile (name, phone, pic)
router.patch("/", uploadProfilePic, updateMyProfile);

// PATCH /api/profile/password — change password
router.patch("/password", changePassword);

// PATCH /api/profile/preferences — update notification/theme settings
router.patch("/preferences", updateMyPreferences);

// POST /api/profile/deactivation-request — user submits deactivation request
router.post("/deactivation-request", requestDeactivation);

// GET /api/profile/deactivation-request — user checks their request status
router.get("/deactivation-request", getMyDeactivationRequest);

// DELETE /api/profile/deactivation-request — user cancels pending request
router.delete("/deactivation-request", cancelDeactivationRequest);

export default router;
