import React from 'react';
import { 
  Search, 
  Calendar, 
  ChevronRight, 
  Users, 
  Clock, 
  Plus
} from 'lucide-react';
import { DashboardLayout } from "../../components/layout/DashboardLayout"; 

const NoticeBoard = () => {
  return (
    <DashboardLayout role="society-admin">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* --- Main Feed Area --- */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Notice Board</h1>
            <p className="text-sm text-slate-500">Updates, alerts, and events for your community</p>
          </div>

          {/* --- Featured Card --- */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 text-white relative overflow-hidden mb-8 shadow-xl shadow-blue-100/50 group">
            <div className="relative z-10">
              <div className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mb-4 backdrop-blur-md border border-white/10">
                Upcoming Event
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Annual General Meeting</h2>
              <p className="text-blue-100 text-[13px] mb-6 max-w-sm opacity-90 leading-relaxed">
                Join us for the yearly discussion on community improvements and financial reports.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[11px] font-bold backdrop-blur-md border border-white/10 shadow-sm">
                  <Calendar size={14} className="text-blue-200" /> Oct 05, 2023
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[11px] font-bold backdrop-blur-md border border-white/10 shadow-sm">
                  <Clock size={14} className="text-blue-200" /> 6:00 PM
                </div>
              </div>
            </div>

            {/* Decorative Background Icon */}
            <Users className="absolute -bottom-6 -right-6 text-white/10 w-48 h-48 rotate-12 transition-transform group-hover:scale-110 duration-700" />
          </div>

          {/* Categories / Filter Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['All Notices', 'Official', 'Events', 'General'].map((tab, i) => (
              <button 
                key={tab} 
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid of Notices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NoticeCard 
              category="OFFICIAL" 
              time="6 hours ago" 
              title="Elevator Maintenance Schedule" 
              color="blue" 
              desc="Please note that Elevator A will be undergo routine maintenance this Friday between 10:00 AM and 4:00 PM."
            />
            <NoticeCard 
              category="REPAIRS" 
              time="12 hours ago" 
              title="Water Tank Cleaning" 
              color="blue" 
              desc="The overhead water tank cleaning is scheduled for Block C. Expect low pressure during afternoon hours."
            />
            <NoticeCard 
              category="EVENTS" 
              time="Yesterday" 
              title="Yoga Sessions - Winter Batch" 
              color="purple" 
              desc="New yoga sessions are starting from November 1st at the Clubhouse. Registration is now open for all ages."
            />
            <NoticeCard 
              category="GENERAL" 
              time="2 days ago" 
              title="Parking Lot Painting" 
              color="purple" 
              desc="New line marking will be done in the visitors' parking area. Kindly cooperate with the security team."
            />
          </div>
        </div>

        {/* --- Community Sidebar --- */}
        <aside className="w-full lg:w-80 space-y-8">
          {/* Community Calendar */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Community Calendar</h3>
              <button className="text-[10px] text-blue-600 font-black uppercase hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              <CalendarItem date="OCT 22" title="Blood Donation Camp" loc="Parking Lot" />
              <CalendarItem date="OCT 25" title="Annual Gen. Meeting" loc="Auditorium" />
              <CalendarItem date="NOV 02" title="Kids Painting Contest" loc="Park" />
            </div>
          </div>

          {/* Quick Post Action Card */}
          <div className="bg-slate-900 rounded-[24px] p-8 text-white text-center shadow-xl shadow-slate-200 border border-slate-800 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="bg-blue-600/20 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-blue-500" strokeWidth={3} />
              </div>
              <h4 className="font-bold mb-2 text-lg">Post a Notice?</h4>
              <p className="text-[10px] text-slate-400 mb-6 font-bold uppercase tracking-widest leading-relaxed">
                Only authorized admins can post official society updates.
              </p>
              <button className="w-full py-3.5 bg-blue-600 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">
                Create Post
              </button>
            </div>
            {/* Background Detail */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
          </div>
        </aside>

      </div>
    </DashboardLayout>
  );
};

// --- Sub-Components ---

const NoticeCard = ({ category, time, title, color, desc }: any) => (
  <div className="p-6 bg-white rounded-[24px] border border-slate-100 hover:shadow-xl hover:shadow-blue-100/30 transition-all cursor-pointer group border-b-4 hover:border-b-blue-500">
    <div className="flex justify-between items-start mb-4">
      <span className={`text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest ${
        color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
      }`}>
        {category}
      </span>
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{time}</span>
    </div>
    <h4 className="font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors text-lg">{title}</h4>
    <p className="text-[12px] text-slate-400 leading-relaxed mb-6 line-clamp-2">
      {desc}
    </p>
    <div className="flex items-center justify-between">
      <button className="text-[11px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1 group/btn">
        Read More 
        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
      </button>
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
        ))}
      </div>
    </div>
  </div>
);

const CalendarItem = ({ date, title, loc }: any) => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex flex-col items-center justify-center font-black text-[9px] shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
       <span className="opacity-60">{date.split(' ')[0]}</span>
       <span className="text-base -mt-1 tracking-tighter text-slate-800 group-hover:text-white">{date.split(' ')[1]}</span>
    </div>
    <div className="min-w-0">
       <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{title}</p>
       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1">
         <span className="w-1 h-1 bg-slate-300 rounded-full" /> {loc}
       </p>
    </div>
  </div>
);

export default NoticeBoard;