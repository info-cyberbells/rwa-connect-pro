import React, { useState } from "react";
import {
  Users, IndianRupee, AlertTriangle, UserCheck,
  Plus, Home, UserPlus, User, ShieldCheck,
  Camera, Edit2, ChevronDown, Upload, Info, X,
  ChevronLeft, ChevronRight, Paperclip, Moon, ImageIcon,
  TrendingUp, Bell, Calendar, ArrowUpRight, Wrench, Clock
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

const avatarColors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

const StatCard = ({ title, value, subtitle, icon, color, trend }: any) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className={`${color} p-2.5 rounded-xl`}>{icon}</div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={10} /> {trend}
        </span>
      )}
    </div>
    <p className="text-xs text-slate-400 font-semibold mb-1">{title}</p>
    <h2 className="text-2xl font-black text-slate-800">{value}</h2>
    {subtitle && <p className="text-xs text-emerald-600 font-bold mt-1">{subtitle}</p>}
  </div>
);

const Dashboard = () => {
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showFineModal, setShowFineModal] = useState(false);
  const [fineFileName, setFineFileName] = useState('No file chosen');
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const quickActions = [
    { label: "Post Notice", icon: Bell, color: "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700", onClick: () => setShowNoticeModal(true) },
    { label: "Add Resident", icon: UserPlus, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50", onClick: () => setShowResidentModal(true) },
    { label: "Maintenance Charge", icon: Wrench, color: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50", onClick: () => setShowMaintenanceModal(true) },
    { label: "Add Fine", icon: AlertTriangle, color: "bg-white border border-orange-200 text-orange-600 hover:bg-orange-50", onClick: () => setShowFineModal(true) },
  ];

  const activities = [
    { text: "Unit 402 paid maintenance for October", val: "₹4,500", sub: "2 mins ago", dot: "bg-emerald-400" },
    { text: "New visitor entry (Unit 105)", val: "Verified", sub: "15 mins ago", dot: "bg-blue-400" },
    { text: "Plumbing complaint resolved in Unit 202", val: "Done", sub: "1 hr ago", dot: "bg-violet-400" },
    { text: "Security alert: Gate 2 sensor check", val: "Active", sub: "3 hrs ago", dot: "bg-amber-400" },
  ];

  return (
    <DashboardLayout role="society-admin">
      <div className="max-w-[1600px] mx-auto relative">

        {/* ── Header ── */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Welcome back, Admin</h1>
            </div>
            <p className="text-slate-400 text-sm pl-3.5">Everything looks good at Greenwood Heights today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm">
            <Clock size={13} className="text-blue-500" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Residents" value="124" trend="+3 this week" icon={<Users className="w-5 h-5 text-blue-600" />} color="bg-blue-50" />
          <StatCard title="Maintenance Collected" value="₹85k" trend="+12%" icon={<IndianRupee className="w-5 h-5 text-emerald-600" />} color="bg-emerald-50" />
          <StatCard title="Active Complaints" value="4" icon={<AlertTriangle className="w-5 h-5 text-orange-500" />} color="bg-orange-50" />
          <StatCard title="Today's Visitors" value="8" icon={<UserCheck className="w-5 h-5 text-violet-600" />} color="bg-violet-50" />
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white rounded-2xl px-6 py-5 border border-slate-100 shadow-sm mb-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            {quickActions.map(({ label, icon: Icon, color, onClick }) => (
              <button key={label} onClick={onClick}
                className={`${color} px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-50">
              <h2 className="font-black text-slate-800 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" /> Recent Activity
              </h2>
              <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
              {activities.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50/70 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.dot} group-hover:scale-125 transition-transform flex-shrink-0`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{item.text}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 flex items-center gap-1">
                        <Clock size={9} /> {item.sub}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl flex-shrink-0 ml-3">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-5">

            {/* Facility Bookings */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-50">
                <h2 className="font-black text-slate-800 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" /> Facility Bookings
                </h2>
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">Today</span>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { name: "Clubhouse Party", time: "04:00 PM", color: "bg-violet-50 text-violet-600" },
                  { name: "Tennis Court A", time: "06:00 PM", color: "bg-blue-50 text-blue-600" },
                ].map((b) => (
                  <div key={b.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-semibold text-slate-700">{b.name}</span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${b.color}`}>{b.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck size={20} className="text-white" />
                </div>
                <h2 className="font-black text-lg mb-1">Support Center</h2>
                <p className="text-xs text-blue-100 leading-relaxed mb-5">
                  Need help managing the society portal or facing technical issues?
                </p>
                <button className="w-full bg-white text-blue-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors active:scale-95">
                  Contact Support
                </button>
              </div>
              <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
            </div>
          </div>
        </div>

        {/* ════════════════ MODALS ════════════════ */}

        {/* MODAL 1: POST NOTICE */}
        {showNoticeModal && (
          <Modal onClose={() => setShowNoticeModal(false)}>
            <ModalHeader title="Post New Notice" subtitle="Admin Dashboard • Notice Board" onClose={() => setShowNoticeModal(false)} />
            <div className="p-8 space-y-5">
              <Field label="Notice Title">
                <input type="text" placeholder="e.g., Annual General Meeting" className="modal-input" />
              </Field>
              <Field label="Category">
                <SelectField options={["Maintenance", "Event", "General", "Emergency"]} />
              </Field>
              <Field label="Visibility Range" hint="Choose how long this notice remains active">
                <MiniCalendar />
              </Field>
              <Field label="Description">
                <textarea rows={4} placeholder="Enter detailed notice information..." className="modal-input resize-none" />
              </Field>
              <Field label="Attachments">
                <UploadBox icon={<Paperclip size={22} className="text-blue-500" />} label="Click to upload or drag and drop" hint="PDF, PNG, JPG (MAX. 10MB)" />
              </Field>
            </div>
            <ModalFooter>
              <button className="modal-btn-primary">Post Notice</button>
              <button onClick={() => setShowNoticeModal(false)} className="modal-btn-secondary">Save as Draft</button>
            </ModalFooter>
          </Modal>
        )}

        {/* MODAL 2: ADD RESIDENT */}
        {showResidentModal && (
          <Modal onClose={() => setShowResidentModal(false)} wide>
            <ModalHeader title="Add New Resident" subtitle="Society Directory Registration" onClose={() => setShowResidentModal(false)} />
            <div className="p-8 space-y-8">
              {/* Personal + Avatar */}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <SectionLabel icon={<User size={14} />} label="Personal Information" color="text-blue-600" />
                  <input type="text" placeholder="Full Name" className="modal-input" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="email" placeholder="Email Address" className="modal-input" />
                    <input type="text" placeholder="Mobile Number" className="modal-input" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[160px]">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-blue-200 bg-white flex items-center justify-center">
                      <Camera size={28} className="text-blue-200" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 bg-blue-600 p-1.5 rounded-xl text-white shadow-lg">
                      <Edit2 size={11} />
                    </button>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest">Photo</span>
                </div>
              </div>

              {/* Residence */}
              <div className="space-y-4">
                <SectionLabel icon={<Home size={14} />} label="Residence Details" color="text-emerald-600" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectField options={["Wing A", "Wing B", "Wing C"]} placeholder="Select Wing" />
                  <input type="text" placeholder="Flat Number" className="modal-input" />
                  <SelectField options={["Owner", "Tenant"]} />
                </div>
              </div>

              {/* Docs */}
              <div className="space-y-4">
                <SectionLabel icon={<ShieldCheck size={14} />} label="Verification Documents" color="text-violet-600" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UploadBox icon={<Upload size={18} className="text-blue-500" />} label="Identity Proof" />
                  <UploadBox icon={<ShieldCheck size={18} className="text-blue-500" />} label="Agreement" />
                </div>
              </div>
            </div>
            <ModalFooter>
              <button className="modal-btn-primary flex items-center gap-2"><UserPlus size={16} /> Add & Notify</button>
              <button onClick={() => setShowResidentModal(false)} className="modal-btn-secondary">Cancel</button>
            </ModalFooter>
          </Modal>
        )}

        {/* MODAL 3: MAINTENANCE CHARGE */}
        {showMaintenanceModal && (
          <Modal onClose={() => setShowMaintenanceModal(false)}>
            <ModalHeader title="Add Maintenance Charge" subtitle="Admin Dashboard • Maintenance" onClose={() => setShowMaintenanceModal(false)} />
            <div className="p-8 space-y-5">
              <Field label="Charge Title">
                <input type="text" placeholder="e.g., Feb 2026 Maintenance" className="modal-input" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Category">
                  <SelectField options={["Maintenance", "Electricity", "Water", "Other"]} />
                </Field>
                <Field label="Amount">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <input type="number" placeholder="0.00" className="modal-input pl-8" />
                  </div>
                </Field>
              </div>
              <Field label="Due Date" hint="Select the last date for payment">
                <MiniCalendar />
              </Field>
              <Field label="Description">
                <textarea rows={3} placeholder="Add any specific instructions..." className="modal-input resize-none" />
              </Field>
            </div>
            <ModalFooter>
              <button className="modal-btn-primary">Post Charge</button>
              <button onClick={() => setShowMaintenanceModal(false)} className="modal-btn-secondary">Cancel</button>
            </ModalFooter>
          </Modal>
        )}

        {/* MODAL 4: ADD FINE */}
        {showFineModal && (
          <Modal onClose={() => setShowFineModal(false)}>
            <ModalHeader title="Add Penalty / Fine" subtitle="Admin Dashboard • Penalty & Fines" accent="text-orange-600" onClose={() => setShowFineModal(false)} />
            <div className="p-8 space-y-5">
              <Field label="Fine Title">
                <input type="text" placeholder="e.g. Late Payment Fine" className="modal-input" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Category">
                  <SelectField options={["Fine", "Penalty", "Late Fee"]} />
                </Field>
                <Field label="Amount">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <input type="number" placeholder="0.00" className="modal-input pl-8" />
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Applied To">
                  <SelectField options={["Specific User", "All Residents"]} />
                </Field>
                <Field label="Select User">
                  <div className="relative">
                    <input type="text" placeholder="Search resident..." className="modal-input pr-10" />
                    <User size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </Field>
              </div>
              <Field label="Proof Image">
                <div className="flex items-center justify-between p-4 border border-dashed border-slate-200 bg-slate-50 rounded-2xl gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-100">
                      <ImageIcon className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{fineFileName}</p>
                      <p className="text-[11px] text-slate-400">Click to upload evidence</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-xs font-black text-blue-600 bg-white border border-blue-100 rounded-xl hover:bg-blue-50 transition-all whitespace-nowrap">
                    Upload File
                  </button>
                </div>
              </Field>
              <Field label="Description">
                <textarea rows={3} placeholder="Provide details about the penalty..." className="modal-input resize-none" />
              </Field>
            </div>
            <ModalFooter>
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-[11px] py-3.5 px-8 rounded-2xl shadow-lg shadow-orange-100 active:scale-95 transition-all">
                Post Fine
              </button>
              <button onClick={() => setShowFineModal(false)} className="modal-btn-secondary">Cancel</button>
            </ModalFooter>
          </Modal>
        )}

        {/* Shared Styles */}
        <style>{`
          .modal-input {
            width: 100%;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 12px 16px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.15s, background 0.15s;
            color: #334155;
          }
          .modal-input:focus { border-color: #3b82f6; background: #fff; }
          .modal-btn-primary {
            background: #2563eb;
            color: white;
            font-weight: 900;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            padding: 14px 32px;
            border-radius: 16px;
            box-shadow: 0 8px 24px -4px #bfdbfe;
            transition: all 0.15s;
          }
          .modal-btn-primary:hover { background: #1d4ed8; }
          .modal-btn-primary:active { transform: scale(0.97); }
          .modal-btn-secondary {
            background: white;
            color: #64748b;
            font-weight: 900;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            padding: 14px 32px;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            transition: all 0.15s;
          }
          .modal-btn-secondary:hover { background: #f8fafc; }
          .modal-btn-secondary:active { transform: scale(0.97); }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

/* ── Shared Modal Components ── */

const Modal = ({ children, onClose, wide }: any) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
    <div className={`relative bg-white w-full ${wide ? "max-w-3xl" : "max-w-2xl"} max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-100`}>
      {children}
    </div>
  </div>
);

const ModalHeader = ({ title, subtitle, accent = "text-blue-600", onClose }: any) => (
  <div className="sticky top-0 bg-white/95 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex justify-between items-center z-10">
    <div>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${accent}`}>{subtitle}</p>
      <h1 className="text-xl font-black text-slate-800 tracking-tight">{title}</h1>
    </div>
    <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"><X size={20} /></button>
  </div>
);

const ModalFooter = ({ children }: any) => (
  <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-8 py-6 border-t border-slate-100 flex flex-wrap gap-3 justify-end">
    {children}
  </div>
);

const Field = ({ label, hint, children }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{label}</label>
    {hint && <p className="text-[11px] text-slate-400 -mt-1">{hint}</p>}
    {children}
  </div>
);

const SelectField = ({ options, placeholder }: any) => (
  <div className="relative">
    <select className="modal-input appearance-none pr-10 cursor-pointer">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o: string) => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

const SectionLabel = ({ icon, label, color }: any) => (
  <div className={`flex items-center gap-2 ${color} text-[10px] font-black uppercase tracking-widest border-b border-slate-100 pb-2`}>
    {icon} {label}
  </div>
);

const UploadBox = ({ icon, label, hint }: any) => (
  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer group gap-2">
    <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-xs font-bold text-slate-600 text-center">{label}</p>
    {hint && <p className="text-[10px] text-slate-400 uppercase font-black text-center">{hint}</p>}
  </div>
);

const MiniCalendar = () => {
  const [selected, setSelected] = useState(10);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
      <div className="flex justify-between items-center mb-4">
        <button className="p-1.5 hover:bg-white rounded-lg transition-colors"><ChevronLeft size={16} className="text-slate-400" /></button>
        <span className="text-sm font-black text-slate-700">October 2023</span>
        <button className="p-1.5 hover:bg-white rounded-lg transition-colors"><ChevronRight size={16} className="text-slate-400" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['S','M','T','W','T','F','S'].map(d => (
          <span key={d} className="text-[10px] font-black text-slate-300 pb-2">{d}</span>
        ))}
        {days.map(n => (
          <button key={n} onClick={() => setSelected(n)}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all
              ${selected === n ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 hover:bg-white'}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;