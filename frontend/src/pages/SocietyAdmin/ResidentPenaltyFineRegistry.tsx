import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Edit
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import DeleteConfirmationModal from './DeleteModal';

const INITIAL_DATA = [
  { id: 'PEN-1029', issueDate: 'Oct 24, 2023', residentName: 'John Doe', unit: 'A-102', penaltyType: 'Late Payment', amount: 50.00, description: 'Maintenance bill for Oct overdue by 10 days', status: 'Outstanding' },
  { id: 'PEN-1028', issueDate: 'Oct 24, 2023', residentName: 'Sarah Miller', unit: 'B-405', penaltyType: 'Parking Violation', amount: 25.00, description: 'Vehicle parked in visitor zone overnight', status: 'Settled' },
  { id: 'PEN-1027', issueDate: 'Oct 23, 2023', residentName: 'Robert White', unit: 'C-112', penaltyType: 'Noise Complaint', amount: 100.00, description: 'Loud music after 11:00 PM (3rd offense)', status: 'Outstanding' },
  { id: 'PEN-1026', issueDate: 'Oct 23, 2023', residentName: 'Emily Lewis', unit: 'A-501', penaltyType: 'Late Payment', amount: 50.00, description: 'Maintenance bill for Oct overdue', status: 'Settled' },
  { id: 'PEN-1025', issueDate: 'Oct 22, 2023', residentName: 'Michael Brown', unit: 'D-202', penaltyType: 'Noise Complaint', amount: 75.00, description: 'Partying past midnight on weekday', status: 'Outstanding' },
  { id: 'PEN-1024', issueDate: 'Oct 21, 2023', residentName: 'Jessica Davis', unit: 'B-110', penaltyType: 'Parking Violation', amount: 25.00, description: 'Blocking emergency exit path', status: 'Settled' },
  { id: 'PEN-1023', issueDate: 'Oct 20, 2023', residentName: 'David Wilson', unit: 'C-304', penaltyType: 'Late Payment', amount: 50.00, description: 'Unpaid cleaning fee', status: 'Outstanding' },
  { id: 'PEN-1022', issueDate: 'Oct 19, 2023', residentName: 'Linda Taylor', unit: 'A-205', penaltyType: 'Parking Violation', amount: 25.00, description: 'Visitor parking used by resident', status: 'Settled' },
  { id: 'PEN-1021', issueDate: 'Oct 18, 2023', residentName: 'James Moore', unit: 'E-401', penaltyType: 'Noise Complaint', amount: 150.00, description: 'Construction work on Sunday', status: 'Outstanding' },
  { id: 'PEN-1020', issueDate: 'Oct 17, 2023', residentName: 'Karen Hall', unit: 'B-202', penaltyType: 'Late Payment', amount: 50.00, description: 'Security deposit balance overdue', status: 'Settled' },
];

const StatusBadge = ({ status }) => {
  const isSettled = status === 'Settled';
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${isSettled ? 'bg-emerald-500' : 'bg-orange-500'}`} />
      <span className={`text-xs font-semibold ${isSettled ? 'text-emerald-600' : 'text-orange-600'}`}>
        {status}
      </span>
    </div>
  );
};

const PenaltyTypeBadge = ({ type }) => {
  const getStyles = (t) => {
    switch (t) {
      case 'Late Payment': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Parking Violation': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Noise Complaint': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border leading-tight inline-block whitespace-nowrap ${getStyles(type)}`}>
      {type}
    </span>
  );
};

const ResidentPenaltyFineRegistry =() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [penalties] = useState(INITIAL_DATA);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate Paginated Data
  const { currentItems, totalPages, startIndex, endIndex } = useMemo(() => {
    const total = penalties.length;
    const pages = Math.ceil(total / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, total);
    const items = penalties.slice(start, end);

    return { 
      currentItems: items, 
      totalPages: pages, 
      startIndex: total === 0 ? 0 : start + 1, 
      endIndex: end 
    };
  }, [penalties, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

   const handleConfirmDelete = () => {
        setIsDeleteModalOpen(false);
    };

  return (
    <DashboardLayout role="society-admin">
    <div className="min-h-screen text-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold  text-[#0F172A] tracking-wide mb-2">Resident Penalty & Fine Registry</h1>
            <p className="text-[#64748B] font-medium mt-1 text-sm md:text-base">Manage and monitor housing society policy violations and penalties.</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm w-fit">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative w-full lg:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search by unit (e.g. B-402)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full lg:w-56">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
                <option>Issue Date: All Time</option>
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>

            <div className="relative w-full lg:w-56">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
                <option>All Penalty Types</option>
                <option>Late Payment</option>
                <option>Parking Violation</option>
                <option>Noise Complaint</option>
              </select>
            </div>

            <button className="w-full lg:w-auto px-8 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all text-sm">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC]/50 uppercase text-[11px] font-bold tracking-widest text-[#94A3B8]">
                  <th className="px-6 py-4 ">Issue Date</th>
                  <th className="px-6 py-4 ">Resident Name</th>
                  <th className="px-6 py-4 ">Penalty Type</th>
                  <th className="px-6 py-4 ">Amount</th>
                  <th className="px-6 py-4 ">Description</th>
                  <th className="px-6 py-4 ">Status</th>
                  <th className="px-6 py-4 ">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-800 leading-tight">
                          {item.issueDate}
                        </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-medium">ID: {item.id}</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-bold text-xs border-2 border-white shadow-sm ring-1 ring-slate-100">
                          {item.residentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-bold ">{item.residentName}</div>
                          <div className="text-[10px] text-slate-400 font-medium">Unit: {item.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <PenaltyTypeBadge type={item.penaltyType} />
                    </td>
                    <td className="px-6 py-6 text-center whitespace-nowrap font-bold  text-sm">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm text-[#475569] max-w-[240px] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button 
                              onClick={() => setIsDeleteModalOpen(true)}
                              className="p-2 hover:bg-red-50 text-[#DC2626] rounded-lg transition-colors" 
                              title="Delete record"
                              >
                              <Trash2 size={18} />
                              </button>
                      </div>
                    </td>
                  </tr>
                ))) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="text-slate-300" size={48} />
                        <p className="text-slate-500 font-medium">No records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Functional Pagination Footer */}
          <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 bg-white">
            <span className="text-sm text-[#64748B] font-medium mb-4 md:mb-0">
              Showing <span className="font-semibold text-slate-900"> {startIndex} </span> to <span className="font-semibold text-slate-900"> {endIndex} </span> of <span className="font-semibold text-slate-900"> {penalties.length} </span> active penalties
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1.5 transition-colors ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                    currentPage === page 
                      ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' 
                        : 'text-[#475569] hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1.5 transition-colors ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-400 font-medium tracking-wide">
          Society Admin Portal v2.4.0 • Internal Registry Secured
        </div>
      </div>
      <DeleteConfirmationModal 
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
            />
    </div>
    </DashboardLayout>
  );
}

export default ResidentPenaltyFineRegistry;