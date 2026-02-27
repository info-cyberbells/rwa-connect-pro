import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Laptop, 
  KeyRound, 
  MessageSquare, 
  CheckCircle2,
  ChevronRight,
  UserCircle,
  Globe,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SecurityAndPreferences = () => {
  const [activeTab, setActiveTab] = useState('Security');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const Toggle = ({ enabled, setEnabled }) => (
    <button 
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased flex">
      <Sidebar />
      
     
<div className="flex-1 w-full md:pl-64 min-h-screen">
<div className="max-w-7xl mx-auto px-4 pt-24 pb-12 sm:px-6 lg:px-8 md:pt-8">          
          {/* --- PAGE HEADER --- */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div className='w-full'>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Security & Preferences
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-bold border border-emerald-200 whitespace-nowrap">
                  <ShieldCheck size={14} /> Verified Admin
                </span>
              </div>
              <p className="text-slate-500 text-sm md:text-base max-w-2xl">
                Configure internal administrative safety protocols, manage active sessions, and personalize your interface settings.
              </p>
            </div>
          </div>

          {/* --- MAIN CONTENT GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2.5rem] text-center border border-slate-100 bg-white shadow-sm">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-3xl flex items-center border-4 border-white shadow-xl justify-center bg-slate-50 ">
                    <Shield size={42} className="text-slate-400 opacity-60" />
                    <div className="absolute -bottom-1 -right-1 p-2 bg-blue-600 rounded-xl border-4 border-white shadow-lg">
                      <UserCircle size={20} className="text-white" />
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1 text-slate-900">Super Admin View</h2>
                <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-8">Internal Access Control</p>
                
                <div className="space-y-4 pt-6 border-t border-slate-50 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Security Level</span>
                    <span className="text-emerald-500 font-bold">Enhanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Last Login</span>
                    <span className="font-bold text-slate-700">2 mins ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0B1221] text-white p-7 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300">
                    <Lock size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Health</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Encrypted Session</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Your current session is protected with end-to-end encryption.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-[#0B1221] flex items-center justify-center text-[8px] font-bold">SSL</div>
                    <div className="w-7 h-7 rounded-full bg-purple-600 border-2 border-[#0B1221] flex items-center justify-center text-[8px] font-bold">AES</div>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">Active</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-8 space-y-8">
              <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flex px-6 sm:px-8 pt-6 border-b border-slate-100">
                  {['Security', 'Preferences'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 px-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-500'}`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-6 sm:p-8 md:p-10 space-y-12">
                  {activeTab === 'Security' ? (
                    <>
                      <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Password Management</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl border border-slate-100 bg-slate-50/50 mt-4">
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0 flex items-center justify-center">
                              <KeyRound size={22} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">Last changed: Jan 12, 2024</p>
                              <p className="text-xs text-slate-400">Recommended update every 90 days</p>
                            </div>
                          </div>
                          <button className="w-full sm:w-auto px-6 py-2.5 rounded-2xl text-sm font-bold border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all">
                            Change
                          </button>
                        </div>
                      </section>

                      <section>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-900">2FA Settings</h3>
                          <Toggle enabled={is2FAEnabled} setEnabled={setIs2FAEnabled} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-5 rounded-3xl border flex items-center gap-4 ${is2FAEnabled ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 opacity-60'}`}>
                            <Smartphone size={20} className={is2FAEnabled ? 'text-blue-600' : 'text-slate-400'} />
                            <div className="flex-1">
                              <h4 className="text-sm font-bold">Authenticator App</h4>
                              <p className="text-xs text-slate-500">Active</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </>
                  ) : (
                    <section className="space-y-8">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-600">Email Notifications</span>
                            <Toggle enabled={notifications.email} setEnabled={() => setNotifications({...notifications, email: !notifications.email})} />
                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
                <button className="w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-bold bg-white border border-slate-200 text-slate-500">
                  Discard
                </button>
                <button className="w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAndPreferences;