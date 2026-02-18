import React, { useState, ChangeEvent } from 'react';
import { 
  Building, User, Lock, Home, ShieldCheck, Upload, CheckCircle, ArrowRight, Eye, HelpCircle 
} from 'lucide-react';

const AdminDetailsStep = () => {
  // --- KYC state ---
  const [govIdFile, setGovIdFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(new File([], "document_v2.pdf"));

  // --- Handlers ---
  const handleGovIdUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGovIdFile(e.target.files[0]);
    }
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAddressFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] relative overflow-hidden flex flex-col font-sans">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Building className="text-white" size={22} />
          </div>
          <span className="font-black text-slate-900 text-xl tracking-tighter ">Luxe<span className="text-blue-600 not-italic">Society</span></span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6 border-r border-slate-100 pr-8">
            {['IDENTITY', 'STRUCTURE', 'ADDRESS', 'SETTINGS'].map((step) => (
              <span key={step} className="text-[10px] font-black text-slate-300 tracking-[0.2em]">{step}</span>
            ))}
            <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] flex items-center gap-2">
               <div className="w-5 h-5 bg-blue-600 rounded-full text-white flex items-center justify-center text-[8px]">5</div> ADMIN
            </span>
          </div>
          <HelpCircle size={20} className="text-slate-300 cursor-pointer" />
          <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white shadow-sm overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
          </div>
        </div>
      </nav>

      {/* --- 2. BACKGROUND ELEMENTS --- */}
      <div className="absolute top-20 left-[-5%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-10 flex-1 flex flex-col items-center">
        
        {/* --- 3. HEADER --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-[800] text-slate-900 tracking-tighter mb-2 ">Society Admin Details</h1>
          <p className="text-slate-400 font-medium">Assign the super administrator who will oversee all society operations.</p>
        </div>

        {/* --- 4. FORM CARD --- */}
        <div className="w-full bg-white rounded-[3rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border border-slate-50 space-y-12">
          
          {/* Section: Personal Info */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
              <User size={16} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Full Name (e.g. Alexander Pierce)" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300" />
              <input type="email" placeholder="Email Address" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300" />
              <div className="flex gap-4">
                <select className="w-24 bg-slate-50/50 border border-slate-100 rounded-2xl px-4 focus:bg-white outline-none font-bold text-slate-400">
                  <option>+91</option>
                </select>
                <input type="tel" placeholder="Phone Number" className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium text-slate-700" />
              </div>
              <select className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 focus:bg-white outline-none font-medium text-slate-400">
                <option>Select Designation / Role</option>
              </select>
            </div>
          </div>

          {/* Section: Login Credentials */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
              <Lock size={16} /> Login Credentials
            </h3>
            <div className="max-w-md space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Admin Password</label>
              <div className="relative">
                <input type="password" value="SuperSecret123!" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 pr-14 focus:bg-white focus:border-blue-400 outline-none transition-all font-bold text-slate-700" />
                <Eye className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer" size={18} />
              </div>
              <div className="flex items-center justify-between px-1">
                <div className="flex gap-1 w-3/4">
                  <div className="h-1.5 flex-1 bg-green-500 rounded-full" />
                  <div className="h-1.5 flex-1 bg-green-500 rounded-full" />
                  <div className="h-1.5 flex-1 bg-green-500 rounded-full" />
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Strong</span>
              </div>
            </div>
          </div>

          {/* Section: Residence Details */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
              <Home size={16} /> Residence Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input type="text" placeholder="Tower/Block (e.g. Wing A)" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 focus:bg-white outline-none" />
              <input type="text" placeholder="Flat Number" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 focus:bg-white outline-none" />
              <input type="text" placeholder="Pincode" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 focus:bg-white outline-none" />
            </div>
          </div>

          {/* Section: KYC Verification */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
              <ShieldCheck size={16} /> KYC Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Government ID Upload */}
              <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-blue-200 transition-colors cursor-pointer bg-slate-50/30">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-700 uppercase tracking-tight">Government ID</p>
                  <p className="text-[10px] text-slate-400 font-medium">Passport or Driver's License</p>
                  {govIdFile && (
                    <p className="text-[10px] text-green-500 font-bold italic underline mt-1">{govIdFile.name}</p>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={handleGovIdUpload}
                  className="hidden"
                  id="gov-id-upload"
                />
                <label
                  htmlFor="gov-id-upload"
                  className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border-b border-blue-600 pb-0.5 cursor-pointer"
                >
                  Choose File
                </label>
              </div>

              {/* Address Proof */}
              <div className="border-2 border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 bg-slate-50/50 relative overflow-hidden">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-100">
                  <CheckCircle size={20} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-700 uppercase tracking-tight">Address Proof</p>
                  <p className="text-[10px] text-green-500 font-bold italic underline">
                    {addressFile ? addressFile.name : "No file uploaded"}
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={handleAddressChange}
                  className="hidden"
                  id="address-upload"
                />
                <label
                  htmlFor="address-upload"
                  className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-600 cursor-pointer"
                >
                  Change
                </label>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* --- 5. STICKY FOOTER --- */}
      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-16 py-8 flex justify-between items-center z-50 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic leading-none mb-1 text-xs">FINAL STEP</span>
          <span className="text-sm font-bold text-slate-600">5 of 5: Setup Admin</span>
        </div>

        <div className="flex items-center gap-10">
           <button className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-700 transition-colors">
            Cancel
           </button>
           <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-[2rem] font-bold text-sm flex items-center gap-4 shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-50 group uppercase tracking-widest">
             Create Society Admin <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </footer>
    </div>
  );
};

export default AdminDetailsStep;
