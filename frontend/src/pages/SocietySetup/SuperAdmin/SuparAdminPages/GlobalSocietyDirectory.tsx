import React from 'react';
import {
  Building2,
  MapPin,
  ArrowUpRight,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import Sidebar from '@/pages/SocietySetup/SuperAdmin/components/Sidebar';
import { useNavigate } from 'react-router-dom';

const GlobalSocietyDirectory: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
<main className="flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300 overflow-x-hidden lg:ml-64">        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 mt-5 lg:mt-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 w-2 h-2 rounded-full animate-ping" />
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">
                Live Network Nodes
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Global Society <span className="text-blue-600">Directory</span>
            </h1>

            <p className="text-slate-500 font-medium mt-1">
              Centralized directory for 42 housing infrastructures.
            </p>
          </div>

          <button className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-3 text-sm hover:bg-blue-700 transition">
            New Society
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-[32px] shadow-lg border overflow-hidden mb-6 max-w-full">
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center justify-between max-w-full overflow-hidden">
            {/* Search */}
            <div className="relative w-full max-w-full lg:max-w-lg group">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by Society ID, Manager, or City..."
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-300 focus:bg-white rounded-3xl pl-14 pr-6 py-4 text-sm font-semibold outline-none transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto justify-start lg:justify-end">
              <FilterTag label="Active Cities" />
              <FilterTag label="Service Plan" />
              <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition">
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* Table Wrapper */}
          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[900px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-50/50">
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400">
                      Deployment
                    </th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400">
                      Location
                    </th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                      Units
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400">
                      Management
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  <NodeRow
                    name="Green Valley"
                    id="NODE-451"
                    city="Gurugram"
                    type="Premium"
                    units="240"
                    admin="A. Sharma"
                    status="Active"
                  />
                  <NodeRow
                    name="Skyline Residency"
                    id="NODE-229"
                    city="Mumbai"
                    type="Luxury"
                    units="120"
                    admin="P. Patel"
                    status="Active"
                  />
                  <NodeRow
                    name="The Royal Palms"
                    id="NODE-108"
                    city="Bangalore"
                    type="Essential"
                    units="85"
                    admin="S. Kumar"
                    status="Pending"
                  />
                  <NodeRow
                    name="Sapphire Towers"
                    id="NODE-092"
                    city="Pune"
                    type="Premium"
                    units="410"
                    admin="R. Mehta"
                    status="Active"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <ShieldCheck size={16} className="text-emerald-500" />
              Security Verified Grid · Total 42
            </div>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <button className="w-10 h-10 rounded-xl border flex items-center justify-center">
                <ChevronLeft size={18} />
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
                01
              </button>
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold">
                02
              </button>
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold">
                03
              </button>
              <button className="w-10 h-10 rounded-xl border flex items-center justify-center">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const FilterTag = ({ label }: { label: string }) => (
  <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition">
    {label}
    <ChevronDown size={14} />
  </button>
);

const NodeRow = ({ name, id, city, type, units, admin, status }: any) => {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-blue-50 transition">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Building2 size={18} />
          </div>
          <div>
            <p className="font-bold text-sm">{name}</p>
            <span className="text-[10px] text-slate-400">{id}</span>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <MapPin size={14} />
          {city}
        </div>
      </td>

      <td className="px-4 py-4 text-center">
        <span className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-100">
          {units}
        </span>
      </td>

      <td className="hidden md:table-cell px-4 py-4 text-sm font-medium">
        {admin}
      </td>

      <td className="hidden lg:table-cell px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
            status === 'Active'
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-orange-100 text-orange-600'
          }`}
        >
          {type}
        </span>
      </td>

      <td className="px-4 py-4 text-right">
        <button
          onClick={() => navigate(`/globalSocietyDirectory/${id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white transition"
        >
          <span className="hidden sm:inline">View Details</span>
          <ArrowUpRight size={14} />
        </button>
      </td>
    </tr>
  );
};

export default GlobalSocietyDirectory;