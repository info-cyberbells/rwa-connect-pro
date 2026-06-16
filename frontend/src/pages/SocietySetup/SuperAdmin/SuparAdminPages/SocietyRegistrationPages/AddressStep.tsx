import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  ChevronLeft, 
  ArrowRight, 
  Globe,
  Navigation,
  Building
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddressStep = ({ nextStep, prevStep, updateFormData, defaultValues }: any) => {

  const [formData, setFormData] = useState({
    addressLine1: defaultValues?.addressLine1 || '',
    addressLine2: defaultValues?.addressLine2 || '',
    city: defaultValues?.city || '',
    state: defaultValues?.state || '',
    pincode: defaultValues?.pincode || '',
    country: defaultValues?.country || 'India'
  });

  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues);
    }
  }, [defaultValues]);

  const [errors, setErrors] = useState({
    addressLine1: false,
    city: false,
    state: false,
    pincode: false
  });

  const handleContinue = () => {
    const newErrors = {
      addressLine1: formData.addressLine1.trim() === '',
      city: formData.city.trim() === '',
      state: formData.state.trim() === '',
      pincode: formData.pincode.trim() === ''
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    updateFormData(formData);
    nextStep();
  };

  const handleSelectChange = (val: string) => {
    setFormData({ ...formData, country: val });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col ">

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-20 left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 flex-1 flex flex-col items-center">
        
        {/* ADDRESS CARD */}
        <div className="w-full max-w-4xl bg-card rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-12 shadow-2xl border border-border relative overflow-hidden">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-[700] text-foreground tracking-tighter mb-3 ">
              Society Location Details
            </h1>
            <p className="text-muted-foreground font-medium">
              Please provide the official registered address of the housing society.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 lg:gap-y-8">

            {/* Address Line 1 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                Address Line 1 *
              </label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="e.g., Plot 45, Sector 12"
                  className={`w-full bg-muted/50 border ${
                    errors.addressLine1 ? 'border-destructive' : 'border-border'
                  } text-foreground rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none`}
                />
              </div>
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                Address Line 2 (Optional)
              </label>
              <div className="relative group">
                <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="e.g., Near City Mall"
                  className="w-full bg-muted/50 border border-border text-foreground rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                City *
              </label>
              <div className="relative group">
                <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter City"
                  className={`w-full bg-muted/50 border ${
                    errors.city ? 'border-destructive' : 'border-border'
                  } text-foreground rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none`}
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                State *
              </label>
              <div className="relative group">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter State"
                  className={`w-full bg-muted/50 border ${
                    errors.state ? 'border-destructive' : 'border-border'
                  } text-foreground rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none`}
                />
              </div>
            </div>

            {/* Pincode */}
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                Pincode *
              </label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="411045"
                  className={`w-full bg-muted/50 border ${
                    errors.pincode ? 'border-destructive' : 'border-border'
                  } text-foreground rounded-[1.5rem] py-4 pl-14 pr-6 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none`}
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                Country *
              </label>
              <div className="relative group">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" size={18} />
                <Select value={formData.country} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full h-[54px] bg-muted/50 border border-border text-foreground rounded-[1.5rem] pl-14 pr-6 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          {/* MAP PREVIEW */}
          <div className="mt-10 relative h-32 w-full rounded-[2rem] overflow-hidden border border-border shadow-inner group">
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.712776,-74.005974&zoom=12&size=800x200&sensor=false')] bg-cover bg-center grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 py-2 bg-card/90 backdrop-blur shadow-xl rounded-full border border-border flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span className="text-[10px] font-black text-foreground uppercase tracking-widest">
                  Location Preview Based on Address
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="sticky bottom-0 bg-card/80 backdrop-blur-2xl border-t border-border px-8 lg:px-16 py-8 flex justify-between items-center z-50">
        <button onClick={prevStep} className="text-muted-foreground hover:text-foreground font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
          <ChevronLeft size={16}/> Back
        </button>

        <button
          onClick={handleContinue}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-[2rem] font-black text-sm flex items-center gap-4 shadow-xl transition-all hover:scale-105"
        >
          Continue <ArrowRight size={20}/>
        </button>
      </footer>
    </div>
  );
};

export default AddressStep;
