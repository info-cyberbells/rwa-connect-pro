import React, { useState, useEffect } from "react";
import {
  Search, Clock, MapPin, Send, Paperclip, ChevronLeft,
  MoreVertical, Lock, CheckCircle, Filter, Inbox, User, Building2
} from "lucide-react";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getComplaints, getComplaintStats, updateComplaintStatus } from "../../features/admin/adminSlice";

interface Ticket {
  _id: string;
  title: string;
  resident: string;
  location: string;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  status: string;
  adminRemarks?: string;
  assignedTo?: {
    name: string;
    contact: string;
  };
  timeAgo: string;
}

const ComplaintsDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { complaints } = useAppSelector((state) => state.admin);
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem("role") || "guard";

  const tickets = ((complaints as any)?.complaints || complaints || []).map((c: any) => ({
    _id: c._id,
    title: c.title,
    resident: c.submittedBy?.name || "Resident",
    location: c.location,
    category: c.type?.replace("_", " ").toUpperCase(),
    priority: (c.priority?.toUpperCase() || "LOW") as "HIGH" | "MEDIUM" | "LOW",
    description: c.description,
    status: c.status,
    adminRemarks: c.adminRemarks,
    assignedTo: c.assignedTo,
    timeAgo: new Date(c.createdAt).toLocaleString(),
  }));

  // ── Stats counts (live from Redux state) ──
  const activeCount     = tickets.filter(t => t.status === "open").length;
  const resolvedCount   = tickets.filter(t => t.status === "resolved").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress").length;

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    dispatch(getComplaints());
    dispatch(getComplaintStats());
  }, [dispatch]);

  useEffect(() => {
    if (tickets.length > 0 && !selectedTicketId) {
      const ticketWithReply = tickets.find(t => t.adminRemarks);
      setSelectedTicketId(ticketWithReply?._id || tickets[0]._id);
    }
  }, [tickets, selectedTicketId]);

  const handleResolve = () => {
    if (!activeTicket) return;
    dispatch(updateComplaintStatus({ id: activeTicket._id, status: "resolved" }));
  };

  const handleSendResponse = () => {
    if (!activeTicket || !replyText.trim()) return;
    dispatch(updateComplaintStatus({
      id: activeTicket._id,
      status: "in_progress",
      adminRemarks: replyText.trim()
    }));
    setReplyText("");
  };

  const handleInProgress = () => {
    if (!activeTicket) return;
    dispatch(updateComplaintStatus({ id: activeTicket._id, status: "in_progress" }));
  };

  const filteredTickets = tickets.filter(t =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.resident?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTicket = tickets.find((t) => t._id === selectedTicketId) || tickets[0] || null;

  const statusConfig: Record<string, { label: string; cls: string }> = {
    open:        { label: "Open",        cls: "bg-destructive/10 text-destructive border-destructive/20" },
    in_progress: { label: "In Progress", cls: "bg-warning/10 text-warning border-warning/20" },
    resolved:    { label: "Resolved",    cls: "bg-success/10 text-success border-success/20" },
    closed:      { label: "Closed",      cls: "bg-muted text-muted-foreground border-border" },
  };
  const getStatus = (s: string) => statusConfig[s] || { label: s, cls: "bg-muted text-muted-foreground border-border" };

  return (
    <DashboardLayout role={role as any}>
      <div className="-m-8 h-[calc(100vh-64px)] flex flex-col">

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h1 className="text-lg font-black text-foreground tracking-tight">Complaints</h1>

            {/* Total */}
            <span className="ml-1 bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-lg border border-primary/20">
              {tickets.length} total
            </span>

            {/* Open / Active */}
            <span className="bg-destructive/10 text-destructive text-[10px] font-black px-2 py-0.5 rounded-lg border border-destructive/20">
              {activeCount} open
            </span>

            {/* In Progress */}
            <span className="bg-warning/10 text-warning text-[10px] font-black px-2 py-0.5 rounded-lg border border-warning/20">
              {inProgressCount} in progress
            </span>

            {/* Resolved */}
            <span className="bg-success/10 text-success text-[10px] font-black px-2 py-0.5 rounded-lg border border-success/20">
              {resolvedCount} resolved
            </span>
          </div>

          <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted border border-border px-3 py-1.5 rounded-xl transition-colors">
            <Filter size={13} /> Filter
          </button>
        </div>

        {/* ── Main Panel ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Sidebar ── */}
          <aside className={`${selectedTicketId ? "hidden md:flex" : "flex"} w-full md:w-[300px] flex-col border-r border-border bg-card flex-shrink-0`}>

            <div className="px-4 py-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors text-foreground"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2">
                  <Inbox size={24} className="text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground font-semibold">No tickets found</p>
                </div>
              ) : filteredTickets.map((ticket) => {
                const isActive = selectedTicketId === ticket._id;
                return (
                  <div
                    key={ticket._id}
                    onClick={() => setSelectedTicketId(ticket._id)}
                    className={`relative px-4 py-4 cursor-pointer transition-all ${isActive ? "bg-primary/10" : "hover:bg-muted/50"}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-full" />}

                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-muted-foreground/40 tracking-wider">#{ticket._id.slice(-6)}</span>
                      <PriorityBadge priority={ticket.priority} />
                    </div>

                    <h4 className={`text-sm font-bold truncate mb-2 ${isActive ? "text-primary" : "text-foreground"}`}>
                      {ticket.title}
                    </h4>

                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-black text-muted-foreground">
                        {ticket.resident?.charAt(0)}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-semibold truncate">{ticket.resident}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black bg-muted text-muted-foreground px-2 py-1 rounded-lg uppercase tracking-wide border border-border">
                        {ticket.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock size={9} /> {ticket.timeAgo}
                      </span>
                    </div>

                    {ticket.adminRemarks && (
                      <div className="mt-2 flex items-center gap-1">
                        <CheckCircle size={10} className="text-success" />
                        <span className="text-[10px] text-success font-bold">Replied</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ── Right Panel ── */}
          <main className={`flex-1 flex flex-col bg-muted/30 ${!selectedTicketId ? "hidden md:flex" : "flex"}`}>

            {activeTicket ? (
              <>
                {/* Ticket Header */}
                <div className="px-6 py-4 bg-card border-b border-border flex-shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button onClick={() => setSelectedTicketId(null)} className="md:hidden mt-0.5 p-1.5 hover:bg-muted rounded-lg">
                        <ChevronLeft size={18} />
                      </button>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <h2 className="text-base font-black text-foreground">{activeTicket.title}</h2>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase ${getStatus(activeTicket.status).cls}`}>
                            {getStatus(activeTicket.status).label}
                          </span>
                          <PriorityBadge priority={activeTicket.priority} />
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-semibold flex-wrap">
                          <span className="flex items-center gap-1"><User size={11} /> {activeTicket.resident}</span>
                          <span className="text-border">•</span>
                          <span className="flex items-center gap-1"><MapPin size={11} className="text-primary" /> {activeTicket.location}</span>
                          <span className="text-border">•</span>
                          <span className="flex items-center gap-1"><Building2 size={11} /> {activeTicket.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl border border-border transition-colors">
                        <MoreVertical size={16} />
                      </button>
                      <button
                        onClick={handleResolve}
                        className="bg-success hover:bg-success/90 text-success-foreground px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle size={13} /> Resolve
                      </button>
                      <button
                        onClick={handleInProgress}
                        className="bg-warning hover:bg-warning/90 text-warning-foreground px-4 py-2 rounded-xl text-xs font-black shadow-sm"
                      >
                        In Progress
                      </button>
                    </div>
                  </div>
                </div>

                {/* Complaint Details */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">

                  {/* Complaint Description */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="text-sm font-bold text-foreground mb-2">
                      Complaint Description
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeTicket.description}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-2 flex items-center gap-1">
                      <Clock size={12} /> {activeTicket.timeAgo}
                    </p>
                  </div>

                  {/* Admin Response */}
                  {activeTicket.adminRemarks && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                      <h3 className="text-sm font-bold text-primary mb-2">
                        Admin Response
                      </h3>
                      <p className="text-sm text-foreground leading-relaxed">
                        {activeTicket.adminRemarks}
                      </p>
                    </div>
                  )}

                  {/* Assigned To */}
                  {activeTicket.assignedTo && (
                    <div className="bg-warning/5 border border-warning/20 rounded-xl p-5">
                      <h3 className="text-sm font-bold text-warning mb-2">
                        Assigned Help
                      </h3>
                      <p className="text-sm text-foreground">Name: {activeTicket.assignedTo.name}</p>
                      <p className="text-sm text-foreground">Contact: {activeTicket.assignedTo.contact}</p>
                    </div>
                  )}
                </div>

                {/* Reply Input */}
                <div className="px-6 py-2 bg-card border-t border-border">
                  <textarea
                    placeholder="Write admin response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg p-3 text-sm outline-none focus:border-primary text-foreground"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleSendResponse}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                      disabled={!replyText.trim()}
                    >
                      Send Response
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                  <Inbox size={28} className="text-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-muted-foreground font-bold text-sm">No ticket selected</p>
                  <p className="text-muted-foreground text-xs mt-1">Select a ticket from the list to view details</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: Record<string, string> = {
    HIGH:   "bg-destructive/10 text-destructive border-destructive/20",
    MEDIUM: "bg-warning/10 text-warning border-warning/20",
    LOW:    "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wide ${styles[priority] || styles.LOW}`}>
      {priority}
    </span>
  );
};

export default ComplaintsDetail;