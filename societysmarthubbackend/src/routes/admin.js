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
} from "../controllers/adminController.js";
import { getUserActivity } from "../controllers/activityController.js";

const router = Router();

// All routes require authentication and society_admin role
router.use(auth);
router.use(permit("society_admin"));

// GET /api/admin/society
router.get("/society", getMySociety);

// POST /api/admin/users - Create user (with optional ID proof upload)
router.post("/users", uploadUserIdProof, createUser);

// GET /api/admin/users
router.get("/users", getSocietyUsers);

// GET /api/admin/users/:userId
router.get("/users/:userId", getUserDetails);

// PATCH /api/admin/users/:userId - Update user (with optional ID proof upload)
router.patch("/users/:userId", uploadUserIdProof, updateUser);

// PATCH /api/admin/users/:userId/toggle-status
router.patch("/users/:userId/toggle-status", toggleUserStatus);

// POST /api/admin/users/:userId/vehicles - Add a vehicle
router.post("/users/:userId/vehicles", addVehicle);

// DELETE /api/admin/users/:userId/vehicles/:vehicleId - Remove a vehicle
router.delete("/users/:userId/vehicles/:vehicleId", removeVehicle);

// GET /api/admin/deactivation-requests - Get all deactivation requests in society
router.get("/deactivation-requests", getDeactivationRequests);

// PATCH /api/admin/deactivation-requests/:requestId/review - Approve or reject
router.patch("/deactivation-requests/:requestId/review", reviewDeactivationRequest);

// GET /api/admin/users/:userId/activity - Get activity log for a specific user
router.get("/users/:userId/activity", getUserActivity);

export default router;
