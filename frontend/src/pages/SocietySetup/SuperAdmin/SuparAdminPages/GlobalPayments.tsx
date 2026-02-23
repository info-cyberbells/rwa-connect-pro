import React, { useState } from 'react';
import { 
  Search, Filter, CreditCard, Clock, CheckCircle2, 
  MoreHorizontal, ChevronLeft, ChevronRight, FileDown,
  ArrowUpRight, AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const GlobalPayments: React.FC = () => {
  const [search, setSearch] = useState('');

  const transactions = [
    { id: '#TXN-849201', society: 'Green Valley Heights', resident: 'Amit Sharma', unit: 'A-401', amount: '₹8,400', status: 'SUCCESS', date: 'Oct 24', time: '02:45 PM' },
    { id: '#TXN-849202', society: 'Skyline Residency', resident: 'Priya Patel', unit: 'B-105', amount: '₹1,250', status: 'PENDING', date: 'Oct 24', time: '01:12 PM' },
    { id: '#TXN-849198', society: 'The Royal Palms', resident: 'Suresh Kumar', unit: 'V-12', amount: '₹500', status: 'FAILED', date: 'Oct 24', time: '11:30 AM' },
    { id: '#TXN-849195', society: 'Green Valley Heights', resident: 'Rohan Mehra', unit: 'C-901', amount: '₹8,400', status: 'SUCCESS', date: 'Oct 23', time: '05:22 PM' },
  ];

  const statusStyles: any = {
    SUCCESS: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
    FAILED: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 w-full p-4 md:p-8 transition-all">
        
        {/* Header Section  */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 pt-16 md:pt-0">
          <div className="w-full lg:w-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight"> Global Payments<span className='text-blue-600'>Center</span></h1>
            <p className="text-slate-500 text-sm mt-1">Monitor and reconcile all society transactions.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition">
              <FileDown size={18} /> <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition">
               Reconcile
            </button>
          </div>
        </div>

        {/* Stats Grid - Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 gap-4 md:gap-6 mb-8 no-scrollbar">
          {[
            { label: 'Collections', val: '₹1.24 Cr', icon: <CreditCard size={20} className="text-indigo-600" />, color: 'bg-indigo-50' },
            { label: 'Pending', val: '₹18.4 L', icon: <Clock size={20} className="text-amber-600" />, color: 'bg-amber-50' },
            { label: 'Success', val: '99.2%', icon: <CheckCircle2 size={20} className="text-emerald-600" />, color: 'bg-emerald-50' },
          ].map((item, i) => (
            <div key={i} className="min-w-[240px] md:min-w-0 flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 ${item.color} rounded-xl`}>{item.icon}</div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center bg-slate-50/30">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search payments..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <Filter size={16} /> Filters
            </button>
          </div>

          {/* DESKTOP TABLE VIEW - Hidden on Mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transaction</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Society & Resident</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4">
                      <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {txn.id}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="font-bold text-slate-800">{txn.society}</div>
                      <div className="text-xs text-slate-500">{txn.resident} • {txn.unit}</div>
                    </td>
                    <td className="p-4 font-extrabold text-slate-900 text-sm">{txn.amount}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${statusStyles[txn.status]}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-medium text-slate-700">{txn.date}</div>
                      <div className="text-slate-400">{txn.time}</div>
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST VIEW - Shown only on Mobile */}
          <div className="md:hidden divide-y divide-slate-100">
            {transactions.map((txn) => (
              <div key={txn.id} className="p-4 active:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded italic">
                      {txn.id}
                    </span>
                    <h3 className="font-bold text-slate-800 mt-1">{txn.society}</h3>
                    <p className="text-xs text-slate-500">{txn.resident} • {txn.unit}</p>
                  </div>
                  <span className={`px-2 py-1 text-[9px] font-bold rounded-md border ${statusStyles[txn.status]}`}>
                    {txn.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                   <div>
                     <p className="text-lg font-black text-slate-900">{txn.amount}</p>
                     <p className="text-[10px] text-slate-400">{txn.date}, {txn.time}</p>
                   </div>
                   <button className="p-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold">
                      View Details
                   </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Responsive Text */}
          <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] md:text-xs text-slate-500 font-medium">1-10 of 240</p>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-200 rounded-xl hover:bg-white text-slate-600 transition disabled:opacity-30">
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GlobalPayments;