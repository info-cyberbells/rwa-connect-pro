import React from 'react';
import { 
  Bell, 
  Wallet, 
  Megaphone, 
  CheckCircle, 
  Clock, 
  Wrench, 
  Upload, 
  ChevronRight,
  User
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// --- Reusable Sub-components ---

const StatCard = ({ icon: Icon, color, value, label }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`${color} p-4 rounded-xl`}>
      <Icon className="w-6 h-6 text-current" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  </div>
);

const Badge = ({ children, status }) => {
  const styles = {
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    meeting: "bg-blue-50 text-blue-600 border-blue-100",
    maintenance: "bg-purple-50 text-purple-600 border-purple-100"
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {children}
    </span>
  );
};

const DuesItem = ({ title, date, amount, status }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
    <div className="flex items-center space-x-4">
      <div className={`p-2 rounded-full ${status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
        {status === 'paid' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
      </div>
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500">Due: {date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-gray-800">₹{amount}</p>
      <Badge status={status}>{status}</Badge>
    </div>
  </div>
);

const NoticeCard = ({ title, date, location, category }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${category === 'meeting' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
        {category === 'meeting' ? <Megaphone className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
      </div>
      <Badge status={category}>{category}</Badge>
    </div>
    <h4 className="font-bold text-gray-800 mb-1 leading-tight">{title}</h4>
    <p className="text-xs text-gray-500 leading-relaxed">
      Scheduled for {date} {location ? `at the ${location}` : ''}
    </p>
  </div>
);


export default function MemberDashboard() {
  return (
    <DashboardLayout role='member'>
    <div className="min-h-screen text-gray-900">
      
      {/* Container */}
      <div className="max-w-6xl">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome, John!
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Flat A-204 • Green Valley Apartments
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2.5 rounded-full transition-all border bg-white border-gray-200 text-gray-600 hover:bg-gray-50 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
               <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                  <User className="w-5 h-5" />
               </div>
            </div>
          </div>
        </header>

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <StatCard 
            icon={Wallet} 
            color="bg-orange-100 text-orange-600" 
            value="₹7,500" 
            label="Pending Dues" 
          />
          <StatCard 
            icon={Bell} 
            color="bg-blue-100 text-blue-600" 
            value="3" 
            label="New Notices" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Payment Dues */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-gray-800">Payment Dues</h2>
              <button className="flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Proof</span>
              </button>
            </div>
            
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <DuesItem 
                title="Maintenance" 
                date="Dec 10, 2024" 
                amount="5,500" 
                status="pending" 
              />
              <DuesItem 
                title="Club Membership" 
                date="Dec 15, 2024" 
                amount="2,000" 
                status="pending" 
              />
              <DuesItem 
                title="Parking Fee" 
                date="Dec 10, 2024" 
                amount="500" 
                status="paid" 
              />
            </div>
          </div>

          {/* Right: Recent Notices */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-gray-800">Recent Notices</h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <NoticeCard 
                category="meeting"
                title="Annual General Meeting"
                date="Jan 15, 2025"
                location="Clubhouse"
              />
              <NoticeCard 
                category="maintenance"
                title="Water Supply Maintenance"
                date="Dec 20, 10 AM - 4 PM"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}