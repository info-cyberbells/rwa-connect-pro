import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, Paperclip, Send, Smile, Bold, Italic, 
  ChevronRight, User, ArrowUpRight, MessageSquare,
  Info, Clock, FileText, CheckCircle2, Hash, Plus, Loader2, Mail, Phone
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllSupportTickets, fetchSupportTicketDetails, addSupportMessage, updateTicketStatus, clearSelectedTicket } from "@/features/Superadmin/superAdminSlice";
import { toast } from "sonner";
import { format } from "date-fns";

const SupportTickets: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tickets, selectedTicket, messages, societyStats, relatedTickets, supportLoading, isSending } = useAppSelector((state) => state.superAdmin);
  
  const [newMessage, setNewMessage] = useState("");
  const [internalMode, setInternalMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchAllSupportTickets());
    return () => { 
      dispatch(clearSelectedTicket()); 
    };
  }, [dispatch]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSelectTicket = async (id: string) => {
    try {
      await dispatch(fetchSupportTicketDetails(id)).unwrap();
    } catch (err) {
      toast.error("Failed to load ticket details");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    try {
      await dispatch(addSupportMessage({
        id: selectedTicket._id,
        payload: { message: newMessage, isInternal: internalMode }
      })).unwrap();
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return;
    try {
      await dispatch(updateTicketStatus({ id: selectedTicket._id, status })).unwrap();
      toast.success(`Ticket marked as ${status.replace('_', ' ')}`);
      dispatch(fetchAllSupportTickets());
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <DashboardLayout role="super-admin">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 text-left">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Support Command Center</h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-2">
              Manage global society requests and technical issues. 
              {selectedTicket && <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">#{selectedTicket.ticketId}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs outline-none w-64 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm" 
              />
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
              <Plus size={16} /> New System Alert
            </button>
          </div>
        </div>

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
          
          {/* Column 1: Ticket List (Left) */}
          <div className="lg:col-span-3 bg-card rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Queue</h2>
              <button className="p-1.5 hover:bg-muted rounded-lg transition-colors"><Filter size={14} className="text-muted-foreground"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
              {supportLoading && tickets.length === 0 ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                tickets.map(ticket => (
                  <TicketItem 
                    key={ticket._id}
                    active={selectedTicket?._id === ticket._id} 
                    id={ticket.ticketId} 
                    title={ticket.subject} 
                    status={ticket.status.toUpperCase()} 
                    priority={ticket.priority}
                    time={format(new Date(ticket.updatedAt), 'HH:mm')} 
                    society={ticket.society?.name}
                    onClick={() => handleSelectTicket(ticket._id)}
                    unread={new Date(ticket.lastMessageAt) > new Date(ticket.lastReadBySuperAdmin)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 2: Chat & Conversation (Center) */}
          <div className="lg:col-span-6 bg-card rounded-3xl border border-border flex flex-col overflow-hidden shadow-md relative">
            {selectedTicket ? (
              <>
                {/* Chat Header */}
               <div className="p-4 border-b border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MessageSquare size={16}/></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate leading-tight">{selectedTicket.subject}</p>
                      <p className="text-[10px] text-muted-foreground font-medium leading-tight mt-0.5">
                        Society: <span className="text-indigo-600 font-bold">{selectedTicket.society?.name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
                    <button onClick={() => handleUpdateStatus('in_progress')} className="text-[9px] font-bold bg-orange-50 border border-orange-100 px-2 py-1.5 rounded-lg text-orange-600 hover:bg-orange-100 transition flex items-center justify-center gap-1"><Clock size={11}/> In Progress</button>
                    <button onClick={() => handleUpdateStatus('resolved')} className="text-[9px] font-bold bg-green-50 border border-green-100 px-2 py-1.5 rounded-lg text-green-600 hover:bg-green-100 transition flex items-center justify-center gap-1"><CheckCircle2 size={11}/> Resolve</button>
                    <button onClick={() => handleUpdateStatus('closed')} className="text-[9px] font-bold bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition flex items-center justify-center gap-1"><Hash size={11}/> Close</button>
                  </div>
                </div>

                {/* Main Chat Thread */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-muted/5 no-scrollbar">
                  <div className="bg-muted/30 border border-dashed border-border p-5 rounded-3xl max-w-3xl mx-auto shadow-sm">
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3">Incident Report</p>
                    <p className="text-sm text-foreground leading-relaxed font-medium">{selectedTicket.description}</p>
                  </div>
                  
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.senderRole === 'superadmin' ? 'items-end' : 'items-start'}`}>
                      {msg.isInternal ? (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 max-w-[90%] shadow-sm text-left">
                          <div className="mt-0.5 text-amber-500 shrink-0"><Info size={16}/></div>
                          <div>
                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">INTERNAL STAFF NOTE</p>
                            <p className="text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed font-medium">{msg.message}</p>
                            <p className="text-[8px] font-bold text-amber-500/60 mt-2">{format(new Date(msg.timestamp), 'HH:mm')}</p>
                          </div>
                        </div>
                      ) : (
                        <div className={`rounded-3xl p-5 shadow-sm max-w-[85%] text-left ${
                          msg.senderRole === 'superadmin' 
                            ? 'bg-indigo-600 text-white shadow-indigo-100' 
                            : 'bg-white dark:bg-muted/30 border border-border text-foreground dark:text-foreground'
                        }`}>
                          <div className="flex justify-between items-center mb-2 gap-8">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-80">
                              {msg.senderRole === 'superadmin' ? 'SYSTEM ADMIN' : selectedTicket.raisedBy?.name}
                            </span>
                            <span className="text-[8px] opacity-70 font-bold">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                          </div>
                          <p className="text-sm leading-relaxed font-medium">{msg.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-card border-t border-border mt-auto">
                  <div className="flex items-center gap-2 mb-3 ml-1">
                    <label className="relative inline-flex items-center cursor-pointer scale-75 -ml-2">
                      <input type="checkbox" className="sr-only peer" checked={internalMode} onChange={() => setInternalMode(!internalMode)} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Private Note Mode</span>
                  </div>

                  <div className={`rounded-2xl border transition-all p-3 flex gap-3 items-end ${internalMode ? 'bg-amber-50/50 border-amber-200' : 'bg-muted/30 border-border focus-within:bg-card focus-within:ring-4 focus-within:ring-indigo-50/50'}`}>
                    <textarea 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-sm min-h-[44px] max-h-[150px] resize-none py-2" 
                      placeholder={internalMode ? "Type private staff note..." : "Type your official response..."} 
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isSending || !newMessage.trim()}
                      className={`p-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center shrink-0 ${internalMode ? 'bg-amber-500 text-white shadow-amber-100' : 'bg-indigo-600 text-white shadow-indigo-100'} disabled:opacity-50`}
                    >
                      {isSending ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={18}/>}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="opacity-20" />
                </div>
                <h3 className="text-lg font-bold text-foreground/50">No Ticket Selected</h3>
                <p className="text-sm max-w-xs mt-1">Select a request from the sidebar to view full details and conversation.</p>
              </div>
            )}
          </div>

          {/* Column 3: Context & Profile (Right) */}
          <div className="lg:col-span-3 space-y-6 overflow-y-auto no-scrollbar">
            {selectedTicket && (
              <>
                {/* Society Context */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Society Context</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-black text-foreground leading-tight mb-1">{selectedTicket.society?.name}</p>
                      <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider italic">Primary Client</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/30 p-3 rounded-xl border border-border text-center">
                        <p className="text-lg font-black text-foreground">{societyStats?.totalResidents || 0}</p>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase">Residents</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-xl border border-border text-center">
                        <p className="text-lg font-black text-rose-500 truncate">₹{(societyStats?.activeDues || 0).toLocaleString()}</p>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase">Dues</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Profile */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Reported By</h4>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100 overflow-hidden">
                      {selectedTicket.raisedBy?.profilePicUrl ? <img src={selectedTicket.raisedBy.profilePicUrl} className="w-full h-full object-cover" /> : <User size={20}/>}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-black text-foreground truncate">{selectedTicket.raisedBy?.name}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Society Admin</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium truncate" title={selectedTicket.raisedBy?.email}><Mail size={12} className="shrink-0"/> {selectedTicket.raisedBy?.email}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium"><Phone size={12} className="shrink-0"/> {selectedTicket.raisedBy?.phone}</p>
                  </div>
                </div>

                {/* Related History */}
                {relatedTickets && relatedTickets.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-5 shadow-sm text-left">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Recent History</h4>
                    <div className="space-y-3">
                      {relatedTickets.map((t: any) => (
                        <div key={t._id} className="group cursor-pointer">
                          <p className="text-[9px] font-bold text-muted-foreground group-hover:text-indigo-600 transition-colors">#{t.ticketId} • {t.status.toUpperCase()}</p>
                          <p className="text-[10px] font-bold text-foreground truncate">{t.subject}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Tags */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm text-left">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">System Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full capitalize">#{selectedTicket.category}</span>
                    <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full capitalize">#{selectedTicket.priority}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const TicketItem = ({ id, title, status, priority, time, society, active, onClick, unread }: any) => (
  <div onClick={onClick} className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col gap-2.5 text-left ${
    active ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-900/30' : 'bg-transparent border-transparent hover:bg-muted/30'
  }`}>
    {unread && (
      <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)] z-10" />
    )}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {!unread && (
          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
            status === 'OPEN' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
            status === 'RESOLVED' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
            status === 'IN_PROGRESS' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>● {status}</span>
        )}
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${
          priority === 'critical' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
          priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}>{priority}</span>
      </div>
      <span className="text-[9px] font-bold text-muted-foreground">{time}</span>
    </div>
    <p className={`text-xs font-bold leading-tight line-clamp-2 ${active ? 'text-indigo-900 dark:text-indigo-200' : 'text-foreground'}`}>{title}</p>
    <div className="flex items-center gap-1.5 opacity-60">
      <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-[8px] font-black italic">
        {society?.charAt(0)}
      </div>
      <span className="text-[9px] font-bold truncate">{society}</span>
    </div>
  </div>
);

export default SupportTickets;