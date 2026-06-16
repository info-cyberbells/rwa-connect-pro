import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, MessageSquare, Clock, CheckCircle2, 
  ChevronRight, Send, Loader2, AlertCircle, FileText, User
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMySupportTickets, fetchSupportTicketDetails, createSupportTicket, addSupportMessage } from "@/features/admin/adminSlice";
import { toast } from "sonner";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Support = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.admin);
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'technical',
    priority: 'medium'
  });

  useEffect(() => {
    loadTickets();
  }, [dispatch]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const loadTickets = async () => {
    try {
      setIsPageLoading(true);
      const res = await dispatch(fetchMySupportTickets()).unwrap();
      setTickets(res.tickets);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleSelectTicket = async (ticket: any) => {
    try {
      setSelectedTicket(ticket);
      const res = await dispatch(fetchSupportTicketDetails(ticket._id)).unwrap();
      setMessages(res.ticket.messages);
      setShowNewForm(false);
      // Refresh list to clear red dot state
      const listRes = await dispatch(fetchMySupportTickets()).unwrap();
      setTickets(listRes.tickets);
    } catch (err) {
      toast.error("Failed to load conversation");
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return;
    try {
      setIsSending(true);
      await dispatch(createSupportTicket(formData)).unwrap();
      toast.success("Support ticket raised successfully");
      setFormData({ subject: '', description: '', category: 'technical', priority: 'medium' });
      setShowNewForm(false);
      loadTickets();
    } catch (err) {
      toast.error("Failed to raise ticket");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    try {
      setIsSending(true);
      await dispatch(addSupportMessage({
        id: selectedTicket._id,
        payload: { message: newMessage }
      })).unwrap();
      setNewMessage("");
      const details = await dispatch(fetchSupportTicketDetails(selectedTicket._id)).unwrap();
      setMessages(details.ticket.messages);
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto p-4 md:p-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Help & Support</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Contact Super Admin for technical help or queries.</p>
          </div>
          <button 
            onClick={() => {setShowNewForm(true); setSelectedTicket(null);}}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all shrink-0"
          >
            <Plus size={16} /> Raise New Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Ticket List - Reduced span from 4 to 3 */}
          <div className="lg:col-span-3 bg-card rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Tickets</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
              {isPageLoading && tickets.length === 0 ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
              ) : tickets.length === 0 ? (
                <div className="p-8 text-center text-[10px] text-muted-foreground italic">No tickets found.</div>
              ) : (
                tickets.map(ticket => (
                  <div 
                    key={ticket._id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                      selectedTicket?._id === ticket._id ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20' : 'hover:bg-muted/50 border-transparent'
                    }`}
                  >
                    {/* Red Dot indicator */}
                    {new Date(ticket.lastMessageAt) > new Date(ticket.lastReadByAdmin) && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    )}

                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[9px] font-bold text-muted-foreground">#{ticket.ticketId}</span>
                      {ticket.status !== 'open' && (
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${
                          ticket.status === 'in_progress' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {ticket.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-foreground truncate">{ticket.subject}</p>
                    <p className="text-[9px] text-muted-foreground mt-1">{format(new Date(ticket.updatedAt), 'MMM dd, yyyy')}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Content Area - Increased span from 8 to 9 */}
          <div className="lg:col-span-9 bg-card rounded-2xl border border-border flex flex-col overflow-hidden shadow-sm">
            {showNewForm ? (
              <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
                <div className="max-w-2xl">
                  <h3 className="text-lg font-bold mb-6">Raise New Support Request</h3>
                  <form onSubmit={handleCreateTicket} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Subject</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g., Payment Link Failure"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Category</label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(val) => setFormData({...formData, category: val})}
                        >
                          <SelectTrigger className="w-full rounded-xl border-border bg-muted/20 focus:ring-primary/20 h-11">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border shadow-xl">
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="payment">Payment Issue</SelectItem>
                            <SelectItem value="access_issue">Login/Access Issue</SelectItem>
                            <SelectItem value="feature_request">Feature Request</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Priority</label>
                        <Select 
                          modal={false}
                          value={formData.priority} 
                          onValueChange={(val) => setFormData({...formData, priority: val})}
                        >
                          <SelectTrigger className="w-full rounded-xl border-border bg-muted/20 focus:ring-primary/20 h-11">
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border shadow-xl">
                            <SelectItem value="low">Low Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="critical">Critical Issue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Description</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Please describe your issue in detail..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm transition-all"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => setShowNewForm(false)}
                        className="px-5 py-2.5 font-bold text-muted-foreground hover:bg-muted rounded-xl transition-all text-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSending}
                        className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm"
                      >
                        {isSending ? <Loader2 className="animate-spin w-4 h-4" /> : <Send size={16} />}
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : selectedTicket ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><FileText size={18}/></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate max-w-[200px] md:max-w-md">Ticket #{selectedTicket.ticketId}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{selectedTicket.subject}</p>
                    </div>
                  </div>
                  <div className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    selectedTicket.status === 'open' ? 'bg-blue-100 text-blue-600' :
                    selectedTicket.status === 'in_progress' ? 'bg-orange-100 text-orange-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {selectedTicket.status.toUpperCase()}
                  </div>
                </div>

                {/* Chat Thread */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/5 no-scrollbar">
                  <div className="bg-card border border-dashed border-border p-4 rounded-2xl max-w-2xl mx-auto shadow-sm">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-wider">Original Request</p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedTicket.description}</p>
                  </div>
                  
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.senderRole === 'superadmin' ? 'items-start' : 'items-end'}`}>
                      <div className={`rounded-2xl p-4 max-w-[85%] md:max-w-[75%] shadow-sm ${
                        msg.senderRole === 'superadmin' 
                          ? 'bg-muted border border-border text-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        <div className="flex justify-between items-center mb-1.5 gap-4">
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
                            {msg.senderRole === 'superadmin' ? 'Super Admin' : 'You'}
                          </span>
                          <span className="text-[8px] opacity-60 font-bold">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                {selectedTicket.status !== 'closed' && (
                  <div className="p-4 border-t border-border bg-card mt-auto shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/20 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={isSending || !newMessage.trim()}
                        className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95 shrink-0"
                      >
                        {isSending ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={20} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                <MessageSquare size={48} className="mb-4 opacity-10" />
                <p className="text-sm font-medium">Select a ticket from the left to view conversation</p>
                <p className="text-xs opacity-60 mt-1">Or raise a new request using the button above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
