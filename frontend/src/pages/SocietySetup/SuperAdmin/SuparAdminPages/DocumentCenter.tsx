import React from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Plus, 
  Bell, 
  MoreVertical, 
  Download, 
  Share2, 
  FileText, 
  FileCode, 
  BarChart3 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const DocCard = ({ title, size, date, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} />
      </div>
      <button className="text-slate-400 hover:text-slate-600">
        <MoreVertical size={18} />
      </button>
    </div>
    
    <h3 className="font-bold text-slate-800 text-sm mb-1 truncate group-hover:text-blue-600 transition-colors">
      {title}
    </h3>
    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
      {size} • {date}
    </p>

    <div className="flex items-center gap-2 mt-5">
      <button className="flex-1 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-xs font-bold transition-colors">
        View
      </button>
      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
        <Download size={16} />
      </button>
      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
        <Share2 size={16} />
      </button>
    </div>
  </div>
);

const SectionHeader = ({ title, count, badgeColor }) => (
  <div className="flex justify-between items-center mb-6 mt-10 first:mt-0">
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>
        {count} Files
      </span>
    </div>
    <button className="text-xs font-bold text-blue-600 hover:underline">See All</button>
  </div>
);

const DocumentCenter = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Placeholder */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 lg:p-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-10 md:pt-0">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Document <span className='text-blue-600'>Center</span></h1>
              <p className="text-slate-500 text-sm mt-1">Manage global society bylaws, deeds, and statutory reports.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                <Plus size={18} /> Global Upload
              </button>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-all">
                <Bell size={20} />
              </button>
            </div>
          </header>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search documents, societies, or categories..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <Filter size={18} /> Filters
              </button>
              <div className="flex bg-white border border-slate-200 rounded-2xl p-1">
                <button className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <LayoutGrid size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Registration Deeds Section */}
          <section>
            <SectionHeader title="Registration Deeds" count="12" badgeColor="bg-blue-50 text-blue-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DocCard title="Green Valley - Conveyance" size="2.4 MB" date="OCT 12, 2023" icon={FileText} color="bg-red-50 text-red-500" />
              <DocCard title="Royal Palms Registration" size="840 KB" date="SEP 28, 2023" icon={FileCode} color="bg-blue-50 text-blue-500" />
              <DocCard title="Skyline Land Title.pdf" size="4.1 MB" date="AUG 15, 2023" icon={FileText} color="bg-red-50 text-red-500" />
              <DocCard title="Horizon Towers Deed..." size="1.2 MB" date="JUL 22, 2023" icon={FileText} color="bg-red-50 text-red-500" />
            </div>
          </section>

          {/* Society Bylaws Section */}
          <section>
            <SectionHeader title="Society Bylaws" count="42" badgeColor="bg-purple-50 text-purple-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DocCard title="Standard Bylaws 2024" size="1.1 MB" date="JAN 05, 2024" icon={FileText} color="bg-red-50 text-red-500" />
              <DocCard title="Model Society Rules" size="5.4 MB" date="DEC 15, 2023" icon={FileText} color="bg-red-50 text-red-500" />
            </div>
          </section>

          {/* Audit Reports Section */}
          <section className="mb-10">
            <SectionHeader title="Audit Reports" count="28" badgeColor="bg-emerald-50 text-emerald-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DocCard title="FY 2022-23 Annual A..." size="8.2 MB" date="NOV 30, 2023" icon={BarChart3} color="bg-emerald-50 text-emerald-600" />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default DocumentCenter;