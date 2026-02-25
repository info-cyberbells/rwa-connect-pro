import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  LifeBuoy, 
  User, 
  Plus, 
  Moon, 
  Bell, 
  ChevronRight, 
  X, 
  Upload,
  Droplets,
  Zap,
  Volume2,
  Settings,
  CheckCircle2,
  Ticket,
  ClipboardList
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Mock Data
const INITIAL_TICKETS = [
  { id: 'HD-892', title: 'Leaking pipe in Block A', date: 'Oct 24, 2023', status: 'PENDING', type: 'plumbing' },
  { id: 'HD-885', title: 'Elevator 2 not working', date: 'Oct 23, 2023', status: 'IN-PROGRESS', type: 'utility' },
  { id: 'HD-881', title: 'Noise complaint - Flat B-102', date: 'Oct 22, 2023', status: 'PENDING', type: 'noise' },
];

const RESOLVED_TICKETS = [
  { id: 'HD-850', title: 'Street light flickering', date: 'Oct 20, 2023', status: 'RESOLVED', type: 'utility' },
];

const recent_RESOLVED_TICKETS = [
  { 
    id: 'HD-850', 
    title: 'Street light flickering', 
    date: 'Oct 20, 2023', 
    status: 'RESOLVED', 
    type: 'utility' 
  }
];

const ResidentialSupport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [attachment, setAttachment] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    category: 'Plumbing',
    subject: '',
    description: '',
    priority: 'Medium'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 10MB validation
    if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
    }

    setAttachment({
        file,
        preview: URL.createObjectURL(file),
    });
    };

  const setPriority = (val) => setFormData(prev => ({ ...prev, priority: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('--- Submitting Ticket Data ---');
    console.log('Ticket Data:', formData);
    
    setFormData({
      category: 'Plumbing',
      subject: '',
      description: '',
      priority: 'Medium'
    });
    setIsModalOpen(false);
    
    // Custom simulated notification
    console.log("Success: Ticket submitted successfully!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]';
      case 'IN-PROGRESS': return 'bg-[#EFF6FF] text-[#3B82F6] border-[#DBEAFE]';
      case 'RESOLVED': return 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'plumbing': return <Droplets className="text-blue-500" size={18} />;
      case 'utility': return <Zap className="text-amber-500" size={18} />;
      case 'noise': return <Volume2 className="text-indigo-500" size={18} />;
      default: return <Settings className="text-slate-500" size={18} />;
    }
  };

  return (
    <DashboardLayout role="residential-admin">
    <div className="min-h-screen text-[#0F172A]">

      {/* Content Area */}
<main className="absolute top-[100px] left-0 right-0 max-w-5xl mx-auto space-y-5">       
  <div className='flex justify-between items-center'>
        <div>
          <h2 className="text-3xl font-bold  text-[#0F172A] tracking-normal">Help Desk & Support</h2>
          <p className="text-[#64748B] text-base font-medium mt-1">Manage your requests and society assistance</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0D6CF2] hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all "
                      >
            <Plus size={18} />
            <span className="hidden sm:inline">New Ticket</span>
          </button>
          </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Ticket className="text-[#3B82F6]" size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#0F172A] tracking-tight">3</h3>
              <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wide mt-1">Active Tickets</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="text-[#059669]" size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-bold text-slate-800 tracking-normal">12</h3>
              <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wide mt-1">Resolved Tickets</p>
            </div>
          </div>
        </div>

        {/* Tickets Table Section */}
        <div className="bg-white rounded-3xl border border-[#F1F5F9] shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="p-5 border-b bg-[#F8FAFC]/50 border-slate-50 ">
            <div className="bg-[#E2E8F0]/80 p-1.5 rounded-2xl w-full sm:w-fit flex">
              <button 
                onClick={() => setActiveTab('active')}
                className={`flex px-8 sm:px-12 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'active' ? 'bg-white text-[#3B82F6] shadow-sm' : 'text-[#64748B] hover:text-slate-700'}`}
              >
                Active
              </button>
              <button 
                onClick={() => setActiveTab('resolved')}
                className={`flex-1 sm:px-12 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'resolved' ? 'bg-white text-[#0D6CF2] shadow-sm' : 'text-[#64748B] hover:text-slate-700'}`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Ticket List */}
          <div className="divide-y divide-slate-50">
            {(activeTab === 'active' ? INITIAL_TICKETS : RESOLVED_TICKETS).map((ticket) => (
              <div key={ticket.id} className="group p-5 flex items-center gap-5 hover:bg-slate-50/80 transition-all cursor-pointer">
                <div className="w-6 sm:w-14 h-6 sm:h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover:scale-105">
                  {getTypeIcon(ticket.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#0F172A] text-md truncate tracking-wide leading-tight">{ticket.title}</h4>
                    <div className="grid grid-cols-1 gap-1 sm:flex sm:items-center sm:gap-2.5 text-xs text-[#64748B] mt-1.5 tracking-wide font-medium">
                    <span className=" py-0.5 rounded text-[#64748B] font-semibold uppercase">Ticket#{ticket.id}</span>
                    <span className="w-2 h-2 hidden sm:block bg-slate-300 rounded-full"></span>
                    <span>{ticket.date}</span>
                  </div>
                </div>
                <div className="flex items-center sm:gap-4">
                  <span className={`px-4 py-1.5 rounded-md text-[8px] sm:text-xs font-black border tracking-wider ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pb-12 pt-4">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Recently Handled</h3>
              <button className="text-[#3B82F6] text-xs font-semibold tracking-wide hover:underline underline-offset-4 decoration-2">View History</button>
            </div>
            
            <div className='space-y-2'>
            {recent_RESOLVED_TICKETS.length === 0 ? (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <ClipboardList className="text-slate-400" size={22} />
                </div>

                <h4 className="font-bold text-slate-700 tracking-wide">
                    No Resolved Tickets
                </h4>

                <p className="text-sm text-slate-400 font-medium">
                    There are no recently resolved maintenance requests.
                </p>
                </div>
            </div>
            ) : (
                recent_RESOLVED_TICKETS.map((ticket) => (
                    <div
                    key={ticket.id}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5"
                    >
                {/* Left Icon */}
                <div className="w-6 sm:w-12 h-6 sm:h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                    {getTypeIcon(ticket.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h4 className="font-bold tracking-wide text-[#0F172A]">
                    {ticket.title}
                    </h4>
                    <p className="text-xs text-[#64748B] tracking-wide mt-1 font-medium">
                    Completed on {ticket.date}
                    </p>
                </div>

                {/* Status */}
                <div className="flex items-center sm:gap-4">
                    <span className="px-4 py-1.5 rounded-md text-[8px] sm:text-xs font-black border bg-green-50 text-[#059669] border-green-100 tracking-wider">
                    {ticket.status}
                    </span>

                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#059669]">
                    <CheckCircle2 size={20} />
                    </div>
                </div>
                </div>
            ))
            )}
            </div>
        </div>
      </main>

      {/* CREATE TICKET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-[#e7e9ec] w-full max-w-lg rounded-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
            {/* Modal Header - Fixed */}
            <div className="px-8 pt-4 pb-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-semibold tracking-normal text-slate-800">Create New Ticket</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-5 overflow-y-auto scrollbar-hide flex-1">
              
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-[#334155]">Category</label>
                <div className="relative">
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 appearance-none text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Security</option>
                    <option>Cleaning</option>
                    <option>Other</option>
                  </select>
                  <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold tracking-wide text-[#334155]">Subject</label>
                <input 
                  type="text"
                  name="subject"
                  required
                  placeholder="What's the issue?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold tracking-wide text-[#334155]">Description</label>
                <textarea 
                  name="description"
                  required
                  placeholder="Provide more details about the problem..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none min-h-[100px]"
                />
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold tracking-wide text-[#334155]">Priority</label>
                <div className="bg-[#F1F5F9] p-1 rounded-lg flex border border-slate-100">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 uppercase text-xs tracking-widest rounded-md transition-all ${
                        formData.priority === p 
                          ? 'bg-[#3B82F6] text-white font-medium shadow-lg shadow-blue-100' 
                          : 'text-[#64748B] font-normal hover:text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload */}
            <div className="space-y-1.5">
            <label className="text-sm font-semibold tracking-wide text-[#334155]">
                Photos / Attachments
            </label>

            {!attachment && (
                <label className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer group">

                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                </div>

                <p className="mt-5 text-sm font-black text-slate-700">
                    Upload Media
                </p>

                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-[0.1em]">
                    PNG, JPG up to 10MB
                </p>
                </label>
            )}

            {attachment && (
                <div className="mt-4 relative w-32">
                <img
                    src={attachment.preview}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-2xl border border-slate-200"
                />

                <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition"
                >
                    <X size={14} />
                </button>
                </div>
            )}
            </div>

              {/* Submit - Action Buttons */}
              <div className="flex gap-4 pt-4 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-[1.5] py-3.5 bg-[#3B82F6] hover:bg-blue-700 text-white text-xs font-black tracking-widest rounded-lg shadow-xl shadow-blue-100 transition-all active:scale-95"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default ResidentialSupport;