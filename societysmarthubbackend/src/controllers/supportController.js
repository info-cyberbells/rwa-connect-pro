import SupportTicket from "../models/SupportTicket.js";
import User from "../models/user.js";
import Charge from "../models/Charge.js";
import Payment from "../models/Payment.js";

// 1. Raise a New Ticket (Society Admin)
export async function createTicket(req, res, next) {
  try {
    const { subject, description, category, priority } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.society) {
      return res.status(400).json({ message: "User is not associated with any society" });
    }

    const ticket = await SupportTicket.create({
      society: user.society,
      raisedBy: req.user.id,
      subject,
      description,
      category,
      priority,
      messages: [{
        sender: req.user.id,
        senderRole: "society_admin",
        message: description
      }],
      lastMessageAt: Date.now(),
      lastReadByAdmin: Date.now(), // Sender has read it
      lastReadBySuperAdmin: new Date(0) // SuperAdmin hasn't read it
    });

    res.status(201).json({ message: "Ticket raised successfully", ticket });
  } catch (error) {
    next(error);
  }
}

// 2. Get All Tickets (Super Admin only)
export async function getAllTickets(req, res, next) {
  try {
    const { status, priority, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tickets = await SupportTicket.find(filter)
      .populate("society", "name")
      .populate("raisedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: tickets.length, tickets });
  } catch (error) {
    next(error);
  }
}

// 3. Get My Society's Tickets (Society Admin)
export async function getMyTickets(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    const tickets = await SupportTicket.find({ society: user.society })
      .sort({ createdAt: -1 });

    res.json({ count: tickets.length, tickets });
  } catch (error) {
    next(error);
  }
}

// 4. Get Ticket Details & Chat
export async function getTicketDetails(req, res, next) {
  try {
    const { ticketId } = req.params;
    const ticket = await SupportTicket.findById(ticketId)
      .populate("society", "name logoUrl")
      .populate("raisedBy", "name email phone")
      .populate("messages.sender", "name profilePicUrl");

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Update read timestamps - This clears the red dot
    if (req.user.role === "superadmin") {
      ticket.lastReadBySuperAdmin = Date.now();
    } else if (req.user.role === "society_admin") {
      ticket.lastReadByAdmin = Date.now();
    }

    await ticket.save();

    // Fetch Society Context Stats for Super Admin
    let societyContext = null;
    if (req.user.role === "superadmin" && ticket.society) {
      const residentsCount = await User.countDocuments({ society: ticket.society._id, role: "user" });
      
      const allCharges = await Charge.find({ society: ticket.society._id, isActive: true });
      const approvedPayments = await Payment.find({ society: ticket.society._id, status: "approved" });
      const totalPaid = approvedPayments.reduce((acc, p) => acc + p.amount, 0);
      
      let totalExpected = 0;
      for (const charge of allCharges) {
        if (charge.appliedTo === 'all') {
          totalExpected += charge.amount * residentsCount;
        } else {
          totalExpected += charge.amount * (charge.targetUsers?.length || 0);
        }
      }

      societyContext = {
        totalResidents: residentsCount,
        activeDues: Math.max(0, totalExpected - totalPaid)
      };
    }

    // Filter out internal notes for non-superadmins
    if (req.user.role !== "superadmin") {
      ticket.messages = ticket.messages.filter(m => !m.isInternal);
    }

    // Fetch Related Tickets (Previous History)
    const relatedTickets = await SupportTicket.find({ 
      society: ticket.society?._id, 
      _id: { $ne: ticket._id } 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("ticketId subject status createdAt");

    res.json({ ticket, societyContext, relatedTickets });
  } catch (error) {
    next(error);
  }
}

// 5. Add Message / Reply
export async function addMessage(req, res, next) {
  try {
    const { ticketId } = req.params;
    const { message, isInternal } = req.body;

    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const isSuperAdmin = req.user.role === "superadmin";

    const newMessage = {
      sender: req.user.id,
      senderRole: isSuperAdmin ? "superadmin" : "society_admin",
      message,
      isInternal: isSuperAdmin ? (isInternal === true || isInternal === "true") : false
    };

    ticket.messages.push(newMessage);
    ticket.lastMessageAt = Date.now();
    
    // Status Logic: Only move to IN PROGRESS if Super Admin sends a non-internal reply
    if (isSuperAdmin) {
      if (!newMessage.isInternal && ticket.status === "open") {
        ticket.status = "in_progress";
      }
      ticket.lastReadBySuperAdmin = Date.now(); // Sender read it
    } else {
      ticket.lastReadByAdmin = Date.now(); // Sender read it
    }

    await ticket.save();
    res.json({ message: "Message added", ticket });
  } catch (error) {
    next(error);
  }
}

// 6. Update Ticket Status
export async function updateTicketStatus(req, res, next) {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.status = status;
    if (status === "resolved") ticket.resolvedAt = Date.now();
    if (status === "closed") ticket.closedAt = Date.now();

    await ticket.save();
    res.json({ message: `Ticket marked as ${status}`, ticket });
  } catch (error) {
    next(error);
  }
}
