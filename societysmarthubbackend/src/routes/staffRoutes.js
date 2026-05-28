import express from "express";

const router = express.Router();

import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";

import {
  createStaff,
  searchStaff,
  staffEntry,
  staffExit,
  staffLogs,
  blockStaff,
  unblockStaff,
  blockedStaffList,
  getStaffAttendanceHistory,
  markAttendanceByQR, // [MODULE-A]: Added QR controller
  verifyStaff, // [MODULE-C]: Added verification controller
} from "../controllers/staffController.js";

import {
  createStaffValidation,
  validationMiddleware,
} from "../middleware/staffValidation.js";

import { uploadStaffDocuments } from "../middleware/upload.js"; // [MODULE-C]: Upload middleware

// Test route to verify router is working
router.get("/test", (req, res) => res.json({ message: "Staff routes are accessible" }));

// ==============================
// COMMUNITY STAFF DIRECTORY (Residents can view)
// ==============================
// Moving this to the top to ensure priority
router.get("/directory", auth, permit("user", "admin", "society_admin", "guard"), staffLogs);

// [MODULE-A]: QR Based Attendance Route (For Guard)
router.post("/mark-qr",auth,permit("guard", "admin", "society_admin"),
markAttendanceByQR,
);

// ==============================
// MEMBER CREATE STAFF
// ==============================

router.post(
  "/create",
  auth,
  permit("admin", "society_admin"),
  uploadStaffDocuments, // [MODULE-C]: Handle document uploads
  createStaffValidation,
  validationMiddleware,
  createStaff,
);

// ==============================
// [MODULE-C]: ADMIN VERIFY STAFF
// ==============================

router.patch(
  "/verify-member/:staffId",
  auth,
  permit("admin", "society_admin"),
  uploadStaffDocuments, // Add this to handle file uploads
  verifyStaff,
);

// ==============================
// GUARD SEARCH STAFF
// ==============================

router.get(
  "/search",
  auth,
  permit("guard", "admin", "society_admin"),
  searchStaff,
);

// ==============================
// GUARD STAFF ENTRY
// ==============================

router.post(
  "/entry",
  auth,
  permit("guard", "admin", "society_admin"),
  staffEntry,
);

// ==============================
// GUARD STAFF EXIT
// ==============================

router.post(
  "/exit",
  auth,
  permit("guard", "admin", "society_admin"),
  staffExit,
);

// ==============================
// ADMIN STAFF LOGS
// ==============================

router.get("/logs", auth, permit("admin", "society_admin", "guard"), staffLogs);

// ==============================
// ADMIN BLOCK STAFF
// ==============================

router.post("/block", auth, permit("admin", "society_admin"), blockStaff);

// ==============================
// ADMIN UNBLOCK STAFF
// ==============================

router.post("/unblock", auth, permit("admin", "society_admin"), unblockStaff);

// ==============================
// ADMIN BLOCKED STAFF LIST
// ==============================

router.get(
  "/blocked-list",
  auth,
  permit("admin", "society_admin", "guard"),
  blockedStaffList,
);

router.get("/attendance-history/:staffId", auth, getStaffAttendanceHistory);

export default router;
