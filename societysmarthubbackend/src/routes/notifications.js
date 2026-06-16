import express from "express";
import { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead, 
  getUnreadCount,
  broadcastManual,
  getNotificationStats
} from "../controllers/notificationController.js";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";

const router = express.Router();

// All notification routes are protected
router.use(auth);

// Stats route at the top to avoid any conflict
router.get("/stats-overview", getNotificationStats);

// Member/Any user routes
router.get("/my", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

// Society Admin, Super Admin, Guard, Member - Manual Broadcast
router.post("/broadcast", permit("society_admin", "superadmin", "guard", "user", "admin", "super-admin", "member"), broadcastManual);

export default router;
