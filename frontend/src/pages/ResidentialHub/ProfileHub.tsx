import React, { useState } from 'react';
import { 
  UserCircle, 
  ChevronRight, 
  User, 
  Lock, 
  Bell, 
  Mail, 
  Languages, 
  HelpCircle, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft,
  Camera,
  Smartphone,
  Building2,
  Settings,
  Info,
  Sun,
  Moon,
  Phone,
  Edit2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

/**
 * SocietyApp Profile Management
 * A streamlined version with light mode only and simplified save logic.
 */

const ProfileHub = () => {
  // --- State Management ---
  const [currentView, setCurrentView] = useState('hub'); // 'hub' or 'edit'
  
  // User Data State
  const [userData, setUserData] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@society.com",
    phone: "+1 (555) 019-2834",
    apartment: "B-402",
    role: "Member",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  });

  // Temporary state for the edit form
  const [formData, setFormData] = useState({ ...userData });

  const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Allow only images
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }

  // Preview instantly
  const previewURL = URL.createObjectURL(file);

  setFormData((prev) => ({
    ...prev,
    avatar: previewURL,
    avatarFile: file 
  }));
};

  // --- Handlers ---
  const handleSave = (e) => {
    e.preventDefault();
    
    console.log("--- SAVING PROFILE CHANGES ---");
    console.log("Full Name:", formData.name);
    console.log("Email Address:", formData.email);
    console.log("Phone Number:", formData.phone);
    console.log("Apartment No:", formData.apartment);
    console.log("Profile Image URL:", formData.avatar);
    console.log("-----------------------------");

    setUserData({ ...formData });
    
    setCurrentView('hub');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- UI Components ---

  const SettingsRow = ({ icon: Icon, label, value, onClick }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
          <Icon size={20} />
        </div>
        <span className="font-semibold text-[15px] text-[#334155]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-slate-400 font-medium">{value}</span>}
        <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
      </div>
    </button>
  );

  const SectionHeader = ({ title }) => (
    <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#94A3B8] mb-3 mt-6 first:mt-2 px-2">
      {title}
    </h3>
  );

  return (
    <DashboardLayout role='residential-admin'>
    <div className="min-h-screen flex flex-col text-[#0F172A] ">
      
      {/* --- Main Content --- */}
<main className="absolute top-[100px] left-0 right-0 max-w-5xl mx-auto space-y-5">        
        {currentView === 'hub' && (
          <div className="w-full max-w-4xl rounded-[2.5rem] shadow-xl shadow-slate-200/40 border bg-white border-[#F8FAFC] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Profile Info Header */}
            <div className="p-10 text-center flex flex-col items-center border-b border-slate-50">
              <div className="relative group mb-4">
                <img 
                  src={userData.avatar} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full object-cover ring-8 ring-slate-50"
                />
                <button 
                  onClick={() => { setFormData({...userData}); setCurrentView('edit'); }}
                  className="absolute bottom-1 right-1 bg-[#3B82F6] text-white p-2.5 rounded-full shadow-lg "
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <h2 className="text-3xl font-semibold text-[#0F172A] flex items-center gap-2">
                {userData.name}
                <span className="text-xs px-4 py-1 -mb-2  uppercase tracking-widest bg-blue-100 text-[#2563EB] rounded-full font-bold">
                  {userData.role}
                </span>
              </h2>
              <p className="text-[#64748B] mt-1 font-semibold text-sm">Block {userData.apartment}</p>
            </div>

            {/* List Sections */}
            <div className="px-8 py-6">
              <SectionHeader title="Account" />
              <div className="space-y-1">
                <SettingsRow icon={User} label="Personal Info" onClick={() => { setFormData({ ...userData }); setCurrentView('edit'); } } value={undefined} />
                <div className='h-[1px] bg-[#F8FAFC]'></div>
                <SettingsRow icon={Lock} label="Change Password" value={undefined} onClick={undefined} />
              </div>

              <SectionHeader title="Notifications" />
              <div className="space-y-1">
                <SettingsRow icon={Bell} label="Push Notifications" value={undefined} onClick={undefined} />
                <div className='h-[1px] bg-[#F8FAFC]'></div>
                <SettingsRow icon={Mail} label="Email Notifications" value={undefined} onClick={undefined} />
              </div>

              <SectionHeader title="Preferences" />
              <div className="space-y-1">
                <SettingsRow icon={Languages} label="Language" value="English" onClick={undefined} />
                <div className='h-[1px] bg-[#F8FAFC]'></div>
                <SettingsRow icon={Moon} label="Theme" value={undefined} onClick={undefined} />
              </div>

              <SectionHeader title="Support" />
              <div className="space-y-1">
                <SettingsRow icon={HelpCircle} label="Help Center" value={undefined} onClick={undefined} />
                <div className='h-[1px] bg-[#F8FAFC]'></div>
                <SettingsRow icon={ShieldCheck} label="Privacy Policy" value={undefined} onClick={undefined} />
              </div>

              <div className="pt-10 pb-4">
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] font-black hover:bg-red-100 transition-colors">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
                <p className="text-[11px] text-center text-[#94A3B8] mt-8 font-medium">Society App v2.4.0</p>
              </div>
            </div>
          </div>
        )}

        {/* --- View: Edit Profile (Image 8) --- */}
        {currentView === 'edit' && (
          <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-500">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between w-full mb-8 px-2">
              <button 
                onClick={() => setCurrentView('hub')}
                className="flex items-center gap-3 font-bold group"
              >
                <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xl">Edit Profile</span>
              </button>
            </div>

            <div className="rounded-[2.5rem] shadow-xl shadow-slate-200/40 border bg-white border-slate-100 p-8 md:p-12">
              {/* Photo Change Section */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative border-2 border-blue-100 rounded-[20rem] p-1">

                    <img 
                    src={formData.avatar} 
                    alt="Edit Avatar" 
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white"
                    />

                    {/* Hidden File Input */}
                    <input
                    type="file"
                    accept="image/png, image/jpeg"
                    id="avatarInput"
                    className="hidden"
                    onChange={handleAvatarChange}
                    />

                    {/* Camera Button */}
                    <label
                    htmlFor="avatarInput"
                    className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer shadow-md hover:scale-105 transition"
                    >
                    <Camera size={18} />
                    </label>

                </div>

                {/* Also Trigger Upload */}
                <label
                    htmlFor="avatarInput"
                    className="mt-4 text-blue-600 font-bold text-sm hover:underline tracking-tight cursor-pointer"
                >
                    Change Profile Photo
                </label>
                </div>

              {/* Form Fields */}
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-2.5 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] fill-current" size={18} />
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder='Alex Morgan'
                      className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium bg-[#F8FAFC] border-[#E2E8F0] text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-2.5 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white fill-[#94A3B8] " size={18} />
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder='alex.morgan@society.com'
                        className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium bg-[#F8FAFC] border-[#E2E8F0] text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-2.5 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-transparent fill-[#94A3B8]" size={18} />
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder='+1 (555) 019-2834'
                        className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium bg-[#F8FAFC] border-[#E2E8F0] text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-2.5 ml-1">Apartment No.</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400/50" size={18} />
                    <input 
                      type="text"
                      readOnly
                      value={formData.apartment}
                      className="w-full pl-12 pr-4 py-4 border rounded-2xl cursor-not-allowed font-medium bg-[#F8FAFC] border-[#E2E8F0] text-slate-400"
                    />
                  </div>
                  <p className="flex items-center gap-2 text-[11px] text-slate-400 mt-4 ml-1">
                    <Info size={14} className="text-slate-500" />
                    Contact your admin to change building allocation.
                  </p>
                </div>

                <div className="pt-10 space-y-4 flex flex-col justify-center items-center">
                  <button 
                    type="submit"
                    className="w-full max-w-lg py-4 bg-[#1D7FF0] text-white rounded-2xl font-semibold tracking-wider shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCurrentView('hub')}
                    className="w-full py-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                  >
                    Cancel & Go Back
                  </button>
                </div>
              </form>
            </div>
            
            <footer className="mt-12 mb-8 text-center space-y-4">
              <p className="text-xs font-medium text-[#94A3B8] tracking-[0.2em]">EcoSociety App v2.4.0</p>
              <div className="flex items-center justify-center gap-6 text-xs font-bold text-[#64748B]">
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
              </div>
            </footer>
          </div>
        )}

      </main>
    </div>
    </DashboardLayout>
  );
};

export default ProfileHub;