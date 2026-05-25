import bcrypt from "bcryptjs";
import User from "../models/user.js";
import RefreshToken from "../models/RefreshToken.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../services/jwtService.js";
import crypto from "crypto";
import { logActivity } from "../utils/logActivity.js";

const SALT_ROUNDS = 12;

export async function registerSuperAdmin(req, res, next) {
  // Only used for initial seeding. Or create via seed script.
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  if (!user.isActive) {
    return res.status(403).json({
      message: "Account disabled",
    });
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role,
    society: user.society ? user.society.toString() : null,
  };
  const accessToken = signAccessToken({
    sub: payload.userId,
    role: payload.role,
    society: payload.society,
  });
  const refreshToken = signRefreshToken({ sub: payload.userId });

  // update last login (updateOne avoids full validation)
  await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });

  // Log login activity (only for regular users in a society)
  if (user.society) {
    logActivity({
      userId: user._id,
      societyId: user.society,
      action: "login",
      description: "Logged in to the app.",
    });
  }

  // persist refresh token with device info
  const rt = new RefreshToken({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    deviceInfo: {
      ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
    },
  });
  await rt.save();

  // set HttpOnly cookie (recommended)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 3600 * 1000,
  });
  res.json({
    accessToken,
    expiresIn: 15 * 24 * 3600, // seconds — 15 days, frontend sets a timer with this
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      society: user.society,
    },
  });
}

export async function refresh(req, res) {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });
  try {
    const payload = verifyRefreshToken(token); // contains sub
    const r = await RefreshToken.findOne({
      token,
      user: payload.sub,
      revoked: false,
    });
    if (!r) return res.status(401).json({ message: "Invalid refresh token" });

    // rotate: revoke old, issue new
    r.revoked = true;
    await r.save();

    const newRefresh = signRefreshToken({ sub: payload.sub });
    await new RefreshToken({
      user: payload.sub,
      token: newRefresh,
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    }).save();

    // issue new access token
    const user = await User.findById(payload.sub);
    const accessToken = signAccessToken({
      sub: user._id.toString(),
      role: user.role,
      society: user.society ? user.society.toString() : null,
    });

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 3600 * 1000,
    });
    return res.json({ accessToken, expiresIn: 15 * 24 * 3600 });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

export async function logout(req, res) {
  const token = req.cookies.refreshToken;
  if (token) await RefreshToken.updateOne({ token }, { revoked: true });
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
}
