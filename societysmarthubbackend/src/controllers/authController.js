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
import OTPVerification from "../models/OTPVerification.js";
import { sendOTPEmail } from "../services/emailService.js";

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

// ==============================
// FORGOT PASSWORD - SEND OTP
// ==============================
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Delete any existing OTPs for this email
    await OTPVerification.deleteMany({ email });

    // 4. Save new OTP (Expires in 10 minutes)
    await OTPVerification.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      status: "PENDING",
    });

    // 5. Send Email
    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.json({ success: true, message: "OTP sent successfully to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ==============================
// VERIFY OTP
// ==============================
export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTPVerification.findOne({
      email,
      otp,
      status: "PENDING",
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark as VERIFIED and extend expiry by 5 minutes for password reset
    otpRecord.status = "VERIFIED";
    otpRecord.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await otpRecord.save();

    res.json({ success: true, message: "OTP verified successfully. You can now reset your password." });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ==============================
// RESET PASSWORD
// ==============================
export async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    // 1. Check if email is verified in OTP model
    const otpRecord = await OTPVerification.findOne({
      email,
      status: "VERIFIED",
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Please verify your OTP first" });
    }

    // 2. Check if verification session expired (5 min window)
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Session expired. Please request OTP again." });
    }

    // 3. Hash new password
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // 4. Update user password
    await User.updateOne({ email }, { passwordHash });

    // 5. Delete OTP record
    await OTPVerification.deleteMany({ email });

    // 6. Log activity
    const user = await User.findOne({ email });
    if (user && user.society) {
      logActivity({
        userId: user._id,
        societyId: user.society,
        action: "password_reset",
        description: "Password reset via OTP verification.",
      });
    }

    res.json({ success: true, message: "Password reset successful. You can now login with your new password." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

