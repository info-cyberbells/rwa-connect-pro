import { Router } from "express";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { uploadSocietyLogo, uploadKycDocs, uploadPlatformLogo } from "../middleware/upload.js";
import {
  createSociety,
  createAdminForSociety,
  getAllSocieties,
  getSocietyDetails,
  toggleUserStatus,
} from "../controllers/superAdminController.js";
import {
  getPlatformConfig,
  updatePlatformConfig,
  updateNotificationRules,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getActiveSessions,
  revokeSession,
  getSecurityInfo,
} from "../controllers/settingsController.js";

const router = Router();

// All routes require authentication and superadmin role
router.use(auth);
router.use(permit("superadmin"));

// ─── Societies ────────────────────────────────────────────────────────────────
router.post("/societies", uploadSocietyLogo, createSociety);
router.get("/societies", getAllSocieties);
router.get("/societies/:societyId", getSocietyDetails);

// ─── Admins ───────────────────────────────────────────────────────────────────
router.post("/admins", uploadKycDocs, createAdminForSociety);

// ─── Users ────────────────────────────────────────────────────────────────────
router.patch("/users/:userId/toggle-status", toggleUserStatus);

// ─── Settings: Platform Config ────────────────────────────────────────────────
router.get("/settings/platform", getPlatformConfig);
router.patch("/settings/platform", uploadPlatformLogo, updatePlatformConfig);

// ─── Settings: Notification Rules ─────────────────────────────────────────────
router.patch("/settings/notifications", updateNotificationRules);

// ─── Settings: Subscription Plans ─────────────────────────────────────────────
router.get("/settings/plans", getPlans);
router.post("/settings/plans", createPlan);
router.patch("/settings/plans/:planId", updatePlan);
router.delete("/settings/plans/:planId", deletePlan);

// ─── Settings: Sessions ───────────────────────────────────────────────────────
router.get("/settings/sessions", getActiveSessions);
router.delete("/settings/sessions/:sessionId", revokeSession);

// ─── Settings: Security Info ──────────────────────────────────────────────────
router.get("/settings/security", getSecurityInfo);

export default router;
