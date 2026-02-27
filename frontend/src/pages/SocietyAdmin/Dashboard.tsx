import React, { useState } from "react";
import { 
  Users, IndianRupee, AlertTriangle, UserCheck, 
  Plus, Home, UserPlus, User, ShieldCheck, 
  Camera, Edit2, ChevronDown, Upload, Info, X,
  ChevronLeft, ChevronRight, Paperclip, Moon
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// --- Sub Component: StatCard ---
const StatCard = ({ title, value, subtitle, icon, color }: any) => (
  <div className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center w-full border border-slate-100 transition-hover hover:shadow-md">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h2 className="text-2xl font-bold mt-1 text-slate-800">{value}</h2>
      {subtitle && <p className="text-xs text-green-600 mt-1 font-semibold">{subtitle}</p>}
    </div>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color} shadow-sm`}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  // --- Modals State Control ---
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showResidentModal, setShowResidentModal] = useState(false);

  return (
    <DashboardLayout role="society-admin">
      <div className="max-w-[1600px] mx-auto relative">
        
        {/* --- HEADER --- */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, Admin</h1>
          <p className="text-slate-500 text-sm">Everything looks good at Greenwood Heights today.</p>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Residents" value="124" icon={<Users className="w-5 h-5 text-blue-600" />} color="bg-blue-50" />
          <StatCard title="Maintenance" value="₹85k" icon={<IndianRupee className="w-5 h-5 text-green-600" />} color="bg-green-50" />
          <StatCard title="Active Complaints" value="4" icon={<AlertTriangle className="w-5 h-5 text-orange-600" />} color="bg-orange-50" />
          <StatCard title="Today's Visitors" value="8" icon={<UserCheck className="w-5 h-5 text-purple-600" />} color="bg-purple-50" />
        </div>

        {/* --- QUICK ACTIONS --- */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-8">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowNoticeModal(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} /> Post Notice
            </button>
              <button 
              onClick={() => setShowResidentModal(true)}
              className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <UserPlus size={18} /> Add Resident
            </button>
            <button 
              onClick={() => setShowResidentModal(true)}
              className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <UserPlus size={18} /> Add Maintanence Charge
            </button>
            <button 
              onClick={() => setShowResidentModal(true)}
              className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <UserPlus size={18} /> Add Fine
            </button>
          
          </div>
        </div>
           {/* 🔹 Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
              <h2 className="font-bold text-slate-800 text-lg">Recent Activity</h2>
              <button className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline">View All</button>
            </div>

            <div className="space-y-6">
              {[
                { text: "Unit 402 paid maintenance for October", val: "₹4,500", sub: "2 mins ago" },
                { text: "New visitor entry (Unit 105)", val: "Verified", sub: "15 mins ago" },
                { text: "Plumbing complaint resolved in Unit 202", val: "Done", sub: "1 hr ago" },
                { text: "Security alert: Gate 2 sensor check", val: "Active", sub: "3 hrs ago" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                    <div>
                      <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{item.text}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                Facility Bookings
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-transparent hover:border-blue-100 transition-all">
                  <span className="text-sm font-medium text-slate-600">Clubhouse Party</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">04:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-transparent hover:border-blue-100 transition-all">
                  <span className="text-sm font-medium text-slate-600">Tennis Court A</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">06:00 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="font-bold mb-2 text-lg">Support Center</h2>
                <p className="text-xs mb-5 text-blue-100 leading-relaxed">
                  Need help managing the society portal or facing technical issues?
                </p>
                <button className="w-full bg-white text-blue-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg active:scale-95">
                  Contact Support
                </button>
              </div>
              {/* Decorative design */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          </div>
        </div>

        {/*MODAL 1: POST NOTICE*/}
   
        {showNoticeModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowNoticeModal(false)} />
            
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md px-8 py-6 border-b flex justify-between items-center z-10">
                <div>
                  <nav className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                    Admin Dashboard &bull; <span className="text-blue-600">Post New Notice</span>
                  </nav>
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">Post New Notice</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><Moon size={20} /></button>
                  <button onClick={() => setShowNoticeModal(false)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"><X size={24} /></button>
                </div>
              </div>

              {/* Modal Form Body */}
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Notice Title</label>
                  <input type="text" placeholder="e.g., Annual General Meeting" className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all text-slate-600" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:border-blue-200 transition-all text-slate-500 bg-white">
                      <option>Select category</option>
                      <option>Maintenance</option>
                      <option>Event</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Calendar UI */}
                <div>
                  <label className="block text-sm font-bold text-slate-700">Visibility Range</label>
                  <p className="text-xs text-slate-400 mb-4">Choose how long this notice remains active</p>
                  <div className="border border-slate-100 rounded-[24px] p-6 flex flex-col items-center bg-slate-50/30">
                     <div className="w-full max-w-xs">
                        <div className="flex justify-between items-center mb-6">
                          <ChevronLeft size={18} className="text-slate-400 cursor-pointer" />
                          <span className="font-bold text-slate-700">October 2023</span>
                          <ChevronRight size={18} className="text-slate-400 cursor-pointer" />
                        </div>
                        <div className="grid grid-cols-7 gap-y-4 text-center text-[11px] font-bold uppercase">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-slate-300">{d}</span>)}
                          <span className="text-slate-200">1</span>
                          {[2,3,4].map(n => <span key={n} className="text-slate-600 py-1">{n}</span>)}
                          <span className="bg-blue-600 text-white rounded-lg py-1 font-bold">5</span>
                          {[6,7,8].map(n => <span key={n} className="bg-blue-50 text-blue-600 py-1">{n}</span>)}
                          <span className="text-slate-600 py-1">9</span>
                          <span className="bg-blue-600 text-white rounded-lg py-1 font-bold">10</span>
                          {Array.from({length: 21}).map((_, i) => <span key={i} className="text-slate-600 py-1">{i+11}</span>)}
                        </div>
                     </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea rows={4} placeholder="Enter detailed notice information..." className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:bg-white transition-all text-slate-600 resize-none"></textarea>
                </div>

                {/* File Upload UI */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Attachments</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-[24px] p-10 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-blue-50/50 transition-all cursor-pointer group">
                    <div className="bg-white p-4 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <Paperclip className="text-blue-500" size={24} />
                    </div>
                    <p className="text-sm text-slate-600 font-bold"><span className="text-blue-600 underline">Click to upload</span> or drag and drop</p>
                    <p className="text-[10px] text-slate-400 mt-2 uppercase font-black">PDF, PNG, JPG (MAX. 10MB)</p>
                  </div>
                </div>
              </div>

              {/* Sticky Footer Buttons */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[2px] text-[11px] py-4 rounded-2xl shadow-xl shadow-blue-100 active:scale-95">Post Notice</button>
                <button onClick={() => setShowNoticeModal(false)} className="bg-white hover:bg-slate-50 text-slate-500 font-black uppercase tracking-[2px] text-[11px] py-4 rounded-2xl border border-slate-100 active:scale-95">Save as Draft</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD RESIDENT  */}
        {showResidentModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowResidentModal(false)} />
            
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-400">
              
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add New Resident</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Society Directory Registration</p>
                </div>
                <button onClick={() => setShowResidentModal(false)} className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 rounded-full transition-all"><X size={24} /></button>
              </div>

              <div className="p-8 md:p-12 space-y-12">
                {/* Personal Info Section */}
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-50 rounded-lg"><User size={18} className="text-blue-500" /></div>
                      <h2 className="font-bold text-slate-700">Personal Information</h2>
                    </div>
                    <div className="space-y-4">
                      <input type="text" placeholder="Full Name" className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="email" placeholder="Email Address" className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none" />
                        <input type="text" placeholder="Mobile Number" className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 min-w-[200px]">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-200 bg-white flex items-center justify-center"><Camera size={32} className="text-blue-200" /></div>
                      <button className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white shadow-lg"><Edit2 size={12} /></button>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">Resident Photo</span>
                  </div>
                </div>

                {/* Residence Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg"><Home size={18} className="text-blue-500" /></div>
                    <h2 className="font-bold text-slate-700">Residence Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <select className="w-full appearance-none px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-600 focus:outline-none">
                        <option>Select Wing</option>
                        <option>Wing A</option><option>Wing B</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                    <input type="text" placeholder="Flat Number" className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none" />
                    <select className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-700 focus:outline-none"><option>Owner</option><option>Tenant</option></select>
                  </div>
                </div>

                {/* Verification Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg"><ShieldCheck size={18} className="text-blue-500" /></div>
                    <h2 className="font-bold text-slate-700">Verification Documents</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-slate-100 rounded-[24px] p-8 flex flex-col items-center bg-slate-50/30 group hover:bg-blue-50/30 transition-all cursor-pointer">
                      <Upload size={20} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-black uppercase">Identity Proof</p>
                    </div>
                    <div className="border-2 border-dashed border-slate-100 rounded-[24px] p-8 flex flex-col items-center bg-slate-50/30 group hover:bg-blue-50/30 transition-all cursor-pointer">
                      <ShieldCheck size={20} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-black uppercase">Agreement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white/90 backdrop-blur-md p-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 text-slate-400">
                  <Info size={14} className="text-blue-500" />
                  <p className="text-[10px] font-medium max-w-[240px]">Resident will receive welcome email with login credentials.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button onClick={() => setShowResidentModal(false)} className="flex-1 md:flex-none text-sm font-bold text-slate-400 px-6">Cancel</button>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[2px] px-10 py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95">
                    <UserPlus size={18} /> Add & Notify
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

export default Dashboard;