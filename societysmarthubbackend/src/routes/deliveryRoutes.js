import express from "express";

const router = express.Router();

import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";

import {
  createDelivery,
  deliveryExit,
  deliveryLogs,
} from "../controllers/deliveryController.js";

import {
  createDeliveryValidation,
  validationMiddleware,
} from "../middleware/deliveryValidation.js";

// ==============================
// GUARD CREATE DELIVERY
// ==============================

router.post(
  "/create",
  auth,
  permit("guard", "society_admin"),
  createDeliveryValidation,
  validationMiddleware,
  createDelivery,
);

// ==============================
// GUARD DELIVERY EXIT
// ==============================

router.post(
  "/exit",
  auth,
  permit("guard", "society_admin"),
  deliveryExit,
);

// ==============================
// ADMIN DELIVERY LOGS
// ==============================

router.get(
  "/logs",
  auth,
  permit("society_admin", "guard"),
  deliveryLogs,
);

export default router;
