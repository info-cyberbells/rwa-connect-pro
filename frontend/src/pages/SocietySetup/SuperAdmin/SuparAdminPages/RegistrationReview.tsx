import React from 'react';
import { 
  ArrowLeft, Info, Building2, ShieldCheck, 
  FileText, MessageSquare, CheckCircle2, 
  Layout, Layers, Home, AlertCircle,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const RegistrationReview: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">

      {/* Sidebar - Desktop par fixed rahega, mobile par Sidebar component khud handle karega */}
      <Sidebar />

      {/* Main Content - md:ml-64 lagaya hai taaki sidebar ki jagah bane */}
      <div className="flex-1 flex flex-col md:ml-64 w-full transition-all duration-300">

        {/* Top Header - Mobile responsive padding and pt-20 for safe zone */}
        <header className="px-4 sm:px-8 pt-20 md:pt-8 pb-6 flex flex-col sm:flex-row sm:items-center gap-4 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-10">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors w-fit">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Green Valley Heights</h1>
              <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[9px] font-bold rounded-md uppercase tracking-wider">
                Pending Review
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400 mt-1">
              Registration ID: #SOC-2024-0892 • Submitted on Oct 24, 2023
            </p>
          </div>
        </header>

        {/* Main grid - Padding bottom added for footer space */}
        <main className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column */}
          <div className="col-span-12 lg:col-span-7 space-y-6">

            {/* Registration Overview */}
            <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Info size={18} className="text-blue-500"/>
                <h2 className="text-base font-black text-slate-800 tracking-tight">Registration Overview</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                <InfoBlock label="Society Name" value="Green Valley Heights Co-operative" />
                <InfoBlock label="Contact Person" value="Amit Sharma (President)" isLink />
                <InfoBlock label="Email Address" value="amit.sharma@greenvalley.com" />
                <InfoBlock label="Phone Number" value="+91 98765 43210" />
                <div className="col-span-1 sm:col-span-2">
                  <InfoBlock label="Full Address" value="Plot 42, Sector 56, Golf Course Extension Road, Gurugram, Haryana - 122011" />
                </div>
              </div>
            </section>

            {/* Document Verification */}
            <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck size={18} className="text-blue-500"/>
                <h2 className="text-base font-black text-slate-800 tracking-tight">Document Verification</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-4">
                <DocCard fileName="Land Deed.pdf" size="2.4 MB" icon={<FileText />} />
                <DocCard fileName="Cert.jpg" size="1.1 MB" icon={<CheckCircle2 />} isVerified />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[10px] sm:text-[11px] font-medium text-blue-700 leading-relaxed">
                  System scan: No security threats detected. OCR verified matching names.
                </p>
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-5 space-y-6">

            {/* Structural Review */}
            <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Layout size={18} className="text-blue-500"/>
                <h2 className="text-base font-black text-slate-800 tracking-tight">Structural Review</h2>
              </div>
              <div className="space-y-3">
                <StatRow label="Total Towers" value="06" icon={<Building2 className="text-blue-500"/>} sub="A to F" />
                <StatRow label="Floors Per Tower" value="12" icon={<Layers className="text-orange-500"/>} sub="Avg" />
                <StatRow label="Total Units" value="240" icon={<Home className="text-emerald-500"/>} sub="Residential" />
              </div>
            </section>

            {/* Internal Notes */}
            <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-blue-500"/>
                <h2 className="text-base font-black text-slate-800 tracking-tight">Internal Notes</h2>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <p className="text-[9px] font-black text-slate-400 mb-2 uppercase">Me (Super Admin) • 1h ago</p>
                <p className="text-xs font-medium text-slate-600 italic">
                  "Waiting for confirmation on the Land Deed stamp date."
                </p>
              </div>
              <textarea 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium outline-none min-h-[80px]"
                placeholder="Add a private note..."
              />
            </section>

          </div>
        </main>

        {/* Footer Actions - Responsive behavior fixed */}
        <footer className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-slate-100 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-600">JD</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-[9px] font-bold text-orange-600">SK</div>
            </div>
            <span className="text-[10px] font-bold text-slate-400">2 admins viewing</span>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600">
              Reject
            </button>
            <button className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
              <CheckCircle2 size={14} /> Approve
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};

// --- Sub-components (Keep them as they are or slight padding tweaks) ---
const InfoBlock = ({ label, value, isLink }: any) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-bold tracking-tight ${isLink ? 'text-blue-500' : 'text-slate-800'}`}>{value}</p>
  </div>
);

const DocCard = ({ fileName, size, icon, isVerified }: any) => (
  <div className="p-3 border border-slate-100 border-dashed rounded-2xl flex flex-col items-center justify-center text-center bg-slate-50/30">
    <div className="relative mb-2">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-300">
        {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      </div>
      {isVerified && <CheckCircle2 size={12} className="absolute -top-1 -right-1 text-emerald-500 fill-white" />}
    </div>
    <p className="text-[10px] font-black text-slate-700 truncate w-full">{fileName}</p>
    <p className="text-[8px] font-bold text-slate-400 uppercase italic">{size}</p>
  </div>
);

const StatRow = ({ label, value, icon, sub }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-50">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
        {React.cloneElement(icon as React.ReactElement, { size: 16 })}
      </div>
      <div>
        <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{label}</p>
        <p className="text-lg font-black text-slate-800 leading-none">{value}</p>
      </div>
    </div>
    <span className="text-[9px] font-bold text-slate-300 uppercase italic">{sub}</span>
  </div>
);

export default RegistrationReview;