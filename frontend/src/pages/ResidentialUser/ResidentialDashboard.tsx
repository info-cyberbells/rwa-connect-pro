import React from 'react';
import { Wallet, Bell, Megaphone, Wrench, CheckCircle, Clock, Upload, Moon } from 'lucide-react';

const ResidentialDashboard: React.FC = () => {
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
          <h1 className="text-2xl font-bold">Welcome back, John!</h1>
          <p className="text-slate-500 text-sm">Flat A-204 • Greenwood Heights</p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Payment Dues Section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Payment Dues</h3>
            <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              <Upload size={16} /> Upload Proof
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
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

        {/* Notices Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Recent Notices</h3>
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
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
    </div>
  );
};

export default ResidentialDashboard;