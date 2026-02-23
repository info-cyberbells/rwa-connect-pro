import React from 'react';
import {
  Building2, MapPin, ArrowUpRight, Search, Filter, ChevronDown, ChevronLeft, ChevronRight, ShieldCheck
} from 'lucide-react';
import Sidebar from '@/pages/SocietySetup/SuperAdmin/components/Sidebar';
import { useNavigate } from "react-router-dom";

const GlobalSocietyDirectory: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300 lg:ml-64">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 mt-5 lg:mt-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 w-2 h-2 rounded-full animate-ping" />
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Live Network Nodes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Global Society <span className="text-blue-600">Directory</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Centralized directory for 42 housing infrastructures.</p>
          </div>

          <button className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-3 text-sm hover:bg-blue-700 transition">
            New Society
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-[40px] shadow-lg border border-white overflow-hidden transition-all duration-500 mb-6">
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center justify-between">
            <div className="relative w-full lg:max-w-lg group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by Society ID, Manager, or City..."
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-300 focus:bg-white focus:shadow-lg focus:shadow-blue-50/50 rounded-3xl pl-14 pr-6 py-4 text-sm font-semibold outline-none transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <FilterTag label="Active Cities" />
              <FilterTag label="Service Plan" />
              <div className="w-[1px] h-8 bg-slate-100 mx-2 hidden sm:block" />
              <button className="group p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 hover:scale-110 active:scale-90 transition-all shadow-lg">
                <Filter size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="bg-blue-50/50">
                  <th className="px-4 py-3 text-xs font-black text-blue-900/40 uppercase tracking-[0.2em]">Deployment</th>
                  <th className="px-4 py-3 text-xs font-black text-blue-900/40 uppercase tracking-[0.2em]">Location</th>
                  <th className="px-4 py-3 text-xs font-black text-blue-900/40 uppercase tracking-[0.2em] text-center">Units</th>
                  <th className="hidden md:table-cell px-4 py-3 text-xs font-black text-blue-900/40 uppercase tracking-[0.2em]">Management</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-xs font-black text-blue-900/40 uppercase tracking-[0.2em]">Plan</th>
                  <th className="px-4 py-3 text-xs font-black text-blue-900/40 uppercase tracking-[0.2em] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <NodeRow name="Green Valley" id="NODE-451" city="Gurugram" type="Premium" units="240" admin="A. Sharma" status="Active" />
                <NodeRow name="Skyline Residency" id="NODE-229" city="Mumbai" type="Luxury" units="120" admin="P. Patel" status="Active" />
                <NodeRow name="The Royal Palms" id="NODE-108" city="Bangalore" type="Essential" units="85" admin="S. Kumar" status="Pending" />
                <NodeRow name="Sapphire Towers" id="NODE-092" city="Pune" type="Premium" units="410" admin="R. Mehta" status="Active" />
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-600 tracking-tight">Security Verified Grid</span>
              </div>
              <p className="text-xs font-medium text-slate-400">Total Records: <span className="font-bold text-slate-900">42</span></p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:shadow-md transition-all"><ChevronLeft size={18} /></button>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl font-mono text-xs font-bold">
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow-sm hover:scale-105 transition-transform">01</button>
                <button className="px-4 py-2 text-slate-400 hover:text-slate-600 transition-colors">02</button>
                <button className="px-4 py-2 text-slate-400 hover:text-slate-600 transition-colors">03</button>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:shadow-md transition-all"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const FilterTag = ({ label }: { label: string }) => (
  <button className="group flex items-center gap-2 px-4 sm:px-5 py-2 bg-white border border-slate-200 rounded-[18px] text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
    {label} <ChevronDown size={14} className="text-slate-300 group-hover:text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
  </button>
);

const NodeRow = ({ name, id, city, type, units, admin, status }: any) => {
  const navigate = useNavigate(); 

  return (
    <tr className="group hover:bg-blue-50/20 transition-all duration-300 cursor-pointer">
      <td className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[20px] bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Building2 size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm sm:text-base text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{name}</h4>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest">{id}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-blue-500" />
          <span className="text-sm font-bold text-slate-600">{city}</span>
        </div>
      </td>
      <td className="px-4 py-4 sm:px-6 text-center">
        <span className={`text-sm font-black px-3 py-1 rounded-lg tracking-tighter ${status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{units}</span>
      </td>
      <td className="hidden md:table-cell px-4 py-4 sm:px-6">
        <span className="text-sm font-bold text-slate-700">{admin}</span>
      </td>
      <td className="hidden lg:table-cell px-4 py-4 sm:px-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
          {type}
        </div>
      </td>
      <td className="px-4 py-4 sm:px-6 text-right">
        <button
          onClick={() =>navigate(`/globalSocietyDirectory/${id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 font-bold text-[11px] uppercase rounded-xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
        >
          View Details
          <ArrowUpRight
            size={14}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </button>
      </td>
    </tr>
  );
};

export default GlobalSocietyDirectory;