import express from "express";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { addRating, getStaffReviews } from "../controllers/ratingController.js";

const router = express.Router();

// Only residents can rate staff
router.post("/add", auth, permit("user"), addRating);

// Everyone can view reviews
router.get("/staff/:staffId", auth, getStaffReviews);

export default router;
