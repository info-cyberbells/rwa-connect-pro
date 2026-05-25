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
} from "../controllers/staffController.js";

import {
  createStaffValidation,
  validationMiddleware,
} from "../middleware/staffValidation.js";

// [MODULE-A]: QR Based Attendance Route (For Guard)
router.post(
  "/mark-qr",
  auth,
  permit("guard", "admin", "society_admin"),
  markAttendanceByQR,
);

// ==============================
// MEMBER CREATE STAFF
// ==============================

router.post(
  "/create",
  auth,
  permit("admin", "society_admin"),
  createStaffValidation,
  validationMiddleware,
  createStaff,
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
