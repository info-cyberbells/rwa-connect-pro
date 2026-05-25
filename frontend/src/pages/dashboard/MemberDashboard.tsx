import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, Bell, FileText, MessageSquare, Upload, 
  CheckCircle, Clock, AlertCircle, UserPlus, ShieldCheck, 
  XCircle, Loader2, Phone, MapPin, Info, Car 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { createVisitor, getVisitorHistory, clearUserError, getMyProfile } from "../../features/User/userSlice";
import { toast } from "sonner";

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder:text-slate-400";

const paymentDues = [
  { type: "Maintenance", amount: "₹5,500", dueDate: "Dec 10, 2024", status: "pending" },
  { type: "Club Membership", amount: "₹2,000", dueDate: "Dec 15, 2024", status: "pending" },
  { type: "Parking Fee", amount: "₹500", dueDate: "Dec 10, 2024", status: "paid" },
];

const recentNotices = [
  { title: "Annual General Meeting", date: "Jan 15, 2025", type: "Meeting" },
  { title: "Water Supply Maintenance", date: "Dec 8, 2024", type: "Maintenance" },
  { title: "New Year Celebration", date: "Dec 31, 2024", type: "Event" },
];

const paymentHistory = [
  { type: "Maintenance", amount: "₹5,500", date: "Nov 5, 2024", status: "approved" },
  { type: "Maintenance", amount: "₹5,500", date: "Oct 5, 2024", status: "approved" },
  { type: "Club Membership", amount: "₹2,000", date: "Oct 15, 2024", status: "approved" },
];

export default function MemberDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profileData, visitorData, visitorLoading, createVisitorSuccess, generatedCode, error } = useAppSelector((state) => state.user);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Use profileData if available, otherwise fallback to auth user
  const currentUser = profileData || user;
  const userFlat = currentUser?.unit?.flatNumber || "";

  const [newVisitor, setNewVisitor] = useState({
    visitorName: "",
    visitorPhone: "",
    vehicleNumber: "",
    purpose: "Guest",
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    flatNumber: "",
  });

  // 1. Fetch Profile and Initial Visitors
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userFlat) {
      dispatch(getVisitorHistory(userFlat));
      setNewVisitor(prev => ({ ...prev, flatNumber: userFlat }));
    }
  }, [dispatch, userFlat]);

  // 2. Success/Error Feedback
  useEffect(() => {
    if (createVisitorSuccess) {
      toast.success("Visitor created successfully!");
      setShowAddModal(false);
      setShowSuccessModal(true);
      // Re-fetch history to show the new entry
      if (userFlat) dispatch(getVisitorHistory(userFlat));
    }
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
  }, [createVisitorSuccess, error, dispatch, userFlat]);

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activeUser = profileData || user;
    const finalMemberId = activeUser?.id || activeUser?._id;
    const finalFlat = newVisitor.flatNumber || userFlat;

    // SANITIZATION: Remove spaces, brackets, and dashes from phone number
    const sanitizedPhone = newVisitor.visitorPhone.replace(/\D/g, '');

    if (!finalMemberId) return toast.error("User ID missing. Please refresh.");
    if (!finalFlat) return toast.error("Flat number is required.");
    if (sanitizedPhone.length < 10) return toast.error("Please enter a valid 10-digit phone number.");

    const payload = {
      visitorName: newVisitor.visitorName.trim(),
      visitorPhone: sanitizedPhone,
      vehicleNumber: newVisitor.vehicleNumber.trim(),
      purpose: newVisitor.purpose,
      visitDate: newVisitor.visitDate,
      visitTime: newVisitor.visitTime,
      flatNumber: finalFlat,
      memberId: finalMemberId
    };

    dispatch(createVisitor(payload)).then((res: any) => {
       if (res.error) {
         // Handle failure if needed, toast is already handled by useEffect
       }
    });
  };

  return (
    <DashboardLayout role="member">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">Welcome, {user?.name || 'Resident'}!</h1>
            <p className="text-muted-foreground">{user?.unit?.flatNumber ? `Flat ${user.unit.flatNumber}` : 'Green Valley Apartments'}</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/10"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Pre-Approve Visitor
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-warning">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold">₹7,500</p>
            <p className="text-muted-foreground text-sm">Pending Dues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-info">
                <Bell className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold">3</p>
            <p className="text-muted-foreground text-sm">New Notices</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold">5</p>
            <p className="text-muted-foreground text-sm">Documents</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-success">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold">0</p>
            <p className="text-muted-foreground text-sm">Open Tickets</p>
          </motion.div>
        </div>

        {/* Visitor Management Section */}
        <div className="bg-card rounded-2xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold">Scheduled Visitors</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ongoing & Upcoming</p>
          </div>
          <div className="p-0">
            {visitorLoading && visitorData.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="text-primary animate-spin" size={32} />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Fetching Visitors...</p>
              </div>
            ) : visitorData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="py-4 px-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Visitor Info</th>
                      <th className="py-4 px-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Purpose</th>
                      <th className="py-4 px-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Entry Code</th>
                      <th className="py-4 px-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visitorData.map((v: any) => (
                      <tr key={v._id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                              {v.visitorName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{v.visitorName}</p>
                              <p className="text-[10px] text-muted-foreground font-medium">{v.visitDate} • {v.visitTime}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold text-muted-foreground">{v.purpose}</span>
                        </td>
                        <td className="py-4 px-6">
                          {v.status === 'Pending' ? (
                            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-black text-xs tracking-widest shadow-sm">
                              {v.verificationCode}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30 text-xs font-bold italic">Used</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                            v.status === 'Pending' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-muted-foreground/40 gap-4">
                <UserPlus size={48} className="opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No visitors scheduled</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="text-primary text-xs font-bold hover:underline"
                >
                  + Add your first visitor
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Dues */}
        <div className="bg-card rounded-2xl card-shadow">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold">Payment Dues</h2>
            <Button>
              <Upload className="w-4 h-4" />
              Upload Payment Proof
            </Button>
          </div>
          <div className="p-4 space-y-4">
            {paymentDues.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.status === "paid" ? "bg-success/20" : "bg-warning/20"
                  }`}>
                    {payment.status === "paid" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{payment.type}</p>
                    <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{payment.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === "paid" 
                      ? "bg-success/10 text-success" 
                      : "bg-warning/10 text-warning"
                  }`}>
                    {payment.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Notices */}
          <div className="bg-card rounded-2xl card-shadow">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Recent Notices</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="p-4 space-y-4">
              {recentNotices.map((notice, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Bell className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notice.title}</p>
                    <p className="text-sm text-muted-foreground">{notice.date}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {notice.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-card rounded-2xl card-shadow">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Payment History</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="p-4 space-y-4">
              {paymentHistory.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.type}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount}</p>
                    <span className="text-xs text-success">Approved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Visitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Pre-Approve Visitor</h3>
                  <p className="text-sm text-slate-500 font-medium">Generate a secure entry code</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-100">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateVisitor}>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visitor Name</label>
                    <input 
                      type="text" required
                      placeholder="e.g. Shivam"
                      className={inputCls} 
                      value={newVisitor.visitorName}
                      onChange={(e) => setNewVisitor({...newVisitor, visitorName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" required
                      placeholder="e.g. 9759477504"
                      className={inputCls} 
                      value={newVisitor.visitorPhone}
                      onChange={(e) => setNewVisitor({...newVisitor, visitorPhone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purpose of Visit</label>
                    <select 
                      className={inputCls}
                      value={newVisitor.purpose}
                      onChange={(e) => setNewVisitor({...newVisitor, purpose: e.target.value})}
                    >
                      <option value="Guest">Guest</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Number</label>
                    <input 
                      type="text"
                      placeholder="e.g. UP32AB1234"
                      className={inputCls} 
                      value={newVisitor.vehicleNumber}
                      onChange={(e) => setNewVisitor({...newVisitor, vehicleNumber: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit Date</label>
                    <input 
                      type="date" required
                      className={inputCls} 
                      value={newVisitor.visitDate}
                      onChange={(e) => setNewVisitor({...newVisitor, visitDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit Time</label>
                    <input 
                      type="text" required
                      placeholder="e.g. 10:30 AM"
                      className={inputCls} 
                      value={newVisitor.visitTime}
                      onChange={(e) => setNewVisitor({...newVisitor, visitTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3 text-left">
                  <Info className="text-blue-600 shrink-0" size={20} />
                  <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                    Once created, you will receive a 4-digit code. Share this with your visitor to allow them entry at the gate.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex items-center gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white transition-all">Cancel</button>
                <button 
                  type="submit" 
                  disabled={visitorLoading}
                  className="flex-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  {visitorLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Create & Get Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal (Showing Verification Code) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ShieldCheck size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Visitor Approved!</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">Please share this entry code with your visitor</p>
              
              <div className="mt-10 mb-10 py-8 bg-slate-50 border-2 border-slate-100 rounded-[32px] relative group overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-[0.02]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verification Code</p>
                <p className="text-6xl font-black text-blue-600 tracking-[8px]">{generatedCode || '####'}</p>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-blue-50/30 rounded-3xl border border-blue-50 text-left space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin size={16} className="text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Flat {user?.unit?.flatNumber}</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Phone size={16} className="text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">{newVisitor.visitorPhone || 'Visitor Mobile'}</p>
                   </div>
                </div>

                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-4 rounded-2xl font-bold text-sm bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Done
                </button>
                <button 
                   onClick={() => {
                     const text = `Hi, I have pre-approved your visit. Your entry code is: ${generatedCode}. Please show this to the guard at the gate.`;
                     window.open(`https://wa.me/${newVisitor.visitorPhone}?text=${encodeURIComponent(text)}`, '_blank');
                   }}
                   className="w-full py-4 rounded-2xl font-bold text-sm bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                >
                  Share via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
