import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  Edit2,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(true);

  const profile = {
    name: "John Doe",
    role: "Super Admin",
    email: "john.doe@societyhub.com",
    phone: "+91 98765 43210",
    location: "New Delhi, India",
    initials: "JD"
  };

  const tabs = ['Personal Info', 'Security', 'Preferences'];
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Sidebar*/}
      <Sidebar />

      {/*Main Content  */}
      <div className="transition-all duration-300 md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Account Settings</h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">Manage your profile information and security preferences.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 xl:p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-bold tracking-wider border-4 border-white shadow-sm">
                    {profile.initials}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-100 hover:bg-slate-50 transition-colors">
                    <Camera size={18} className="text-blue-500" />
                  </button>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{profile.name}</h2>
                <p className="text-blue-600 font-medium text-sm mb-6">{profile.role}</p>
                
                <div className="w-full space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-600 overflow-hidden">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm text-left">{profile.location}</span>
                  </div>
                </div>

                <button className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              </div>

              {/* Security Score Card  */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Security Score</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Profile Strength: High</h3>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[85%] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                  </div>
                  <p className="text-xs font-medium">85% Security Compliance</p>
                </div>
              </div>
            </div>

            {/* Right Column: Settings Forms */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Tab Navigation - Scrollable on mobile */}
                <div className="flex border-b border-slate-100 px-4 md:px-8 overflow-x-auto no-scrollbar">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 md:px-6 py-5 text-sm font-semibold transition-all relative whitespace-nowrap ${
                        activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 sm:p-6 md:p-8 space-y-8">
                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Full Name</label>
                      <input type="text" defaultValue="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input type="email" defaultValue="john.doe@societyhub.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Phone Number</label>
                      <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Language</label>
                      <div className="relative">
                        <select className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                          <option>English (US)</option>
                          <option>Hindi (IN)</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">Security & Auth</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                            <Lock size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm sm:text-base">Password</p>
                            <p className="text-xs text-slate-500">Changed 3 months ago</p>
                          </div>
                        </div>
                        <button className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all font-semibold rounded-xl text-xs sm:text-sm shadow-sm">
                          Update
                        </button>
                      </div>

                      <div className="flex flex-row items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm sm:text-base">2-Factor Auth</p>
                            <p className="text-xs text-slate-500">Highly Secure</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isTwoFactorEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isTwoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-50">
                    <button className="w-full sm:w-auto px-8 py-3 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                      Cancel
                    </button>
                    <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-red-600 mb-1">Danger Zone</h3>
                  <p className="text-sm text-slate-600">Permanently delete your account credentials.</p>
                </div>
                <button className="px-6 py-3 border border-red-200 text-red-600 font-bold rounded-xl bg-white hover:bg-red-600 hover:text-white transition-all text-sm">
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;