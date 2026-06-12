import React, { useState, useEffect } from 'react';
import { Wallet, Bell, Megaphone, Wrench, CheckCircle, Clock, Upload, UserPlus, ShieldCheck, XCircle, Loader2, Phone, Car, Info, MapPin, MessageSquare, Users, AlertTriangle, Calendar, CreditCard } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { createVisitor, getVisitorHistory, clearUserError } from "../../features/User/userSlice";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "@/auth/axiosInstance";

const inputCls = "w-full bg-muted border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground";

const ResidentialDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { profileData, visitorData, visitorLoading, createVisitorSuccess, generatedCode, error } = useAppSelector((state) => state.user);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [dashboardStats, setDashboardStats] = useState({
    pendingDues: 0,
    newNoticesCount: 0
  });
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

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
    flatNumber: userFlat, 
  });

  useEffect(() => {
    dispatch(getVisitorHistory(userFlat || 'All'));
  }, [dispatch, userFlat]);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setDashboardLoading(true);
        const response = await axiosInstance.get("/profile/dashboard-summary");
        setDashboardStats(response.data.stats);
        setPendingPayments(response.data.pendingPayments);
        setRecentNotices(response.data.recentNotices);
      } catch (err) {
        console.error("Failed to fetch dashboard summary", err);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  useEffect(() => {
    if (createVisitorSuccess) {
      setShowAddModal(false);
      setShowSuccessModal(true);
      setNewVisitor({
        visitorName: "",
        visitorPhone: "",
        vehicleNumber: "",
        purpose: "Guest",
        visitDate: new Date().toISOString().split('T')[0],
        visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        flatNumber: user?.unit?.flatNumber || "",
      });
    }
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
  }, [createVisitorSuccess, error, dispatch, user]);

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createVisitor({
      ...newVisitor,
      memberId: user?.id,
      flatNumber: user?.unit?.flatNumber || newVisitor.flatNumber
    }));
  };

  const getNoticeIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return <Wrench className="w-5 h-5 text-purple-500" />;
      case 'urgent': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'event': return <Calendar className="w-5 h-5 text-success" />;
      default: return <Megaphone className="w-5 h-5 text-primary" />;
    }
  };

  const getNoticeTagColor = (category: string) => {
    switch (category) {
      case 'maintenance': return 'bg-purple-500/10 text-purple-500';
      case 'urgent': return 'bg-destructive/10 text-destructive';
      case 'event': return 'bg-success/10 text-success';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <DashboardLayout role="member">
    <div className="space-y-8 font-sans text-foreground">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Welcome, {currentUser?.name || 'Resident'}!</h1>
          <p className="text-muted-foreground">{currentUser?.unit?.flatNumber ? `Flat ${currentUser.unit.flatNumber}` : 'Green Valley Apartments'}</p>
        </div>
        <div className="flex gap-3">
            <Button 
              onClick={() => setShowAddModal(true)}
              className="rounded-2xl h-12 px-6 font-bold bg-primary text-primary-foreground border-none hover:bg-primary/90 transition-all"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Pre-Approve Visitor
            </Button>
          </div>
        </div>

      {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 border border-border cursor-pointer hover:bg-muted/30 transition-all shadow-none"
            onClick={() => navigate('/member/payments')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-warning/10">
                <CreditCard className="w-6 h-6 text-warning" />
              </div>
            </div>
            {dashboardLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
              <p className="text-3xl font-bold text-foreground">₹{dashboardStats.pendingDues.toLocaleString()}</p>
            )}
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">Pending Dues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-6 border border-border cursor-pointer hover:bg-muted/30 transition-all shadow-none"
            onClick={() => navigate('/member/notices')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Bell className="w-6 h-6 text-primary" />
              </div>
            </div>
            {dashboardLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
              <p className="text-3xl font-bold text-foreground">{dashboardStats.newNoticesCount}</p>
            )}
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">New Notices</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-3xl p-6 border border-border cursor-pointer hover:bg-muted/30 transition-all shadow-none"
            onClick={() => navigate('/member/staff-directory')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-success/10">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">Explore</p>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">Staff Directory</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-3xl p-6 border border-border cursor-pointer hover:bg-muted/30 transition-all shadow-none"
            onClick={() => navigate('/member/support')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-destructive/10">
                <MessageSquare className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">Support</p>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">Help Desk</p>
          </motion.div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Visitor Management Section */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">Scheduled Visitors</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Ongoing & Upcoming</p>
            </div>
            <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden">
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
                              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-black text-xs tracking-widest">
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

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">Payment Dues</h3>
              <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                <Upload size={16} /> Upload Proof
              </button>
            </div>
            <div className="bg-card rounded-3xl border border-border overflow-hidden divide-y divide-border min-h-[100px]">
              {dashboardLoading ? (
                <div className="py-10 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : pendingPayments.length > 0 ? (
                pendingPayments.map((item) => (
                  <div key={item.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${item.status === 'PAID' ? 'bg-success/10' : 'bg-warning/10'}`}>
                        {item.status === 'PAID' ? 
                          <CheckCircle size={20} className="text-success" /> : 
                          <Clock size={20} className="text-warning" />
                        }
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Due Date: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground text-lg">₹{item.amount.toLocaleString()}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.status === 'PAID' ? 'bg-success/10 text-success' : 
                        item.status === 'AWAITING_VERIFICATION' ? 'bg-blue-500/10 text-blue-500' : 
                        'bg-warning/10 text-warning'
                      }`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-muted-foreground text-sm font-medium italic">
                  No pending dues. You're all caught up! ✨
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notices Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-foreground">Recent Notices</h3>
            <button 
              onClick={() => navigate('/member/notices')}
              className="text-primary text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardLoading ? (
              <div className="py-10 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recentNotices.length > 0 ? (
              recentNotices.map((notice) => (
                <div key={notice._id} className="bg-card p-5 rounded-3xl border border-border border-l-4 border-l-primary hover:bg-muted/20 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-muted rounded-lg">
                      {getNoticeIcon(notice.category)}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${getNoticeTagColor(notice.category)}`}>
                      {notice.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{notice.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{notice.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-3 font-bold uppercase tracking-widest">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-card p-10 rounded-3xl border border-border text-center text-muted-foreground text-sm">
                No new notices.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Visitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-card rounded-[32px] w-full max-w-lg shadow-none overflow-hidden animate-in fade-in zoom-in duration-200 border border-border">
            <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center border border-primary/20">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Pre-Approve Visitor</h3>
                  <p className="text-sm text-muted-foreground font-medium">Generate a secure entry code</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors border border-transparent hover:border-border">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateVisitor}>
              <div className="p-8 space-y-6 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Visitor Name</label>
                    <input 
                      type="text" required
                      placeholder="e.g. Shivam"
                      className={inputCls} 
                      value={newVisitor.visitorName}
                      onChange={(e) => setNewVisitor({...newVisitor, visitorName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
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
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Purpose of Visit</label>
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
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Vehicle Number</label>
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
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Visit Date</label>
                    <input 
                      type="date" required
                      className={inputCls} 
                      value={newVisitor.visitDate}
                      onChange={(e) => setNewVisitor({...newVisitor, visitDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Visit Time</label>
                    <input 
                      type="text" required
                      placeholder="e.g. 10:30 AM"
                      className={inputCls} 
                      value={newVisitor.visitTime}
                      onChange={(e) => setNewVisitor({...newVisitor, visitTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3">
                  <Info className="text-primary shrink-0" size={20} />
                  <p className="text-[11px] font-medium text-primary leading-relaxed">
                    Once created, you will receive a 4-digit code. Share this with your visitor to allow them entry at the gate.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-muted/50 border-t border-border flex items-center gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-card transition-all">Cancel</button>
                <button 
                  type="submit" 
                  disabled={visitorLoading}
                  className="flex-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {visitorLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Create & Get Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-card rounded-[40px] w-full max-sm shadow-none animate-in fade-in zoom-in duration-300 overflow-hidden border border-border">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-success/10 text-success rounded-[32px] flex items-center justify-center mx-auto mb-8">
                <ShieldCheck size={48} />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Visitor Approved!</h3>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Please share this entry code with your visitor</p>
              
              <div className="mt-10 mb-10 py-8 bg-muted border-2 border-border rounded-[32px] relative group overflow-hidden">
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-[0.02]" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Verification Code</p>
                <p className="text-6xl font-black text-primary tracking-[8px]">{generatedCode || '####'}</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-4 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
                >
                  Done
                </button>
                <button 
                   onClick={() => {
                     const text = `Hi, I have pre-approved your visit. Your entry code is: ${generatedCode}. Please show this to the guard at the gate.`;
                     window.open(`https://wa.me/${newVisitor.visitorPhone}?text=${encodeURIComponent(text)}`, '_blank');
                   }}
                   className="w-full py-4 rounded-2xl font-bold text-sm bg-card text-success border border-success/20 hover:bg-success/5 transition-all flex items-center justify-center gap-2"
                >
                  Share via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default ResidentialDashboard;
