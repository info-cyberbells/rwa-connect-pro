import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  AlertCircle,
  FilePenLine
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import DeleteConfirmationModal from './Delete';

const INITIAL_DATA = [
  { id: 1, billingDate: 'Oct 01, 2023', billingTime: '08:00 AM', unit: 'B402', wing: 'WING B', recipient: 'John Doe', chargeTitle: 'Monthly Maintenance', amount: 245.00, dueDate: 'Oct 15, 2023', status: 'Paid' },
  { id: 2, billingDate: 'Oct 01, 2023', billingTime: '08:00 AM', unit: 'A105', wing: 'WING A', recipient: 'Sarah Miller', chargeTitle: 'Monthly Maintenance', amount: 245.00, dueDate: 'Oct 15, 2023', status: 'Overdue' },
  { id: 3, billingDate: 'Oct 05, 2023', billingTime: '02:15 PM', unit: 'C902', wing: 'WING C', recipient: 'Robert White', chargeTitle: 'Electricity Utility', amount: 82.40, dueDate: 'Oct 20, 2023', status: 'Unpaid' },
  { id: 4, billingDate: 'Sep 28, 2023', billingTime: '10:00 AM', unit: 'D201', wing: 'WING D', recipient: 'Emily Lewis', chargeTitle: 'Clubhouse Booking Fee', amount: 50.00, dueDate: 'Oct 10, 2023', status: 'Paid' },
  { id: 5, billingDate: 'Sep 25, 2023', billingTime: '09:00 AM', unit: 'B102', wing: 'WING B', recipient: 'Michael Brown', chargeTitle: 'Monthly Maintenance', amount: 245.00, dueDate: 'Oct 05, 2023', status: 'Paid' },
  { id: 6, billingDate: 'Sep 22, 2023', billingTime: '11:30 AM', unit: 'A304', wing: 'WING A', recipient: 'Jessica Davis', chargeTitle: 'Water Charges', amount: 45.50, dueDate: 'Oct 02, 2023', status: 'Unpaid' },
  { id: 7, billingDate: 'Sep 20, 2023', billingTime: '03:45 PM', unit: 'C110', wing: 'WING C', recipient: 'David Wilson', chargeTitle: 'Monthly Maintenance', amount: 245.00, dueDate: 'Sep 30, 2023', status: 'Overdue' },
  { id: 8, billingDate: 'Sep 15, 2023', billingTime: '08:15 AM', unit: 'D405', wing: 'WING D', recipient: 'Lisa Taylor', chargeTitle: 'Gym Membership', amount: 30.00, dueDate: 'Sep 25, 2023', status: 'Paid' },
  { id: 9, billingDate: 'Sep 10, 2023', billingTime: '10:00 AM', unit: 'B201', wing: 'WING B', recipient: 'Kevin Moore', chargeTitle: 'Monthly Maintenance', amount: 245.00, dueDate: 'Sep 20, 2023', status: 'Paid' },
  { id: 10, billingDate: 'Sep 05, 2023', billingTime: '01:00 PM', unit: 'A202', wing: 'WING A', recipient: 'Anna Taylor', chargeTitle: 'Electricity Utility', amount: 95.20, dueDate: 'Sep 15, 2023', status: 'Unpaid' }
];

const ROWS_PER_PAGE = 4;

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-[#DCFCE7] text-[#15803D] border-emerald-100",
    Overdue: "bg-[#FEE2E2] text-[#B91C1C] border-red-100",
    Unpaid: "bg-[#FEF3C7] text-[#B45309] border-amber-100"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || "bg-gray-50 text-gray-600"}`}>
      {status}
    </span>
  );
};

const UnitBadge = ({ unit, wing, recipient }) => {
  const getBgColor = (unit) => {
    if (unit.startsWith('B')) return 'bg-blue-50 text-blue-600';
    if (unit.startsWith('A')) return 'bg-purple-50 text-purple-600';
    if (unit.startsWith('C')) return 'bg-orange-50 text-orange-600';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getBgColor(unit)}`}>
        {unit}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-[#334155] truncate">{recipient}</span>
        <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold">{wing}</span>
      </div>
    </div>
  );
};


const SocietyMaintainanceCharges = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState(INITIAL_DATA);
    const [currentPage, setCurrentPage] = useState(1);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    // Filter logic
    const filteredData = useMemo(() => {
        setCurrentPage(1); // Reset to page 1 on search
        return data.filter(item => 
        item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, data]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        return filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);
    }, [filteredData, currentPage]);

    const handleDelete = (id) => {
        setData(prev => prev.filter(item => item.id !== id));
    };

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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold  text-[#0F172A] tracking-wide mb-2">Society Maintenance Charges</h1>
            <p className="text-base text-[#64748B] font-medium">Manage and track all housing society maintenance and utility billing records.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors shadow-sm self-start md:self-center">
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by unit or name..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:flex-[0.6]">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select className="w-full pl-10 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none text-sm cursor-pointer">
                  <option>Last 30 Days</option>
                  <option>Last 6 Months</option>
                  <option>Year to Date</option>
                </select>
              </div>

              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select className="w-full pl-10 pr-1.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none text-sm cursor-pointer">
                  <option>All Categories</option>
                  <option>Maintenance</option>
                  <option>Utilities</option>
                  <option>Fine</option>
                </select>
              </div>
            </div>

            <button className="bg-[#3B82F6] hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC]/50 uppercase text-[11px] font-bold tracking-widest text-[#94A3B8]">
                  <th className="px-6 py-5">Billing Date</th>
                  <th className="px-6 py-5">Recipient Unit</th>
                  <th className="px-6 py-5">Charge Title</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Due Date</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedData.length > 0 ? paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#334155] whitespace-nowrap">{item.billingDate}</span>
                        <span className="text-[10px] text-[#94A3B8] font-medium whitespace-nowrap">Generated {item.billingTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <UnitBadge unit={item.unit} wing={item.wing} recipient={item.recipient} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#475569] whitespace-nowrap">{item.chargeTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#334155]">${item.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#475569] whitespace-nowrap">{item.dueDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 ">
                        <button className="p-2 hover:bg-blue-50 text-[#2563EB] rounded-lg transition-colors" title="View details">
                          <FilePenLine size={18} />
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
                )) : (
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

          {/* Pagination Footer */}
          <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#64748B] tracking-normal">
              Showing <span className="font-semibold text-slate-900">
                {filteredData.length > 0 ? (currentPage - 1) * ROWS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)}
              </span> of {filteredData.length} records
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      page === currentPage 
                        ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' 
                        : 'text-[#475569] hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex flex-col items-center justify-center gap-1 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
          <p>Society Admin Portal v2.4.0 • Maintenance Ledger Verified</p>
        </div>
      </div>
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
    </DashboardLayout>
  )
}

export default SocietyMaintainanceCharges