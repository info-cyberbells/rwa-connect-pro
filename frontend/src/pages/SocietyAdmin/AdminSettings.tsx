import {useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getAdminProfile, updateAdminProfile, changePassword } from "../../features/admin/adminSlice";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { 
  User, ShieldCheck, Bell, Camera, MapPin, Clock, Smartphone, Laptop, Eye, EyeOff,
  Mail, MessageSquare, AlertTriangle, FileText, ChevronDown, ExternalLink,
  MessageSquareMore, BellRing, Wrench, Megaphone, LucideShieldCheck, History,
  Save, KeyRound, Building2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const AdminSettings = () => {
  const dispatch = useAppDispatch();
  const { profile, isLoading, isSuccess, error } = useAppSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState('account');

  const handleSaveAccount = () => {
    const payload = {
      name: accountData.fullName,
      designation: accountData.officialDesignation,
      email: accountData.email,
      phone: accountData.phone,
      visitorManagement: accountData.visitorManagement,
      societyContact: accountData.societyContact,
      officeHoursStart: accountData.officeHoursStart,
      officeHoursEnd: accountData.officeHoursEnd,
    };
    dispatch(updateAdminProfile(payload));
  };

  useEffect(() => {
    if (isSuccess) toast.success("Profile updated successfully!");
    if (error) toast.error("Error: " + error);
  }, [isSuccess, error]);

  const user = profile;

  useEffect(() => { dispatch(getAdminProfile()); }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setAccountData({
        fullName: profile.name || '',
        officialDesignation: profile.designation || 'Chief Administrator',
        email: profile.email || '',
        phone: profile.phone || '',
        familyMembers: 0,
        visitorManagement: profile.visitorManagement ?? true,
        societyContact: profile.society?.contactPhone || '',
        officeHoursStart: profile.officeHoursStart || '09:00 AM',
        officeHoursEnd: profile.officeHoursEnd || '06:00 PM',
      });
    }
  }, [profile]);

  const [accountData, setAccountData] = useState({
    fullName: '', officialDesignation: 'Chief Administrator',
    email: 'alex.j@societyconnect.com', phone: '+1 (555) 000-1234',
    familyMembers: 0, societyContact: 'Society Front Desk',
    officeHoursStart: '09:00 AM', officeHoursEnd: '06:00 PM', visitorManagement: true
  });

  const loginData = [
    { status: "SUCCESS", statusColor: "green", device: "Chrome on MacOS", deviceSub: "System v14.2.1", icon: "laptop", location: "San Francisco, US", ip: "192.168.1.1", time: "Today, 2:45 PM" },
    { status: "SUCCESS", statusColor: "green", device: "Safari on iPhone 15", deviceSub: "Mobile Web", icon: "mobile", location: "San Francisco, US", ip: "172.56.21.8", time: "Yesterday, 9:12 AM" },
    { status: "FAILED", statusColor: "red", device: "Unknown Device", deviceSub: "Firefox Browser", icon: "unknown", location: "London, UK", ip: "45.12.89.201", time: "Oct 24, 11:30 PM" },
  ];

  const [securityData, setSecurityData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    maintenance: { email: true, sms: false, push: true },
    visitor: { email: false, sms: true, push: true },
    complaint: { email: true, sms: false, push: true },
    emergency: { email: true, sms: true, push: true },
    quietHours: { start: '10:00 PM', end: '06:00 AM', applyAll: true }
  });

  const handleAccountChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setAccountData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleNotification = (category: string, type: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: { ...(prev as any)[category], [type]: !(prev as any)[category][type] }
    }));
  };

  const handleChangePassword = () => {
    if (securityData.newPassword !== securityData.confirmPassword) { toast.error("Passwords do not match"); return; }
    dispatch(changePassword({ currentPassword: securityData.currentPassword, newPassword: securityData.newPassword }));
  };

  const navItems = [
    { id: 'account', label: 'Account', icon: User, desc: 'Personal and society preferences' },
    { id: 'security', label: 'Security', icon: LucideShieldCheck, desc: 'Manage security and access controls' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Manage system-wide alerts' }
  ];

  const Toggle = ({ active, onToggle, critical = false }: any) => (
    <button onClick={onToggle}
      className={`w-10 h-5 rounded-full relative transition-all duration-200 flex-shrink-0
        ${active ? (critical ? 'bg-rose-500' : 'bg-blue-600') : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 shadow-sm ${active ? 'left-6' : 'left-1'}`} />
    </button>
  );

  const NotificationCard = ({ title, desc, icon: Icon, iconBg, iconColor, isCritical = false, settings, onToggle }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2.5 ${iconBg} ${iconColor} rounded-xl`}><Icon size={16} /></div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{title}</h4>
          <p className="text-[11px] text-slate-400">{desc}</p>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { key: 'email', icon: Mail, label: isCritical ? 'Critical Email' : 'Email' },
          { key: 'sms', icon: MessageSquareMore, label: isCritical ? 'Critical SMS' : 'SMS' },
          { key: 'push', icon: BellRing, label: isCritical ? 'Forced Push' : 'Push' },
        ].map(({ key, icon: Icon2, label }) => (
          <div key={key} className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors
            ${isCritical && (settings as any)[key] ? 'bg-rose-50 border border-rose-100' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2">
              <Icon2 size={13} className={isCritical ? 'text-rose-500' : 'text-slate-400'} />
              <span className={`text-xs font-semibold ${isCritical ? 'text-rose-700' : 'text-slate-700'}`}>{label}</span>
            </div>
            <Toggle active={(settings as any)[key]} onToggle={() => onToggle(key)} critical={isCritical} />
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <DashboardLayout role="society-admin">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sticky Sidebar ── */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-6 space-y-4">

              {/* Page Title */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">Settings</h1>
                </div>
                <p className="text-xs text-slate-400 pl-3.5">{navItems.find(n => n.id === activeTab)?.desc}</p>
              </div>

              {/* Nav */}
              <nav className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 space-y-1">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold
                      ${activeTab === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <item.icon size={16} className={activeTab === item.id ? 'text-white' : 'text-blue-500'} />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Tip Card */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-5 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
                  {activeTab === 'security' ? 'Security Tip' : activeTab === 'notifications' ? 'Need Help?' : 'Support'}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {activeTab === 'security' ? 'Rotate your passwords every 90 days to maintain high security.'
                    : activeTab === 'notifications' ? 'Our support team can help you configure broadcast rules.'
                    : 'Need help with society configuration?'}
                </p>
                <button className="w-full bg-white py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors border border-slate-100 shadow-sm">
                  {activeTab === 'notifications' ? 'Documentation' : 'Contact Specialist'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* ── ACCOUNT TAB ── */}
            {activeTab === 'account' && (
              <div className="space-y-5">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-14 h-14 text-slate-400">
                        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <button className="absolute -bottom-1.5 -right-1.5 bg-blue-600 text-white p-1.5 rounded-xl shadow-md hover:bg-blue-700 transition-colors">
                      <Camera size={13} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-black text-slate-800">{user?.name || 'Admin User'}</h2>
                    <p className="text-sm text-slate-400 mb-3">Chief Administrator • ID: #SOC-9921</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-wide">Full Access</span>
                      <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wide border
                        ${user?.kyc?.verified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {user?.kyc?.verified ? '✓ KYC Verified' : 'KYC Pending'}
                      </span>
                      <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wide border
                        ${user?.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                  <SectionTitle icon={<User size={15} />} label="Personal Information" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Full Name">
                      <input type="text" name="fullName" value={accountData.fullName} onChange={handleAccountChange} className="settings-input" />
                    </FormField>
                    <FormField label="Designation">
                      <input type="text" name="officialDesignation" value={accountData.officialDesignation} onChange={handleAccountChange} className="settings-input" />
                    </FormField>
                    <FormField label="Email Address">
                      <input type="email" value={accountData.email} readOnly className="settings-input opacity-60 cursor-not-allowed" />
                    </FormField>
                    <FormField label="Phone Number">
                      <input type="text" value={accountData.phone} onChange={handleAccountChange} className="settings-input" />
                    </FormField>
                    <FormField label="Family Members">
                      <input type="number" value={accountData.familyMembers} onChange={handleAccountChange} className="settings-input" />
                    </FormField>
                  </div>
                </div>

                {/* KYC Docs */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                  <SectionTitle icon={<ShieldCheck size={15} />} label="Identity & KYC Documents" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Aadhaar Number">
                      <div className="settings-input font-mono font-bold text-slate-700">{user?.kyc?.aadhaarNumber || 'XXXX XXXX XXXX'}</div>
                    </FormField>
                    <FormField label="PAN Number">
                      <div className="settings-input font-mono font-bold text-slate-700">{user?.kyc?.panNumber || 'XXXXX0000X'}</div>
                    </FormField>
                    <DocLink href={user?.kyc?.governmentIdUrl} label="View Aadhaar Card" icon={<FileText size={16} />} color="text-blue-600 bg-blue-50 border-blue-200" />
                    <DocLink href={user?.kyc?.addressProofUrl} label="View Address Proof" icon={<MapPin size={16} />} color="text-slate-600 bg-slate-50 border-slate-200" />
                  </div>
                </div>

                {/* Residential */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                  <SectionTitle icon={<Building2 size={15} />} label="Residential Details" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <FormField label="Unit / Flat No.">
                      <div className="settings-input font-bold text-blue-600">{user?.towerBlock} - {user?.flatNumber}</div>
                    </FormField>
                    <FormField label="Ownership">
                      <div className="settings-input capitalize">{user?.unit?.ownershipType || 'Owner'}</div>
                    </FormField>
                    <FormField label="Pincode">
                      <div className="settings-input">{user?.address?.pincode}</div>
                    </FormField>
                    <div className="sm:col-span-3">
                      <FormField label="Full Address">
                        <div className="settings-input text-slate-500">
                          {user?.address?.line1}, {user?.address?.city}, {user?.address?.state}
                        </div>
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* Society */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                  <SectionTitle icon={<MapPin size={15} />} label="Registered Society" />
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 mb-1">{user?.society?.name}</p>
                      <p className="text-xs text-slate-400 mb-3">{user?.address?.line1}, {user?.address?.city}, {user?.address?.state} - {user?.address?.pincode}</p>
                      <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                        <Smartphone size={14} /> <span>{user?.society?.contactPhone}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 px-6 py-5 flex flex-col items-center justify-center text-center min-w-[140px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Account Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user?.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="text-sm font-black text-slate-800">{user?.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={handleSaveAccount}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-black shadow-lg shadow-blue-100 transition-all active:scale-95">
                  <Save size={15} /> Save All Changes
                </button>
              </div>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === 'security' && (
              <div className="space-y-5">

                {/* Password */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                  <SectionTitle icon={<KeyRound size={15} />} label="Password Management" />

                  <FormField label="Current Password">
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={securityData.currentPassword}
                        onChange={(e) => setSecurityData(p => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="••••••••••••" className="settings-input pr-12" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="New Password">
                      <input type="password" value={securityData.newPassword}
                        onChange={(e) => setSecurityData(p => ({ ...p, newPassword: e.target.value }))}
                        placeholder="At least 8 characters" className="settings-input" />
                    </FormField>
                    <FormField label="Confirm New Password">
                      <input type="password" value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData(p => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="Repeat new password" className="settings-input" />
                    </FormField>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 px-3 py-2.5 rounded-xl">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 text-[9px] font-black">✓</span>
                    </div>
                    Include numbers, symbols, and uppercase letters for a strong password.
                  </div>

                  <button onClick={handleChangePassword}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl text-sm font-black shadow-lg shadow-blue-100 transition-all active:scale-95">
                    <ShieldCheck size={15} /> Change Password
                  </button>
                </div>

                {/* Login History */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <SectionTitle icon={<History size={15} />} label="Login History" />
                    <button className="text-blue-600 text-xs font-bold hover:underline">Export Log</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-50">
                          {["Status", "Device", "Location", "IP Address", "Time"].map(h => (
                            <th key={h} className="pb-3 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {loginData.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-2">
                              <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase
                                ${item.statusColor === 'green' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-2">
                              <div className="flex items-center gap-2">
                                {item.icon === 'laptop' && <Laptop size={14} className="text-slate-400 flex-shrink-0" />}
                                {item.icon === 'mobile' && <Smartphone size={14} className="text-slate-400 flex-shrink-0" />}
                                {item.icon === 'unknown' && <div className="w-3.5 h-3.5 rounded-full border border-slate-400 flex-shrink-0" />}
                                <div>
                                  <p className="text-xs font-bold text-slate-800">{item.device}</p>
                                  <p className="text-[10px] text-slate-400">{item.deviceSub}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-2 text-xs text-slate-600">{item.location}</td>
                            <td className="py-3.5 px-2 text-xs font-mono text-slate-500">{item.ip}</td>
                            <td className="py-3.5 px-2 text-xs text-slate-400 text-right whitespace-nowrap">{item.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-black text-slate-800">Communication Channels</h2>
                    <p className="text-xs text-slate-400">Enable or disable notification types across categories.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-black rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">Enable All</button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-500 text-xs font-black rounded-xl hover:bg-slate-200 transition-colors">Reset</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NotificationCard title="Maintenance Alerts" desc="Service requests and utility updates." icon={Wrench} iconBg="bg-blue-50" iconColor="text-blue-600" settings={notifications.maintenance} onToggle={(t: string) => toggleNotification('maintenance', t)} />
                  <NotificationCard title="Visitor Notifications" desc="Gate entries and guest approvals." icon={User} iconBg="bg-emerald-50" iconColor="text-emerald-600" settings={notifications.visitor} onToggle={(t: string) => toggleNotification('visitor', t)} />
                  <NotificationCard title="Complaint Updates" desc="Ticket status and resolution news." icon={MessageSquare} iconBg="bg-amber-50" iconColor="text-amber-600" settings={notifications.complaint} onToggle={(t: string) => toggleNotification('complaint', t)} />
                  <NotificationCard title="Emergency Broadcasts" desc="Urgent safety and security alerts." icon={Megaphone} iconBg="bg-rose-50" iconColor="text-rose-600" isCritical settings={notifications.emergency} onToggle={(t: string) => toggleNotification('emergency', t)} />
                </div>

                {/* Quiet Hours */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                  <SectionTitle icon={<Clock size={15} />} label="Quiet Hours Schedule" />
                  <div className="flex flex-col sm:flex-row gap-5 items-end">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {["Start Time", "End Time"].map((label, i) => (
                        <FormField key={label} label={label}>
                          <div className="relative">
                            <select className="settings-input appearance-none pr-10 cursor-pointer">
                              <option>{i === 0 ? '10:00 PM' : '06:00 AM'}</option>
                              <option>{i === 0 ? '09:00 PM' : '07:00 AM'}</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </FormField>
                      ))}
                    </div>
                    <label className="flex items-center gap-2.5 mb-1 cursor-pointer">
                      <div onClick={() => setNotifications(p => ({ ...p, quietHours: { ...p.quietHours, applyAll: !p.quietHours.applyAll } }))}
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors cursor-pointer
                          ${notifications.quietHours.applyAll ? 'bg-blue-600' : 'border-2 border-slate-200'}`}>
                        {notifications.quietHours.applyAll && <span className="text-white text-[10px] font-black">✓</span>}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Apply to all</span>
                    </label>
                  </div>
                </div>

                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-black shadow-lg shadow-blue-100 transition-all active:scale-95">
                  <Save size={15} /> Save Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .settings-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          color: #334155;
        }
        .settings-input:focus { border-color: #3b82f6; background: #fff; }
      `}</style>
    </DashboardLayout>
  );
};

/* ── Helpers ── */
const SectionTitle = ({ icon, label }: any) => (
  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-3">
    {icon} {label}
  </div>
);

const FormField = ({ label, children }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const DocLink = ({ href, label, icon, color }: any) => (
  <FormField label="">
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`flex items-center justify-between p-3.5 rounded-2xl border border-dashed hover:opacity-80 transition-all group ${color}`}>
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-white rounded-lg shadow-sm">{icon}</div>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
    </a>
  </FormField>
);

export default AdminSettings;