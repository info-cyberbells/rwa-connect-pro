import React, { useState } from 'react';
import { 
  User, Lock, Home, ShieldCheck, Upload, CheckCircle, 
  ArrowRight, Eye, FileText, Check, EyeOff, Search
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { clearCreatedSociety, createSocietyAdminBySuperAdmin } from '@/features/Superadmin/superAdminSlice';
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

const AdminDetailsStep = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { createdSociety, loading } = useAppSelector((state: RootState) => state.superAdmin);
  const societyId = createdSociety?.society?._id;
  const navigate = useNavigate();

  // ---------------- FORM STATE ----------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    designation: "",
    password: "",
    towerBlock: "",
    flatNumber: "",
    pincode: "",
    city: "",
    state: "",
    govIdFile: null as File | null,
    addressFile: null as File | null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---------------- HANDLERS ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      setErrors(prev => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: any = {};
    const requiredFields = ["name", "email", "phone", "designation", "password", "towerBlock", "flatNumber", "pincode", "city", "state"];
    
    requiredFields.forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key] = "Required";
      }
    });

    if (!societyId) {
      toast({ title: "Error", description: "Society ID not found. Please restart the process.", variant: "destructive" });
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: `${formData.countryCode}${formData.phone}`,
      password: formData.password,
      societyId: societyId,
      designation: formData.designation,
      flatNumber: formData.flatNumber,
      towerBlock: formData.towerBlock,
      address: {
        line1: `${formData.flatNumber}, Tower ${formData.towerBlock}`,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      kyc: {
        aadhaarNumber: "XXXX-XXXX-5678",
        panNumber: "FGHIJ5678K",
        governmentIdUrl: formData.govIdFile?.name || null,
        addressProofUrl: formData.addressFile?.name || null,
      },
    };

    try {
      await dispatch(createSocietyAdminBySuperAdmin(payload)).unwrap();
      toast({ title: "Success", description: "Society Admin created successfully!" });
      dispatch(clearCreatedSociety());
      navigate("/super-admin/globalSocietyDirectory");
    } catch (error: any) {
      toast({ title: "Creation Failed", description: error.message || "Failed to create society admin.", variant: "destructive" });
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-muted/50 border rounded-2xl py-3.5 px-5 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/40
    ${errors[field] ? "border-destructive focus:ring-destructive/10" : "border-border focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10"}`;

  return (
    <DashboardLayout role='super-admin'>
      <div className="min-h-screen font-sans text-foreground relative overflow-hidden flex flex-col">
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex-1">
          
          {/* HEADER */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-3">Society Admin Details</h1>
            <p className="text-muted-foreground font-medium">Assign the administrator who will oversee all society operations.</p>
          </div>

          {/* MAIN FORM CARD */}
          <div className="bg-card rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-border space-y-12">
            
            {/* SECTION 1: Personal Info */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-5">
                <User size={18} className='text-primary' /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Full Name</label>
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
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Email Address</label>
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
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Phone Number</label>
                  <div className="flex gap-3">
                    <div className="min-w-[110px]">
                      <Select value={formData.countryCode} onValueChange={(v) => handleSelectChange("countryCode", v)}>
                        <SelectTrigger className="h-[54px] rounded-2xl border-border bg-muted/50 focus:ring-primary/10">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="+91">+91 (IN)</SelectItem>
                          <SelectItem value="+1">+1 (US)</SelectItem>
                          <SelectItem value="+44">+44 (UK)</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Designation</label>
                  <Select value={formData.designation} onValueChange={(v) => handleSelectChange("designation", v)}>
                    <SelectTrigger className={`h-[54px] rounded-2xl bg-muted/50 focus:ring-primary/10 ${errors.designation ? 'border-destructive' : 'border-border'}`}>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="Chairman">Chairman</SelectItem>
                      <SelectItem value="Secretary">Secretary</SelectItem>
                      <SelectItem value="Treasurer">Treasurer</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* SECTION 2: Login Credentials */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-5">
                <Lock size={18} className='text-primary' /> Login Credentials
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground ml-1">Admin Password</label>
                  <div className="relative">
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className={`${inputClass("password")} pr-12`} 
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground/40">Security Advice</span>
                    <span className={formData.password.length >= 8 ? "text-emerald-500" : "text-amber-500"}>
                      {formData.password.length >= 8 ? "Strong" : "Weak"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${formData.password.length >= 8 ? 'bg-emerald-500 w-full' : 'bg-amber-500 w-1/3'}`}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">Use 8+ characters with a mix of letters, numbers & symbols.</p>
                </div>
              </div>
            </section>

            {/* SECTION 3: Residence Details */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-5">
                <Home size={18} className='text-primary' /> Residence Details
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground ml-1">Tower/Block</label>
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
                    <label className="text-sm font-semibold text-muted-foreground ml-1">Flat Number</label>
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
                    <label className="text-sm font-semibold text-muted-foreground ml-1">Pincode</label>
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
                    <label className="text-sm font-semibold text-muted-foreground ml-1">City</label>
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
                    <label className="text-sm font-semibold text-muted-foreground ml-1">State</label>
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
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-5">
                <ShieldCheck size={18} className='text-primary' /> KYC Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Government ID */}
                <div className={`relative rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all border-2 border-dashed ${formData.govIdFile ? 'bg-emerald-500/5 border-emerald-500/20' : 'border-border hover:border-primary/40'}`}>
                  <input type="file" className="hidden" id="govIdUpload" onChange={(e) => handleFileChange(e, "govIdFile")} />
                  {formData.govIdFile ? (
                    <>
                      <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg"><Check size={20} /></div>
                      <div><h4 className="text-sm font-bold text-foreground">Government ID</h4><p className="text-xs text-emerald-600 font-medium">{formData.govIdFile.name}</p></div>
                      <button type="button" onClick={() => document.getElementById("govIdUpload")?.click()} className="text-xs font-bold text-primary">Change</button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground"><FileText size={24} /></div>
                      <div><h4 className="text-sm font-bold text-foreground">Government ID</h4><p className="text-xs text-muted-foreground">Passport or Driver's License</p></div>
                      <button type="button" onClick={() => document.getElementById("govIdUpload")?.click()} className="text-primary text-xs font-bold flex items-center gap-1"><Upload size={12} /> Choose File</button>
                    </>
                  )}
                </div>

                {/* Address Proof */}
                <div className={`relative rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all border-2 border-dashed ${formData.addressFile ? 'bg-emerald-500/5 border-emerald-500/20' : 'border-border hover:border-primary/40'}`}>
                  <input type="file" className="hidden" id="addressUpload" onChange={(e) => handleFileChange(e, "addressFile")} />
                  {formData.addressFile ? (
                    <>
                      <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg"><Check size={20} /></div>
                      <div><h4 className="text-sm font-bold text-foreground">Address Proof</h4><p className="text-xs text-emerald-600 font-medium">{formData.addressFile.name}</p></div>
                      <button type="button" onClick={() => document.getElementById("addressUpload")?.click()} className="text-xs font-bold text-primary">Change</button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground"><FileText size={24} /></div>
                      <div><h4 className="text-sm font-bold text-foreground">Address Proof</h4><p className="text-xs text-muted-foreground">Utility bill or bank statement</p></div>
                      <button type="button" onClick={() => document.getElementById("addressUpload")?.click()} className="text-primary text-xs font-bold flex items-center gap-1"><Upload size={12} /> Choose File</button>
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
            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mb-0.5">Final Step</span>
            <span className="text-sm font-bold text-foreground">5 of 5: Setup Admin</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Back</button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Create Society Admin"} <ArrowRight size={18} />
            </button>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default AdminDetailsStep;
