import { Router } from "express";
import auth from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketDetails,
  addMessage,
  updateTicketStatus,
} from "../controllers/supportController.js";

const router = Router();

// All routes require authentication
router.use(auth);

// Society Admin: Raise a new ticket
router.post("/", permit("society_admin"), createTicket);

// Society Admin: Get their own tickets
router.get("/my-tickets", permit("society_admin"), getMyTickets);

// Super Admin: Get all tickets from all societies
router.get("/all", permit("superadmin"), getAllTickets);

// Common: Get ticket details and chat history
router.get("/:ticketId", getTicketDetails);

// Common: Add a message/reply to a ticket
router.post("/:ticketId/messages", addMessage);

// Super Admin: Update ticket status (Resolve/Close)
router.patch("/:ticketId/status", permit("superadmin"), updateTicketStatus);

export default router;
