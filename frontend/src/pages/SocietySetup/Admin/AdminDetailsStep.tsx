import React, { useState, useRef } from 'react';
import { 
  User, Lock, Home, ShieldCheck, Upload, CheckCircle, 
  ArrowRight, Eye, HelpCircle, ChevronDown, FileText, 
  Check, Info
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { clearCreatedSociety, createSocietyAdminBySuperAdmin } from '@/features/Superadmin/superAdminSlice';
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

const AdminDetailsStep = () => {

      const dispatch = useDispatch<AppDispatch>();
  
      const { createdSociety } = useAppSelector((state: RootState) => state.superAdmin);

      const societyId = createdSociety?.society?._id;

      const navigate = useNavigate();


  // ---------------- FORM STATE ----------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    designation: "",
    password: "",
    towerBlock: "",
    flatNumber: "",
    pincode: "",
    city: "",
    state: "",
    govIdFile: null,
    addressFile: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData(prev => ({ ...prev, [name]: value }));

      // remove error when user types
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file,
      }));

      setErrors(prev => ({
        ...prev,
        [fieldName]: ""
      }));
    }
  };

  const handleSubmit = async () => {
  const newErrors: any = {};

  Object.keys(formData).forEach((key) => {
    if (!formData[key] && key !== "govIdFile" && key !== "addressFile") {
      newErrors[key] = "Required";
    }
  });

  if (!societyId) {
    console.error("❌ Society ID not found in Redux");
    return;
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  const payload = {
    name: formData.name,
    email: formData.email,
    phone: `${formData.countryCode}${formData.phone}`,
    password: formData.password,
    societyId: societyId ,
    designation: formData.designation,
    flatNumber: formData.flatNumber,
    towerBlock: formData.towerBlock,

    address: {
      line1: formData.flatNumber + ", Tower " + formData.towerBlock,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    },

    kyc: {
      aadhaarNumber: "XXXX-XXXX-5678", // Replace if dynamic
      panNumber: "FGHIJ5678K",         // Replace if dynamic
      governmentIdUrl: formData.govIdFile?.name || null,
      addressProofUrl: formData.addressFile?.name || null,
    },
  };

  try {
    const response = await dispatch(
      createSocietyAdminBySuperAdmin(payload)
    ).unwrap();

    console.log("🎉 Society Admin Created:", response);

    // Reset form
    setFormData({
      name: "",
      email: "",
      countryCode: "+1",
      phone: "",
      designation: "",
      password: "SuperSecret123!",
      towerBlock: "",
      flatNumber: "",
      pincode: "",
      city: "",
      state: "",
      govIdFile: null,
      addressFile: null,
    });

    dispatch(clearCreatedSociety());

    navigate("/super-admin/globalSocietyDirectory");


  } catch (error) {
    console.error("❌ Admin creation failed:", error);
  }
};

  // Helper for input styling
const inputClass = (field) =>
  `w-full bg-[#F8FAFC] border rounded-2xl py-3.5 px-5 outline-none transition-all font-medium text-[#6B7280] placeholder:text-slate-300
  ${errors[field] ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-[#E2E8F0] focus:bg-card focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"}`;
  return (

    <DashboardLayout role='super-admin'>
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-foreground relative overflow-hidden flex flex-col">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex-1">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">Society Admin Details</h1>
          <p className="text-muted-foreground font-medium">Assign the super administrator who will oversee all society operations.</p>
        </div>

        {/* MAIN FORM CARD */}
        <div className="bg-card rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 space-y-12">
          
          {/* SECTION 1: Personal Info */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-5"><User size={18} className='text-[#135BEC]' /> Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#334155] ml-1">Full Name</label>
                <input 
                  name="name"
                  type="text" 
                  placeholder="e.g. Alexander Pierce" 
                  className={inputClass("name")} 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#334155] ml-1">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  placeholder="alexander@society.com" 
                  className={inputClass("email")} 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#334155] ml-1">Phone Number</label>
                <div className="flex gap-3">
                  <div className="relative min-w-[100px]">
                    <select 
                      name="countryCode"
                      className={`${inputClass("countryCode")} appearance-none pr-10`}
                      value={formData.countryCode}
                      onChange={handleChange}
                    >
                      <option>+1</option>
                      <option>+91</option>
                      <option>+44</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                  <input 
                    name="phone"
                    type="tel" 
                    placeholder="123 456 7890" 
                    className={inputClass("phone")} 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#334155] ml-1">Designation</label>
                <div className="relative">
                  <select 
                    name="designation"
                    className={`${inputClass("designation")} appearance-none pr-10 text-muted-foreground`}
                    value={formData.designation}
                    onChange={handleChange}
                  >
                    <option value="">Select Role</option>
                    <option>Chairman</option>
                    <option>Secretary</option>
                    <option>Treasurer</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Login Credentials */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-5"><Lock size={18} className='text-[#135BEC]' /> Login Credentials</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#334155] ml-1">Admin Password</label>
                <div className="relative">
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="SuperSecret123!" 
                    className={`${inputClass("password")} pr-12`} 
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
              
              {/* Password Strength */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-300">Strength</span>
                  <span className="text-emerald-500">Strong</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[60%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">Use 8+ characters with a mix of letters, numbers & symbols.</p>
              </div>
            </div>
          </section>

          {/* SECTION 3: Residence Details */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-5"><Home size={18} className='text-[#135BEC]' /> Residence Details</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#334155] ml-1">Tower/Block</label>
                  <input 
                    name="towerBlock"
                    type="text" 
                    placeholder="e.g. Wing A" 
                    className={inputClass("towerBlock")} 
                    value={formData.towerBlock}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#334155] ml-1">Flat Number</label>
                  <input 
                    name="flatNumber"
                    type="text" 
                    placeholder="102" 
                    className={inputClass("flatNumber")} 
                    value={formData.flatNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#334155] ml-1">Pincode</label>
                  <input 
                    name="pincode"
                    type="text" 
                    placeholder="123456" 
                    className={inputClass("pincode")} 
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#334155] ml-1">City</label>
                  <input 
                    name="city"
                    type="text" 
                    placeholder="Manhattan" 
                    className={inputClass("city")} 
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#334155] ml-1">State</label>
                  <input 
                    name="state"
                    type="text" 
                    placeholder="New York" 
                    className={inputClass("state")} 
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: KYC Verification */}
          <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-5">
            <ShieldCheck size={18} className='text-[#135BEC]' /> KYC Verification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ---------------- Government ID ---------------- */}
            <div
              className={`relative rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all cursor-pointer ${
                errors.govIdFile
                  ? "border-2 border-red-500"
                  : formData.govIdFile
                  ? "bg-[#F4F9F7] border border-emerald-100 shadow-sm"
                  : "border-2 border-dashed border-border hover:border-blue-200"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="govIdUpload"
                onChange={(e) => handleFileChange(e, "govIdFile")}
              />

              {formData.govIdFile ? (
                <>
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Check size={20} />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700">
                      Government ID
                    </h4>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      {formData.govIdFile.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => document.getElementById("govIdUpload").click()}
                    className="text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Change
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                    <FileText size={24} />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700">
                      Government ID
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Passport or Driver's License
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => document.getElementById("govIdUpload").click()}
                    className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    <Upload size={12} /> Choose File
                  </button>
                </>
              )}
            </div>

            {/* ---------------- Address Proof ---------------- */}
            <div
              className={`relative rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all cursor-pointer ${
                errors.addressFile
                  ? "border-2 border-red-500"
                  : formData.addressFile
                  ? "bg-[#F4F9F7] border border-emerald-100 shadow-sm"
                  : "border-2 border-dashed border-border hover:border-blue-200"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="addressUpload"
                onChange={(e) => handleFileChange(e, "addressFile")}
              />

              {formData.addressFile ? (
                <>
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Check size={20} />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700">
                      Address Proof
                    </h4>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      {formData.addressFile.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => document.getElementById("addressUpload").click()}
                    className="text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Change
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center text-slate-300">
                    <FileText size={24} />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700">
                      Address Proof
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Utility bill or bank statement
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => document.getElementById("addressUpload").click()}
                    className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    <Upload size={12} /> Choose File
                  </button>
                </>
              )}
            </div>

          </div>
        </section>

        </div>
      </main>

      {/* FIXED FOOTER */}
      <footer className="sticky bottom-0 bg-card border-t border-border px-10 py-6 flex justify-between items-center z-30">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Final Step</span>
          <span className="text-sm font-bold text-foreground">5 of 5: Setup Admin</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-sm font-bold text-muted-foreground hover:text-slate-600 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-3 shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Create Society Admin <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
    </DashboardLayout>
  );
};

export default AdminDetailsStep;