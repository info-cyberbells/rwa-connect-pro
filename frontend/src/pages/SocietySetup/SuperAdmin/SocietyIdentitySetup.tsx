import React from 'react';
import { Shield, LayoutGrid, MapPin, Settings, Info, ArrowRight, CloudUpload } from 'lucide-react';
import { motion } from 'framer-motion'; 

const SocietyIdentitySetup = () => {
  const steps = [
    { id: 'identity', label: 'Identity', icon: Shield, status: 'active' },
    { id: 'structure', label: 'Structure', icon: LayoutGrid, status: 'upcoming' },
    { id: 'address', label: 'Address', icon: MapPin, status: 'upcoming' },
    { id: 'settings', label: 'Settings', icon: Settings, status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden"
      >
        
        {/* --- Header / Navigation --- */}
        <header className="px-10 py-8 border-b border-dashed border-blue-100 bg-white/50">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                <LayoutGrid className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="font-black text-slate-800 text-xl tracking-tight">Society Identity</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Management Suite</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-blue-50/50 border border-blue-100 px-4 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Setup Mode</span>
            </div>
          </div>

          {/* Stepper with better visuals */}
          <div className="flex justify-between relative max-w-3xl mx-auto">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center z-10 group cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
                  step.status === 'active' 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110' 
                  : 'bg-white border border-slate-100 text-slate-400 hover:border-blue-200'
                }`}>
                  <step.icon size={24} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-wider ${step.status === 'active' ? 'text-blue-600' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
            <div className="absolute top-7 left-0 w-full h-[3px] bg-slate-50 -z-0 rounded-full" />
            <div className="absolute top-7 left-0 w-1/4 h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 -z-0 rounded-full" />
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <main className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Side: Form Details */}
          <section className="space-y-8">
            <header>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Society Identity</h2>
              <p className="text-slate-500 font-medium">Please provide the registered details of your society.</p>
            </header>

            <div className="space-y-6">
              {[
                { label: 'Society Legal Name', placeholder: 'e.g. Green Acres Residency', type: 'text' },
                { label: 'Contact Email Address', placeholder: 'admin@society.com', type: 'email' },
                { label: 'Primary Phone Number', placeholder: '+91 00000 00000', type: 'text' }
              ].map((field, i) => (
                <div key={i} className="group">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-600 transition-colors">
                    {field.label}
                  </label>
                  <input 
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-300 font-medium text-slate-700"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Right Side: Visual Branding */}
          <section className="flex flex-col items-center">
            <div className="w-full space-y-4">
               <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest text-center lg:text-left">Society Logo</label>
               <div className="w-full aspect-square max-w-[340px] mx-auto border-2 border-dashed border-blue-100 rounded-[3rem] flex flex-col items-center justify-center p-10 bg-blue-50/20 group cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-3xl flex items-center justify-center border border-slate-50 group-hover:scale-110 transition-transform duration-500">
                       <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-serif italic text-xl font-bold">GA</span>
                       </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200 scale-0 group-hover:scale-100 transition-transform duration-300">
                      <CloudUpload size={16} />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800">Logo Preview</h3>
                  <p className="text-[11px] text-slate-400 mt-1 text-center font-medium leading-relaxed">
                    Click to browse or <br/>drag & drop your file here
                  </p>
               </div>
            </div>

            <div className="mt-10 flex gap-4 bg-amber-50/50 p-5 rounded-[2rem] border border-amber-100 max-w-[340px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
              <Info className="text-amber-500 shrink-0" size={22} />
              <p className="text-[11px] text-amber-700 leading-relaxed font-semibold">
                This logo will be automatically optimized for official invoices and member certificates.
              </p>
            </div>
          </section>
        </main>

        {/* --- Footer / Navigation --- */}
        <footer className="px-10 py-8 border-t border-dashed border-blue-100 bg-slate-50/50 flex items-center justify-between">
          <button className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-red-500 transition-colors">
            Cancel Process
          </button>
          
          <div className="flex items-center gap-10">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em]">Current Progress</p>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-slate-800">25%</span>
                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-1/4 h-full bg-blue-600 rounded-full" />
                </div>
              </div>
            </div>
            <button className="group relative bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[1.5rem] font-bold flex items-center gap-3 transition-all shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:shadow-blue-400/40 active:scale-95 overflow-hidden">
              <span className="relative z-10">Save & Continue</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default SocietyIdentitySetup;