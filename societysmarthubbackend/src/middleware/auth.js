import { verifyAccessToken } from "../services/jwtService.js";
import User from "../models/user.js";

export default async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
  const token = header.split(" ")[1];
  try {
    const payload = verifyAccessToken(token); // throws if invalid
    // attach user info (not full user object to avoid extra DB hit; but you can fetch if needed)
    req.user = { id: payload.sub || payload.userId, role: payload.role, society: payload.society || null };
    // Optionally fetch fresh user to check isActive:
    const userDoc = await User.findById(req.user.id).select("isActive role society");
    if (!userDoc || !userDoc.isActive) return res.status(403).json({ message: "Account disabled" });
    
    req.user.role = userDoc.role === 'admin' ? 'society_admin' : userDoc.role;
    req.user.society = userDoc.society;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "Invalid token", code: "TOKEN_INVALID" });
  }
}
