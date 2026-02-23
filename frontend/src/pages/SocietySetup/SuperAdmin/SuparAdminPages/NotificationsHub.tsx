import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle, Building2, 
  CheckCheck, Trash2 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const NotificationsHub = () => {
  const [activeTab, setActiveTab] = useState('All Notifications');

  const notifications = [
    {
      type: 'alert',
      title: 'High Database Load Detected',
      description: 'System performance might be impacted due to a sudden surge in traffic from the Northern region hubs.',
      time: '2 mins ago',
      label: 'System Alert',
      colors: 'bg-orange-50 text-orange-500 border-orange-100'
    },
    {
      type: 'request',
      title: 'New Society Registration Request',
      description: "'Sunset Boulevard Residency' has submitted a new onboarding request for 350 units.",
      time: '15 mins ago',
      label: 'Society Request',
      colors: 'bg-blue-50 text-blue-500 border-blue-100'
    },
    {
      type: 'payment',
      title: 'Monthly Revenue Milestone',
      description: 'Congratulations! SocietyHub has reached the ₹2.5M revenue milestone for this month.',
      time: '2 hours ago',
      label: 'Payments',
      colors: 'bg-green-50 text-green-500 border-green-100'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content*/}
      <main className="md:ml-64 w-full md:w-auto p-4 md:p-8 lg:p-12 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pt-12 md:pt-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 block">
                Notifications <span className='text-blue-600'>Hub</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage and track all system activities and requests.
              </p>
            </div>
            
            <div className="flex gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <button className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap">
                <CheckCheck size={16} /> Mark all
              </button>
              <button className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-red-500 hover:text-red-600 transition-colors whitespace-nowrap">
                <Trash2 size={16} /> Clear all
              </button>
            </div>
          </header>

          <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-4 md:px-6 overflow-x-auto no-scrollbar bg-white sticky top-0 z-10">
              {['All Notifications', 'System Alerts', 'Society Requests', 'Payments'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 md:py-5 px-3 md:px-4 text-xs md:text-sm font-semibold transition-all border-b-2 whitespace-nowrap -mb-[1px] ${
                    activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="divide-y divide-slate-50">
              {notifications.map((note, idx) => (
                <div key={idx} className="p-4 md:p-6 flex flex-col sm:flex-row gap-3 md:gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between sm:block">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${note.colors.split(' ')[0]} ${note.colors.split(' ')[1]}`}>
                      {note.type === 'alert' && <AlertTriangle size={20} />}
                      {note.type === 'request' && <Building2 size={20} />}
                      {note.type === 'payment' && <CheckCircle size={20} />}
                    </div>
                    <span className="text-[10px] text-slate-400 sm:hidden">{note.time}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900 text-sm md:text-base">{note.title}</h3>
                      <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap ml-2">{note.time}</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
                      {note.description}
                    </p>
                    <span className={`inline-block mt-3 px-2 py-1 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${note.colors.split(' ')[2]} ${note.colors.split(' ')[1]}`}>
                      {note.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 text-center border-t border-slate-50 bg-slate-50/30">
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Load older notifications
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsHub; 