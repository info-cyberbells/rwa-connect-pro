import React from 'react';
import {
  Building2, MapPin, Phone, Mail, ChevronRight,
 Activity, TrendingUp, Layers,
  MessageSquare, PhoneCall, FileText, Plus, Edit2
} from 'lucide-react';
import Sidebar from "../components/Sidebar";

const SocietyDetails: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto">

          {/* Breadcrumb & Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <nav className="flex items-center gap-2 text-[11px] font-medium text-slate-400 flex-wrap mt-12 sm:mt-2">
              <span>Societies</span>
              <ChevronRight size={12} />
              <span className="text-slate-900 font-semibold">Green Valley Heights</span>
            </nav>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button className="px-4 py-2 w-full sm:w-auto bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
                Edit Profile
              </button>
              <button className="px-4 py-2 w-full sm:w-auto bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center">
                Generate Report
              </button>
            </div>
          </div>

          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <Building2 size={32} />
              </div>
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Green Valley Heights</h1>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-wider">Active</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-slate-400 text-xs font-semibold">
                  <div className="flex items-center gap-1.5"><MapPin size={14} /> Sector 54, Gurugram, HR - 122002</div>
                  <div className="flex items-center gap-1.5"><Phone size={14} /> +91 98765 43210</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Content */}
            <div className="col-span-12 lg:col-span-8 space-y-8">

              {/* Structural Overview */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Structural Overview</h3>
                  <span className="text-[10px] font-bold text-blue-500 uppercase mt-2 sm:mt-0">Last Updated: Today</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <OverviewCard label="Towers/Wings" value="12" icon={<Layers className="text-blue-500" />} color="bg-blue-50" />
                  <OverviewCard label="Total Floors" value="24" icon={<Activity className="text-indigo-500" />} color="bg-indigo-50" />
                  <OverviewCard label="Total Units" value="240" icon={<Building2 className="text-purple-500" />} color="bg-purple-50" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <MiniBadge label="Occupied" value="215 Units" dot="bg-emerald-500" />
                  <MiniBadge label="Vacant" value="25 Units" dot="bg-amber-500" />
                  <MiniBadge label="Tenants" value="85 Units" dot="bg-blue-500" />
                  <MiniBadge label="Owners" value="130 Units" dot="bg-purple-500" />
                </div>
              </div>

              {/* Recent Financials */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm overflow-x-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Recent Financials</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Maintenance collection for the last 6 months</p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
                      <TrendingUp size={12} /> +12.5%
                    </span>
                    <select className="bg-slate-50 border-none text-[11px] font-bold text-slate-500 rounded-lg px-3 py-1.5 focus:ring-0">
                      <option>Year 2023-24</option>
                    </select>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="mb-6 overflow-x-auto">
                  <div className="h-32 w-full flex items-end justify-between px-2 gap-4 border-b border-slate-100">
                    {[40, 35, 45, 30, 55, 65].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="flex-1 bg-slate-50 rounded-t-lg hover:bg-blue-500 transition-all cursor-pointer group relative"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between px-2 gap-4 mt-3">
                    {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, i) => (
                      <div key={i} className="flex-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {month}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <FinancialStat label="Collection Rate" value="94.2%" icon="💹" color="text-emerald-500" />
                  <FinancialStat label="Defaulters" value="14 Units" icon="⚠️" color="text-rose-500" />
                </div>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">

              {/* Society Admin Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative group">
                <button className="absolute top-4 right-4 text-slate-300 hover:text-blue-500 transition-colors">
                  <Edit2 size={16} />
                </button>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-6">Society Admin</h3>
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-slate-50" alt="Admin" />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-lg">Amit Sharma</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Head of Operations</p>
                </div>

                <div className="space-y-3 mb-6">
                  <ContactRow icon={<Mail size={14} />} label="Email Address" value="amit.sharma@greenv..." />
                  <ContactRow icon={<Phone size={14} />} label="Phone Number" value="+91 98765 00124" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                    <MessageSquare size={14} /> Message
                  </button>
                  <button className="py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-50">
                    <PhoneCall size={14} /> Call
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <ActionButton icon={<FileText className="text-orange-500" />} label="12 Pending Tasks" sub="Service requests, complaints" />
                <ActionButton icon={<Plus className="text-purple-500" />} label="New Announcement" sub="Broadcast to all residents" hasPlus />
              </div>

              {/* Health Score Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-100">
                <div className="flex justify-between items-center mb-8">
                  <div className="p-2 bg-white/10 rounded-lg"><Activity size={18} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Health Score</span>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-extrabold">92</span>
                  <span className="text-xl font-bold opacity-40">/100</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-80 font-medium mb-6">
                  Green Valley Heights is in the top 5% of well-managed societies this month.
                </p>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[92%]"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components ---
const OverviewCard = ({ label, value, icon, color }: any) => (
  <div className="p-4 sm:p-6 bg-[#F8FAFC] border border-slate-50 rounded-2xl flex flex-col items-start">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </div>
    <p className="text-2xl font-black text-slate-900 mb-1">{value}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

const MiniBadge = ({ label, value, dot }: any) => (
  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-50 flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
      <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
    </div>
    <span className="text-xs font-extrabold text-slate-800">{value}</span>
  </div>
);

const ContactRow = ({ icon, label, value }: any) => (
  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
    <div className="text-slate-400">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
      <span className="text-[11px] font-bold text-slate-800">{value}</span>
    </div>
  </div>
);

const FinancialStat = ({ label, value, icon, color }: any) => (
  <div className="flex items-center gap-3">
    <div className="text-xl">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-black ${color}`}>{value}</span>
    </div>
  </div>
);

const ActionButton = ({ icon, label, sub, hasPlus }: any) => (
  <button className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-100 transition-all text-left group">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-xs font-bold text-slate-800 tracking-tight">{label}</h4>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
    {hasPlus ? <Plus size={14} className="text-slate-300" /> : <ChevronRight size={14} className="text-slate-300" />}
  </button>
);

export default SocietyDetails;