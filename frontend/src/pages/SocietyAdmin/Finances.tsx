import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  PlusCircle, 
  History, 
  Send,
  Eye,
  Edit2,
  AlertCircle,
  Users,
  Zap,
  ScrollText,
  CreditCard,
  BellRing,
  Calendar,
  ChevronDown,
  Home,
  Info,
  X,
  User,
  Building2,
  CheckCircle2,
  Receipt,
  ShieldCheck,
  Landmark
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const MOCK_DATA = {
  stats: [
    { label: 'Total Outstanding', value: '₹2.4L', sub: 'Across 42 units', color: 'text-[#EF4444]', bg: 'bg-red-50', icon: 'wallet' },
    { label: 'Collection This Month', value: '₹4.8L', sub: '72% of total billed', color: 'text-[#059669]', bg: 'bg-emerald-50', icon: 'piggy' },
    { label: 'Defaulters', value: '18', sub: '3 critical (> 3 months)', color: 'text-[#0F172A]', bg: 'bg-orange-50', icon: 'users', alert: true },
    { label: 'Upcoming Bills', value: '156', sub: 'Cycle starts Nov 1st', color: 'text-[#3B82F6]', bg: 'bg-blue-50', icon: 'bill' },
  ],
  records: [
    { id: 1, unit: '402', name: 'Vikram Sharma', amount: '4,500', dueDate: 'Oct 15, 2023', status: 'PAID' },
    { id: 2, unit: '105', name: 'Anjali Verma', amount: '4,500', dueDate: 'Oct 15, 2023', status: 'PENDING' },
    { id: 3, unit: '202', name: 'Rohan Mehra', amount: '9,000', dueDate: 'Sep 15, 2023', status: 'OVERDUE' },
    { id: 4, unit: '301', name: 'Ananya Roy', amount: '4,500', dueDate: 'Oct 15, 2023', status: 'PAID' },
    { id: 5, unit: '502', name: 'Rajesh Khanna', amount: '4,500', dueDate: 'Oct 15, 2023', status: 'PENDING' },
  ],
  defaulters: [
    { id: 101, unit: '202', name: 'Rohan Mehra', amount: '13,500', time: '2 months overdue' },
    { id: 102, unit: '112', name: 'Suresh Pal', amount: '9,000', time: '1 month overdue' },
    { id: 103, unit: '305', name: 'Amit Joshi', amount: '4,500', time: '1 month overdue' },
  ],
  chartData: [
    { month: 'MAY', value: 45 },
    { month: 'JUN', value: 55 },
    { month: 'JUL', value: 40 },
    { month: 'AUG', value: 65 },
    { month: 'SEP', value: 80 },
    { month: 'OCT', value: 95 },
  ]
};

// GENERATE MONTHLY BILL MONDAL
const GenerateBillsModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    month: '',
    year: '',
    dueDate: '',
    totalUnits: '',
    fixedFee: '',
    sinkingFund: '',
    parkingCharges: '',
    waterCharges: '',
    recipientType: 'all',
    searchQuery: '',
    autoNotification: true
  });

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // CALCULATION LOGIC: ( Total Units * ₹10 per unit) + Other charges 
 const baseCharges =
  (Number(formData.fixedFee) || 0) +
  (Number(formData.sinkingFund) || 0) +
  (Number(formData.parkingCharges) || 0) +
  (Number(formData.waterCharges) || 0);

const unitsCount = Number(formData.totalUnits) || 0;

const extraUnitCharge = 10 * unitsCount;

const grandTotalValue = baseCharges + extraUnitCharge;

  const handleGenerate = () => {
    console.log('Data:', { ...formData, grandTotal: grandTotalValue });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={onClose}></div>
      
    <div className="relative bg-white text-[#0F172A] h-[90vh] w-full max-w-4xl flex flex-col rounded-[20px] shadow-2xl overflow-hidden animate-in fade-in duration-300">        {/* Header */}
        <div className="py-4 px-8 flex items-start justify-between border-b border-100 ">
          <div>
            <h2 className="text-xl font-semibold text-[#0F172A] tracking-wide">Generate Monthly Bills</h2>
            {/* <p className="text-blue-500 text-sm font-semibold mt-1">October 2023 Billing Cycle</p> */}
          </div>
          <button onClick={onClose} className=" hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>

        </div>
        {/* <div className='h-[1px] bg-gray-100'></div> */}

       <div className="flex-1 overflow-y-auto p-10 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Billing Cycle & Date */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-[#0F172A] font-semibold text-base">
                <Calendar size={18} className="text-blue-500" />
                Billing Cycle & Date
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Month</label>
                  <div className="relative">
                    <select 
                      value={formData.month}
                      onChange={(e) => handleInputChange('month', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm appearance-none focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                    >
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Year</label>
                  <div className="relative">
                    <select 
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm appearance-none focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                    >
                      <option>2026</option>
                      <option>2027</option>
                      <option>2028</option>
                      
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Due Date</label>
                  <input 
                    type="date" 
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none font-medium" 
                  />
                </div>
              </div>
            </section>

            {/* Charge Configuration */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
                <CreditCard size={18} className="text-blue-500" />
                Charge Configuration
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Fixed Maintenance Fee
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                ₹
                </span>
                <input
                type="number"
                value={formData.fixedFee}
                onChange={(e) => handleInputChange("fixedFee", e.target.value)}
                placeholder='3500'
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-8 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold"
                />
            </div>
            </div>

            {/* Sinking Fund */}
            <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Sinking Fund
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                ₹
                </span>
                <input
                type="number"
                value={formData.sinkingFund}
                placeholder='500'
                onChange={(e) => handleInputChange("sinkingFund", e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-8 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold"
                />
            </div>
            </div>

            {/* Parking Charges */}
            <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Parking Charges
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                ₹
                </span>
                <input
                type="number"
                value={formData.parkingCharges}
                onChange={(e) => handleInputChange("parkingCharges", e.target.value)}
                placeholder='1000'
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-8 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold"
                />
            </div>
            </div>

            {/* Water Charges */}
            <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Water Charges
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                ₹
                </span>
                <input
                type="number"
                value={formData.waterCharges}
                onChange={(e) => handleInputChange("waterCharges", e.target.value)}
                placeholder='500'
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-8 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold appearance-none"
                />
            </div>
            </div>
              </div>
            </section>

            {/* Targeted Recipients */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
                <Users size={18} className="text-blue-500" />
                Targeted Recipients
              </div>
              <div className="flex p-1 rounded-2xl gap-4">
                {['all', 'wings', 'individual'].map((id) => (
                  <button 
                    key={id}
                    onClick={() => handleInputChange('recipientType', id)}
                    className={`flex-1 py-3 text-[10px] font-black text-[#0F172A] uppercase tracking-widest rounded-2xl transition-all ${
                      formData.recipientType === id 
                      ? ' border border-[#3B82F6] bg-[#3B82F6]/10' 
                      : ' border border-gray-200 hover:text-slate-600 bg-slate-50'
                    }`}
                  >
                    {id === 'wings' ? 'Wings/Blocks' : id === 'all' ? 'All Units' : 'Individual'}
                  </button>
                ))}
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search and select units..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                />
              </div>
            </section>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#3B82F6] rounded-[36px] p-8 text-white space-y-8 ">
              <h4 className="text-sm tracking-wider font-thin uppercase ">Preview Summary</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex-1">
                    <p className="text-[10px] opacity-70 font-bold mb-1 uppercase tracking-wider">Total Units</p>
                    <input 
                      type="number"
                      value={formData.totalUnits}
                      onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                      placeholder='0'
                      className="text-2xl font-black bg-transparent border-none outline-none w-full text-white placeholder:text-white/40 focus:ring-0 p-0 appearance-none"
                    />
                  </div>
                  <div className="p-3  rounded-[20px]"><Home size={24} className='text-gray-300' /></div>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] opacity-70 font-bold mb-1 uppercase tracking-wider">Total Amount</p>
                    <p className="text-2xl font-black tracking-tight">{grandTotalValue}</p>
                  </div>
                  <div className="p-3 rounded-[20px]"><Wallet size={24} className='text-gray-300' /></div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">Auto-Notification</p>
                    <p className="text-[10px] opacity-60 mt-0.5">Notification via Email & SMS on dispatch</p>
                  </div>
                  <div 
                    onClick={() => handleInputChange('autoNotification', !formData.autoNotification)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${formData.autoNotification ? 'bg-blue-400' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${formData.autoNotification ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF9EA] border border-orange-100/50 p-6 rounded-2xl flex gap-4 shadow-sm">
              <div className="text-orange-400 mt-0.5 flex-shrink-0"><Info size={20} /></div>
              <p className="text-[12px] text-[#92400E] leading-relaxed font-medium">
                Bills will be generated for the current cycle. Residents will receive an instant notification once you click 'Generate & Dispatch'.
              </p>
            </div>

          </div>
        </div>

        <div className="flex items-center justify-end gap-4 py-4 px-8 border-t bg-white">
                  <button onClick={onClose} className="px-8 py-2 text-sm font-bold text-slate-400 border rounded-2xl hover:text-slate-800 transition-colors">Cancel</button>
              <button 
                onClick={handleGenerate}
                className="flex items-center justify-center gap-3 bg-[#3B82F6]  text-white px-4 py-2 rounded-2xl text-sm font-bold hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0"
              >
                <Send size={14} className="rotate-45 " />
                Generate & Dispatch
              </button>
            </div>
      </div>
    </div>
  );
};

//Manual Payment Modal
const ManualPaymentModal = ({ isOpen, onClose }) => {
  // Form State
  const [formData, setFormData] = useState({
    residentSearch: '',
    amountReceived: '0.00',
    paymentDate: '10/27/2023',
    paymentMethod: 'Cash',
    transactionId: '',
    remark: '',
    generateReceipt: true
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setPaymentMethod = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const toggleReceipt = () => {
    setFormData(prev => ({ ...prev, generateReceipt: !prev.generateReceipt }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment Data Submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-4 flex justify-between items-start border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A]">Record Manual Payment</h2>
            <p className="text-[#3B82F6] text-sm font-medium ">Direct entry for offline maintenance payments</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto p-8 pt-6">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column - Form */}
              <div className="flex-1 space-y-8">
                
                {/* Resident Selection */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-[#1E293B] font-semibold text-base">
                    <User size={18} className="text-blue-500" />
                    <h3>Resident Selection</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Society Unit/Resident</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        name="residentSearch"
                        value={formData.residentSearch}
                        onChange={handleChange}
                        placeholder="Search by Unit No. or Resident Name"
                        className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                      />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3 flex justify-between items-center">
                    <span className="text-[#2563EB] font-medium text-sm uppercase tracking-wider">Current Outstanding Amount</span>
                    <span className="text-[#1D4ED8] font-extrabold text-lg">₹4,250.00</span>
                  </div>
                </section>

                {/* Payment Details */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-[#1E293B] font-semibold text-base">
                    <Wallet size={18} className="text-blue-500" />
                    <h3>Payment Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Amount Received</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                        <input 
                          type="text" 
                          name="amountReceived"
                          value={formData.amountReceived}
                          onChange={handleChange}
                          placeholder='4000'
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Payment Date</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleChange}
                          placeholder='20/03/2028'
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Payment Method</label>
                    <div className="flex flex-wrap gap-2 p-1 ">
                      {['Cash', 'Cheque', 'Transfer', 'UPI'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`flex-1 min-w-[80px] py-2.5 px-4 rounded-2xl text-sm font-bold transition-all ${
                            formData.paymentMethod === method 
                            ? ' border border-[#3B82F6] bg-[#3B82F6]/10' 
                            : ' border border-gray-200 hover:text-slate-600 bg-slate-50'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Transaction ID / Cheque Number</label>
                    <input 
                      type="text" 
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter reference number (optional)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Remark / Internal Note</label>
                    <textarea 
                      name="remark"
                      value={formData.remark}
                      onChange={handleChange}
                      placeholder="Add any relevant notes here..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Moved Receipt Toggle Here */}
                  <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className=" p-2 rounded-lg">
                        <ScrollText className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#0F172A]">Generate Digital Receipt</p>
                        <p className="text-sm text-[#64748B]">Auto-send receipt to resident's email/app</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={toggleReceipt}
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${formData.generateReceipt ? 'bg-blue-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.generateReceipt ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </section>
              </div>

              {/* Right Column - Status & Info */}
              <div className="w-full lg:w-72 space-y-6">
                {/* Unit Status Card */}
                <div className="bg-[#3B82F6] rounded-3xl p-6 text-white">
                  <h3 className="text-base font-medium uppercase tracking-widest opacity-80 mb-6">Unit Status</h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs uppercase font-semibold opacity-70 mb-1">Current Unit Balance</p>
                        <p className="text-2xl font-bold">₹4,250</p>
                      </div>
                      <div className="pt-4">
                        <Landmark size={24} className='text-gray-200'/>
                      </div>
                    </div>

                    <div className="h-px bg-white/20 w-full"></div>

                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs uppercase font-semibold opacity-70 mb-1">Last Payment Date</p>
                        <p className="text-lg font-bold">12 Sep 2023</p>
                      </div>
                      <div className="pt-4">
                        <History size={24} className='text-gray-200' />
                      </div>
                    </div>

                    <div className="mt-4 pt-2">
                      <div className="flex items-center justify-center gap-2 bg-white/10 py-2.5 px-4 rounded-2xl backdrop-blur-sm">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-semibold">Verified Resident Profile</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Warning */}
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
                  <div className="text-[#D97706] mt-0.5 shrink-0">
                    <div className=" rounded-full p-0.5"><Info size={20} /></div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#92400E] font-medium">
                    Manual entries are audited monthly. Ensure reference numbers are entered for bank transfers or cheques to avoid reconciliation issues.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="py-4 px-8 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-2 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="w-full sm:w-auto px-10 py-3 text-sm bg-[#3B82F6] hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <CheckCircle2 size={20} />
                Confirm & Save Payment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Finances = () => {

    const [isGenerateBillModalOpen, setIsGenerateBillModalOpen] = useState(false);
    const [isRecordManualOpen, setIsRecordManualOpen] = useState(false);

    const getStatusStyles = (status) => {
        switch (status) {
        case 'PAID': return 'bg-emerald-50 text-emerald-600';
        case 'PENDING': return 'bg-orange-50 text-orange-600';
        case 'OVERDUE': return 'bg-red-50 text-red-600';
        default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <DashboardLayout role="society-admin">
        <div className="min-h-screen text-[#0F172A]">
        <div className=" max-w-7xl mx-auto space-y-8">
            
            {/* Page Title (Moved from header to main content) */}
            {/* <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 mb-2">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Maintenance Billing</h2>
            <span className="text-gray-400 text-sm hidden sm:inline">|</span>
            <span className="text-gray-400 text-sm font-medium">October 2023 Cycle</span>
            </div> */}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {MOCK_DATA.stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                    <p className="text-sm text-[#64748B] font-medium mb-1">{stat.label}</p>
                    <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
                    </div>
                    <div className={`${stat.bg} p-2.5 rounded-xl`}>
                    {idx === 0 && <History className="text-[#EF4444]" size={20} />}
                    {idx === 1 && <Wallet className="text-[#059669]" size={20} />}
                    {idx === 2 && <Users className="text-[#D97706]" size={20} />}
                    {idx === 3 && <PlusCircle className="text-[#3B82F6]" size={20} />}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {stat.alert && <AlertCircle size={14} className="text-[#D97706]" />}
                    <p className={`text-xs ${stat.alert ? 'text-[#D97706] font-medium' : 'text-[#94A3B8]'}`}>{stat.sub}</p>
                </div>
                {stat.label.includes('Collection') && (
                    <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#059669] rounded-full" style={{ width: '72%' }}></div>
                    </div>
                )}
                </div>
            ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-4 sm:px-6 sm:py-4 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#94A3B8] font-bold uppercase tracking-widest text-xs">
                <Zap size={20} className='text-[#3B82F6]' />
                Quick Actions
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
                <button
                onClick={() => setIsGenerateBillModalOpen(true)} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#3B82F6] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                <ScrollText size={18} />
                Generate Monthly Bills
                </button>
                <button
                onClick={()=> setIsRecordManualOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-200 text-[#0F172A] px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                <CreditCard size={18} className='text-[#3B82F6]' />
                Record Manual Payment
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-200 text-[#0F172A] px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                <BellRing size={18} className='text-[#3B82F6]' />
                Send Reminders
                </button>
            </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Maintenance Records Table */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
                    <h3 className="text-lg font-semibold">Maintenance Records</h3>
                    <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search Unit or Resident..."
                        className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                    />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-bold border-b border-gray-50">
                        <th className="px-6 py-4">Unit No</th>
                        <th className="px-6 py-4">Resident Name</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {MOCK_DATA.records.map((row) => (
                        <tr key={row.id} className="group hover:bg-blue-50/20 transition-colors">
                            <td className="px-6 py-5 font-bold text-[#0F172A]">{row.unit}</td>
                            <td className="px-6 py-5">
                            <p className="text-sm font-medium text-[#0F172A]">{row.name}</p>
                            </td>
                            <td className="px-6 py-5">
                            <span className={`font-bold ${row.status === 'OVERDUE' ? 'text-red-500' : 'text-[#0F172A]'}`}>
                                ₹{row.amount}
                            </span>
                            </td>
                            <td className="px-6 py-5">
                            <p className={`text-xs font-medium ${row.status === 'OVERDUE' ? 'text-red-400' : 'text-[#64748B]'}`}>
                                {row.dueDate}
                            </p>
                            </td>
                            <td className="px-6 py-5 text-center">
                            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${getStatusStyles(row.status)}`}>
                                {row.status}
                            </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                            {row.status === 'OVERDUE' ? (
                                <button className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors uppercase">
                                Remind
                                </button>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                    {row.status === 'PAID' ? <Eye size={16} /> : <Edit2 size={16} />}
                                </button>
                                </div>
                            )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                <div className="p-4 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">Showing 5 of 156 units</p>
                    <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs text-gray-400 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg">Prev</button>
                    <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg ">1</button>
                    <button className="px-3 py-1.5 text-xs text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg">Next</button>
                    </div>
                </div>
                </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-8">
                
                {/* Collection Trends */}
                <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-md font-bold text-gray-800">Collection Trends</h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Last 6 Months</span>
                </div>
                
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                    {MOCK_DATA.chartData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                        <div 
                        className={`w-full rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-80 ${i === MOCK_DATA.chartData.length - 1 ? 'bg-blue-500' : 'bg-blue-100'}`}
                        style={{ height: `${data.value}%` }}
                        ></div>
                        <span className={`text-[9px] font-bold tracking-tighter ${i === MOCK_DATA.chartData.length - 1 ? 'text-blue-600' : 'text-gray-300'}`}>
                        {data.month}
                        </span>
                    </div>
                    ))}
                </div>
                </div>

                {/* Top Defaulters */}
                <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden">
                <div className="p-6 pb-2">
                    <h3 className="text-md font-bold text-gray-800 mb-2">Top Defaulters</h3>
                    <div className="h-[1px] -mx-6 bg-gray-100 mb-4"></div>
                    <div className="space-y-4">
                    {MOCK_DATA.defaulters.map((person) => (
                        <div key={person.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            {person.unit}
                            </div>
                            <div>
                            <p className="text-sm font-bold text-gray-700">{person.name}</p>
                            <p className="text-[10px] text-[#94A3B8] font-medium">{person.time}</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-[#EF4444]">₹{person.amount}</p>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="p-4 mt-2">
                    <button className="w-full py-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                    View All Defaulters
                    </button>
                </div>
                </div>

            </div>
            </div>
        </div>
        <GenerateBillsModal 
            isOpen={isGenerateBillModalOpen} 
            onClose={() => setIsGenerateBillModalOpen(false)} 
        />
         <ManualPaymentModal 
        isOpen={isRecordManualOpen} 
        onClose={() => setIsRecordManualOpen(false)} 
      />
        </div>
        </DashboardLayout>
    );
};

export default Finances;