import React, { useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Headphones, 
  Zap,
  Calendar,
  Coins,
  Clock
} from 'lucide-react';

const FinalizeSetup = ({ prevStep, submitForm, defaultValues, fullFormData, loading }: any) => {

  const [settings, setSettings] = useState({
    maintenanceDue: defaultValues?.maintenanceDue || '5',
    currency: defaultValues?.currency || 'INR',
    timezone: defaultValues?.timezone || 'Asia/Kolkata (GMT +5:30)'
  });

  useEffect(() => {
    if (defaultValues) {
      setSettings(defaultValues);
    }
  }, [defaultValues]);

  const handleComplete = () => {

  const finalData = {
      name: fullFormData.identity?.societyName,
      address: {
        line1: fullFormData.address?.addressLine1,
        line2: fullFormData.address?.addressLine2,
        city: fullFormData.address?.city,
        state: fullFormData.address?.state,
        pincode: fullFormData.address?.pincode,
        country: fullFormData.address?.country
      },
      contactEmail: fullFormData.identity?.email,
      contactPhone: fullFormData.identity?.phone,
      totalUnits: Number(fullFormData.structure?.totalUnits),
      totalFloors: Number(fullFormData.structure?.totalFloors),
      totalTowers: Number(fullFormData.structure?.totalTowers),
      logoUrl: fullFormData.identity?.logoPreview || null,
      settings: {
      maintenanceDueDay: Number(settings?.maintenanceDue || 5),
      currency: settings?.currency || "INR",
      timezone: settings?.timezone || "Asia/Kolkata"
    }
    };

    console.log(" FINAL SOCIETY DATA:", finalData);

    submitForm(finalData);
  };

  return (
    <div className="min-h-screen  relative overflow-hidden flex flex-col">
      
      {/* --- 2. DECORATIVE BLURS --- */}
      <div className="absolute top-20 left-[-5%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-5xl mx-auto px-8 py-14 flex-1 flex flex-col items-center">
        
        {/* --- 3. PROGRESS HEADER --- */}
        <div className="w-full mb-12">
          <p className="text-blue-500 text-[11px] font-black uppercase tracking-[0.2em] mb-3">Step 4 of 4</p>
          <div className="flex justify-between items-end mb-4">
            <h1 className="text-4xl font-[800] text-foreground tracking-tighter ">Finalize Setup</h1>
            {/* <span className="text-muted-foreground font-bold text-lg italic">100%</span> */}
          </div>
          {/* <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-600 rounded-full" />
          </div> */}
          <p className="mt-3 text-muted-foreground font-medium">
            Ready to launch your society management dashboard.
          </p>
        </div>

        {/* --- 4. MAIN CONFIGURATION CARD --- */}
        <div className="w-full bg-card rounded-[3.5rem] p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-slate-50 mb-16">
          <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">
            Regional & Billing Settings
          </h2>
          <p className="text-muted-foreground text-sm font-medium mb-12">
            Configure how maintenance and local timings are handled.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            
            {/* Maintenance Due Day */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                <Calendar size={14} /> Maintenance Due Day
              </label>
              <div className="relative">
                <select
                  value={settings.maintenanceDue}
                  onChange={(e) =>
                    setSettings({ ...settings, maintenanceDue: e.target.value })
                  }
                  className="w-full bg-muted/50 border border-border rounded-[1.5rem] py-5 px-8 focus:bg-card focus:border-blue-400 transition-all outline-none text-slate-700 font-bold appearance-none"
                >
                   <option value="5">5th of every month</option>
                   <option value="10">10th of every month</option>
                   <option value="15">15th of every month</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-x-4 border-x-transparent border-t-slate-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium ml-2 italic">
                Auto-invoice will be generated 5 days prior.
              </p>
            </div>

            {/* Currency */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                <Coins size={14} /> Currency
              </label>
              <div className="relative">
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    setSettings({ ...settings, currency: e.target.value })
                  }
                  className="w-full bg-muted/50 border border-border rounded-[1.5rem] py-5 px-8 focus:bg-card focus:border-blue-400 transition-all outline-none text-slate-700 font-bold appearance-none"
                >
                   <option value="INR">INR (₹) - Indian Rupee</option>
                   <option value="USD">USD ($) - US Dollar</option>
                   <option value="EUR">EUR (€) - Euro</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-x-4 border-x-transparent border-t-slate-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium ml-2 italic">
                Used for all financial reports and dues.
              </p>
            </div>

            {/* Timezone */}
            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                <Clock size={14} /> Timezone
              </label>
              <div className="relative">
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                  className="w-full bg-muted/50 border border-border rounded-[1.5rem] py-5 px-8 focus:bg-card focus:border-blue-400 transition-all outline-none text-slate-700 font-bold appearance-none"
                >
                  <option>Asia/Kolkata (GMT +5:30)</option>
                  <option>UTC (GMT +0)</option>
                  <option>America/New_York (GMT -5)</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-x-4 border-x-transparent border-t-slate-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium ml-2 italic">
                Ensure scheduled notices are delivered at the right time.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-16 flex items-center justify-center gap-8">
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-slate-700 transition-all"
            >
              <ChevronLeft size={18} /> Previous Step
            </button>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-[2rem] font-black text-lg flex items-center gap-4 shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Society..." : "Complete Setup"}
              <CheckCircle2 size={24} />
            </button>
          </div>
        </div>

        {/* --- 5. TRUST BADGES (UNCHANGED) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-12">
          {[
            { icon: <ShieldCheck className="text-blue-500" />, title: "Secure Setup", desc: "Your data is encrypted and managed under GDPR compliance." },
            { icon: <Headphones className="text-blue-500" />, title: "Need Help?", desc: "Our support team is available 24/7 for onboarding assistance." },
            { icon: <Zap className="text-blue-500" />, title: "Fast Processing", desc: "Your dashboard will be ready in under 30 seconds after completion." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="bg-card p-3 h-fit rounded-xl shadow-sm border border-slate-50">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-foreground text-sm tracking-tight">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- FOOTER (UNCHANGED) --- */}
      <footer className="py-10 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          © 2024 SocietyPro Management Suite. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default FinalizeSetup;