import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, ShieldCheck, MapPin, Phone } from 'lucide-react';

interface StaffIDCardProps {
  staff: {
    staffName: string;
    role: string;
    mobileNumber: string;
    flatNumber: string;
    photo?: string;
    societyName?: string;
  };
}

const StaffIDCard: React.FC<StaffIDCardProps> = ({ staff }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High quality
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `${staff.staffName}_ID_Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* [MODULE-A]: Digital ID Card Component */}
      <div 
        ref={cardRef}
        className="w-[320px] h-[500px] bg-card rounded-[32px] overflow-hidden shadow-2xl border border-border flex flex-col relative"
      >
        {/* Header/Society Info */}
        <div className="bg-blue-600 p-6 text-white text-center pb-20">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldCheck size={20} className="text-blue-200" />
            <span className="text-[10px] font-black uppercase tracking-[3px]">SocietySmartHub</span>
          </div>
          <h3 className="font-bold text-lg leading-tight truncate px-4">
            {staff.societyName || "Premium Residency"}
          </h3>
        </div>

        {/* Profile Content */}
        <div className="flex-1 flex flex-col items-center -mt-16 px-6 pb-6 z-10">
          <div className="w-32 h-32 rounded-[40px] border-4 border-white shadow-xl overflow-hidden bg-slate-100 mb-4 bg-cover bg-center"
               style={{ backgroundImage: staff.photo ? `url(${staff.photo})` : 'none' }}>
            {!staff.photo && <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-4xl">{staff.staffName[0]}</div>}
          </div>

          <h2 className="text-xl font-black text-foreground text-center uppercase tracking-tight">{staff.staffName}</h2>
          <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 mb-10">
            {staff.role}
          </div>

          {/* Contact Details */}
          <div className="w-full space-y-3 mb-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
                <Phone size={14} />
              </div>
              <span className="text-xs font-bold">{staff.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
                <MapPin size={14} />
              </div>
              <span className="text-xs font-bold">Flat: {staff.flatNumber}</span>
            </div>
          </div>
        </div>

        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-card/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 rounded-full -ml-16 -mb-16 blur-3xl" />
      </div>

      {/* Download Action */}
      <button 
        onClick={downloadCard}
        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
      >
        <Download size={18} /> Download Digital ID
      </button>
    </div>
  );
};

export default StaffIDCard;
