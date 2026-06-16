import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, Building2, Info, ArrowRight, ChevronLeft } from 'lucide-react';

const StructureStep = ({ nextStep, prevStep, updateFormData, defaultValues, fullFormData }: any) => {

  const [formData, setFormData] = useState({
    totalUnits: defaultValues?.totalUnits || '',
    totalFloors: defaultValues?.totalFloors || '',
    totalTowers: defaultValues?.totalTowers || ''
  });

  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues);
    }
  }, [defaultValues]);

  const [errors, setErrors] = useState({
    totalUnits: false,
    totalFloors: false,
    totalTowers: false
  });

  const steps = [
    { label: 'Basic Info', status: 'completed' },
    { label: 'Structure', status: 'active' },
    { label: 'Units', status: 'pending' },
    { label: 'Amenities', status: 'pending' }
  ];

  const handleContinue = () => {
    const newErrors = {
      totalUnits: formData.totalUnits === '',
      totalFloors: formData.totalFloors === '',
      totalTowers: formData.totalTowers === ''
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(val => val)) return;

    // 🔥 LOG PREVIOUS + CURRENT DATA
    // const cumulativeData = {
    //   ...fullFormData,
    //   structure: formData
    // };

    // console.log("🔥 CUMULATIVE DATA AFTER STEP 2:", cumulativeData);

    updateFormData(formData);
    nextStep();
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">

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
          <p className="text-primary text-sm font-bold mb-2 tracking-wide uppercase">
            Setup <span className="text-muted-foreground/40 mx-2 font-normal">/</span> Society Structure
          </p>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight mb-4">
            Define Society Scale
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Step 2 of 4: Enter the total architectural capacity of your property.
          </p>
        </div>

        {/* Metric Cards — DESIGN KEPT SAME */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">

          {/* TOTAL UNITS */}
          <motion.div 
            className="bg-card rounded-[2.5rem] p-10 border border-border shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center group"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
              <Home size={28} className="text-primary group-hover:text-primary-foreground" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">Total Units *</h3>
            <p className="text-xs text-muted-foreground text-center leading-relaxed mb-6 opacity-80">
              Total count of residences across all blocks.
            </p>

            <input
              type="number"
              value={formData.totalUnits}
              onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
              className={`w-full bg-muted/80 rounded-2xl py-4 text-center text-2xl font-black tracking-tighter border ${
                errors.totalUnits ? 'border-destructive' : 'border-border'
              } text-foreground focus:outline-none focus:ring-2 focus:ring-primary outline-none transition-all`}
              placeholder="0"
            />
          </motion.div>

          {/* TOTAL FLOORS */}
          <motion.div 
            className="bg-card rounded-[2.5rem] p-10 border border-border shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center group"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
              <Layers size={28} className="text-primary group-hover:text-primary-foreground" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">Total Floors *</h3>
            <p className="text-xs text-muted-foreground text-center leading-relaxed mb-6 opacity-80">
              Average or maximum floor levels per building.
            </p>

            <input
              type="number"
              value={formData.totalFloors}
              onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
              className={`w-full bg-muted/80 rounded-2xl py-4 text-center text-2xl font-black tracking-tighter border ${
                errors.totalFloors ? 'border-destructive' : 'border-border'
              } text-foreground focus:outline-none focus:ring-2 focus:ring-primary outline-none transition-all`}
              placeholder="0"
            />
          </motion.div>

          {/* TOTAL TOWERS */}
          <motion.div 
            className="bg-card rounded-[2.5rem] p-10 border border-border shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center group"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
              <Building2 size={28} className="text-primary group-hover:text-primary-foreground" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">Total Towers *</h3>
            <p className="text-xs text-muted-foreground text-center leading-relaxed mb-6 opacity-80">
              Number of standalone blocks or towers.
            </p>

            <input
              type="number"
              value={formData.totalTowers}
              onChange={(e) => setFormData({ ...formData, totalTowers: e.target.value })}
              className={`w-full bg-muted/80 rounded-2xl py-4 text-center text-2xl font-black tracking-tighter border ${
                errors.totalTowers ? 'border-destructive' : 'border-border'
              } text-foreground focus:outline-none focus:ring-2 focus:ring-primary outline-none transition-all`}
              placeholder="0"
            />
          </motion.div>

        </div>

        {/* Pro Tip */}
        <div className="mt-16 bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex items-center gap-4 max-w-4xl w-full">
          <Info size={20} className="text-primary" />
          <p className="text-[13px] text-primary/80 font-semibold">
            These numbers can be adjusted later if your society expands.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-8 lg:px-12 py-6 flex justify-between items-center shadow-lg">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 text-muted-foreground font-bold text-sm hover:text-foreground transition-all"
        >
          <ChevronLeft size={18} /> Back
        </button>

        <button
          onClick={handleContinue}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl transition-transform hover:scale-[1.05]"
        >
          Continue to Step 3 <ArrowRight size={20} />
        </button>
      </footer>
    </div>
  );
};

export default StructureStep;