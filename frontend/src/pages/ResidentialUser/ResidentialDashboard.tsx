import React, { useState, useEffect } from 'react';
import { Wallet, Bell, Megaphone, Wrench, CheckCircle, Clock, Upload, UserPlus, ShieldCheck, XCircle, Loader2, Phone, Car, Info, MapPin } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { createVisitor, getVisitorHistory, clearUserError } from "../../features/User/userSlice";
import { toast } from "sonner";

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder:text-slate-400";

const ResidentialDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { visitorData, visitorLoading, createVisitorSuccess, generatedCode, error } = useAppSelector((state) => state.user);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitorName: "",
    visitorPhone: "",
    vehicleNumber: "",
    purpose: "Guest",
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    flatNumber: user?.unit?.flatNumber || "", // Assuming this structure
  });

  useEffect(() => {
    // Initial fetch for visitors
    dispatch(getVisitorHistory(user?.unit?.flatNumber || 'All'));
  }, [dispatch, user]);

  useEffect(() => {
    if (createVisitorSuccess) {
      setShowAddModal(false);
      setShowSuccessModal(true);
      // Reset form
      setNewVisitor({
        visitorName: "",
        visitorPhone: "",
        vehicleNumber: "",
        purpose: "Guest",
        visitDate: new Date().toISOString().split('T')[0],
        visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        flatNumber: user?.unit?.flatNumber || "",
      });
    }
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
  }, [createVisitorSuccess, error, dispatch, user]);

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createVisitor({
      ...newVisitor,
      memberId: user?.id,
      flatNumber: user?.unit?.flatNumber || newVisitor.flatNumber
    }));
  };

  const payments = [
    { id: 1, title: 'Maintenance', amount: 5500, dueDate: 'Dec 10, 2024', status: 'PENDING' },
    { id: 2, title: 'Club Membership', amount: 2000, dueDate: 'Dec 15, 2024', status: 'PENDING' },
    { id: 3, title: 'Parking Fee', amount: 500, dueDate: 'Dec 10, 2024', status: 'PAID' },
  ];

  const notices = [
    {
      id: 1,
      title: 'Annual General Meeting',
      tag: 'Meeting',
      description: 'Scheduled for Jan 15, 2025 at the Clubhouse.',
      icon: <Megaphone className="w-5 h-5 text-blue-500" />,
      tagColor: 'bg-blue-50 text-blue-600',
    },
    {
      id: 2,
      title: 'Water Supply Maintenance',
      tag: 'Maintenance',
      description: 'Scheduled for Dec 20, 10 AM - 4 PM.',
      icon: <Wrench className="w-5 h-5 text-purple-500" />,
      tagColor: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8 font-sans text-slate-800">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Resident'}!</h1>
          <p className="text-slate-500 text-sm">{user?.unit?.flatNumber ? `Flat ${user.unit.flatNumber}` : 'Greenwood Heights'}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <UserPlus size={18} /> Pre-Approve Visitor
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.01]">
          <div className="p-4 bg-orange-50 rounded-xl">
            <Wallet className="text-orange-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">₹7,500</h2>
            <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Pending Dues</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.01]">
          <div className="p-4 bg-blue-50 rounded-xl">
            <Bell className="text-blue-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">3</h2>
            <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">New Notices</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.01]">
          <div className="p-4 bg-emerald-50 rounded-xl">
            <ShieldCheck className="text-emerald-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{(visitorData || []).filter((v: any) => v.status === 'Pending').length}</h2>
            <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Expected Visitors</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Visitor Management Section */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Scheduled Visitors</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ongoing & Upcoming</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {visitorLoading && visitorData.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="text-blue-600 animate-spin" size={32} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fetching Visitors...</p>
                </div>
              ) : visitorData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visitor Info</th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose</th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Code</th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {visitorData.map((v: any) => (
                        <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                {v.visitorName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-700">{v.visitorName}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{v.visitDate} • {v.visitTime}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs font-bold text-slate-500">{v.purpose}</span>
                          </td>
                          <td className="py-4 px-6">
                            {v.status === 'Pending' ? (
                              <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black text-xs tracking-widest shadow-sm">
                                {v.verificationCode}
                              </span>
                            ) : (
                              <span className="text-slate-300 text-xs font-bold italic">Used</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                              v.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                  <UserPlus size={48} className="opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">No visitors scheduled</p>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="text-blue-600 text-xs font-bold hover:underline"
                  >
                    + Add your first visitor
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Payment Dues</h3>
              <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                <Upload size={16} /> Upload Proof
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
              {payments.map((item) => (
                <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${item.status === 'PAID' ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                      {item.status === 'PAID' ? 
                        <CheckCircle size={20} className="text-emerald-500" /> : 
                        <Clock size={20} className="text-orange-400" />
                      }
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-400">Due Date: {item.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-lg">₹{item.amount.toLocaleString()}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notices Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Recent Notices</h3>
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    {notice.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${notice.tagColor}`}>
                    {notice.tag}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{notice.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{notice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Visitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Pre-Approve Visitor</h3>
                  <p className="text-sm text-slate-500 font-medium">Generate a secure entry code</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-100">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateVisitor}>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visitor Name</label>
                    <input 
                      type="text" required
                      placeholder="e.g. Shivam"
                      className={inputCls} 
                      value={newVisitor.visitorName}
                      onChange={(e) => setNewVisitor({...newVisitor, visitorName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" required
                      placeholder="e.g. 9759477504"
                      className={inputCls} 
                      value={newVisitor.visitorPhone}
                      onChange={(e) => setNewVisitor({...newVisitor, visitorPhone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purpose of Visit</label>
                    <select 
                      className={inputCls}
                      value={newVisitor.purpose}
                      onChange={(e) => setNewVisitor({...newVisitor, purpose: e.target.value})}
                    >
                      <option value="Guest">Guest</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Number</label>
                    <input 
                      type="text"
                      placeholder="e.g. UP32AB1234"
                      className={inputCls} 
                      value={newVisitor.vehicleNumber}
                      onChange={(e) => setNewVisitor({...newVisitor, vehicleNumber: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit Date</label>
                    <input 
                      type="date" required
                      className={inputCls} 
                      value={newVisitor.visitDate}
                      onChange={(e) => setNewVisitor({...newVisitor, visitDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit Time</label>
                    <input 
                      type="text" required
                      placeholder="e.g. 10:30 AM"
                      className={inputCls} 
                      value={newVisitor.visitTime}
                      onChange={(e) => setNewVisitor({...newVisitor, visitTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
                  <Info className="text-blue-600 shrink-0" size={20} />
                  <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                    Once created, you will receive a 4-digit code. Share this with your visitor to allow them entry at the gate.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex items-center gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white transition-all">Cancel</button>
                <button 
                  type="submit" 
                  disabled={visitorLoading}
                  className="flex-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  {visitorLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Create & Get Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal (Showing Verification Code) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white rounded-[40px] w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ShieldCheck size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Visitor Approved!</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">Please share this entry code with your visitor</p>
              
              <div className="mt-10 mb-10 py-8 bg-slate-50 border-2 border-slate-100 rounded-[32px] relative group overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-[0.02]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verification Code</p>
                <p className="text-6xl font-black text-blue-600 tracking-[8px]">{generatedCode || '####'}</p>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-blue-50/30 rounded-3xl border border-blue-50 text-left space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin size={16} className="text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Flat {user?.unit?.flatNumber}</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Phone size={16} className="text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">{newVisitor.visitorPhone || 'Visitor Mobile'}</p>
                   </div>
                </div>

                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-4 rounded-2xl font-bold text-sm bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Done
                </button>
                <button 
                   onClick={() => {
                     const text = `Hi, I have pre-approved your visit to Greenwood Heights. Your entry code is: ${generatedCode}. Please show this to the guard at the gate.`;
                     window.open(`https://wa.me/${newVisitor.visitorPhone}?text=${encodeURIComponent(text)}`, '_blank');
                   }}
                   className="w-full py-4 rounded-2xl font-bold text-sm bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                >
                  Share via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentialDashboard;