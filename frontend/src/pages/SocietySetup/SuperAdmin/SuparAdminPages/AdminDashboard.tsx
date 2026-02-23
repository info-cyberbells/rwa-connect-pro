import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { 
  Building, Users, ShieldCheck, CreditCard, 
  Activity, Zap, Bell
} from "lucide-react";

// Types
interface PendingSociety {
  name: string;
  location: string;
  admin: string;
  units: string;
  type: string;
}

const pendingSocieties: PendingSociety[] = [
  { name: "Green Valley Heights", location: "Gurugram, HR", admin: "Amit Sharma", units: "240 Units", type: "Premium" },
  { name: "Skyline Residency", location: "Mumbai, MH", admin: "Priya Patel", units: "120 Units", type: "Luxury" },
  { name: "The Royal Palms", location: "Bangalore, KA", admin: "Suresh Kumar", units: "80 Units", type: "Villas" },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* Sidebar  */}
      <Sidebar />

      {/* MAIN CONTENT 
      
      */}
      <main className="flex-1 w-full ml-0 lg:ml-64 min-h-screen p-4 md:p-8 lg:p-10 pt-4 md:pt-6 lg:pt-8 overflow-x-hidden">
        
        {/* Top Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full">
            <h1 className="text-2xl md:text-3xl pt-12 font-bold text-slate-900 tracking-tight">
              Super Admin  <span className="text-blue-600">Dashboard </span>
            </h1>
           
            <p className="text-slate-500 text-sm mt-1">
              Welcome back, Managing 42 housing societies across the country.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button className="flex-1 md:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
              <span className="bg-white/20 rounded-full p-0.5"><Zap size={14}/></span> 
              <span className="whitespace-nowrap">New Society</span>
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          <StatCard title="Total Societies" value="42" icon={<Building size={20} className="text-blue-600" />} bg="bg-white" />
          <StatCard title="Active Residents" value="5.2k" icon={<Users size={20} className="text-emerald-600" />} bg="bg-white" />
          <StatCard title="Pending Approvals" value="12" icon={<ShieldCheck size={20} className="text-amber-600" />} bg="bg-white" />
          <StatCard title="Revenue" value="₹245k" icon={<CreditCard size={20} className="text-purple-600" />} bg="bg-white" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Table Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 flex justify-between items-center border-b border-slate-50">
              <h2 className="font-bold text-slate-800 text-sm md:text-base">Pending Registrations</h2>
              <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>
            
            {/* Table wrapper for horizontal scroll on small screens */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-6 py-4">Society Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Contact Person</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[13px]">
                  {pendingSocieties.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600 shrink-0">
                            <Building size={18}/>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate">{s.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{s.units} • {s.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-500 font-medium">{s.location}</td>
                      <td className="px-6 py-5 text-slate-500 font-medium">{s.admin}</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button className="px-3 py-1.5 border border-rose-100 text-rose-500 bg-rose-50/30 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors">Reject</button>
                          <button className="px-3 py-1.5 border border-emerald-100 text-emerald-600 bg-emerald-50/30 rounded-lg font-bold text-xs hover:bg-emerald-100 transition-colors">Approve</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDEBAR - Alerts & Insights */}
          <div className="space-y-6">
            {/* System Alerts */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-sm">System Alerts</h3>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Live</span>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Database load spike", desc: "AWS Region experiencing high traffic.", time: "2 mins ago", color: "bg-amber-500" },
                  { title: "Version Deployed", desc: "Patch v2.4.1 rolled out.", time: "1 hour ago", color: "bg-blue-500" },
                  { title: "Payment API Fail", desc: "Gateway timeout in Razorpay.", time: "3 hours ago", color: "bg-rose-500" },
                ].map((alert, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${alert.color}`} />
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-800 leading-tight">{alert.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{alert.desc}</p>
                      <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blue Insight Card */}
            <div className="bg-blue-600 rounded-[32px] p-6 md:p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                    <Activity size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Insights</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Monthly Growth</h3>
                <p className="text-blue-100 text-[13px] mb-8">
                  You've onboarded <span className="text-white font-bold">15% more</span> societies this month.
                </p>
                <div className="space-y-3">
                  <div className="w-full bg-white/20 h-1.5 rounded-full">
                    <div className="bg-white h-full w-[75%] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  </div>
                  <p className="text-[10px] font-bold text-blue-50 uppercase">75% of target achieved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;