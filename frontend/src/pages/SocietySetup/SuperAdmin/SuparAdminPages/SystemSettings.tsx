import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Upload,
  CreditCard,
  Info,
  CheckCircle2,
  XCircle,
  Plus,

} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SystemSettings = () => {
  const [platformName, setPlatformName] = useState('SocietyHub Pro');
  const [supportEmail, setSupportEmail] = useState('support@societyhub.io');
  const [unsavedChanges, setUnsavedChanges] = useState(true);

  // Notification states
  const [notifications, setNotifications] = useState({
    registration: { email: true, push: false },
    payment: { email: true, push: true },
    health: { email: false, push: false },
  });

  const toggleNotification = (key, type) => {
    setNotifications(prev => ({
      ...prev,
      [key]: { ...prev[key], [type]: !prev[key][type] }
    }));
  };

  const Toggle = ({ active, onClick }) => (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${active ? 'bg-blue-600' : 'bg-gray-200'
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-24">
      <Sidebar />

      <header className="max-w-7xl mx-auto px-4 pt-20 pb-6 flex justify-between items-start md:ml-64 md:pt-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">System Settings</h1>
          <p className="text-slate-500 mt-1">Configure global platform parameters and management rules.</p>
        </div>
        {/* Notification Bell */}
        <button className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors relative">
          <Bell className="w-5 h-5 text-slate-600 fill-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 space-y-6 md:ml-64">
        {/* General Configuration Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold">General Configuration</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Platform Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <label className="text-sm font-medium text-slate-700">Platform Logo</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <label className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 cursor-pointer hover:border-blue-400 transition-colors">
                  <Upload className="w-6 h-6" />
                  <input type="file" className="hidden" />
                </label>
                <div className="space-y-2">
                  <label className="cursor-pointer">
                    <span className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 inline-block">
                      Upload New Logo
                    </span>
                    <input type="file" className="hidden" />
                  </label>
                  <p className="text-xs text-slate-400">Recommended size: 512x512px. PNG or SVG preferred.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Rules Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold">Notification Rules</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl gap-4">
              <div>
                <h3 className="font-semibold text-slate-800">New Society Registration</h3>
                <p className="text-sm text-slate-500">Notify super admins when a new society applies for registration.</p>
              </div>
              <div className="flex items-center gap-6 self-end sm:self-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
                  <Toggle active={notifications.registration.email} onClick={() => toggleNotification('registration', 'email')} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Push</span>
                  <Toggle active={notifications.registration.push} onClick={() => toggleNotification('registration', 'push')} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl gap-4">
              <div>
                <h3 className="font-semibold text-slate-800">Payment Failure Alerts</h3>
                <p className="text-sm text-slate-500">Critical alerts for subscription or utility payment failures.</p>
              </div>
              <div className="flex items-center gap-6 self-end sm:self-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
                  <Toggle active={notifications.payment.email} onClick={() => toggleNotification('payment', 'email')} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Push</span>
                  <Toggle active={notifications.payment.push} onClick={() => toggleNotification('payment', 'push')} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Plans Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Subscription Plans</h2>
            </div>
            <button className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-700">
              <Plus className="w-4 h-4" />
              Create New Tier
            </button>
          </div>

          <div className="p-6 xl:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className="border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-blue-200 transition-colors">
              <div className="mb-6">
                <h3 className="text-xl font-bold">Starter</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Up to 50 Units</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">₹4,999</span>
                  <span className="text-slate-400 text-sm ml-1">/year</span>
                </div>
              </div>
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 fill-[#22C55E] text-white" />
                  Basic Accounting
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <XCircle className="w-4 h-4 text-slate-300" />
                  Gate Management
                </div>
              </div>
              <button className="w-full py-2.5 border border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Edit Plan
              </button>
            </div>

            {/* Standard Plan (Popular) */}
            <div className="relative border-2 border-blue-500 bg-blue-50/60 rounded-2xl p-6 flex flex-col shadow-lg shadow-blue-50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-center bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Most Popular
              </div>
              <div className="mb-6 mt-2">
                <h3 className="text-xl font-bold">Standard</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Up to 250 Units</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">₹12,499</span>
                  <span className="text-slate-400 text-sm ml-1">/year</span>
                </div>
              </div>
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 fill-[#22C55E] text-white" />
                  Advanced ERP
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 fill-[#22C55E] text-white" />
                  Visitor Management
                </div>
              </div>
              <button className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 text-sm">
                Edit Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-blue-200 transition-colors">
              <div className="mb-6">
                <h3 className="text-xl font-bold">Premium</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Unlimited Units</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">₹24,999</span>
                  <span className="text-slate-400 text-sm ml-1">/year</span>
                </div>
              </div>
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 fill-[#22C55E] text-white" />
                  Everything in Pro
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 fill-[#22C55E] text-white" />
                  White-label App
                </div>
              </div>
              <button className="w-full py-2.5 border border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Edit Plan
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Bar */}
      {unsavedChanges && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-300 md:pl-64">          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">              <Info className="w-6 h-6 fill-[#F97316] text-white" />
            <span className="text-sm text-[#64748B] font-medium">You have unsaved changes in 'Notification Rules'</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setUnsavedChanges(false)}
              className="flex-1 sm:flex-none px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Discard
            </button>
            <button
              onClick={() => setUnsavedChanges(false)}
              className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
            >
              Save Changes
            </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;