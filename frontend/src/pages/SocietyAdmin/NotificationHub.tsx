import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  Megaphone,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Waves,
  Plus,
  PlusCircle,
  Inbox,
  BellPlus,
  RefreshCw,
  ShieldAlert,
  Users,
  User,
  X,
  Send
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { fetchMyNotifications, markNotificationRead, markAllNotificationsRead, fetchUnreadCount, fetchNotificationStats } from '../../features/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import notificationService from '@/auth/notificationService';
import { getAllSocietiesSuperAdminService } from '@/auth/authServices';

const StatCard = ({ icon: Icon, label, value, iconBg, onClick, isActive }) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-[2rem] flex items-center gap-5 shadow-none border transition-all cursor-pointer w-full group ${iconBg} text-white ${isActive ? 'ring-4 ring-white/30 scale-[1.03]' : 'hover:scale-[1.02] border-border'}`}
  >
    <div className={`p-3.5 rounded-2xl bg-white/20`}>
      <Icon className={`w-6 h-6 text-white`} />
    </div>
    <div>
      <p className="text-white/80 text-sm font-medium mb-0.5">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  </div>
);

const NotificationHub = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notifications, isLoading, totalPages, currentPage, stats } = useAppSelector((state) => state.notifications);
  
  const role = user?.role || localStorage.getItem("role") || "guard";
  const [activeTab, setActiveTab] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // SuperAdmin Societies
  const [societies, setSocieties] = useState<any[]>([]);

  // Search/Residents State
  const [residents, setResidents] = useState<any[]>([]);
  const [memberSearch, setMemberSearch] = useState('');

  // Form State for Broadcast
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'general',
    targetAudience: 'all',
    societyId: '',
    recipientId: '' // [NEW] For specific member targeting
  });

  useEffect(() => {
    dispatch(fetchMyNotifications({ page: 1, limit: 10, category: activeTab }));
    dispatch(fetchNotificationStats());
    
    // Fetch societies if superadmin
    if (role === 'superadmin' || role === 'super-admin') {
      const fetchSocieties = async () => {
        try {
          const data = await getAllSocietiesSuperAdminService();
          setSocieties(data.societies || []);
        } catch (error) {
          console.error("Failed to fetch societies", error);
        }
      };
      fetchSocieties();
    }
  }, [dispatch, activeTab, role]);

  // Fetch Residents when societyId or Target changes
  useEffect(() => {
    const fetchResidents = async () => {
      if (formData.targetAudience === 'specific') {
        try {
          // If SuperAdmin, use the selected societyId. 
          // If Society Admin, the backend will automatically use their society from the token.
          const targetSoc = (role === 'superadmin' || role === 'super-admin') ? formData.societyId : '';
          
          if (formData.targetAudience === 'specific') {
            console.log("Fetching residents...");
            const response = await notificationService.getSocietyResidents(targetSoc);
            
            const rawList = response.users || response.data || (Array.isArray(response) ? response : []);
            setResidents(rawList);
          }
        } catch (error) {
          console.error("Failed to fetch residents", error);
        }
      }
    };
    fetchResidents();
  }, [formData.targetAudience, formData.societyId, role]);

  const filteredResidents = useMemo(() => {
    const search = memberSearch.toLowerCase().trim();
    if (!search) return residents;

    return residents.filter(r => {
      const name = (r.name || "").toLowerCase();
      const flat = (r.unit?.flatNumber || "").toString().toLowerCase();
      const tower = (r.unit?.towerBlock || "").toLowerCase();
      
      return name.includes(search) || flat.includes(search) || tower.includes(search);
    });
  }, [residents, memberSearch]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchMyNotifications({ page: newPage, limit: 10, category: activeTab }));
  };

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsRead()).unwrap();
      toast({ title: "Success", description: "All notifications marked as read" });
      dispatch(fetchUnreadCount());
      dispatch(fetchNotificationStats());
    } catch (error) {
      toast({ title: "Error", description: "Failed to mark all as read", variant: "destructive" });
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast({ title: "Validation Error", description: "Title and Message are required", variant: "destructive" });
      return;
    }

    try {
      setIsSending(true);
      await notificationService.broadcastManual(formData);
      toast({ title: "Success", description: "Broadcast alert sent successfully!" });
      setIsDialogOpen(false);
      setFormData({ title: '', message: '', category: 'general', targetAudience: 'all', societyId: '' });
      dispatch(fetchMyNotifications({ page: 1, limit: 10, category: activeTab })); // Refresh list
      dispatch(fetchNotificationStats());
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to send broadcast", 
        variant: "destructive" 
      });
    } finally {
      setIsSending(false);
    }
  };

  const isAdmin = role === 'society_admin' || role === 'admin' || role === 'superadmin' || role === 'super-admin';
  const isGuard = role === 'guard';

  const tabs = [
    'All', 
    'Unread', 
    ...(!isGuard ? ['Payment Alerts'] : []), 
    'Security', 
    'Read', 
    'Sent'
  ];

  const filteredList = useMemo(() => {
    // [CLEANUP] Frontend manual filtering removed.
    // Backend now handles all tab-specific separation (Inbox vs Sent).
    return notifications;
  }, [notifications]);

  const TYPE_STYLES = {
    payment: {
        bg: "bg-amber-50",
        text: "text-[#D97706]",
        icon: "text-[#F59E0B]",
        iconComp: CreditCard
    },
    visitor: {
        bg: "bg-rose-50",
        text: "text-[#DC2626]",
        icon: "text-[#EF4444]",
        iconComp: ShieldAlert
    },
    alert: {
        bg: "bg-rose-50",
        text: "text-[#DC2626]",
        icon: "text-[#EF4444]",
        iconComp: AlertTriangle
    },
    notice: {
        bg: "bg-blue-50",
        text: "text-[#2563EB]",
        icon: "text-[#3B82F6]",
        iconComp: Megaphone
    },
    general: {
        bg: "bg-emerald-50",
        text: "text-[#059669]",
        icon: "text-[#10B981]",
        iconComp: Users
    },
    complaint: {
        bg: "bg-purple-50",
        text: "text-[#7C3AED]",
        icon: "text-[#8B5CF6]",
        iconComp: AlertTriangle
    }
  };

  const handleNotificationClick = (id: string, isRead: boolean) => {
    setExpandedId(expandedId === id ? null : id);
    if (!isRead) {
      dispatch(markNotificationRead(id)).then(() => {
        dispatch(fetchNotificationStats());
        // Re-fetch list if we are in Unread or Read tab to sync items
        if (activeTab === 'Unread' || activeTab === 'Read') {
          dispatch(fetchMyNotifications({ page: currentPage, limit: 10, category: activeTab }));
        }
      });
    }
  };

  return (
    <DashboardLayout role={role as any}>
    <div className="min-h-screen text-foreground relative overflow-hidden ">
     
      <div className="max-w-5xl mx-auto relative z-10 space-y-8 mb-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 mt-12 sm:mt-0 text-left">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-wide mb-1">
              Notifications Hub
            </h1>
            <p className="text-muted-foreground text-base font-medium">
              Central control for all society alerts and management updates.
            </p>
          </div>
          
          {(role === 'society_admin' || role === 'admin' || role === 'superadmin') && (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleMarkAllRead}
                className="rounded-full px-6 font-semibold hidden sm:flex"
              >
                Mark All Read
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full flex items-center justify-center gap-2 font-semibold transition-all shadow-none">
                  <div className="p-1 rounded-md">
                      <BellPlus className="w-5 h-5" />
                  </div>
                  <span>Broadcast Alert</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-8 pt-8 pb-4 bg-card">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Megaphone className="w-6 h-6" />
                    </div>
                    Send Alert
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBroadcast} className="px-8 pb-8 space-y-5 overflow-y-auto max-h-[70vh] no-scrollbar">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Alert Title</label>
                    <Input 
                      placeholder="e.g. Water Maintenance" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="rounded-2xl border-border bg-muted/30 focus-visible:ring-primary h-11"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {(role === 'superadmin' || role === 'super-admin') && (
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Select Society</label>
                        <Select 
                          value={formData.societyId} 
                          onValueChange={(val) => setFormData({...formData, societyId: val})}
                        >
                          <SelectTrigger className="rounded-2xl border-border bg-muted/30 h-11">
                            <SelectValue placeholder="All Societies (Global)" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border">
                            <SelectItem value="global">All Societies (Global)</SelectItem>
                            {societies.map((society) => (
                              <SelectItem key={society._id} value={society._id}>
                                {society.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Category</label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(val) => setFormData({...formData, category: val})}
                      >
                        <SelectTrigger className="rounded-2xl border-border bg-muted/30 h-11 text-xs">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border">
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="alert">Emergency Alert</SelectItem>
                          <SelectItem value="notice">Notice</SelectItem>
                          <SelectItem value="payment">Payment Reminder</SelectItem>
                          <SelectItem value="visitor">Visitor Alert</SelectItem>
                          <SelectItem value="complaint">Complaint Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Target</label>
                      <Select 
                        value={formData.targetAudience} 
                        onValueChange={(val) => {
                          setFormData({...formData, targetAudience: val, recipientId: ''});
                          setMemberSearch('');
                        }}
                      >
                        <SelectTrigger className="rounded-2xl border-border bg-muted/30 h-11 text-xs">
                          <SelectValue placeholder="Audience" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border">
                          <SelectItem value="all">All Members</SelectItem>
                          <SelectItem value="admins">Admins Only</SelectItem>
                          <SelectItem value="owners">Owners Only</SelectItem>
                          <SelectItem value="tenants">Tenants Only</SelectItem>
                          <SelectItem value="guards">Guards Only</SelectItem>
                          <SelectItem value="specific">Specific Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.targetAudience === 'specific' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-muted/20 p-4 rounded-3xl border border-border/50">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Member Selection</label>
                      
                      {(role === 'superadmin' || role === 'super-admin') && (!formData.societyId || formData.societyId === 'global') ? (
                        <div className="text-center py-4 bg-card rounded-2xl border border-dashed border-border">
                           <p className="text-[11px] font-bold text-rose-500 uppercase tracking-tight">Please select a specific society first to search members</p>
                        </div>
                      ) : !formData.recipientId ? (
                        <div className="relative">
                          <Input 
                            placeholder="Search name or flat..." 
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            className="rounded-xl border-border bg-card focus-visible:ring-primary h-10 mb-2"
                          />
                          {memberSearch.length > 0 && (
                            <div className="max-h-[120px] overflow-y-auto border border-border rounded-xl bg-card divide-y divide-border/50 scrollbar-thin shadow-inner">
                              {filteredResidents.length > 0 ? (
                                filteredResidents.map((resident) => (
                                  <div 
                                    key={resident._id}
                                    onClick={() => {
                                      setFormData({...formData, recipientId: resident._id});
                                      setMemberSearch('');
                                    }}
                                    className="px-4 py-2.5 cursor-pointer hover:bg-muted transition-all flex justify-between items-center group"
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-semibold group-hover:text-primary">{resident.name}</span>
                                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Unit: {resident.unit?.towerBlock}-{resident.unit?.flatNumber}</span>
                                    </div>
                                    <PlusCircle className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-[11px] text-rose-500 text-center italic font-medium">No members found with this name/flat</div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-3 rounded-2xl animate-in zoom-in-95 duration-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary rounded-xl">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-primary">
                                {residents.find(r => r._id === formData.recipientId)?.name}
                              </span>
                              <span className="text-[10px] text-primary/60 font-black uppercase tracking-tighter">
                                Selected Member
                              </span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, recipientId: ''})}
                            className="p-1.5 hover:bg-primary/20 rounded-lg text-primary transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Message</label>
                    <Textarea 
                      placeholder="Type your message here..." 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="rounded-3xl border-border bg-muted/30 focus-visible:ring-primary min-h-[100px] resize-none text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={isSending || (formData.targetAudience === 'specific' && !formData.recipientId)}
                      className="w-full h-12 rounded-2xl font-bold text-base gap-2 shadow-lg shadow-primary/20"
                    >
                      {isSending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      {isSending ? 'Sending...' : 'Broadcast Alert'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            </div>
          )}
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          <StatCard 
            icon={Mail} 
            label="Unread Alerts" 
            value={stats.unread || 0} 
            iconBg="bg-primary" 
            isActive={activeTab === 'Unread'}
            onClick={() => setActiveTab('Unread')}
          />
          <StatCard 
            icon={AlertTriangle} 
            label="High Priority" 
            value={stats.highPriority || 0} 
            iconBg="bg-warning" 
            isActive={activeTab === 'Security'}
            onClick={() => setActiveTab('Security')}
          />
          {!isGuard && (
            <StatCard 
              icon={CreditCard} 
              label="Payment Alerts" 
              value={stats.payment || 0} 
              iconBg="bg-amber-500" 
              isActive={activeTab === 'Payment Alerts'}
              onClick={() => setActiveTab('Payment Alerts')}
            />
          )}
          <StatCard 
            icon={CheckCircle2} 
            label="Read Alerts" 
            value={stats.read || 0} 
            iconBg="bg-success" 
            isActive={activeTab === 'Read'}
            onClick={() => setActiveTab('Read')}
          />
        </section>

        {/* Main Hub Content Container */}
        <main className="bg-card rounded-[2.5rem] overflow-hidden border border-border">
          
          {/* Navigation Bar */}
          <div className="px-4 sm:px-8 pt-8 pb-4">
            <div className="bg-muted p-1.5 rounded-3xl flex items-center w-full overflow-x-auto no-scrollbar border border-border scroll-smooth">
              <div className="flex items-center gap-1.5 min-w-max pr-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 sm:px-6 py-2 rounded-2xl text-xs sm:text-sm transition-all whitespace-nowrap font-bold ${
                      activeTab === tab 
                      ? 'bg-card text-primary shadow-sm border border-border' 
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List of Notifications */}
          <div className=" px-2 sm:px-8 py-4 space-y-3 min-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredList.length > 0 ? (
              filteredList.map((item) => {
                const style = TYPE_STYLES[item.category] || TYPE_STYLES.general;
                const Icon = style.iconComp;
                const isExpanded = expandedId === item._id;

                return (
                    <div 
                    key={item._id}
                    onClick={() => handleNotificationClick(item._id, item.isRead)}
                    className={`group flex flex-col gap-4 px-6 py-4 rounded-[2rem] bg-card border border-border hover:border-primary/40 hover:bg-muted/30 transition-all text-left cursor-pointer ${isExpanded ? 'border-primary/50 bg-muted/20' : ''}`}
                    >
                    <div className="flex flex-row items-start md:items-center gap-6">
                        {/* Left Icon */}
                        <div className={`p-4 rounded-2xl flex-shrink-0 ${style.bg} ${style.icon} bg-opacity-10`}>
                            <Icon className="w-6 h-6" />
                        </div>

                        {/* Center Content */}
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[11px] px-2 font-black rounded-md uppercase tracking-[0.1em] ${style.bg} ${style.text} bg-opacity-10 py-0.5 border border-current/20`}>
                                {item.category}
                            </span>
                            <span className="text-muted-foreground text-xs font-medium">
                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </span>
                            </div>

                            <h3 className="text-base font-bold text-foreground tracking-tight leading-snug">
                            {item.title}
                            </h3>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 self-end md:self-center pr-2">
                            {item.isRead ? (
                            <span className="text-muted-foreground/30 hidden md:block text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                Read
                            </span>
                            ) : (
                            <div className="w-2.5 h-2.5 rounded-full hidden md:block bg-primary shadow-none"></div>
                            )}
                        </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                        <div className="pl-[72px] pr-4 pb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                {item.message}
                            </p>
                            <div className="mt-4 flex gap-3">
                                {item.link && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = item.link;
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                                  >
                                    Take Action
                                  </button>
                                )}
                                <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-muted text-foreground border border-border">Dismiss</button>
                            </div>
                        </div>
                    )}
                    </div>
                );
                })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-muted/50 p-8 rounded-[2.5rem] mb-6 border border-dashed border-border">
                  <Inbox className="w-16 h-16 text-muted-foreground/20" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No notifications found</h3>
                <p className="text-muted-foreground max-w-xs font-medium leading-relaxed mb-8">
                  It looks like there are no alerts in the category at the moment.
                </p>
                <button 
                  onClick={() => setActiveTab('All')}
                  className="px-6 py-2.5 bg-card border border-border shadow-sm rounded-xl text-primary font-bold text-sm hover:bg-muted transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Footer & Pagination */}
          <footer className="sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border mt-4">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </p>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition border border-border disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-9 h-9 rounded-xl font-bold text-sm ${currentPage === i + 1 ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground border border-border'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition border border-border disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </footer>
        </main>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default NotificationHub;
