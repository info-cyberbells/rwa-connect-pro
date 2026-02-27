import React, { useState } from 'react';
import { Search, Bell, Moon, Clock, Info, ShieldAlert, ArrowLeft, User, Phone, CheckCircle2 } from 'lucide-react';

// Sample Data
const noticesData = [
  {
    id: 1,
    type: 'URGENT',
    title: 'Water Maintenance - Block B',
    date: 'Oct 24 • 10:30 AM',
    description: 'Emergency water supply suspension for 4 hours starting 2:00 PM today due to a major pipe burst in the main basement line connecting the overhead tank.',
    status: 'Action Required',
    image: 'https://images.unsplash.com/photo-1517646288273-96e956f6a5c1?auto=format&fit=crop&q=80&w=600',
    color: 'bg-[#FF4D4D]'
  },
  {
    id: 2,
    type: 'EVENT',
    title: 'Annual Summer BBQ Party',
    date: 'Oct 22 • 09:00 AM',
    description: 'Get ready for the biggest event of the season! Join us at the Clubhouse for unlimited food, live music, and fun activities for children.',
    status: 'Social',
    image: 'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&q=80&w=600',
    color: 'bg-[#4D88FF]'
  }
];

const SocietyNotices = () => {
  const [view, setView] = useState('list'); 
  const [selectedNotice, setSelectedNotice] = useState(noticesData[0]); 

  // Detail View Component
  const DetailView = ({ notice }) => (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
      <button 
        onClick={() => setView('list')}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition mb-6 font-semibold"
      >
        <ArrowLeft size={20} /> Back to All Notices
      </button>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-64 bg-slate-200">
          <img src={notice.image} className="w-full h-full object-cover" alt="banner" />
        </div>
        
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <span className={`${notice.color} text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider`}>
              {notice.type}
            </span>
            <span className="text-slate-400 text-sm">{notice.date}</span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-6">{notice.title}</h1>
          
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-10">
            <p className="font-bold text-slate-800">Dear Residents,</p>
            <p>{notice.description}</p>
          </div>

          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-10">
             <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
               <Info size={18} /> Important Instructions:
             </h4>
             <p className="text-blue-700 text-sm">Please follow the guidelines mentioned above. For any queries, contact the admin office.</p>
          </div>

          <button className="w-full bg-[#4D88FF] text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-600 transition flex items-center justify-center gap-2">
            <CheckCircle2 size={22} /> Acknowledge Notice
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B]">Society Notices</h1>
          <p className="text-[#64748B] text-sm">Community Updates & Alerts</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100"><Moon size={20} /></button>
          <button className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100"><Bell size={20} /></button>
        </div>
      </header>

      {/* Tabs / Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex gap-2 overflow-x-auto">
          {['All', 'General', 'Events', 'Urgent'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setView('list')}
              className={`px-6 py-2.5 rounded-2xl text-[14px] font-semibold transition-all ${
                view === 'list' && tab === 'All' ? 'bg-[#4D88FF] text-white' : 'bg-white text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
          
          {/* NOTICE DETAILS TAB */}
          <button 
            onClick={() => setView('detail')}
            className={`px-6 py-2.5 rounded-2xl text-[14px] font-semibold transition-all shadow-sm ${
              view === 'detail' ? 'bg-[#4D88FF] text-white shadow-blue-200' : 'bg-white text-slate-500 border border-slate-100'
            }`}
          >
            NoticeDetails
          </button>
        </div>
      </div>

      {/* Conditional Rendering: List or Detail */}
      {view === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
          {noticesData.map((notice) => (
            <div key={notice.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 flex flex-col">
              {notice.image && <img src={notice.image} className="h-56 w-full object-cover" />}
              <div className="p-8 flex-1 flex flex-col">
                <span className={`w-fit px-3 py-1 text-[10px] font-bold rounded-md text-white mb-4 ${notice.color}`}>{notice.type}</span>
                <h3 className="text-[22px] font-bold text-[#1E293B] mb-4">{notice.title}</h3>
                <p className="text-[#64748B] text-[15px] mb-8 line-clamp-2">{notice.description}</p>
                <button 
                  onClick={() => { setSelectedNotice(notice); setView('detail'); }}
                  className="mt-auto bg-[#4D88FF] text-white px-7 py-3 rounded-xl font-bold self-end"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DetailView notice={selectedNotice} />
      )}
    </div>
  );
};

export default SocietyNotices;