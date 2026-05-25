import { Router } from "express";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { uploadChargeProof } from "../middleware/upload.js";
import {
  createCharge,
  getAllCharges,
  getChargeById,
  updateCharge,
  deleteCharge,
  getMyCharges,
  getMyChargeById,
} from "../controllers/chargeController.js";

const router = Router();

// All routes require authentication
router.use(auth);

// ─── USER routes (must be before :chargeId to avoid conflict) ──────
router.get("/my", permit("user"), getMyCharges);
router.get("/my/:chargeId", permit("user"), getMyChargeById);

// ─── ADMIN routes ──────────────────────────────────────────────────
router.post("/", permit("society_admin"), uploadChargeProof, createCharge);
router.get("/", permit("society_admin"), getAllCharges);
router.get("/:chargeId", permit("society_admin"), getChargeById);
router.patch("/:chargeId", permit("society_admin"), uploadChargeProof, updateCharge);
router.delete("/:chargeId", permit("society_admin"), deleteCharge);

export default router;
