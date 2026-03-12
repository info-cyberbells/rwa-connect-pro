import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addNewResident, resetAdminState, getResidents, getResidentById, updateResident, toggleResidentStatus } from "../../features/admin/adminSlice";

import {
  Search, Plus, Users, CheckCircle, Clock, X, Home, User, Car,
  Mail, Phone, MapPin, Shield, Building2, ChevronRight, MoreHorizontal,
  Eye, Pencil, PowerOff
} from 'lucide-react';

import { DashboardLayout } from "../../components/layout/DashboardLayout";

const ResidentDirectory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, error, selectedResident, residents } = useAppSelector((state) => state.admin);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', familyMembers: 4,
    unit: {
      flatNumber: '', towerBlock: '', floor: 1, type: '3BHK',
      areaSqFt: 1450, ownershipType: 'owner', parkingSlots: '',
      moveInDate: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => { dispatch(getResidents()); }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      alert(isEditMode ? "Resident Updated Successfully!" : "Resident Added Successfully!");
      handleCloseModal();
      dispatch(resetAdminState());
      dispatch(getResidents());
    }
    if (error) { alert("Error: " + error); dispatch(resetAdminState()); }
  }, [isSuccess, error, dispatch]);

  const handleCloseModal = () => {
    setShowAddModal(false); setIsEditMode(false); setCurrentEditingId(null);
    setFormData({ name: '', email: '', password: '', phone: '', familyMembers: 4, unit: { flatNumber: '', towerBlock: '', floor: 1, type: '3BHK', areaSqFt: 1450, ownershipType: 'owner', parkingSlots: '', moveInDate: new Date().toISOString().split('T')[0] } });
  };

  const handleEditClick = (res: any) => {
    setIsEditMode(true); setCurrentEditingId(res._id);
    setFormData({ name: res.name || '', email: res.email || '', password: '', phone: res.phone || '', familyMembers: res.familyMembers || 1, unit: { flatNumber: res.unit?.flatNumber || '', towerBlock: res.unit?.towerBlock || '', floor: res.unit?.floor || 1, type: res.unit?.type || '3BHK', areaSqFt: res.unit?.areaSqFt || 1450, ownershipType: res.unit?.ownershipType || 'owner', parkingSlots: res.unit?.parkingSlots?.join(', ') || '', moveInDate: res.unit?.moveInDate ? new Date(res.unit.moveInDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0] } });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedUnit = { ...formData.unit, parkingSlots: typeof formData.unit.parkingSlots === 'string' ? formData.unit.parkingSlots.split(',').map(s => s.trim()).filter(s => s !== "") : formData.unit.parkingSlots };
    const payload = { name: formData.name, email: formData.email, phone: formData.phone, familyMembers: formData.familyMembers, unit: formattedUnit, ...(formData.password && { password: formData.password }) };
    if (isEditMode && currentEditingId) { dispatch(updateResident({ id: currentEditingId, data: { user: payload } })); }
    else { dispatch(addNewResident(payload)); }
  };

  const handleViewDetails = async (residentId: string) => {
    await dispatch(getResidentById(residentId));
    setShowResidentModal(true);
  };

  const filteredResidents = residents?.filter((res: any) =>
    res.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.unit?.flatNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avatarColors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500'];
  const getAvatarColor = (name: string) => avatarColors[name?.charCodeAt(0) % avatarColors.length] || 'bg-slate-400';

  return (
    <DashboardLayout role="society-admin">
      <div className="max-w-[1600px] mx-auto">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Resident Directory</h1>
            </div>
            <p className="text-slate-400 text-sm pl-3.5">Manage and monitor all members of Greenwood Heights</p>
          </div>
          <button
            onClick={() => { setIsEditMode(false); setShowAddModal(true); }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={16} /> Add New Member
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Users, label: "Total Members", value: String(residents?.length || 0), color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { icon: CheckCircle, label: "Verified", value: "94.2%", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { icon: Clock, label: "Pending KYC", value: "12", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} className={`bg-white rounded-2xl border ${border} p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`${bg} ${color} p-3 rounded-xl`}><Icon size={20} /></div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{label}</p>
                <p className="text-2xl font-black text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, flat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-300 transition-colors"
              />
            </div>
            <span className="text-xs text-slate-400 font-semibold ml-auto">{filteredResidents?.length || 0} residents</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  {["Resident", "Unit", "Occupancy", "Contact", "Status", "Action"].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredResidents?.length > 0 ? filteredResidents.map((res: any, i: number) => (
                  <tr key={res._id} className="hover:bg-slate-50/70 transition-colors group">

                    {/* Resident Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${getAvatarColor(res.name)} rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0`}>
                          {res.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{res.name}</p>
                          <p className="text-[11px] text-slate-400">
                            Joined {new Date(res.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Building2 size={13} className="text-slate-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{res.unit?.towerBlock}-{res.unit?.flatNumber}</span>
                      </div>
                    </td>

                    {/* Occupancy */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide
                        ${res.unit?.ownershipType === 'owner' ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'}`}>
                        {res.unit?.ownershipType}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <Phone size={11} className="text-slate-400" /> {res.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Mail size={11} /> {res.email}
                        </div>
                      </div>
                    </td>

                    {/* KYC Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase
                        ${res.kyc?.verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${res.kyc?.verified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {res.kyc?.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">

                        {/* Toggle */}
                        <button
                          onClick={() => dispatch(toggleResidentStatus(res._id))}
                          title={res.isActive ? "Deactivate" : "Activate"}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200 flex-shrink-0
                            ${res.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200
                            ${res.isActive ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                        </button>

                        {/* View */}
                        <button
                          onClick={() => handleViewDetails(res._id)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEditClick(res)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                          <Users size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm font-semibold">No residents found</p>
                        {searchQuery && <p className="text-slate-300 text-xs">Try a different search term</p>}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── ADD / EDIT MODAL ── */}
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-800">{isEditMode ? "Update Resident" : "Add New Resident"}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{isEditMode ? "Modify details of existing member" : "Register a new society member"}</p>
                </div>
                <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto">

                  <SectionHeader icon={<User size={13} />} label="Personal Information" color="text-blue-600" />

                  <FormField label="Full Name">
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="Sneha Joshi" />
                  </FormField>
                  <FormField label="Phone Number">
                    <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" placeholder="+91 98765 43210" />
                  </FormField>
                  <FormField label="Email Address">
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="sneha@gmail.com" />
                  </FormField>
                  <FormField label={isEditMode ? "New Password (optional)" : "Password"}>
                    <input type="password" required={!isEditMode} placeholder={isEditMode ? "Leave blank to keep" : "••••••••"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" />
                  </FormField>

                  <SectionHeader icon={<Home size={13} />} label="Unit Details" color="text-emerald-600" />

                  <FormField label="Flat / Unit No.">
                    <input type="text" required value={formData.unit.flatNumber} onChange={(e) => setFormData({ ...formData, unit: { ...formData.unit, flatNumber: e.target.value } })} className="input-field" placeholder="301" />
                  </FormField>
                  <FormField label="Tower / Block">
                    <input type="text" required value={formData.unit.towerBlock} onChange={(e) => setFormData({ ...formData, unit: { ...formData.unit, towerBlock: e.target.value } })} className="input-field" placeholder="B" />
                  </FormField>
                  <FormField label="Floor">
                    <input type="number" value={formData.unit.floor} onChange={(e) => setFormData({ ...formData, unit: { ...formData.unit, floor: Number(e.target.value) } })} className="input-field" />
                  </FormField>
                  <FormField label="Ownership Type">
                    <select value={formData.unit.ownershipType} onChange={(e) => setFormData({ ...formData, unit: { ...formData.unit, ownershipType: e.target.value } })} className="input-field">
                      <option value="owner">Owner</option>
                      <option value="tenant">Tenant</option>
                    </select>
                  </FormField>

                  <SectionHeader icon={<Car size={13} />} label="Additional Info" color="text-amber-600" />

                  <div className="col-span-full">
                    <FormField label="Parking Slots (comma separated)">
                      <input type="text" placeholder="P-1, P-2" value={formData.unit.parkingSlots} onChange={(e) => setFormData({ ...formData, unit: { ...formData.unit, parkingSlots: e.target.value } })} className="input-field" />
                    </FormField>
                  </div>
                </div>

                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all disabled:opacity-60">
                    {isLoading ? "Saving..." : isEditMode ? "Update Resident" : "Create Resident"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── VIEW DETAILS MODAL ── */}
        {showResidentModal && selectedResident && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

              {/* Modal Header with gradient */}
              <div className="relative px-8 py-6 border-b border-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-slate-50" />
                <div className="relative flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${getAvatarColor(selectedResident.name)} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                      {selectedResident.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800">{selectedResident.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase ${selectedResident.kyc?.verified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {selectedResident.kyc?.verified ? '✓ Verified' : 'KYC Pending'}
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2.5 py-1 rounded-lg font-black uppercase">
                          {selectedResident.unit?.ownershipType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowResidentModal(false)} className="p-2 hover:bg-white/80 rounded-xl text-slate-400 transition-colors"><X size={18} /></button>
                </div>
              </div>

              <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto">
                <SectionHeader icon={<User size={13} />} label="Personal Information" color="text-blue-600" />
                <DetailField label="Email Address" value={selectedResident.email} />
                <DetailField label="Phone Number" value={selectedResident.phone} />
                <DetailField label="Family Members" value={selectedResident.familyMembers} />
                <DetailField label="Member Since" value={new Date(selectedResident.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />

                <SectionHeader icon={<Home size={13} />} label="Property Details" color="text-emerald-600" />
                <DetailField label="Flat / Unit" value={`${selectedResident.unit?.towerBlock}-${selectedResident.unit?.flatNumber}`} />
                <DetailField label="Floor & Type" value={`${selectedResident.unit?.floor} Floor (${selectedResident.unit?.type})`} />
                <DetailField label="Area" value={`${selectedResident.unit?.areaSqFt} sqft`} />
                <DetailField label="Move-In Date" value={selectedResident.unit?.moveInDate ? new Date(selectedResident.unit.moveInDate).toLocaleDateString('en-IN') : "N/A"} />

                {selectedResident.unit?.ownershipType === 'tenant' && (
                  <>
                    <SectionHeader icon={<Users size={13} />} label="Owner Information" color="text-violet-600" />
                    <DetailField label="Owner Name" value={selectedResident.unit?.ownerName} />
                    <DetailField label="Owner Phone" value={selectedResident.unit?.ownerPhone} />
                  </>
                )}

                <SectionHeader icon={<Car size={13} />} label="Parking Slots" color="text-amber-600" />
                <div className="col-span-full flex flex-wrap gap-2">
                  {selectedResident.unit?.parkingSlots?.length > 0 ? (
                    selectedResident.unit.parkingSlots.map((slot: string) => (
                      <span key={slot} className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-black text-slate-600">
                        🅿 {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs italic">No parking slots assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inline styles for input-field */}
        <style>{`
          .input-field {
            width: 100%;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 10px 14px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.15s;
            color: #1e293b;
          }
          .input-field:focus {
            border-color: #3b82f6;
            background: #fff;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

/* ── Helper Components ── */

const SectionHeader = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
  <div className={`col-span-full flex items-center gap-2 ${color} font-black text-[10px] uppercase tracking-widest pt-2 pb-1 border-b border-slate-100`}>
    {icon} {label}
  </div>
);

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const DetailField = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</label>
    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700">
      {value || "N/A"}
    </div>
  </div>
);

export default ResidentDirectory;