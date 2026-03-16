import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getCharges, getChargeById, getResidents, updateCharge, deleteCharge, getPayments, approvePayment, rejectPayment } from "@/features/admin/adminSlice";
import { toast } from 'sonner';
import {
  Wallet, Search, PlusCircle, History, Send, Eye, Edit2,
  AlertCircle, Users, Zap, ScrollText, CreditCard, BellRing,
  Calendar, ChevronDown, Home, Info, X, User, Check, Upload,
  Trash2, CheckCircle2, ShieldCheck, Landmark
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const MOCK_DATA = {
  stats: [
    { label: 'Total Outstanding', value: '₹2.4L', sub: 'Across 42 units', color: 'text-[#EF4444]', bg: 'bg-red-50' },
    { label: 'Collection This Month', value: '₹4.8L', sub: '72% of total billed', color: 'text-[#059669]', bg: 'bg-emerald-50' },
    { label: 'Defaulters', value: '18', sub: '3 critical (> 3 months)', color: 'text-[#0F172A]', bg: 'bg-orange-50', alert: true },
    { label: 'Upcoming Bills', value: '156', sub: 'Cycle starts Nov 1st', color: 'text-[#3B82F6]', bg: 'bg-blue-50' },
  ],
  defaulters: [
    { id: 101, unit: '202', name: 'Rohan Mehra', amount: '13,500', time: '2 months overdue' },
    { id: 102, unit: '112', name: 'Suresh Pal', amount: '9,000', time: '1 month overdue' },
    { id: 103, unit: '305', name: 'Amit Joshi', amount: '4,500', time: '1 month overdue' },
  ],
  chartData: [
    { month: 'MAY', value: 45 }, { month: 'JUN', value: 55 }, { month: 'JUL', value: 40 },
    { month: 'AUG', value: 65 }, { month: 'SEP', value: 80 }, { month: 'OCT', value: 95 },
  ]
};

// ─── Generate Bills Modal ─────────────────────────────────────────────────────
const GenerateBillsModal = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    month: '', year: '', dueDate: '', totalUnits: '', fixedFee: '',
    sinkingFund: '', parkingCharges: '', waterCharges: '',
    recipientType: 'all', autoNotification: true
  });

  useEffect(() => { dispatch(getCharges()); }, [dispatch]);
  if (!isOpen) return null;

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const grandTotalValue =
    (Number(formData.fixedFee) || 0) + (Number(formData.sinkingFund) || 0) +
    (Number(formData.parkingCharges) || 0) + (Number(formData.waterCharges) || 0) +
    (10 * (Number(formData.totalUnits) || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white text-[#0F172A] h-[90vh] w-full max-w-4xl flex flex-col rounded-[20px] shadow-2xl overflow-hidden">
        <div className="py-4 px-8 flex items-start justify-between border-b">
          <h2 className="text-xl font-semibold">Generate Monthly Bills</h2>
          <button onClick={onClose} className="hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <section className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-base">
                <Calendar size={18} className="text-blue-500" /> Billing Cycle & Date
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Month</label>
                  <div className="relative">
                    <select value={formData.month} onChange={(e) => handleInputChange('month', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm appearance-none outline-none font-medium">
                      {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Year</label>
                  <div className="relative">
                    <select value={formData.year} onChange={(e) => handleInputChange('year', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm appearance-none outline-none font-medium">
                      <option>2026</option><option>2027</option><option>2028</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none font-medium" />
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CreditCard size={18} className="text-blue-500" /> Charge Configuration
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { label: 'Fixed Maintenance Fee', key: 'fixedFee', placeholder: '3500' },
                  { label: 'Sinking Fund', key: 'sinkingFund', placeholder: '500' },
                  { label: 'Parking Charges', key: 'parkingCharges', placeholder: '1000' },
                  { label: 'Water Charges', key: 'waterCharges', placeholder: '500' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{label}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                      <input type="number" value={formData[key]} onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={placeholder} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-8 pr-4 text-sm outline-none font-bold" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Users size={18} className="text-blue-500" /> Targeted Recipients
              </div>
              <div className="flex gap-4">
                {['all', 'wings', 'individual'].map((type) => (
                  <button key={type} onClick={() => handleInputChange('recipientType', type)}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                      formData.recipientType === type ? 'border border-[#3B82F6] bg-[#3B82F6]/10' : 'border border-gray-200 bg-slate-50'
                    }`}>
                    {type === 'wings' ? 'Wings/Blocks' : type === 'all' ? 'All Units' : 'Individual'}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="text" placeholder="Search and select units..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none" />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#3B82F6] rounded-[36px] p-8 text-white space-y-8">
              <h4 className="text-sm tracking-wider font-thin uppercase">Preview Summary</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex-1">
                    <p className="text-[10px] opacity-70 font-bold mb-1 uppercase tracking-wider">Total Units</p>
                    <input type="number" value={formData.totalUnits} onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                      placeholder='0' className="text-2xl font-black bg-transparent border-none outline-none w-full text-white placeholder:text-white/40 p-0 appearance-none" />
                  </div>
                  <Home size={24} className='text-gray-300' />
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] opacity-70 font-bold mb-1 uppercase tracking-wider">Total Amount</p>
                    <p className="text-2xl font-black tracking-tight">₹{grandTotalValue}</p>
                  </div>
                  <Wallet size={24} className='text-gray-300' />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">Auto-Notification</p>
                    <p className="text-[10px] opacity-60 mt-0.5">Notification via Email & SMS</p>
                  </div>
                  <div onClick={() => handleInputChange('autoNotification', !formData.autoNotification)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${formData.autoNotification ? 'bg-blue-400' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${formData.autoNotification ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#FFF9EA] border border-orange-100/50 p-6 rounded-2xl flex gap-4">
              <Info size={20} className="text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-[12px] text-[#92400E] leading-relaxed font-medium">
                Bills will be generated for the current cycle. Residents will receive an instant notification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 py-4 px-8 border-t bg-white">
          <button onClick={onClose} className="px-8 py-2 text-sm font-bold text-slate-400 border rounded-2xl">Cancel</button>
          <button onClick={onClose} className="flex items-center gap-3 bg-[#3B82F6] text-white px-4 py-2 rounded-2xl text-sm font-bold hover:bg-blue-700">
            <Send size={14} className="rotate-45" /> Generate & Dispatch
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Manual Payment Modal ─────────────────────────────────────────────────────
const ManualPaymentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    residentSearch: '', amountReceived: '0.00', paymentDate: '',
    paymentMethod: 'Cash', transactionId: '', remark: '', generateReceipt: true
  });

  if (!isOpen) return null;

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="px-8 py-4 flex justify-between items-start border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A]">Record Manual Payment</h2>
            <p className="text-[#3B82F6] text-sm font-medium">Direct entry for offline maintenance payments</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto p-8 pt-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <section className="space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <User size={18} className="text-blue-500" /> <h3>Resident Selection</h3>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="residentSearch" value={formData.residentSearch} onChange={handleChange}
                      placeholder="Search by Unit No. or Resident Name"
                      className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3 flex justify-between items-center">
                    <span className="text-[#2563EB] font-medium text-sm uppercase tracking-wider">Current Outstanding</span>
                    <span className="text-[#1D4ED8] font-extrabold text-lg">₹4,250.00</span>
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <Wallet size={18} className="text-blue-500" /> <h3>Payment Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Amount Received</label>
                      <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                        <input type="text" name="amountReceived" value={formData.amountReceived} onChange={handleChange}
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Payment Date</label>
                      <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange}
                        className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Payment Method</label>
                    <div className="flex gap-2 mt-1">
                      {['Cash', 'Cheque', 'Transfer', 'UPI'].map((method) => (
                        <button key={method} type="button" onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                          className={`flex-1 py-2.5 px-4 rounded-2xl text-sm font-bold transition-all ${
                            formData.paymentMethod === method ? 'border border-[#3B82F6] bg-[#3B82F6]/10' : 'border border-gray-200 bg-slate-50'
                          }`}>
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Transaction ID</label>
                    <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange}
                      placeholder="Enter reference number (optional)"
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Remark</label>
                    <textarea name="remark" value={formData.remark} onChange={handleChange}
                      placeholder="Add any relevant notes here..."
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex items-center gap-3">
                      <ScrollText className="text-blue-500" size={20} />
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">Generate Digital Receipt</p>
                        <p className="text-xs text-[#64748B]">Auto-send receipt to resident</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, generateReceipt: !prev.generateReceipt }))}
                      className={`w-12 h-6 rounded-full relative focus:outline-none ${formData.generateReceipt ? 'bg-blue-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.generateReceipt ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </section>
              </div>

              <div className="w-full lg:w-72 space-y-6">
                <div className="bg-[#3B82F6] rounded-3xl p-6 text-white">
                  <h3 className="text-base font-medium uppercase tracking-widest opacity-80 mb-6">Unit Status</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs uppercase font-semibold opacity-70 mb-1">Current Balance</p>
                        <p className="text-2xl font-bold">₹4,250</p>
                      </div>
                      <Landmark size={24} className='text-gray-200' />
                    </div>
                    <div className="h-px bg-white/20 w-full" />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs uppercase font-semibold opacity-70 mb-1">Last Payment</p>
                        <p className="text-lg font-bold">12 Sep 2023</p>
                      </div>
                      <History size={24} className='text-gray-200' />
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-white/10 py-2.5 px-4 rounded-2xl">
                      <ShieldCheck size={16} />
                      <span className="text-xs font-semibold">Verified Resident</span>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
                  <Info size={20} className="text-[#D97706] shrink-0" />
                  <p className="text-sm text-[#92400E] font-medium">Manual entries are audited monthly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="py-4 px-8 border-t border-slate-100 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-8 py-2 text-slate-500 font-semibold">Cancel</button>
            <button type="submit" className="px-10 py-3 text-sm bg-[#3B82F6] hover:bg-blue-700 text-white font-semibold rounded-2xl flex items-center gap-2">
              <CheckCircle2 size={20} /> Confirm & Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Edit Charge Modal ────────────────────────────────────────────────────────
const EditChargeModal = ({ isOpen, onClose, chargeId }) => {
  const dispatch = useAppDispatch();
  const selectedCharge = useAppSelector((state) => state.admin.selectedCharge);
  const residents = useAppSelector((state) => state.admin.residents);

  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "", category: "maintenance", unitType: "all", amount: "",
    dueDay: new Date().getDate(), dueMonth: new Date().getMonth(),
    dueYear: new Date().getFullYear(), appliedTo: "all", targetUsers: [], description: "",
  });

  const CATEGORIES = [
    { value: "maintenance", label: "Maintenance" }, { value: "event", label: "Event" },
    { value: "fine", label: "Fine" }, { value: "penalty", label: "Penalty" }, { value: "other", label: "Other" },
  ];
  const UNIT_TYPES = ["all","1BHK","2BHK","3BHK","4BHK","studio","penthouse","shop","office"];

  useEffect(() => {
    if (isOpen && chargeId) {
      dispatch(getChargeById(chargeId));
      dispatch(getResidents());
    }
  }, [isOpen, chargeId, dispatch]);

  useEffect(() => {
    if (selectedCharge && chargeId && selectedCharge._id === chargeId) {
      const dueDate = new Date(selectedCharge.dueDate);
      setFormData({
        title: selectedCharge.title || "",
        category: selectedCharge.category || "maintenance",
        unitType: selectedCharge.unitType || "all",
        amount: String(selectedCharge.amount || ""),
        dueDay: dueDate.getDate(),
        dueMonth: dueDate.getMonth(),
        dueYear: dueDate.getFullYear(),
        appliedTo: selectedCharge.appliedTo || "all",
        targetUsers: selectedCharge.targetUsers?.map((u) => typeof u === "string" ? u : u._id) || [],
        description: selectedCharge.description || "",
      });
    }
  }, [selectedCharge, chargeId]);

  const toggleResident = (residentId) => {
    setFormData((prev) => ({
      ...prev,
      targetUsers: prev.targetUsers.includes(residentId)
        ? prev.targetUsers.filter((id) => id !== residentId)
        : [...prev.targetUsers, residentId],
    }));
  };

  const filteredResidents = residents.filter((r) =>
    r.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.title || !formData.amount) { toast.error("Title and amount are required"); return; }
    if (formData.appliedTo === "specific" && formData.targetUsers.length === 0) {
      toast.error("Please select at least one resident"); return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category", formData.category);
    form.append("amount", String(Number(formData.amount)));
    form.append("dueDate", new Date(formData.dueYear, formData.dueMonth, formData.dueDay, 23, 59, 59).toISOString());
    form.append("appliedTo", formData.appliedTo);
    if (formData.appliedTo === "specific") formData.targetUsers.forEach((uid) => form.append("targetUsers[]", uid));
    if (formData.unitType !== "all") form.append("unitType", formData.unitType);
    if (proofFile) form.append("proofImage", proofFile);

    const toastId = toast.loading("Updating charge...");
    try {
      await dispatch(updateCharge({ id: chargeId, chargeData: form })).unwrap();
      toast.success("Charge updated successfully", { id: toastId });
      dispatch(getCharges());
      onClose();
    } catch (err) {
      toast.error(err?.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Charge</h2>
            <p className="text-sm text-slate-400">Update charge details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <input value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Charge Title" className="w-full mb-4 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100" />

        <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full mb-4 px-4 py-3 border rounded-xl outline-none">
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <select value={formData.unitType} onChange={(e) => setFormData(prev => ({ ...prev, unitType: e.target.value }))}
          className="w-full mb-4 px-4 py-3 border rounded-xl outline-none">
          {UNIT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>

        <input type="number" value={formData.amount} onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="Amount" className="w-full mb-4 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100" />

        <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3} placeholder="Description" className="w-full mb-4 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100" />

        <div className="mb-4">
          <label className="block text-[13px] font-bold mb-2 text-slate-500 uppercase tracking-wider">Apply To</label>
          <div className="flex gap-3">
            {[{ value: "all", label: "All Units" }, { value: "specific", label: "Specific Users" }].map((opt) => (
              <button key={opt.value} type="button"
                onClick={() => setFormData(prev => ({ ...prev, appliedTo: opt.value, targetUsers: [] }))}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                  formData.appliedTo === opt.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {formData.appliedTo === "specific" && (
          <div className="mb-4 border border-slate-200 rounded-2xl p-4 bg-slate-50/30">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search resident..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white outline-none text-sm" />
            </div>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-100 bg-white">
              {filteredResidents.map((r) => {
                const isSelected = formData.targetUsers.includes(r._id);
                return (
                  <div key={r._id} onClick={() => toggleResident(r._id)}
                    className={`flex justify-between items-center px-4 py-3 cursor-pointer border-b border-slate-50 last:border-0 ${isSelected ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                    <p className={`text-sm font-bold ${isSelected ? "text-blue-700" : "text-slate-700"}`}>{r.name}</p>
                    {isSelected && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                  </div>
                );
              })}
            </div>
            {formData.targetUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.targetUsers.map((uid) => {
                  const r = residents.find((x) => x._id === uid);
                  return (
                    <span key={uid} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      {r?.name || uid}
                      <X size={12} className="cursor-pointer" onClick={() => toggleResident(uid)} />
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <label className="flex items-center gap-3 w-full px-4 py-3 border border-dashed border-slate-200 rounded-xl cursor-pointer mb-6 hover:bg-slate-50">
          <Upload className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-500">{proofFile ? proofFile.name : "Upload new proof image (optional)"}</span>
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) setProofFile(file); }} />
        </label>

        <div className="flex gap-4">
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Saving..." : "Update Charge"}
          </button>
          <button onClick={onClose} className="flex-1 border py-3 rounded-xl font-semibold hover:bg-slate-50">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Finances Page ───────────────────────────────────────────────────────
const Finances = () => {
  const dispatch = useAppDispatch();
  const { charges, payments } = useAppSelector((state) => state.admin);

  const [isGenerateBillModalOpen, setIsGenerateBillModalOpen] = useState(false);
  const [isRecordManualOpen, setIsRecordManualOpen] = useState(false);
  const [isEditChargeOpen, setIsEditChargeOpen] = useState(false);
  const [editChargeId, setEditChargeId] = useState(null);

  // ✅ Reject modal state — Finances ke andar
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectPaymentId, setRejectPaymentId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    dispatch(getCharges());
    dispatch(getPayments());
  }, [dispatch]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-50 text-emerald-600';
      case 'PENDING': return 'bg-orange-50 text-orange-600';
      case 'OVERDUE': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  // ✅ Delete
  const handleDeleteCharge = async (chargeId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this charge?");
    if (!confirmed) return;
    const toastId = toast.loading("Deleting charge...");
    try {
      await dispatch(deleteCharge(chargeId)).unwrap();
      toast.success("Charge deleted successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete charge", { id: toastId });
    }
  };

  // ✅ Approve
  const handleApprovePayment = async (paymentId: string) => {
    const toastId = toast.loading("Approving payment...");
    try {
      await dispatch(approvePayment(paymentId)).unwrap();
      toast.success("Payment approved successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Failed to approve payment", { id: toastId });
    }
  };

  // ✅ Reject
  const handleRejectPayment = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    const toastId = toast.loading("Rejecting payment...");
    try {
      await dispatch(rejectPayment({
        paymentId: rejectPaymentId,
        rejectionReason: rejectionReason.trim()
      })).unwrap();
      toast.success("Payment rejected", { id: toastId });
      setIsRejectModalOpen(false);
      setRejectionReason("");
      setRejectPaymentId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to reject payment", { id: toastId });
    }
  };

  return (
    <DashboardLayout role="society-admin">
      <div className="min-h-screen text-[#0F172A]">
        <div className="max-w-7xl mx-auto space-y-8">

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
                    <div className="h-full bg-[#059669] rounded-full" style={{ width: '72%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-4 sm:px-6 sm:py-4 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#94A3B8] font-bold uppercase tracking-widest text-xs">
              <Zap size={20} className='text-[#3B82F6]' /> Quick Actions
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
              <button onClick={() => setIsGenerateBillModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#3B82F6] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-blue-700">
                <ScrollText size={18} /> Generate Monthly Bills
              </button>
              <button onClick={() => setIsRecordManualOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-200 text-[#0F172A] px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-gray-50">
                <CreditCard size={18} className='text-[#3B82F6]' /> Record Manual Payment
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-200 text-[#0F172A] px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-gray-50">
                <BellRing size={18} className='text-[#3B82F6]' /> Send Reminders
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Charges Table */}
              <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
                  <h3 className="text-lg font-semibold">Maintenance Records</h3>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Search Unit or Resident..."
                      className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm outline-none" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-bold border-b border-gray-50">
                        <th className="px-6 py-4">Unit No</th>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {charges?.map((row) => (
                        <tr key={row._id} className="group hover:bg-blue-50/20 transition-colors">
                          <td className="px-6 py-5 font-bold text-[#0F172A]">{row.unitType || '—'}</td>
                          <td className="px-6 py-5"><p className="text-sm font-medium text-[#0F172A]">{row.title}</p></td>
                          <td className="px-6 py-5">
                            <span className={`font-bold ${row.status === "OVERDUE" ? "text-red-500" : "text-[#0F172A]"}`}>₹{row.amount}</span>
                          </td>
                          <td className="px-6 py-5">
                            <p className={`text-xs font-medium ${row.status === "OVERDUE" ? "text-red-400" : "text-[#64748B]"}`}>
                              {new Date(row.dueDate).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${getStatusStyles(row.status)}`}>
                              {row.status || 'PENDING'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => { setEditChargeId(row._id); setIsEditChargeOpen(true); }}
                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteCharge(row._id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">Showing {charges?.length || 0} charges</p>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs text-gray-400 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg">Prev</button>
                    <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg">1</button>
                    <button className="px-3 py-1.5 text-xs text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg">Next</button>
                  </div>
                </div>
              </div>

              {/* ✅ Payments Table */}
              <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-gray-50">
                  <h3 className="text-lg font-semibold">Payment History</h3>
                  <span className="text-xs text-gray-400 font-bold uppercase">{payments?.length || 0} payments</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-bold border-b border-gray-50">
                        <th className="px-6 py-4">Resident</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {payments?.length > 0 ? payments.map((payment) => (
                        <tr key={payment._id} className="group hover:bg-blue-50/20 transition-colors">
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-[#0F172A]">{payment.user?.name || "—"}</p>
                            <p className="text-xs text-slate-400">Unit: {payment.user?.unit?.flatNumber || "—"}</p>
                          </td>
                          <td className="px-6 py-5"><span className="font-bold text-[#0F172A]">₹{payment.amount}</span></td>
                          <td className="px-6 py-5"><span className="text-sm text-slate-500 font-medium">{payment.method || "—"}</span></td>
                          <td className="px-6 py-5">
                            <p className="text-xs font-medium text-[#64748B]">{new Date(payment.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${
                              payment.status === "approved" ? "bg-emerald-50 text-emerald-600"
                              : payment.status === "pending" ? "bg-orange-50 text-orange-600"
                              : "bg-gray-50 text-gray-600"
                            }`}>
                              {payment.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            {payment.status === "pending" ? (
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleApprovePayment(payment._id)}
                                  className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-emerald-100 uppercase">
                                  Approve
                                </button>
                                <button
                                  onClick={() => { setRejectPaymentId(payment._id); setIsRejectModalOpen(true); }}
                                  className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-100 uppercase">
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`text-xs font-bold ${payment.status === "approved" ? "text-emerald-500" : "text-red-400"}`}>
                                {payment.status === "approved" ? "Approved ✓" : "Rejected ✗"}
                              </span>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">No payments found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-md font-bold text-gray-800">Collection Trends</h3>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Last 6 Months</span>
                </div>
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                  {MOCK_DATA.chartData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                      <div className={`w-full rounded-t-lg transition-all ${i === MOCK_DATA.chartData.length - 1 ? 'bg-blue-500' : 'bg-blue-100'}`}
                        style={{ height: `${data.value}%` }} />
                      <span className={`text-[9px] font-bold ${i === MOCK_DATA.chartData.length - 1 ? 'text-blue-600' : 'text-gray-300'}`}>
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden">
                <div className="p-6 pb-2">
                  <h3 className="text-md font-bold text-gray-800 mb-2">Top Defaulters</h3>
                  <div className="h-[1px] -mx-6 bg-gray-100 mb-4" />
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
                  <button className="w-full py-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50">
                    View All Defaulters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Sare Modals — Finances return ke andar */}
        <GenerateBillsModal isOpen={isGenerateBillModalOpen} onClose={() => setIsGenerateBillModalOpen(false)} />
        <ManualPaymentModal isOpen={isRecordManualOpen} onClose={() => setIsRecordManualOpen(false)} />
        <EditChargeModal
          isOpen={isEditChargeOpen}
          chargeId={editChargeId}
          onClose={() => { setIsEditChargeOpen(false); setEditChargeId(null); }}
        />

        {/* ✅ Reject Modal — Finances return ke andar, sahi jagah */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md"
              onClick={() => setIsRejectModalOpen(false)} />
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Reject Payment</h2>
                  <p className="text-sm text-slate-400">Reason batao kyun reject kar rahe ho</p>
                </div>
                <button onClick={() => setIsRejectModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 mb-6">
                <Info size={18} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">
                  Resident ko notification milegi ki payment reject ho gayi.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-[13px] font-bold mb-2 text-slate-500 uppercase tracking-wider">
                  Rejection Reason *
                </label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Transaction ID does not match. Screenshot is blurry/unclear."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100 text-sm resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleRejectPayment}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                  Confirm Reject
                </button>
                <button onClick={() => { setIsRejectModalOpen(false); setRejectionReason(""); setRejectPaymentId(null); }}
                  className="flex-1 border border-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Finances;