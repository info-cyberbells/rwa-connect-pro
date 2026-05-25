import { Router } from "express";
import { login, refresh, logout } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/login - Login with email and password
router.post("/login", login);

// POST /api/auth/refresh - Refresh access token using refresh token
router.post("/refresh", refresh);

// POST /api/auth/logout - Logout and revoke refresh token
router.post("/logout", logout);

export default router;
