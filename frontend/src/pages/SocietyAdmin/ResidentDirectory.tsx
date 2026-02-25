import React from 'react';
import { 
  Search, 
  Plus, 
  Users, 
  CheckCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  MoreVertical
} from 'lucide-react';
import { DashboardLayout } from "../../components/layout/DashboardLayout"; 

// --- Types ---
interface Resident {
  id: string;
  name: string;
  joinDate: string;
  unit: string;
  type: 'OWNER' | 'TENANT';
  phone: string;
  email: string;
  status: 'Verified' | 'Pending' | 'Suspended';
}

const residents: Resident[] = [
  { id: '1', name: 'Alex Johnson', joinDate: 'Oct 2022', unit: 'A-402', type: 'OWNER', phone: '+1 (555) 012-3456', email: 'alex.j@example.com', status: 'Verified' },
  { id: '2', name: 'Sarah Williams', joinDate: 'Jan 2023', unit: 'B-105', type: 'TENANT', phone: '+1 (555) 012-7890', email: 'sarah.w@example.com', status: 'Pending' },
  { id: '3', name: 'Michael Chen', joinDate: 'May 2021', unit: 'C-1204', type: 'OWNER', phone: '+1 (555) 012-9988', email: 'm.chen@example.com', status: 'Verified' },
  { id: '4', name: 'Elena Rodriguez', joinDate: 'Feb 2024', unit: 'A-201', type: 'TENANT', phone: '+1 (555) 012-4455', email: 'elena.r@example.com', status: 'Suspended' },
];

const ResidentDirectory: React.FC = () => {
  return (
    <DashboardLayout role="society-admin">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Resident Directory</h1>
            <p className="text-slate-500 text-sm">Manage, verify, and monitor all members of Greenwood Heights.</p>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-100 transition-all hover:opacity-90 active:scale-95">
            <Plus size={18} /> Add New Member
          </button>
        </div>

        {/* --- Filters Area --- */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6 flex flex-wrap gap-3 shadow-sm">
          <div className="relative flex-grow max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, flat number, or contact info..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition"
            />
          </div>
          <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm text-slate-600 outline-none hover:bg-slate-100 transition-colors">
            <option>All Blocks</option>
            <option>Block A</option>
            <option>Block B</option>
            <option>Block C</option>
          </select>
          <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm text-slate-600 outline-none hover:bg-slate-100 transition-colors">
            <option>All Types</option>
            <option>Owner</option>
            <option>Tenant</option>
          </select>
          <button className="p-2.5 border border-slate-100 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
            <Filter size={18} />
          </button>
        </div>

        {/* --- Table Section --- */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-8 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-5">Resident Name</th>
                  <th className="px-6 py-5">Unit / Flat</th>
                  <th className="px-6 py-5">Occupancy</th>
                  <th className="px-6 py-5">Contact</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {residents.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs shadow-inner">
                          {res.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{res.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Joined {res.joinDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">{res.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider ${res.type === 'OWNER' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {res.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">{res.phone}</p>
                      <p className="text-xs text-slate-400">{res.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${
                        res.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 
                        res.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                        'bg-rose-50 text-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          res.status === 'Verified' ? 'bg-emerald-500' : 
                          res.status === 'Pending' ? 'bg-amber-500' : 
                          'bg-rose-500'
                        }`} />
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 text-xs font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                        <button className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
            <p>152 total residents</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-all disabled:opacity-50"><ChevronLeft size={16} /></button>
              <span className="text-slate-800">Page 1 of 16</span>
              <button className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-all"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* --- Stats Summary --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatSummary icon={<Users className="text-blue-600" />} label="Total Active Members" value="1,248" color="bg-blue-50" />
          <StatSummary icon={<CheckCircle className="text-emerald-500" />} label="Verified Occupancy" value="94.2%" color="bg-emerald-50" />
          <StatSummary icon={<Clock className="text-orange-500" />} label="Pending Verification" value="12" color="bg-orange-50" />
        </div>
      </div>
    </DashboardLayout>
  );
};

// --- Helper Component ---
const StatSummary = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`${color} p-3 rounded-xl shadow-sm`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default ResidentDirectory;