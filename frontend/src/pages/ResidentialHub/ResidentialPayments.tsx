import React, { useState } from 'react';
import { 
  Bell, Wallet, Download, CheckCircle2, 
  Filter, ArrowRight, CreditCard, Info ,ShieldCheck
} from 'lucide-react';
import { cn } from "@/lib/utils";

const ResidentialPayments = () => {
  const [selectedBills, setSelectedBills] = useState(['monthly']);

  const dues = [
    {
      id: 'monthly',
      title: 'Monthly Maintenance',
      invoice: '#INV-00921',
      due: 'Oct 31, 2023',
      amount: 4500,
      status: 'PENDING'
    },
    {
      id: 'gym',
      title: 'Gym & Pool Access',
      invoice: '#FAC-00122',
      due: 'Nov 05, 2023',
      amount: 600,
      status: 'UPCOMING'
    },
    {
      id: 'water',
      title: 'Water Charges',
      invoice: '#UTL-00344',
      due: 'Nov 10, 2023',
      amount: 300,
      status: 'UPCOMING'
    }
  ];

  const toggleBill = (id: string) => {
    setSelectedBills(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const selectedTotal = dues
    .filter(d => selectedBills.includes(d.id))
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
<div className="absolute top-[100px] left-0 right-0 max-w-5xl mx-auto space-y-5">     
   {/* Header Area */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-slate-800">Billing & Payments</h1>
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-slate-400 hover:bg-white rounded-full transition-all">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8fafc]"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800 leading-none">Aryan Sharma</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium text-right">Resident Owner</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan" alt="avatar" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Total & Dues */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Total Outstanding Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Wallet size={28} />
               </div>
            </div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Outstanding</p>
            <div className="flex items-center gap-3 mb-2">
               <h2 className="text-4xl font-black text-slate-900">₹5,400.00</h2>
               <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-100">3 Bills Due</span>
            </div>
            <p className="text-slate-400 text-xs flex items-center gap-1.5">
               <Info size={14} /> Next billing cycle starts on Nov 01, 2023
            </p>
          </div>

          {/* Tabs & Filter */}
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button className="px-6 py-2 rounded-lg text-sm font-bold bg-white text-slate-800 shadow-sm">Upcoming Dues</button>
               <button className="px-6 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700">Past Payments</button>
            </div>
            <button className="flex items-center gap-2 text-blue-600 font-bold text-sm">
               <Filter size={16} /> Filter
            </button>
          </div>

          {/* Dues List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Dues to Pay <span className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px]">{dues.length}</span>
            </h3>
            
            {dues.map((bill) => (
              <div 
                key={bill.id}
                onClick={() => toggleBill(bill.id)}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                  selectedBills.includes(bill.id) 
                    ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                    selectedBills.includes(bill.id) ? "bg-blue-600 border-blue-600" : "border-slate-200 bg-slate-50"
                  )}>
                    {selectedBills.includes(bill.id) && <CheckCircle2 className="text-white w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{bill.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Invoice: {bill.invoice} • Due: {bill.due}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">₹{bill.amount}</p>
                  <span className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                    bill.status === 'PENDING' ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-400"
                  )}>{bill.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Payment Summary */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Payment Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Amount Selected</span>
                <span className="text-slate-800 font-bold">₹{selectedTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Convenience Fee</span>
                <span className="text-slate-800 font-bold">₹0.00</span>
              </div>
              <div className="pt-4 border-t border-dashed flex justify-between items-center">
                <span className="text-slate-800 font-bold">Total Payable</span>
                <span className="text-2xl font-black text-blue-600">₹{selectedTotal.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Pay Now <ArrowRight size={18} />
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
               <ShieldCheck size={14} className="text-green-500" /> PCI DSS COMPLIANT GATEWAY
            </div>

            {/* Auto Pay Banner */}
            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  <CreditCard size={18} />
               </div>
               <div>
                  <h5 className="text-xs font-bold text-blue-900">Auto-Pay Active</h5>
                  <p className="text-[10px] text-blue-700/70 mt-1 leading-relaxed">Your monthly maintenance will be auto-debited on Oct 31.</p>
                  <button className="text-[10px] font-black text-blue-600 mt-2 hover:underline">Manage Auto-Pay</button>
               </div>
            </div>
          </div>

          <button className="w-full p-5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between text-slate-600 hover:bg-slate-50 transition-all group">
            <div className="flex items-center gap-3">
               <Download size={18} className="text-slate-400 group-hover:text-blue-600" />
               <span className="text-sm font-bold">Download Last Receipt</span>
            </div>
            <Download size={16} className="text-slate-300" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResidentialPayments;