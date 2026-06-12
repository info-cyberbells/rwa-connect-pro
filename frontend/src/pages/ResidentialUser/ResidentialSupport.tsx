import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  LifeBuoy,
  User,
  Plus,
  Moon,
  Bell,
  ChevronRight,
  X,
  Upload,
  Droplets,
  Zap,
  Volume2,
  Settings,
  CheckCircle2,
  Ticket,
  ClipboardList,
  AlertCircle,
  Calendar,
  Clock,
  ImageIcon,
  MapPin,
  MessageSquare,
  Phone,
  Wrench,
  TrendingUp,
  ArrowUpDown,
  Brush,
  Car,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyComplaints,
  submitComplaint,
  viewComplaintDetails,
} from "@/features/User/userSlice";
import { toast } from "@/hooks/use-toast";

const ResidentialSupport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [attachment, setAttachment] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [ticketCounts, setTicketCounts] = useState({
    open: 0,
    resolved: 0,
    inProgress: 0,
  });

  const dispatch = useDispatch<AppDispatch>();
  const {
    myComplaints,
    singleLoading,
    loading,
    complaintDetails,
    submitError,
  } = useSelector((state: RootState) => state.user);

  // Form State
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    preferredVisitTime: "",
    location: "",
    description: "",
    priority: "Low",
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    dispatch(getMyComplaints({}));
  }, [dispatch]);

  useEffect(() => {
    if (myComplaints?.complaints) {
      const openCount = myComplaints.complaints.filter((c: any) => c.status === "open").length;
      const inProgressCount = myComplaints.complaints.filter((c: any) => c.status === "in_progress").length;
      const resolvedCount = myComplaints.complaints.filter((c: any) => c.status === "resolved").length;

      setTicketCounts({
        open: openCount,
        resolved: resolvedCount,
        inProgress: inProgressCount,
      });
    }
  }, [myComplaints]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 10MB", variant: "destructive" });
      return;
    }
    setAttachment({ file, preview: URL.createObjectURL(file) });
  };

  const setPriority = (val: string) => setFormData((prev) => ({ ...prev, priority: val }));

  const resetTicketForm = () => {
    setFormData({
      category: "",
      subject: "",
      preferredVisitTime: "",
      location: "",
      description: "",
      priority: "Low",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.category) newErrors.category = "Required";
    if (!formData.subject.trim()) newErrors.subject = "Required";
    if (!formData.description.trim()) newErrors.description = "Required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const form = new FormData();
    form.append("type", formData.category);
    form.append("priority", formData.priority.toLowerCase());
    form.append("title", formData.subject);
    form.append("location", formData.location);
    form.append("preferredVisitTime", formData.preferredVisitTime);
    form.append("description", formData.description);
    if (attachment?.file) form.append("images", attachment.file);

    const res = await dispatch(submitComplaint(form));
    if (res?.meta?.requestStatus === "fulfilled") {
      toast({ title: "Ticket Submitted", description: "Your complaint has been submitted successfully" });
      resetTicketForm();
      setAttachment(null);
      setIsModalOpen(false);
      dispatch(getMyComplaints({}));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-destructive/10 text-destructive border-destructive/20";
      case "in_progress": return "bg-warning/10 text-warning border-warning/20";
      case "resolved": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "water_issue": return <Droplets className="text-primary" size={18} />;
      case "lift_problem": return <ArrowUpDown className="text-foreground/70" size={18} />;
      case "security": return <ShieldCheck className="text-destructive" size={18} />;
      case "cleaning": return <Brush className="text-success" size={18} />;
      case "parking": return <Car className="text-primary" size={18} />;
      case "electricity": return <Zap className="text-warning" size={18} />;
      default: return <HelpCircle className="text-muted-foreground" size={18} />;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <DashboardLayout role="member">
      <div className="min-h-screen text-foreground">
        <main className="max-w-5xl mx-auto space-y-8 text-left">
          <div className="flex justify-between items-center mt-12 sm:mt-0">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Help Desk & Support</h2>
              <p className="text-muted-foreground text-base font-medium mt-1">Manage your requests and assistance</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary/10 transition-all active:scale-95"
            >
              <Plus size={20} /> <span className="hidden sm:inline">New Ticket</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center"><Ticket className="text-primary" size={32} /></div>
              <div>
                <h3 className="text-4xl font-bold">{ticketCounts.open}</h3>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">Active</p>
              </div>
            </div>
            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center"><CheckCircle2 className="text-success" size={32} /></div>
              <div>
                <h3 className="text-4xl font-bold">{ticketCounts.resolved}</h3>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">Resolved</p>
              </div>
            </div>
            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center"><TrendingUp className="text-warning" size={32} /></div>
              <div>
                <h3 className="text-4xl font-bold">{ticketCounts.inProgress}</h3>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-muted/20 border-border">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="bg-muted p-1 rounded-2xl flex border border-border w-full lg:w-auto">
                  {["all", "active", "in_progress", "resolved"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setActiveTab(t);
                        dispatch(getMyComplaints(t === "all" ? {} : { status: t === "active" ? "open" : t }));
                      }}
                      className={`flex-1 px-6 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === t ? "bg-card text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {t.replace("_", " ")}
                    </button>
                  ))}
                </div>
                {activeTab === "all" && (
                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">Issue Type</label>
                    <select
                      onChange={(e) => dispatch(getMyComplaints({ type: e.target.value }))}
                      className="bg-card text-foreground border border-border rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 flex-1 lg:flex-none"
                    >
                      <option value="" className="bg-card">All Issues</option>
                      {["water_issue", "lift_problem", "security", "cleaning", "parking", "electricity", "other"].map(opt => (
                        <option key={opt} value={opt} className="bg-card">{opt.replace("_", " ").toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="divide-y divide-border">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-6 flex items-center gap-6 animate-pulse">
                    <div className="w-14 h-14 bg-muted rounded-2xl"></div>
                    <div className="flex-1 space-y-3"><div className="h-4 bg-muted rounded w-1/3"></div><div className="h-3 bg-muted rounded w-1/4"></div></div>
                  </div>
                ))
              ) : !myComplaints?.complaints?.length ? (
                <div className="p-20 text-center"><div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-4 text-muted-foreground/30"><ClipboardList size={32} /></div><h4 className="font-bold text-foreground">No Tickets Found</h4></div>
              ) : (
                myComplaints.complaints.map((ticket: any) => (
                  <div
                    key={ticket._id}
                    onClick={() => { setSelectedComplaintId(ticket._id); setDetailsOpen(true); dispatch(viewComplaintDetails(ticket._id)); }}
                    className="group p-6 flex items-center gap-6 hover:bg-muted/30 transition-all cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center shrink-0 border border-border group-hover:scale-105 transition-transform">{getTypeIcon(ticket.type)}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{ticket.title}</h4>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Ticket #{ticket._id?.slice(-6)} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase border tracking-widest ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                      <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 text-left">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-card w-full max-w-lg rounded-[2.5rem] border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-border flex items-center justify-between">
                <div><h2 className="text-xl font-bold text-foreground">New Support Request</h2><p className="text-xs text-muted-foreground mt-0.5">Submit your request for assistance</p></div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary">
                      <option value="">Select Category</option>
                      {["water_issue", "lift_problem", "security", "cleaning", "parking", "electricity", "other"].map(opt => (
                        <option key={opt} value={opt}>{opt.replace("_", " ").toUpperCase()}</option>
                      ))}
                    </select>
                   </div>
                   <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Title</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary" placeholder="Issue Title" />
                   </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Description</label>
                  <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary resize-none" placeholder="Details..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary" placeholder="e.g. Master Bedroom" />
                   </div>
                   <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Preferred Time</label>
                    <input type="text" name="preferredVisitTime" value={formData.preferredVisitTime} onChange={handleInputChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary" placeholder="e.g. 10 AM - 1 PM" />
                   </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Priority</label>
                  <div className="bg-muted p-1 rounded-xl flex border border-border">
                    {["Low", "Medium", "High"].map(p => (
                      <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${formData.priority === p ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{p}</button>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted rounded-xl transition-all">Discard</button>
                  <button type="submit" className="flex-[1.5] py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">Create Ticket</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Drawer */}
        {detailsOpen && (
          <div className="fixed inset-0 z-[120] flex justify-end text-left">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-border">
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/10">
                <div><h2 className="text-xl font-bold">Ticket Details</h2><p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">#{selectedComplaintId?.slice(-8)}</p></div>
                <button onClick={() => setDetailsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-destructive/10 hover:text-destructive transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {singleLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4"><Loader2 className="animate-spin text-primary" size={32} /><p className="text-xs font-bold uppercase tracking-widest opacity-40">Loading details...</p></div>
                ) : complaintDetails ? (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getPriorityStyles(complaintDetails.priority)}`}>{complaintDetails.priority} Priority</span>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(complaintDetails.status)}`}>{complaintDetails.status}</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-4">{complaintDetails.title}</h3>
                    <div className="p-5 bg-muted/30 rounded-2xl border border-border italic text-sm text-muted-foreground">"{complaintDetails.description}"</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-border rounded-2xl bg-muted/10"><p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Submitted By</p><p className="text-sm font-bold">{complaintDetails.submittedBy?.name}</p><p className="text-[10px] font-bold text-primary">Unit {complaintDetails.submittedBy?.unit?.flatNumber}</p></div>
                      <div className="p-4 border border-border rounded-2xl bg-muted/10"><p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Created Date</p><p className="text-sm font-bold">{new Date(complaintDetails.createdAt).toLocaleDateString()}</p></div>
                    </div>
                    {complaintDetails.adminRemarks && (
                      <div className="p-5 bg-warning/5 border border-warning/20 rounded-2xl">
                        <div className="flex items-center gap-2 text-warning mb-2"><AlertCircle size={14} /><span className="text-[10px] font-black uppercase">Admin Remarks</span></div>
                        <p className="text-sm font-medium">{complaintDetails.adminRemarks}</p>
                      </div>
                    )}
                  </>
                ) : <div className="text-center py-20 text-muted-foreground">Details not available</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResidentialSupport;
