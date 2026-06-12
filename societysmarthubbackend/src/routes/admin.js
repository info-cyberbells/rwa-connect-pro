import { Router } from "express";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { uploadUserIdProof } from "../middleware/upload.js";
import {
  createUser,
  getSocietyUsers,
  getUserDetails,
  updateUser,
  toggleUserStatus,
  getMySociety,
  addVehicle,
  removeVehicle,
  getDeactivationRequests,
  reviewDeactivationRequest,
  getDashboardStats,
} from "../controllers/adminController.js";
import { getUserActivity } from "../controllers/activityController.js";

const router = Router();

// All routes require authentication
router.use(auth);

// GET /api/admin/dashboard-stats — Both admin and guard can see stats
router.get("/dashboard-stats", permit("society_admin", "guard"), getDashboardStats);

// GET /api/admin/society — Both admin and guard can see society info
router.get("/society", permit("society_admin", "guard"), getMySociety);

// POST /api/admin/users — Create a resident or guard
router.post("/users", permit("society_admin"), uploadUserIdProof, createUser);

// GET /api/admin/users — List all residents (excluding guards for this list)
router.get("/users", permit("society_admin", "guard", "superadmin", "super-admin"), getSocietyUsers);

// GET /api/admin/users/:userId — Get specific resident details
router.get("/users/:userId", permit("society_admin", "guard"), getUserDetails);

// PATCH /api/admin/users/:userId — Update user details
router.patch("/users/:userId", permit("society_admin"), uploadUserIdProof, updateUser);

// PATCH /api/admin/users/:userId/toggle-status — Activate/Deactivate user
router.patch("/users/:userId/toggle-status", permit("society_admin"), toggleUserStatus);

// POST /api/admin/users/:userId/vehicles — Add vehicle to user
router.post("/users/:userId/vehicles", permit("society_admin"), addVehicle);

// DELETE /api/admin/users/:userId/vehicles/:vehicleId — Remove vehicle
router.delete("/users/:userId/vehicles/:vehicleId", permit("society_admin"), removeVehicle);

// GET /api/admin/deactivation-requests — List all requests
router.get("/deactivation-requests", permit("society_admin"), getDeactivationRequests);

// PATCH /api/admin/deactivation-requests/:requestId/review — Approve/Reject
router.patch("/deactivation-requests/:requestId/review", permit("society_admin"), reviewDeactivationRequest);

// GET /api/admin/users/:userId/activity - Get activity log for a specific user
router.get("/users/:userId/activity", permit("society_admin", "guard"), getUserActivity);

export default router;
