import React, { useState, useEffect } from "react";
import {
  Search, Clock, MapPin, Send, Paperclip, ChevronLeft,
  MoreVertical, Lock, CheckCircle, Filter, Inbox, User, Building2
} from "lucide-react";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getComplaints, getComplaintStats ,updateComplaintStatus } from "../../features/admin/adminSlice";

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

  dispatch(
    updateComplaintStatus({
      id: activeTicket._id,
      status: "resolved"
    })
  );
};
// const handleInProgress = () => {
//   if (!activeTicket) return;

//   dispatch(
//     updateComplaintStatus({
//       id: activeTicket._id,
//       status: "in_progress"
//     })
//   );
// };
  
const filteredTickets = tickets.filter(t =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.resident?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTicket = tickets.find((t) => t._id === selectedTicketId) || tickets[0] || null;

  const statusConfig: Record<string, { label: string; cls: string }> = {
    open:        { label: "Open",        cls: "bg-rose-50 text-rose-600 border-rose-100" },
    in_progress: { label: "In Progress", cls: "bg-amber-50 text-amber-600 border-amber-100" },
    resolved:    { label: "Resolved",    cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  };
  const getStatus = (s: string) => statusConfig[s] || { label: s, cls: "bg-slate-100 text-slate-500 border-slate-200" };

  return (
    <DashboardLayout role="society-admin">
      <div className="-m-8 h-[calc(100vh-64px)] flex flex-col">

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h1 className="text-lg font-black text-slate-800 tracking-tight">Complaints</h1>
            <span className="ml-1 bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-lg border border-blue-100">
              {tickets.length} total
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors">
            <Filter size={13} /> Filter
          </button>
        </div>

        {/* ── Main Panel ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Sidebar ── */}
          <aside className={`${selectedTicketId ? "hidden md:flex" : "flex"} w-full md:w-[300px] flex-col border-r border-slate-100 bg-white flex-shrink-0`}>

            <div className="px-4 py-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-300 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2">
                  <Inbox size={24} className="text-slate-300" />
                  <p className="text-xs text-slate-400 font-semibold">No tickets found</p>
                </div>
              ) : filteredTickets.map((ticket) => {
                const isActive = selectedTicketId === ticket._id;
                return (
                  <div
                    key={ticket._id}
                    onClick={() => setSelectedTicketId(ticket._id)}
                    className={`relative px-4 py-4 cursor-pointer transition-all ${isActive ? "bg-blue-50" : "hover:bg-slate-50/80"}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600 rounded-r-full" />}

                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-slate-300 tracking-wider">#{ticket._id.slice(-6)}</span>
                      <PriorityBadge priority={ticket.priority} />
                    </div>

                    <h4 className={`text-sm font-bold truncate mb-2 ${isActive ? "text-blue-700" : "text-slate-800"}`}>
                      {ticket.title}
                    </h4>

                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500">
                        {ticket.resident?.charAt(0)}
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold truncate">{ticket.resident}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase tracking-wide">
                        {ticket.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={9} /> {ticket.timeAgo}
                      </span>
                    </div>

                    {ticket.adminRemarks && (
                      <div className="mt-2 flex items-center gap-1">
                        <CheckCircle size={10} className="text-emerald-500" />
                        <span className="text-[10px] text-emerald-600 font-bold">Replied</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ── Right Panel ── */}
          <main className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedTicketId ? "hidden md:flex" : "flex"}`}>

            {activeTicket ? (
              <>
                {/* Ticket Header */}
                <div className="px-6 py-4 bg-white border-b border-slate-100 flex-shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button onClick={() => setSelectedTicketId(null)} className="md:hidden mt-0.5 p-1.5 hover:bg-slate-100 rounded-lg">
                        <ChevronLeft size={18} />
                      </button>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <h2 className="text-base font-black text-slate-800">{activeTicket.title}</h2>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase ${getStatus(activeTicket.status).cls}`}>
                            {getStatus(activeTicket.status).label}
                          </span>
                          <PriorityBadge priority={activeTicket.priority} />
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold flex-wrap">
                          <span className="flex items-center gap-1"><User size={11} /> {activeTicket.resident}</span>
                          <span className="text-slate-200">•</span>
                          <span className="flex items-center gap-1"><MapPin size={11} className="text-blue-400" /> {activeTicket.location}</span>
                          <span className="text-slate-200">•</span>
                          <span className="flex items-center gap-1"><Building2 size={11} /> {activeTicket.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                   <button
  onClick={handleResolve}
  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm shadow-emerald-100 transition-all flex items-center gap-1.5"
>
  <CheckCircle size={13} /> Resolve
</button>
{/* <button
  onClick={handleInProgress}
  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-black"
>
  In Progress
</button> */}
                    </div>
                  </div>
                </div>

                {/* Chat Area */}
              {/* Complaint Details */}
<div className="flex-1 overflow-y-auto p-6 space-y-6">

  {/* Complaint Description */}
  <div className="bg-white border border-slate-200 rounded-xl p-5">
    <h3 className="text-sm font-bold text-slate-700 mb-2">
      Complaint Description
    </h3>

    <p className="text-sm text-slate-600 leading-relaxed">
      {activeTicket.description}
    </p>

    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
      <Clock size={12}/> {activeTicket.timeAgo}
    </p>
  </div>

  {/* Admin Response */}
  {activeTicket.adminRemarks && (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <h3 className="text-sm font-bold text-blue-700 mb-2">
        Admin Response
      </h3>

      <p className="text-sm text-blue-800 leading-relaxed">
        {activeTicket.adminRemarks}
      </p>
    </div>
  )}

{activeTicket.assignedTo && (
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
    <h3 className="text-sm font-bold text-amber-700 mb-2">
      Assigned Plumber
    </h3>

    <p className="text-sm text-amber-800">
      Name: {activeTicket.assignedTo.name}
    </p>

    <p className="text-sm text-amber-800">
      Contact: {activeTicket.assignedTo.contact}
    </p>
  </div>
)}
</div>

               {/* Reply Input */}
<div className="px-6 py-2 bg-white border-t border-slate-100">

  <textarea
    placeholder="Write admin response..."
    value={replyText}
    onChange={(e) => setReplyText(e.target.value)}
    className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-blue-400"
  />

  <div className="flex justify-end mt-3">
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
      disabled={!replyText.trim()}
    >
      Send Response
    </button>
  </div>

</div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <Inbox size={28} className="text-slate-300" />
                </div>
                <div>
                  <p className="text-slate-500 font-bold text-sm">No ticket selected</p>
                  <p className="text-slate-400 text-xs mt-1">Select a ticket from the list to view details</p>
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
    HIGH:   "bg-rose-50 text-rose-600 border-rose-100",
    MEDIUM: "bg-amber-50 text-amber-600 border-amber-100",
    LOW:    "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wide ${styles[priority] || styles.LOW}`}>
      {priority}
    </span>
  );
};

export default ComplaintsDetail;