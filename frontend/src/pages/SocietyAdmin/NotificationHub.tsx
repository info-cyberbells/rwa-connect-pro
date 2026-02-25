import React, { useState, useMemo } from 'react';
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
  Inbox,
  BellPlus
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'FINANCIAL',
    title: 'Urgent: Maintenance Dues Pending',
    description: '15 residents in Block A have not cleared the maintenance fees for October.',
    timestamp: '15 mins ago',
    read: false,
    category: 'Payment Alerts',
    icon: CreditCard,
    color: 'amber',
    priority: 'high'
  },
  {
    id: 2,
    type: 'SECURITY',
    title: 'New Visitor Entry Request: Gate 3',
    description: 'Delivery vehicle DL-01-AB-1234 requesting entry for Apartment 402.',
    timestamp: '1 hour ago',
    read: false,
    category: 'Security',
    icon: ShieldCheck,
    color: 'rose',
    priority: 'high'
  },
  {
    id: 3,
    type: 'FACILITY',
    title: 'Swimming Pool Maintenance Completed',
    description: 'Weekly cleaning and PH check for Main Pool is successful. Ready for use.',
    timestamp: '3 hours ago',
    read: true,
    category: 'Facility',
    icon: Waves,
    color: 'blue',
    priority: 'normal'
  },
  {
    id: 4,
    type: 'COMMUNITY',
    title: 'Upcoming AGM Meeting',
    description: 'Annual General Meeting scheduled for Sunday, 15th October at the Clubhouse.',
    timestamp: '5 hours ago',
    read: true,
    category: 'Community',
    icon: Calendar,
    color: 'emerald',
    priority: 'normal'
  }
];

const StatCard = ({ icon: Icon, label, value, iconBg }) => (
  <div className="bg-white p-6 rounded-[2rem] flex items-center gap-5 shadow-sm border border-slate-50 w-full">
    <div className={`p-3.5 rounded-2xl ${iconBg} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${iconBg.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-[#64748B] text-sm font-medium mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-[#0F172A] tracking-tight">{value}</p>
    </div>
  </div>
);

const NotificationHub = () => {
  const [notifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Unread', 'Payment Alerts', 'Security'];

  // Dynamic Stats for the bottom cards
  const stats = useMemo(() => ({
    unread: notifications.filter(n => !n.read).length,
    high: notifications.filter(n => n.priority === 'high').length,
    resolved: notifications.filter(n => n.read).length
  }), [notifications]);

  // Filtered List logic
  const filteredList = useMemo(() => {
    if (activeTab === 'All') return notifications;
    if (activeTab === 'Unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.category === activeTab);
  }, [activeTab, notifications]);

  const TYPE_STYLES = {
    FINANCIAL: {
        bg: "bg-amber-50",
        text: "text-[#D97706]",
        icon: "text-[#F59E0B]"
    },
    SECURITY: {
        bg: "bg-rose-50",
        text: "text-[#DC2626]",
        icon: "text-[#EF4444]"
    },
    FACILITY: {
        bg: "bg-blue-50",
        text: "text-[#2563EB]",
        icon: "text-[#3B82F6]"
    },
    COMMUNITY: {
        bg: "bg-emerald-50",
        text: "text-[#059669]",
        icon: "text-[#10B981]"
    }
    };

  return (
    <DashboardLayout role="society-admin">
    <div className="min-h-screen  text-[#0F172A] relative overflow-hidden ">
      {/* Decorative Blurs */}
      {/* <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" /> */}

      <div className="max-w-5xl mx-auto relative z-10 space-y-10 mb-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <div>
            <h1 className="text-3xl font-bold  text-[#0F172A] tracking-wide mb-1">
              Notifications Hub
            </h1>
            <p className="text-[#64748B] text-base font-medium">
              Central control for all society alerts and management updates.
            </p>
          </div>
          <button className="bg-[#0D6CF2] hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 font-semibold transition-all ">
            <div className="p-1 rounded-md">
                <BellPlus className="w-5 h-5" />
            </div>
            <span>Broadcast Alert</span>
          </button>
        </header>

        {/* Main Hub Content Container */}
        <main className="bg-white rounded-[2.5rem] overflow-hidden">
          
          {/* Navigation Bar */}
          <div className="px-2 sm:px-8 pt-8 pb-4">
            <div className="bg-[#F1F5F9] sm:px-2 py-1.5 rounded-3xl flex items-center w-fit overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 sm:px-6 py-1.5 rounded-2xl text-xs sm:text-base  transition-all whitespace-nowrap ${
                    activeTab === tab 
                    ? 'bg-white text-[#0D6CF2] font-bold shadow-sm ring-1 ring-slate-100' 
                    : 'text-[#64748B] hover:text-slate-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* List of Notifications */}
          <div className=" px-2 sm:px-8 py-4 space-y-3 min-h-[400px]">
            {filteredList.length > 0 ? (
              filteredList.map((item) => {
                const style = TYPE_STYLES[item.type] || TYPE_STYLES.COMMUNITY;

                return (
                    <div 
                    key={item.id}
                    className="group flex flex-row items-start md:items-center gap-6 px-6 py-3 rounded-[2rem] bg-white border border-slate-50 hover:border-slate-100 transition-all hover:shadow-sm"
                    >
                    {/* Left Icon */}
                    <div className={`p-4 rounded-2xl flex-shrink-0 ${style.bg} ${style.icon}`}>
                        <item.icon className="w-6 h-6" />
                    </div>

                    {/* Center Content */}
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[11px] px-2 font-semibold rounded-md uppercase tracking-[0.1em] ${style.bg} ${style.text}`}>
                            {item.type}
                        </span>
                        <span className="text-[#94A3B8] text-xs font-medium">
                            {item.timestamp}
                        </span>
                        </div>

                        <h3 className="text-base font-semibold text-[#0F172A] tracking-normal leading-snug">
                        {item.title}
                        </h3>

                        <p className="text-[#64748B] text-sm font-medium leading-relaxed">
                        {item.description}
                        </p>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 self-end md:self-center pr-2">
                        {item.read ? (
                        <span className="text-slate-300 hidden md:block text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                            Already read
                        </span>
                        ) : (
                        <div className="w-2.5 h-2.5 rounded-full hidden md:block bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        )}
                    </div>
                    </div>
                );
                })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-6 border border-dashed border-slate-200">
                  <Inbox className="w-16 h-16 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No notifications found</h3>
                <p className="text-slate-400 max-w-xs font-medium leading-relaxed mb-8">
                  It looks like there are no alerts in the <span className="text-slate-600 font-bold">"{activeTab}"</span> category at the moment.
                </p>
                <button 
                  onClick={() => setActiveTab('All')}
                  className="px-6 py-2.5 bg-white border border-slate-100 shadow-sm rounded-xl text-blue-600 font-bold text-sm hover:bg-blue-50 hover:border-blue-100 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Footer & Pagination */}
          <footer className="sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-50 mt-4">
            <p className="text-slate-400 text-[0.9rem] font-medium">
              Showing {filteredList.length > 0 ? `1-${filteredList.length}` : '0'} of {notifications.length} notifications
            </p>
            {filteredList.length > 0 && (
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-slate-50 text-slate-300">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2.5">
                  <button className="w-9 h-9 rounded-full bg-[#1a73e8] text-white font-bold text-sm shadow-md shadow-blue-100">1</button>
                  <button className="w-9 h-9 rounded-full hover:bg-slate-50 text-slate-400 font-bold text-sm">2</button>
                  <button className="w-9 h-9 rounded-full hover:bg-slate-50 text-slate-400 font-bold text-sm">3</button>
                </div>
                <button className="p-2 rounded-full hover:bg-slate-50 text-slate-300">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </footer>
        </main>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <StatCard 
            icon={Mail} 
            label="Unread Alerts" 
            value={stats.unread} 
            iconBg="bg-blue-600" 
          />
          <StatCard 
            icon={AlertTriangle} 
            label="High Priority" 
            value={stats.high} 
            iconBg="bg-amber-600" 
          />
          <StatCard 
            icon={CheckCircle2} 
            label="Resolved Today" 
            value={stats.resolved} 
            iconBg="bg-emerald-600" 
          />
        </section>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default NotificationHub;