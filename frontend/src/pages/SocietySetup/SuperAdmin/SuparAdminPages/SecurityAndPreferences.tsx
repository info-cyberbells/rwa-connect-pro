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
import { DashboardLayout } from '@/components/layout/DashboardLayout';


const SecurityAndPreferences = () => {
  const [activeTab, setActiveTab] = useState('Security');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const Toggle = ({ enabled, setEnabled }: any) => (
    <button 
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-primary' : 'bg-muted'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <DashboardLayout role="super-admin">
    <div className="min-h-screen text-foreground font-sans antialiased flex">
         
<div className="flex-1 w-full min-h-screen">
<div className="max-w-7xl mx-auto px-4 pt-24 pb-12 sm:px-6 lg:px-8 md:pt-8">          
          {/* --- PAGE HEADER --- */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 text-left">
              <div className='w-full'>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                  Security & Preferences
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-[10px] sm:text-xs font-bold border border-success/20 whitespace-nowrap">
                  <ShieldCheck size={14} /> Verified Admin
                </span>
              </div>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                Configure internal administrative safety protocols, manage active sessions, and personalize your interface settings.
              </p>
            </div>
          </div>

          {/* --- MAIN CONTENT GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2.5rem] text-center border border-border bg-card shadow-sm">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-3xl flex items-center border-4 border-card shadow-xl justify-center bg-muted/50 ">
                    <Shield size={42} className="text-muted-foreground opacity-60" />
                    <div className="absolute -bottom-1 -right-1 p-2 bg-primary rounded-xl border-4 border-card shadow-lg">
                      <UserCircle size={20} className="text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1 text-foreground">Super Admin View</h2>
                <p className="text-primary text-[10px] font-bold uppercase tracking-wider mb-8">Internal Access Control</p>
                
                <div className="space-y-4 pt-6 border-t border-border text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Security Level</span>
                    <span className="text-success font-bold">Enhanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Last Login</span>
                    <span className="font-bold text-foreground">2 mins ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 text-white p-7 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300">
                    <Lock size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Health</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Encrypted Session</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  Your current session is protected with end-to-end encryption.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-primary border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold">SSL</div>
                    <div className="w-7 h-7 rounded-full bg-purple-600 border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold">AES</div>
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold">Active</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-8 space-y-8">
              <div className="rounded-[2.5rem] border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex px-6 sm:px-8 pt-6 border-b border-border">
                  {['Security', 'Preferences'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 px-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-6 sm:p-8 md:p-10 space-y-12 text-left">
                  {activeTab === 'Security' ? (
                    <>
                      <section>
                        <h3 className="text-lg font-bold text-foreground mb-2">Password Management</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl border border-border bg-muted/50 mt-4">
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex-shrink-0 flex items-center justify-center">
                              <KeyRound size={22} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">Last changed: Jan 12, 2024</p>
                              <p className="text-xs text-muted-foreground">Recommended update every 90 days</p>
                            </div>
                          </div>
                          <button className="w-full sm:w-auto px-6 py-2.5 rounded-2xl text-sm font-bold border border-border bg-card hover:bg-muted/50 shadow-sm transition-all text-foreground">
                            Change
                          </button>
                        </div>
                      </section>

                      <section>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-foreground">2FA Settings</h3>
                          <Toggle enabled={is2FAEnabled} setEnabled={setIs2FAEnabled} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-5 rounded-3xl border flex items-center gap-4 ${is2FAEnabled ? 'border-primary/20 bg-primary/5' : 'border-border opacity-60'}`}>
                            <Smartphone size={20} className={is2FAEnabled ? 'text-primary' : 'text-muted-foreground'} />
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-foreground">Authenticator App</h4>
                              <p className="text-xs text-muted-foreground">Active</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </>
                  ) : (
                    <section className="space-y-8">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-6">Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">Email Notifications</span>
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
                <button className="w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-bold bg-card border border-border text-muted-foreground hover:bg-muted transition-colors">
                  Discard
                </button>
                <button className="w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default SecurityAndPreferences;