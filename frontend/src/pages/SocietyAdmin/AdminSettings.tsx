import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Camera, 
  MapPin, 
  Clock, 
  Smartphone, 
  Laptop, 
  Eye, 
  EyeOff,
  LogOut,
  Mail,
  MessageSquare,
  AlertTriangle,
  FileText,
  ChevronDown,
  ExternalLink,
  MessageSquareMore,
  BellRing,
  WrenchIcon,
  Wrench,
  Megaphone,
  LucideShieldCheck,
  Edit3,
  Edit2,
  History
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  
  // --- Account State ---
  const [accountData, setAccountData] = useState({
    fullName: 'Alex Johnson',
    officialDesignation: 'Chief Administrator',
    email: 'alex.j@societyconnect.com',
    phone: '+1 (555) 000-1234',
    societyContact: 'Society Front Desk',
    officeHoursStart: '09:00 AM',
    officeHoursEnd: '06:00 PM',
    visitorManagement: true
  });

  const loginData = [
  {
    status: "SUCCESS",
    statusColor: "green",
    device: "Chrome on MacOS",
    deviceSub: "System v14.2.1",
    icon: "laptop",
    location: "San Francisco, US",
    ip: "192.168.1.1",
    time: "Today, 2:45 PM",
  },
  {
    status: "SUCCESS",
    statusColor: "green",
    device: "Safari on iPhone 15",
    deviceSub: "Mobile Web",
    icon: "mobile",
    location: "San Francisco, US",
    ip: "172.56.21.8",
    time: "Yesterday, 9:12 AM",
  },
  {
    status: "FAILED",
    statusColor: "red",
    device: "Unknown Device",
    deviceSub: "Firefox Browser",
    icon: "unknown",
    location: "London, UK",
    ip: "45.12.89.201",
    time: "Oct 24, 11:30 PM",
  },
];

  // --- Security State ---
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // --- Notifications State ---
  const [notifications, setNotifications] = useState({
    maintenance: { email: true, sms: false, push: true },
    visitor: { email: false, sms: true, push: true },
    complaint: { email: true, sms: false, push: true },
    emergency: { email: true, sms: true, push: true },
    quietHours: { start: '10:00 PM', end: '06:00 AM', applyAll: true }
  });

  const handleAccountChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleNotification = (category, type) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

  // Sidebar Items
  const navItems = [
    { id: 'account', label: 'Account Information', icon: User, desc: 'Configure your personal and society preferences.' },
    { id: 'security', label: 'Security & Access', icon: LucideShieldCheck, desc: 'Manage security and access controls.' },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell, desc: 'Manage system-wide alerts and communication.' }
  ];

  const currentNav = navItems.find(item => item.id === activeTab);

  // --- Sub-components ---

const Toggle = ({ active, onToggle, critical = false }) => (
  <button 
    onClick={onToggle}
    className={`w-10 h-5 rounded-full relative transition-all duration-200 ${
      active 
        ? (critical ? 'bg-blue-400' : 'bg-[#0D6CF2]') 
        : 'bg-slate-200'
    }`}
  >
    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 shadow-sm ${
      active ? 'left-6' : 'left-1'
    }`} />
  </button>
);

const NotificationCard = ({ title, desc, icon: Icon, iconBg, iconColor, isCritical = false, settings, onToggle }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
    <div className="flex items-start gap-3 mb-6">
      <div className={`p-2 ${iconBg} ${iconColor} rounded-lg`}>
        <Icon size={18} />
      </div>
      <div>
        <h4 className="text-base font-semibold tracking-normal text-[#0F172A]">{title}</h4>
        <p className="text-[12px] text-[#64748B] leading-tight">{desc}</p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className={`flex items-center justify-between p-2 rounded-xl transition-colors ${isCritical && settings.email ? 'bg-[#FEE2E2]/50 border border-[#FEE2E2]/50' : 'bg-[#F8FAFC]'}`}>
        <div className="flex items-center gap-2">
          <Mail size={14} className={isCritical ? 'text-[#EF4444]' : 'text-slate-400'} />
          <span className={`text-xs font-semibold ${isCritical ? 'text-[#B91C1C]' : 'text-slate-700'}`}>{isCritical ? 'Critical Email' : 'Email Notifications'}</span>
        </div>
        <Toggle active={settings.email} onToggle={() => onToggle('email')} critical={isCritical} />
      </div>
      
      <div className={`flex items-center justify-between p-2 rounded-xl transition-colors ${isCritical && settings.sms ? 'bg-[#FEE2E2]/50 border border-[#FEE2E2]/50' : 'bg-[#F8FAFC]'}`}>
        <div className="flex items-center gap-2">
          <MessageSquareMore size={14} className={isCritical ? 'text-[#EF4444]' : 'text-slate-400'} />
          <span className={`text-xs font-semibold ${isCritical ? 'text-[#B91C1C]' : 'text-slate-700'}`}>{isCritical ? 'Critical SMS' : 'SMS Alerts'}</span>
        </div>
        <Toggle active={settings.sms} onToggle={() => onToggle('sms')} critical={isCritical} />
      </div>
      
      <div className={`flex items-center justify-between p-2 rounded-xl  transition-colors ${isCritical && settings.push ? 'bg-[#FEE2E2]/50 border border-[#FEE2E2]/50' : 'bg-[#F8FAFC]'}`}>
        <div className="flex items-center gap-2">
          <BellRing size={14} className={isCritical ? 'text-[#EF4444]' : 'text-slate-400'} />
          <span className={`text-xs font-semibold ${isCritical ? 'text-[#B91C1C]' : 'text-[#0F172A]'}`}>{isCritical ? 'Forced Push' : 'Push Notifications'}</span>
        </div>
        <Toggle active={settings.push} onToggle={() => onToggle('push')} critical={isCritical} />
      </div>
    </div>
  </div>
);

  return (
    <DashboardLayout role="society-admin">
    <div className="min-h-screen text-[#0F172A] pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-normal text-[#0F172A]">Settings</h1>
            <p className="text-sm text-[#64748B] mt-1">{currentNav.desc}</p>
          </div>

          <nav className="space-y-2 ">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-3xl transition-all duration-200 text-sm font-medium ${
                  activeTab === item.id 
                    ? 'bg-[#0D6CF2] text-white shadow-lg shadow-blue-200' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} className={`${activeTab === item.id ? '' : 'text-[#0D6CF2]'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Support Widget */}
          <div className="mt-8 bg-gradient-to-br from-[#0D6CF2]/5  to-[#E0F2FE]/3 p-5 rounded-2xl border border-blue-50">
            <h3 className="text-sm uppercase tracking-wider font-semibold text-[#0D6CF2] mb-2">
              {activeTab === 'security' ? 'Security Tip' : activeTab === 'notifications' ? 'Need Help?' : 'Support'}
            </h3>
            <p className="text-xs text-[#475569] leading-relaxed mb-4">
              {activeTab === 'security' 
                ? 'Rotate your passwords every 90 days to maintain high security.' 
                : activeTab === 'notifications'
                ? 'Our support team can help you configure broadcast rules.'
                : 'Need help with society configuration?'}
            </p>
            <button className="w-full bg-white py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm">
              {activeTab === 'notifications' ? 'Documentation' : 'Contact Specialist'}
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-grow space-y-6">
          
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#0D6CF2]/10 flex flex-col md:flex-row gap-6 items-start">
                <div className="relative ">
                  <div className="w-24 h-24 bg-[#E8C0A0] rounded-2xl overflow-hidden">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-slate-700/30 opacity-60 translate-y-2">
                      <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-[#1D6AEE] text-white p-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-2 ">
                    <h2 className="text-xl font-medium text-[#0F172A]">Alex Johnson</h2>
                   </div>
                  <p className="text-sm text-[#64748B]">Chief Administrator • ID: #SOC-9921</p>
                  <div className='flex gap-6 mt-3'>
                      <span className="px-3 py-1 bg-blue-50 text-[#1D6AEE] text-xs font-bold rounded-md">Full Access</span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md">Verified</span>
                 
                  </div>
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#0D6CF2]/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={accountData.fullName}
                      onChange={handleAccountChange}
                      placeholder='Alex Jhonson'
                      className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Official Designation</label>
                    <input 
                      type="text" 
                      name="officialDesignation"
                      value={accountData.officialDesignation}
                      onChange={handleAccountChange}
                      placeholder='Cheif Administrator'
                      className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={accountData.email}
                      onChange={handleAccountChange}
                      placeholder='alex.j@societyconnect.com'
                      className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={accountData.phone}
                      onChange={handleAccountChange}
                      placeholder='+1 (555) 000-1234'
                      className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Society Details Card */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#0D6CF2]/10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-50 text-[#1D6AEE] rounded-lg">
                    <MapPin size={20} />
                  </div>
                  <h3 className="font-semibold text-lg tracking-normal text-[#0F172A]">Society Details</h3>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-grow space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-semibold text-[#64748B] tracking-wider">Main Society Contact</label>
                      <input 
                        type="text" 
                        name="societyContact"
                        value={accountData.societyContact}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-semibold text-[#64748B] tracking-wider">Office Hours</label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-grow">
                          <input type="text" value={accountData.officeHoursStart} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm" readOnly />
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <span className="text-[#64748B] text-xs uppercase font-bold">to</span>
                        <div className="relative flex-grow">
                          <input type="text" value={accountData.officeHoursEnd} className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm" readOnly />
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-72 bg-slate-50 p-6 rounded-2xl relative overflow-hidden border border-slate-100">
                    <div className="absolute top-4 right-4 text-blue-100">
                      <FileText size={48} />
                    </div>
                    <h4 className="text-xs uppercase font-semibold text-[#64748B] tracking-wider mb-3">Registered Address</h4>
                    <p className="text-sm text-[#0F172A]  leading-relaxed pr-8">
                      124 Green Valley Heights, Phase 4, Silicon District, California, 94043
                    </p>
                    <button className="mt-4 flex items-center gap-2 text-[#0D6CF2] text-xs font-bold hover:underline">
                      Edit Address <Edit2 size={14} className="" />
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold tracking-normal text-[#0F172A]">Visitor Management</h4>
                    <p className="text-xs text-[#64748B]">Auto-approve frequent visitors</p>
                  </div>
                  <Toggle active={accountData.visitorManagement} onToggle={() => handleAccountChange({ target: { name: 'visitorManagement', checked: !accountData.visitorManagement, type: 'checkbox' } })} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password Management */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-50 text-[#1D6AEE] rounded-full">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-semibold text-lg tracking-normal">Password Management</h3>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 ">
                    <label className="text-xs uppercase font-bold text-[#64748B] tracking-wider">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData(prev => ({...prev, currentPassword: e.target.value}))}
                        placeholder='••••••••••••••'
                        className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] focus:border-blue-400 outline-none text-sm"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#64748B] tracking-wider">New Password</label>
                      <input 
                        type="password" 
                        placeholder="At least 8 characters"
                        className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] focus:border-blue-400 outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-[#64748B] tracking-wider">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="Repeat new password"
                        className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] focus:border-blue-400 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-medium">
                    <div className="w-3 h-3 rounded-full border border-green-600 flex items-center justify-center">
                      <span className="text-[8px]">✓</span>
                    </div>
                    Strong password: Include numbers, symbols, and uppercase letters.
                  </div>
                </div>
              </div>

              {/* Login History */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-[#1D6AEE] rounded-lg">
                      <History size={20} />
                    </div>
                    <h3 className="font-semibold tracking-normal ">Login History</h3>
                  </div>
                  <button className="text-[#0D6CF2] text-sm font-bold flex items-center gap-1 hover:underline">
                    Export Log 
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs uppercase font-bold text-[#64748B] tracking-wider border-b border-slate-50">
                        <th className="pb-4 px-2">Status</th>
                        <th className="pb-4 px-2">Device & Browser</th>
                        <th className="pb-4 px-2">Location</th>
                        <th className="pb-4 px-2">IP Address</th>
                        <th className="pb-4 px-2 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                    {loginData.map((item, index) => (
                        <tr key={index} className="border-b border-slate-50">
                        
                        {/* Status */}
                        <td className="py-4 px-2">
                            <span
                            className={`px-2 py-1 rounded text-[9px] font-bold ${
                                item.statusColor === "green"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500 uppercase"
                            }`}
                            >
                            {item.status}
                            </span>
                        </td>

                        {/* Device */}
                        <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                            
                            {item.icon === "laptop" && (
                                <Laptop size={16} className="text-slate-400" />
                            )}
                            {item.icon === "mobile" && (
                                <Smartphone size={16} className="text-slate-400" />
                            )}
                            {item.icon === "unknown" && (
                                <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            )}

                            <div>
                                <p className="font-bold text-[#0F172A]">{item.device}</p>
                                <p className="text-[10px] text-slate-400">
                                {item.deviceSub}
                                </p>
                            </div>
                            </div>
                        </td>

                        {/* Location */}
                        <td className="py-4 px-2 text-sm ">
                            {item.location}
                        </td>

                        {/* IP */}
                        <td className="py-4 px-2 text-slate-600 font-mono">
                            {item.ip}
                        </td>

                        {/* Time */}
                        <td className="py-4 px-2 text-right">
                            {item.time}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-medium text-[#0F172A]">Communication Channels</h2>
                  <p className="text-sm text-[#64748B]">Enable or disable notification types across categories.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-1.5 bg-[#0D6CF2]/10 text-[#0D6CF2] text-sm font-bold rounded-xl hover:bg-blue-100 transition-colors">Enable All</button>
                  <button className="px-4 py-1.5 bg-slate-100 text-[#64748B] text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors">Reset Defaults</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NotificationCard 
                  title="Maintenance Alerts" 
                  desc="Service requests and utility updates." 
                  icon={Wrench} 
                  iconBg="bg-blue-50" 
                  iconColor="text-[#1D6AEE]"
                  settings={notifications.maintenance}
                  onToggle={(type) => toggleNotification('maintenance', type)}
                />
                <NotificationCard 
                  title="Visitor Notifications" 
                  desc="Gate entries and guest approvals." 
                  icon={User} 
                  iconBg="bg-green-50" 
                  iconColor="text-green-500"
                  settings={notifications.visitor}
                  onToggle={(type) => toggleNotification('visitor', type)}
                />
                <NotificationCard 
                  title="Complaint Updates" 
                  desc="Ticket status and resolution news." 
                  icon={MessageSquare} 
                  iconBg="bg-orange-50" 
                  iconColor="text-orange-400"
                  settings={notifications.complaint}
                  onToggle={(type) => toggleNotification('complaint', type)}
                />
                <NotificationCard 
                  title="Emergency Broadcasts" 
                  desc="Urgent safety and security alerts." 
                  icon={Megaphone} 
                  iconBg="bg-red-50" 
                  iconColor="text-[#DC2626]"
                  isCritical
                  settings={notifications.emergency}
                  onToggle={(type) => toggleNotification('emergency', type)}
                />
              </div>

              {/* Quiet Hours Card */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className=" text-[#0D6CF2] rounded-lg">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-bold tracking-normal">Quiet Hours Schedule</h3>
                </div>

                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Start Time</label>
                      <div className="relative">
                        <select className="w-full appearance-none bg-[#F8FAFC] px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-sm">
                          <option>10:00 PM</option>
                          <option>09:00 PM</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">End Time</label>
                      <div className="relative">
                        <select className="w-full appearance-none bg-[#F8FAFC] px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-sm ">
                          <option>06:00 AM</option>
                          <option>07:00 AM</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 mb-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${notifications.quietHours.applyAll ? 'bg-[#0D6CF2]' : 'border-2 border-slate-200'}`}>
                      {notifications.quietHours.applyAll && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={notifications.quietHours.applyAll}
                      onChange={() => setNotifications(prev => ({...prev, quietHours: {...prev.quietHours, applyAll: !prev.quietHours.applyAll}}))}
                    />
                    <span className="text-sm font-medium">Apply to all categories</span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Persistent Footer */}
      {/* <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-50">
        <p className="text-[10px] text-slate-400 font-medium order-2 sm:order-1">
          {activeTab === 'notifications' 
            ? 'Settings are updated in real-time for all connected residents.' 
            : activeTab === 'security'
            ? 'Security changes require verification'
            : `Last auto-save at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          }
        </p>
        <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
          <button className="flex-grow sm:flex-grow-0 px-8 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            Discard
          </button>
          <button className="flex-grow sm:flex-grow-0 px-8 py-2.5 rounded-xl bg-[#1D6AEE] text-white text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all">
            {activeTab === 'notifications' ? 'Save Preferences' : 'Save All Changes'}
          </button>
        </div>
      </footer> */}
    </div>
    </DashboardLayout>
  );
};



export default AdminSettings;