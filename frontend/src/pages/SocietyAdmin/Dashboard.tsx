import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Users, IndianRupee, AlertTriangle, UserCheck,
  Plus, Home, UserPlus, User, ShieldCheck,
  Camera, Edit2, ChevronDown, Upload, Info, X,
  ChevronLeft, ChevronRight, Paperclip, Moon, ImageIcon,
  TrendingUp, Bell, Calendar, ArrowUpRight, Wrench, Clock,
  Loader2, ListFilter, RefreshCw
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useAppSelector } from "../../store/store";
import axiosInstance from "@/auth/axiosInstance";
import { toast } from "sonner";
import notificationService from "@/auth/notificationService";

const StatCard = ({ title, value, subtitle, icon, color, trend, loading, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`bg-card rounded-2xl p-5 border border-border shadow-none hover:shadow-md hover:scale-[1.02] transition-all group ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`${color} p-2.5 rounded-xl`}>{icon}</div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
          <ArrowUpRight size={10} /> {trend}
        </span>
      )}
    </div>
    <p className="text-xs text-muted-foreground font-semibold mb-1">{title}</p>
    {loading ? (
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    ) : (
      <h2 className="text-2xl font-black text-foreground">{value}</h2>
    )}
    {subtitle && <p className="text-xs text-emerald-600 font-bold mt-1">{subtitle}</p>}
  </div>
);

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem("role") || "guard";
  
  const [stats, setStats] = useState({
    totalResidents: 0,
    maintenanceCollected: 0,
    activeComplaints: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [silentLoading, setSilentLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showAllAlertsModal, setShowAllAlertsModal] = useState(false);
  
  const isGuard = role === 'guard';
  const lastAlertIdRef = useRef<string | null>(null);

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setSilentLoading(true);

      const response = await axiosInstance.get("/admin/dashboard-stats");
      setStats(response.data.stats);
      setActivities(response.data.recentActivity);

      if (isGuard) {
        const alertsRes = await axiosInstance.get("/notifications/my?page=1&limit=20");
        const allNotifs = alertsRes.data.data || [];
        
        if (allNotifs.length > 0) {
          const latest = allNotifs[0];
          if (lastAlertIdRef.current && lastAlertIdRef.current !== latest._id) {
             toast.info(latest.title, { description: latest.message, position: "top-right" });
          }
          lastAlertIdRef.current = latest._id;
        }

        const filtered = allNotifs.filter((n: any) => 
          n.category === 'visitor' || n.category === 'alert'
        );
        setSecurityAlerts(filtered);
      }
    } catch (error: any) {
      console.error("Dashboard fetch error", error);
    } finally {
      setLoading(false);
      setSilentLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    let interval = setInterval(() => fetchDashboardData(true), 15000);
    return () => clearInterval(interval);
  }, [isGuard]);

  const handleAlertClick = async (alert: any) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
    
    if (!alert.isRead) {
      try {
        await notificationService.markAsRead(alert._id);
        setSecurityAlerts(prev => prev.map(n => n._id === alert._id ? { ...n, isRead: true } : n));
      } catch (err) {
        console.error("Failed to mark read", err);
      }
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hrs ago`;
    return date.toLocaleDateString();
  };

  const filteredActivities = useMemo(() => {
    if (!isGuard) return activities;
    const securityActions = ['visitor_entry', 'visitor_exit', 'delivery_registered', 'login', 'guard_created'];
    return activities.filter(act => securityActions.includes(act.action));
  }, [activities, isGuard]);

  return (
    <DashboardLayout role={role as any}>
      <div className="max-w-[1600px] mx-auto relative px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                {isGuard ? `Security Hub: ${user?.name || 'Guard'}` : `Welcome back, ${user?.name || 'Admin'}`}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm pl-3.5 flex items-center gap-2">
              {isGuard ? "Real-time security monitoring active." : "Overview of society operations today."}
              {silentLoading && <span className="text-[10px] text-primary font-bold animate-pulse">● Syncing</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fetchDashboardData()} 
              className="p-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all border border-border shadow-sm active:scale-95"
              title="Refresh Dashboard"
            >
              <RefreshCw size={16} className={loading || silentLoading ? "animate-spin" : ""} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold bg-card border border-border px-4 py-2.5 rounded-xl shadow-sm text-foreground/80">
               <Clock size={13} className="text-primary" /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Residents" value={stats.totalResidents} loading={loading} icon={<Users size={20} className="text-blue-600 dark:text-blue-400" />} color="bg-blue-500/10" />
          {!isGuard && <StatCard title="Maintenance" value={`₹${stats.maintenanceCollected}`} loading={loading} icon={<IndianRupee size={20} className="text-emerald-600 dark:text-emerald-400" />} color="bg-emerald-500/10" />}
          <StatCard 
             title={isGuard ? "Unread Alerts" : "Complaints"} 
             value={isGuard ? securityAlerts.filter(a => !a.isRead).length : stats.activeComplaints} 
             loading={loading} 
             icon={<Bell size={20} className="text-orange-500 dark:text-orange-400" />} 
             color="bg-orange-500/10" 
             onClick={isGuard ? () => setShowAllAlertsModal(true) : undefined}
          />
        </div>

        {/* ── Main Layout ── */}
        <div className={`grid grid-cols-1 ${isGuard ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          
          {/* Activity Feed */}
          <div className={`${isGuard ? 'lg:col-span-2' : 'col-span-1'} bg-card rounded-3xl border border-border overflow-hidden shadow-sm`}>
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-card">
               <h2 className="font-black text-foreground flex items-center gap-2"><TrendingUp size={16} className="text-primary" /> Recent Activity</h2>
            </div>
            <div className="divide-y divide-border min-h-[300px]">
              {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div> :
               filteredActivities.length > 0 ? filteredActivities.map((item, i) => (
                <div key={i} className="px-6 py-4 hover:bg-muted/30 transition-colors flex justify-between items-center group">
                  <div className="flex gap-3 items-center">
                    <div className={`w-2 h-2 rounded-full ${item.action.includes('exit') ? 'bg-orange-400' : 'bg-primary'} group-hover:scale-125 transition-transform`} />
                    <div>
                       <p className="text-sm font-bold text-foreground/90">{item.description}</p>
                       <p className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1 mt-0.5">
                         <Clock size={10} /> {formatTimestamp(item.createdAt)}
                       </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-muted text-foreground px-2 py-1 rounded-lg uppercase tracking-tighter border border-border">
                    {item.action.replace(/_/g,' ')}
                  </span>
                </div>
              )) : <div className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">No activity yet</div>}
            </div>
          </div>

          {/* Right Alerts Panel - GUARD ONLY */}
          {isGuard && (
            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
               <div className="px-6 py-5 border-b border-border bg-card flex justify-between items-center">
                  <h2 className="font-black text-foreground flex items-center gap-2"><Bell size={16} className="text-primary" /> Live Alerts</h2>
                  <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-lg border border-emerald-500/20">Active</span>
               </div>
               <div className="p-4 space-y-3">
                  {securityAlerts.slice(0, 6).map((alert) => (
                    <div key={alert._id} onClick={() => handleAlertClick(alert)} className={`p-4 ${alert.isRead ? 'bg-muted/10' : 'bg-primary/5'} hover:bg-muted/50 rounded-2xl border border-border/50 hover:border-border transition-all cursor-pointer group`}>
                      <div className="flex items-center gap-2 mb-1">
                         {!alert.isRead && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                         <h4 className={`text-xs font-black ${alert.isRead ? 'text-muted-foreground' : 'text-foreground'} group-hover:text-primary transition-colors`}>{alert.title}</h4>
                      </div>
                      <p className={`text-[11px] ${alert.isRead ? 'text-muted-foreground/60' : 'text-muted-foreground'} line-clamp-2 ml-3.5 leading-relaxed`}>{alert.message}</p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase mt-2 ml-3.5 flex justify-between items-center">
                         {formatTimestamp(alert.createdAt)}
                         <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[8px]">View Details →</span>
                      </p>
                    </div>
                  ))}
                  {securityAlerts.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center gap-2">
                      <Bell className="w-8 h-8 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground opacity-40 font-black uppercase text-[10px] tracking-widest">Waiting for alerts</p>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>

        {/* DETAILS MODAL (Highest Z-Index) */}
        {showAlertModal && selectedAlert && (
          <Modal onClose={() => setShowAlertModal(false)} zIndex="z-[1100]">
            <div className="p-8 space-y-6 bg-card">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
                    <Bell size={28} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-foreground tracking-tight">{selectedAlert.title}</h2>
                     <p className="text-xs font-bold text-primary uppercase tracking-widest">{new Date(selectedAlert.createdAt).toLocaleString()}</p>
                  </div>
               </div>
               <div className="p-6 bg-muted rounded-[24px] border border-border">
                  <p className="text-base text-foreground font-medium leading-relaxed tracking-tight whitespace-pre-wrap">
                    {selectedAlert.message}
                  </p>
               </div>
               <button 
                 onClick={() => setShowAlertModal(false)} 
                 className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-lg hover:bg-primary/90"
               >
                 Understood
               </button>
            </div>
          </Modal>
        )}

        {/* ALL ALERTS MODAL */}
        {showAllAlertsModal && (
          <Modal onClose={() => setShowAllAlertsModal(false)} wide zIndex="z-[1000]">
             <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                <h1 className="font-black text-foreground flex items-center gap-2"><ListFilter size={18} /> Security Alerts Log</h1>
                <button onClick={() => setShowAllAlertsModal(false)} className="p-2 hover:bg-muted text-muted-foreground rounded-xl transition-colors"><X size={20} /></button>
             </div>
             <div className="max-h-[500px] overflow-y-auto divide-y divide-border">
                {securityAlerts.length > 0 ? securityAlerts.map(n => (
                  <div key={n._id} className={`p-6 hover:bg-muted/20 transition-colors cursor-pointer ${n.isRead ? '' : 'bg-primary/5'}`} onClick={() => handleAlertClick(n)}>
                     <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                          <h4 className="font-bold text-foreground/90">{n.title}</h4>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase">{formatTimestamp(n.createdAt)}</span>
                     </div>
                     <p className="text-sm text-muted-foreground leading-relaxed">{n.message}</p>
                  </div>
                )) : <div className="py-20 text-center opacity-30 font-black uppercase text-xs">No alerts recorded</div>}
             </div>
             <div className="p-4 bg-muted/20 border-t border-border flex justify-center">
                <button onClick={() => setShowAllAlertsModal(false)} className="text-[10px] font-black uppercase text-muted-foreground hover:text-foreground transition-colors">Close Log</button>
             </div>
          </Modal>
        )}

      </div>
    </DashboardLayout>
  );
};

const Modal = ({ children, onClose, wide, zIndex = "z-[1000]" }: any) => (
  <div className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4`}>
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
    <div className={`relative bg-card w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} rounded-[40px] shadow-2xl overflow-hidden border border-border`}>
       {children}
    </div>
  </div>
);

export default Dashboard;
