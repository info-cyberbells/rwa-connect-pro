import React from 'react';
import { 
  MapPin, 
  ChevronLeft, 
  ArrowRight, 
  LayoutDashboard, 
  Users, 
  Building, 
  CreditCard,
  Globe,
  Navigation,
  HelpCircle
} from 'lucide-react';

const AddressStep = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] relative overflow-hidden flex flex-col font-sans">
      
      {/* --- 1. PREMIUM NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 px-10 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
            <Building className="text-white" size={22} />
          </div>
          <span className="font-black text-slate-900 text-xl tracking-tighter ">Luxe<span className="text-blue-600 not-italic">Society</span></span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          {[
            { name: 'Identity', active: true },
            { name: 'Structure', active: false },
            { name: 'Address', active: false },
            { name: 'Settings', active: false }
          ].map((item) => (
            <a key={item.name} className={`flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer ${item.active ? 'text-blue-600' : 'text-slate-300 hover:text-slate-500'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-blue-600' : 'bg-slate-200'}`} />
              {item.name}
            </a>
          ))}
          <div className="h-8 w-[1px] bg-slate-100 mx-2" />
          <div className="flex items-center gap-4">
            <HelpCircle size={20} className="text-slate-400 cursor-pointer hover:text-blue-600 transition-colors" />
            <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white shadow-md overflow-hidden hover:scale-110 transition-transform cursor-pointer">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
            </div>
          </div>
        </div>
      </nav>

      {/* --- 2. BACKGROUND ELEMENTS --- */}
      <div className="absolute top-20 left-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-8 py-10 flex-1 flex flex-col items-center">
        
        {/* --- 3. STEP INDICATOR --- */}
        <div className="w-full max-w-3xl mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 w-[66%] h-[2px] bg-blue-500 -translate-y-1/2 transition-all duration-1000" />
          
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                step < 3 ? 'bg-blue-600 border-blue-50 text-white' : 
                step === 3 ? 'bg-white border-blue-500 text-blue-600 scale-110 shadow-lg' : 
                'bg-white border-slate-50 text-slate-200'
              }`}>
                {step < 3 ? "✓" : step}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${step <= 3 ? 'text-blue-600' : 'text-slate-300'}`}>
                {step === 1 ? 'Basic Info' : step === 2 ? 'Structure' : step === 3 ? 'Address' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        {/* --- 4. ADDRESS CARD --- */}
        <div className="w-full max-w-4xl bg-white rounded-[3.5rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-[700] text-slate-900 tracking-tighter mb-3 ">Society Location Details</h1>
            <p className="text-slate-400 font-medium">Please provide the official registered address of the housing society.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {/* Address Line 1 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Address Line 1</label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g., Plot 45, Sector 12" 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Address Line 2 (Optional)</label>
              <div className="relative group">
                <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g., Near City Mall" 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">City</label>
              <div className="relative group">
                <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <select className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-400 font-medium appearance-none">
                  <option>Select City</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-x-4 border-x-transparent border-t-slate-300" />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">State</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500">
                  <Globe size={18} />
                </div>
                <select className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-400 font-medium appearance-none">
                  <option>Select State</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-x-4 border-x-transparent border-t-slate-300" />
              </div>
            </div>

            {/* Pincode */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Pincode</label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g., 411045" 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Country</label>
              <div className="relative group">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <select className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-700 font-medium appearance-none">
                  <option>India</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-x-4 border-x-transparent border-t-slate-300" />
              </div>
            </div>
          </div>

          {/* Map Preview Placeholder */}
          <div className="mt-10 relative h-32 w-full rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner group">
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.712776,-74.005974&zoom=12&size=800x200&sensor=false')] bg-cover bg-center grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 py-2 bg-white/90 backdrop-blur shadow-xl rounded-full border border-white flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Location Preview Based on Address</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- 5. STICKY FOOTER --- */}
      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-16 py-8 flex justify-between items-center z-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest  leading-none mb-1">Final Step</span>
          <span className="text-sm font-bold text-slate-600">5 of 5: Setup Admin</span>
        </div>

        <div className="flex items-center gap-10">
           <button className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-700 transition-colors">
            Cancel
           </button>
           <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[2rem] font-black text-sm flex items-center gap-4 shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 group uppercase tracking-widest">
             Create Society Admin <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </footer>
    </div>
  );
};

export default AddressStep;