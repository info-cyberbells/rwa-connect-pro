import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { 
  Building, Users, ShieldCheck, CreditCard, 
  Activity, Zap, Bell, X, ArrowLeft, Info, 
  Building2, FileText, MessageSquare, CheckCircle2, 
  Layout, Layers, Home, AlertCircle
} from "lucide-react";

// Types
interface PendingSociety {
  id: string;
  name: string;
  location: string;
  admin: string;
  units: string;
  type: string;
  email: string;
  phone: string;
}

const pendingSocieties: PendingSociety[] = [
  { id: "SOC-0892", name: "Green Valley Heights", location: "Gurugram, HR", admin: "Amit Sharma", units: "240 Units", type: "Premium", email: "amit@gv.com", phone: "+91 98765 43210" },
  { id: "SOC-0893", name: "Skyline Residency", location: "Mumbai, MH", admin: "Priya Patel", units: "120 Units", type: "Luxury", email: "priya@sky.com", phone: "+91 98765 11111" },
  { id: "SOC-0894", name: "The Royal Palms", location: "Bangalore, KA", admin: "Suresh Kumar", units: "80 Units", type: "Villas", email: "suresh@royal.com", phone: "+91 98765 22222" },
];

const AdminDashboard: React.FC = () => {
  // Modal State
  const [selectedSociety, setSelectedSociety] = useState<PendingSociety | null>(null);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />

      <main className="flex-1 w-full ml-0 lg:ml-64 min-h-screen p-4 md:p-8 lg:p-10 pt-4 md:pt-6 lg:pt-8 overflow-x-hidden">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full">
            <h1 className="text-2xl md:text-3xl pt-12 font-bold text-slate-900 tracking-tight">
              Super Admin <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Managing 42 housing societies across the country.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button className="flex-1 md:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
              <Zap size={14}/> <span>New Society</span>
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 relative">
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

        {/* Table Section */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 flex justify-between items-center border-b border-slate-50">
            <h2 className="font-bold text-slate-800">Pending Registrations</h2>
          </div>
          <div className="overflow-x-auto">
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
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600">
                          <Building size={18}/>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{s.name}</p>
                          <p className="text-[11px] text-slate-400">{s.units} • {s.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-500 font-medium">{s.location}</td>
                    <td className="px-6 py-5 text-slate-500 font-medium">{s.admin}</td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button className="px-3 py-1.5 border border-rose-100 text-rose-500 bg-rose-50 rounded-lg font-bold text-xs">Reject</button>
                        <button 
                          onClick={() => setSelectedSociety(s)}
                          className="px-3 py-1.5 border border-blue-100 text-blue-600 bg-blue-50 rounded-lg font-bold text-xs"
                        >
                          View Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- REGISTRATION REVIEW MODAL --- */}
      {selectedSociety && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-[#F8FAFC] w-full max-w-5xl h-[95vh] sm:h-[90vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Modal Header */}
            <header className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedSociety(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black tracking-tight">{selectedSociety.name}</h2>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded uppercase">Pending Review</span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400">ID: {selectedSociety.id} • Submitted recently</p>
                </div>
              </div>
              <button onClick={() => setSelectedSociety(null)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full">
                <X size={20} />
              </button>
            </header>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left side */}
                <div className="lg:col-span-7 space-y-6">
                  <section className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <Info size={18} className="text-blue-500"/>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Overview</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <InfoBlock label="Admin Name" value={selectedSociety.admin} />
                      <InfoBlock label="Email Address" value={selectedSociety.email} />
                      <InfoBlock label="Phone" value={selectedSociety.phone} />
                      <InfoBlock label="Units" value={selectedSociety.units} />
                      <div className="sm:col-span-2">
                        <InfoBlock label="Address" value={selectedSociety.location} />
                      </div>
                    </div>
                  </section>

                  <section className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck size={18} className="text-blue-500"/>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Documents</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <DocCard fileName="Land_Deed.pdf" size="2.4 MB" icon={<FileText />} />
                      <DocCard fileName="Tax_Receipt.jpg" size="1.1 MB" icon={<CheckCircle2 />} isVerified />
                    </div>
                  </section>
                </div>

                {/* Right side */}
                <div className="lg:col-span-5 space-y-6">
                  <section className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <Layout size={18} className="text-blue-500"/>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Structure</h3>
                    </div>
                    <div className="space-y-3">
                      <StatRow label="Towers" value="06" icon={<Building2 className="text-blue-500"/>} sub="A to F" />
                      <StatRow label="Units" value={selectedSociety.units.split(' ')[0]} icon={<Home className="text-emerald-500"/>} sub="Residential" />
                    </div>
                  </section>

                  <section className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare size={18} className="text-blue-500"/>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Internal Notes</h3>
                    </div>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium outline-none min-h-[100px]"
                      placeholder="Add a private note for other admins..."
                    />
                  </section>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <footer className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setSelectedSociety(null)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600">
                Close
              </button>
              <button className="px-6 py-2.5 bg-rose-500 text-white rounded-xl text-[11px] font-black">
                Reject Society
              </button>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-black shadow-lg shadow-blue-100">
                Approve Now
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Reusable Sub-components ---

const InfoBlock = ({ label, value }: any) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-800 tracking-tight">{value}</p>
  </div>
);

const DocCard = ({ fileName, size, icon, isVerified }: any) => (
  <div className="p-3 border border-slate-100 border-dashed rounded-2xl flex flex-col items-center justify-center bg-slate-50/30">
    <div className="relative mb-2">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-300">
        {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      </div>
      {isVerified && <CheckCircle2 size={12} className="absolute -top-1 -right-1 text-emerald-500 fill-white" />}
    </div>
    <p className="text-[10px] font-black text-slate-700 truncate w-full">{fileName}</p>
    <p className="text-[8px] font-bold text-slate-400 uppercase">{size}</p>
  </div>
);

const StatRow = ({ label, value, icon, sub }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-50">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
        {React.cloneElement(icon as React.ReactElement, { size: 16 })}
      </div>
      <div>
        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{label}</p>
        <p className="text-lg font-black text-slate-800 leading-none">{value}</p>
      </div>
    </div>
    <span className="text-[9px] font-bold text-slate-300 uppercase">{sub}</span>
  </div>
);

export default AdminDashboard;