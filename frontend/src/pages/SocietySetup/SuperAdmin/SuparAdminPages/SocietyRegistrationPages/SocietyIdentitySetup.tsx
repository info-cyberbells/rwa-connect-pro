import React, { useEffect, useState } from 'react';
import { Shield, LayoutGrid, MapPin, Settings, Info, ArrowRight, CloudUpload } from 'lucide-react';
import { motion } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom';

const SocietyIdentitySetup = ({ nextStep, updateFormData, defaultValues }: any) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    societyName: defaultValues?.societyName || '',
    email: defaultValues?.email || '',
    phone: defaultValues?.phone || '',
    logo: defaultValues?.logo || null,
    logoPreview: defaultValues?.logoPreview || ''
  });

  useEffect(() => {
  if (defaultValues) {
    setFormData(defaultValues);
  }
}, [defaultValues]);

  const [errors, setErrors] = useState({
    societyName: false,
    email: false,
    phone: false
  });

  const steps = [
    { id: 'identity', label: 'Identity', icon: Shield, status: 'active' },
    { id: 'structure', label: 'Structure', icon: LayoutGrid, status: 'upcoming' },
    { id: 'address', label: 'Address', icon: MapPin, status: 'upcoming' },
    { id: 'settings', label: 'Settings', icon: Settings, status: 'upcoming' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData({
        ...formData,
        logo: file,
        logoPreview: preview
      });
    }
  };

  const handleContinue = () => {
    const newErrors = {
      societyName: formData.societyName.trim() === '',
      email: formData.email.trim() === '',
      phone: formData.phone.trim() === ''
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(val => val === true);
    if (hasError) return;

    updateFormData(formData);
    // console.log("STEP 1 DATA:", formData);
    nextStep();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-card/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden"
      >

        <main className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* LEFT SIDE FORM */}
          <section className="space-y-8">
            <header>
              <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">Society Identity</h2>
              <p className="text-muted-foreground font-medium">Please provide the registered details of your society.</p>
            </header>

            <div className="space-y-6">

              {/* Society Name */}
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                  Society Legal Name *
                </label>
                <input 
                  type="text"
                  value={formData.societyName}
                  onChange={(e) =>
                    setFormData({ ...formData, societyName: e.target.value })
                  }
                  placeholder="e.g. Green Acres Residency"
                  className={`w-full p-4 rounded-2xl border ${
                    errors.societyName ? 'border-red-400' : 'border-border'
                  } bg-muted/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                  Contact Email Address *
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@society.com"
                  className={`w-full p-4 rounded-2xl border ${
                    errors.email ? 'border-red-400' : 'border-border'
                  } bg-muted/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                  Primary Phone Number *
                </label>
                <input 
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 00000 00000"
                  className={`w-full p-4 rounded-2xl border ${
                    errors.phone ? 'border-red-400' : 'border-border'
                  } bg-muted/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none`}
                />
              </div>

            </div>
          </section>

          {/* RIGHT SIDE LOGO */}
          <section className="flex flex-col items-center">
            <div className="w-full space-y-4">
              <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-6 text-center lg:text-left">
                Society Logo (Optional)
              </label>

              <label className="w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <div className="w-full aspect-square max-w-[340px] mx-auto border-2 border-dashed border-blue-100 rounded-[3rem] flex flex-col items-center justify-center p-10 bg-blue-50/20 hover:bg-card hover:border-blue-400 hover:shadow-2xl transition-all duration-500">
                  
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-card rounded-3xl flex items-center justify-center border border-slate-50 shadow-lg">

                      {formData.logoPreview ? (
                        <img
                          src={formData.logoPreview}
                          alt="Society Logo"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-serif italic text-xl font-bold">
                            {formData.societyName
                              ? formData.societyName.substring(0, 2).toUpperCase()
                              : "GA"}
                          </span>
                        </div>
                      )}

                    </div>

                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg">
                      <CloudUpload size={16} />
                    </div>
                  </div>

                  <h3 className="font-bold text-foreground">Logo Preview</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 text-center font-medium">
                    Click to upload logo
                  </p>
                </div>
              </label>
            </div>
          </section>

        </main>

        {/* FOOTER */}
        <footer className="px-10 py-8 border-t border-dashed border-blue-100 bg-muted/50 flex items-center justify-between">
          <button
          onClick={()=>navigate(-1)}
          className="text-muted-foreground font-black text-xs uppercase tracking-widest">
            Cancel Process
          </button>

          <button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-lg transition-all"
          >
            Save & Continue
            <ArrowRight size={20} />
          </button>
        </footer>
      </motion.div>
    </div>
  );
};

export default SocietyIdentitySetup;