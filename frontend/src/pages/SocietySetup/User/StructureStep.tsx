import React from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, Building2, Info, ArrowRight, ChevronLeft, LayoutDashboard, Users, Building, CreditCard } from 'lucide-react';

const StructureStep = () => {
  const metrics = [
    {
      title: "Total Units",
      icon: <Home size={28} />,
      desc: "Total count of residences across all blocks.",
      value: "120"
    },
    {
      title: "Total Floors",
      icon: <Layers size={28} />,
      desc: "Average or maximum floor levels per building.",
      value: "14"
    },
    {
      title: "Total Towers",
      icon: <Building2 size={28} />,
      desc: "Number of standalone blocks or towers.",
      value: "3"
    }
  ];

  const steps = [
    { label: 'Basic Info', status: 'completed' },
    { label: 'Structure', status: 'active' },
    { label: 'Units', status: 'pending' },
    { label: 'Amenities', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden flex flex-col font-sans">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Building className="text-white" size={22} />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">Society Management</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[{ name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { name: 'Residents', icon: <Users size={18} /> },
            { name: 'Facilities', icon: <Building size={18} /> },
            { name: 'Billing', icon: <CreditCard size={18} /> }
          ].map(item => (
            <a key={item.name} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm transition-colors cursor-pointer">
              {item.name}
            </a>
          ))}
          <div className="group relative w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>

      {/* Decorative Blobs */}
      <motion.div 
        className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none"
        animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"
        animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity }}
      />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full mb-12 text-center md:text-left">
          <p className="text-blue-500 text-sm font-bold mb-2 tracking-wide uppercase">Setup <span className="text-slate-300 mx-2 font-normal">/</span> Society Structure</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Define Society Scale</h1>
          <p className="text-slate-600 text-lg font-medium">Step 2 of 4: Enter the total architectural capacity of your property.</p>
        </div>

        {/* Stepper */}
        <div className="w-full max-w-4xl relative mb-16">
          <div className="absolute top-1/2 left-8 right-8 h-[4px] bg-slate-100 -translate-y-1/2 rounded-full" />
          <motion.div 
            className="absolute top-1/2 left-8 h-[4px] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '33%' }}
            transition={{ duration: 1.2 }}
          />
          <div className="flex justify-between relative z-10">
            {steps.map((s, i) => (
              <motion.div key={i} className="flex flex-col items-center gap-2"
                initial={{ scale: 0.9 }}
                animate={{ scale: s.status === 'active' ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500
                  ${s.status === 'completed' ? 'bg-blue-600 border-blue-50 text-white' :
                  s.status === 'active' ? 'bg-gradient-to-r from-blue-500 to-blue-400 border-white text-white shadow-xl' :
                  'bg-white border-slate-100 text-slate-300'}`}>
                  {s.status === 'completed' ? "✓" : i + 1}
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${s.status !== 'pending' ? 'text-blue-600' : 'text-slate-300'}`}>
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {metrics.map((item, index) => (
            <motion.div key={index} 
              className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center cursor-pointer group"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-[2rem] flex items-center justify-center mb-6 group-hover:from-blue-500 group-hover:to-blue-600 group-hover:rotate-6 transition-all duration-300">
                <div className="text-blue-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 text-center leading-relaxed h-8 px-4 opacity-80">{item.desc}</p>
              <div className="mt-10 w-full bg-slate-50/80 rounded-2xl py-5 flex items-center justify-center relative border border-slate-100 group-hover:bg-blue-50 transition-colors">
                <motion.span className="text-3xl font-black text-slate-800 tracking-tighter" 
                  initial={{ y: 20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: index * 0.2, type: 'spring' }}
                >
                  {item.value}
                </motion.span>
                <div className="absolute right-4 flex flex-col gap-0.5 opacity-20">
                  <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-slate-900 rotate-[-45deg]" />
                  <div className="w-1.5 h-1.5 border-b-2 border-l-2 border-slate-900 rotate-[-45deg]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="mt-16 bg-blue-50/40 border border-blue-100/40 p-6 rounded-[2rem] flex items-center gap-4 max-w-4xl w-full">
          <div className="bg-white p-2.5 rounded-xl shadow-sm">
            <Info size={20} className="text-blue-500" />
          </div>
          <p className="text-[13px] text-blue-700/80 font-semibold leading-relaxed">
            <span className="text-blue-600 font-bold uppercase mr-1 text-[11px]">Pro Tip:</span> 
            These numbers can be adjusted later if your society is under construction or expanding.
          </p>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200 px-12 py-6 flex justify-between items-center relative z-20 shadow-sm">
        <button className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-700 transition-all active:translate-x-[-3px]">
          <ChevronLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-6">
          <span className="hidden sm:block text-[11px] font-bold text-slate-300 uppercase tracking-widest italic">Saved to drafts 2 mins ago</span>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-blue-200 transition-transform hover:scale-[1.05] active:scale-95">
            Continue to Step 3 <ArrowRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default StructureStep;
