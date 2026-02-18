import React from 'react';
import { 
  Building, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Headphones, 
  Zap,
  Calendar,
  Coins,
  Clock
} from 'lucide-react';

const FinalizeSetup = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] relative overflow-hidden flex flex-col font-sans">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Building className="text-white" size={20} />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">SocietyPro</span>
        </div>
        
        <div className="flex items-center gap-8">
          <a href="#" className="text-slate-500 hover:text-blue-600 font-semibold text-sm transition-colors">Support</a>
          <a href="#" className="text-slate-500 hover:text-blue-600 font-semibold text-sm transition-colors">Documentation</a>
          <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white shadow-sm overflow-hidden cursor-pointer">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
          </div>
        </div>
      </nav>

      {/* --- 2. DECORATIVE BLURS --- */}
      <div className="absolute top-20 left-[-5%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-5xl mx-auto px-8 py-14 flex-1 flex flex-col items-center">
        
        {/* --- 3. PROGRESS HEADER --- */}
        <div className="w-full mb-12">
          <p className="text-blue-500 text-[11px] font-black uppercase tracking-[0.2em] mb-3">Step 4 of 4</p>
          <div className="flex justify-between items-end mb-4">
            <h1 className="text-4xl font-[800] text-slate-900 tracking-tighter ">Finalize Setup</h1>
            <span className="text-slate-400 font-bold text-lg italic">100%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-600 rounded-full" />
          </div>
          <p className="mt-6 text-slate-400 font-medium">Ready to launch your society management dashboard.</p>
        </div>

        {/* --- 4. MAIN CONFIGURATION CARD --- */}
        <div className="w-full bg-white rounded-[3.5rem] p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-slate-50 mb-16">
          <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Regional & Billing Settings</h2>
          <p className="text-slate-400 text-sm font-medium mb-12">Configure how maintenance and local timings are handled.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {/* Maintenance Due Day */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                <Calendar size={14} /> Maintenance Due Day
              </label>
              <div className="relative">
                <select className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 px-8 focus:bg-white focus:border-blue-400 transition-all outline-none text-slate-700 font-bold appearance-none">
                  <option>5th of every month</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-x-4 border-x-transparent border-t-slate-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium ml-2 italic">Auto-invoice will be generated 5 days prior.</p>
            </div>

            {/* Currency */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                <Coins size={14} /> Currency
              </label>
              <div className="relative">
                <select className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 px-8 focus:bg-white focus:border-blue-400 transition-all outline-none text-slate-700 font-bold appearance-none">
                  <option>INR (₹) - Indian Rupee</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-x-4 border-x-transparent border-t-slate-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium ml-2 italic">Used for all financial reports and dues.</p>
            </div>

            {/* Timezone */}
            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                <Clock size={14} /> Timezone
              </label>
              <div className="relative">
                <select className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-5 px-8 focus:bg-white focus:border-blue-400 transition-all outline-none text-slate-700 font-bold appearance-none">
                  <option>Asia/Kolkata (GMT +5:30)</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-x-4 border-x-transparent border-t-slate-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium ml-2 italic">Ensure scheduled notices are delivered at the right time.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-16 flex items-center justify-center gap-8">
            <button className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-700 transition-all">
              <ChevronLeft size={18} /> Previous Step
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-[2rem] font-black text-lg flex items-center gap-4 shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 group">
              Complete Setup <CheckCircle2 size={24} />
            </button>
          </div>
        </div>

        {/* --- 5. TRUST BADGES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-12">
          {[
            { icon: <ShieldCheck className="text-blue-500" />, title: "Secure Setup", desc: "Your data is encrypted and managed under GDPR compliance." },
            { icon: <Headphones className="text-blue-500" />, title: "Need Help?", desc: "Our support team is available 24/7 for onboarding assistance." },
            { icon: <Zap className="text-blue-500" />, title: "Fast Processing", desc: "Your dashboard will be ready in under 30 seconds after completion." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="bg-white p-3 h-fit rounded-xl shadow-sm border border-slate-50">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-800 text-sm tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- 6. SIMPLE FOOTER --- */}
      <footer className="py-10 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          © 2024 SocietyPro Management Suite. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default FinalizeSetup;