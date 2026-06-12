import { Router } from "express";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { uploadSocietyDocument } from "../middleware/upload.js";
import {
  createDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
} from "../controllers/documentController.js";

const router = Router();

// POST /api/documents - Admin only
router.post(
  "/",
  auth,
  permit("society_admin"),
  uploadSocietyDocument,
  createDocument
);

// GET /api/documents - Admin (All) & Members (Public only) & Guards
router.get("/", auth, permit("society_admin", "user", "guard"), getDocuments);

// PATCH /api/documents/:id - Admin only
router.patch(
  "/:id",
  auth,
  permit("society_admin"),
  uploadSocietyDocument,
  updateDocument
);

// DELETE /api/documents/:id - Admin only
router.delete("/:id", auth, permit("society_admin"), deleteDocument);


export default router;
