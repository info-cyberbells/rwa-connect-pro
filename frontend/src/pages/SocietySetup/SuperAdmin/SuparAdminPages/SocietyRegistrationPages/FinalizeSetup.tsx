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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FinalizeSetup = ({ prevStep, submitForm, defaultValues, fullFormData, loading }: any) => {

  const [settings, setSettings] = useState({
    maintenanceDue: defaultValues?.maintenanceDue || '5',
    currency: defaultValues?.currency || 'INR',
    timezone: defaultValues?.timezone || 'Asia/Kolkata'
  });

  useEffect(() => {
    if (defaultValues) {
      setSettings(defaultValues);
    }
  }, [defaultValues]);

  const handleSelectChange = (name: string, val: string) => {
    setSettings({ ...settings, [name]: val });
  };

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

    submitForm(finalData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      
      {/* DECORATIVE BLURS */}
      <div className="absolute top-20 left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 py-10 lg:py-14 flex-1 flex flex-col items-center">
        
        {/* PROGRESS HEADER */}
        <div className="w-full mb-12">
          <p className="text-primary text-[11px] font-black uppercase tracking-[0.2em] mb-3">Step 4 of 4</p>
          <div className="flex justify-between items-end mb-4">
            <h1 className="text-3xl lg:text-4xl font-[800] text-foreground tracking-tighter ">Finalize Setup</h1>
          </div>
          <p className="mt-3 text-muted-foreground font-medium">
            Ready to launch your society management dashboard.
          </p>
        </div>

        {/* MAIN CONFIGURATION CARD */}
        <div className="w-full bg-card rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-16 shadow-2xl border border-border mb-16">
          <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">
            Regional & Billing Settings
          </h2>
          <p className="text-muted-foreground text-sm font-medium mb-12">
            Configure how maintenance and local timings are handled.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            
            {/* Maintenance Due Day */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-widest ml-1">
                <Calendar size={14} /> Maintenance Due Day
              </label>
              <Select value={settings.maintenanceDue} onValueChange={(v) => handleSelectChange("maintenanceDue", v)}>
                <SelectTrigger className="w-full h-[60px] bg-muted/50 border border-border rounded-[1.5rem] px-8 focus:bg-card focus:border-primary transition-all outline-none text-foreground font-bold">
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="5">5th of every month</SelectItem>
                  <SelectItem value="10">10th of every month</SelectItem>
                  <SelectItem value="15">15th of every month</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground/60 font-medium ml-2 italic">
                Auto-invoice will be generated 5 days prior.
              </p>
            </div>

            {/* Currency */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-widest ml-1">
                <Coins size={14} /> Currency
              </label>
              <Select value={settings.currency} onValueChange={(v) => handleSelectChange("currency", v)}>
                <SelectTrigger className="w-full h-[60px] bg-muted/50 border border-border rounded-[1.5rem] px-8 focus:bg-card focus:border-primary transition-all outline-none text-foreground font-bold">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                  <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground/60 font-medium ml-2 italic">
                Used for all financial reports and dues.
              </p>
            </div>

            {/* Timezone */}
            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-widest ml-1">
                <Clock size={14} /> Timezone
              </label>
              <Select value={settings.timezone} onValueChange={(v) => handleSelectChange("timezone", v)}>
                <SelectTrigger className="w-full h-[60px] bg-muted/50 border border-border rounded-[1.5rem] px-8 focus:bg-card focus:border-primary transition-all outline-none text-foreground font-bold">
                  <SelectValue placeholder="Select Timezone" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT +5:30)</SelectItem>
                  <SelectItem value="UTC">UTC (GMT +0)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (GMT -5)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground/60 font-medium ml-2 italic">
                Ensure scheduled notices are delivered at the right time.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-16 flex items-center justify-center gap-8">
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-foreground transition-all"
            >
              <ChevronLeft size={18} /> Previous Step
            </button>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-[2rem] font-black text-lg flex items-center gap-4 shadow-xl transition-all hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Society..." : "Complete Setup"}
              <CheckCircle2 size={24} />
            </button>
          </div>
        </div>

        {/* TRUST BADGES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-12">
          {[
            { icon: <ShieldCheck className="text-primary" />, title: "Secure Setup", desc: "Your data is encrypted and managed under GDPR compliance." },
            { icon: <Headphones className="text-primary" />, title: "Need Help?", desc: "Our support team is available 24/7 for onboarding assistance." },
            { icon: <Zap className="text-primary" />, title: "Fast Processing", desc: "Your dashboard will be ready in under 30 seconds after completion." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="bg-card p-3 h-fit rounded-xl shadow-sm border border-border">
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

      {/* FOOTER */}
      <footer className="py-10 text-center">
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
          © 2024 SocietyPro Management Suite. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default FinalizeSetup;
