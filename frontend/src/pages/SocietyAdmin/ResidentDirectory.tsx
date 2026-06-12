import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  addNewResident, resetAdminState, getResidents, getResidentById,
  updateResident, toggleResidentStatus, addVehicle,
  deleteVehicle, getUserActivity
} from "../../features/admin/adminSlice";

import {
  Search, Plus, Users, CheckCircle, Clock, X, Home, User, Car, Bike,
  Mail, Phone, Building2, Eye, Pencil, Trash2, PlusCircle, ExternalLink
} from 'lucide-react';

import { DashboardLayout } from "../../components/layout/DashboardLayout";

const inputCls = "w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-blue-400 focus:bg-card transition-colors placeholder:text-muted-foreground";

const VEHICLE_TYPES = ["car", "bike", "scooter", "other"] as const;
type VehicleType = typeof VEHICLE_TYPES[number];
interface Vehicle { _id?: string; type: VehicleType; model?: string; vehicleNumber?: string; }

const vehicleIcons = {
  car: <Car size={16} />,
  bike: <Bike size={16} />,
  scooter: <Bike size={16} />,
  other: <Car size={16} />
};

const vehicleColors: Record<VehicleType, string> = {
  car: "bg-blue-50 text-blue-600 border-blue-100",
  bike: "bg-orange-50 text-orange-600 border-orange-100",
  scooter: "bg-emerald-50 text-emerald-600 border-emerald-100",
  other: "bg-muted text-muted-foreground border-border",
};

/* ══════════════════════════════════════════
   ID PROOF CARD — reusable in both modals
══════════════════════════════════════════ */
const IdProofCard = ({ idProof }: { idProof: any }) => {
  let proof: { type?: string; number?: string; documentUrl?: string } = {};
  try {
    proof = typeof idProof === 'string' ? JSON.parse(idProof) : idProof;
  } catch {
    return <p className="text-xs text-muted-foreground italic">Invalid ID proof data</p>;
  }

  if (!proof || (!proof.type && !proof.number)) {
    return (
      <div className="bg-muted/50 border border-dashed border-border rounded-xl py-5 text-center">
        <p className="text-muted-foreground text-xs">No ID proof uploaded</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 bg-muted/50 border border-border rounded-xl px-4 py-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Type</p>
          <p className="text-sm font-bold text-foreground uppercase">{proof.type || '—'}</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Number</p>
          <p className="text-sm font-mono font-semibold text-foreground">{proof.number || '—'}</p>
        </div>
      </div>
      {proof.documentUrl ? (
        <a href={proof.documentUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
          <img src={proof.documentUrl} alt="ID Document"
            className="w-full max-h-48 object-cover rounded-xl border border-border group-hover:opacity-80 transition-opacity cursor-pointer" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <ExternalLink size={11} /> Open full image
            </div>
          </div>
        </a>
      ) : (
        <div className="bg-muted/50 border border-dashed border-border rounded-xl py-3 text-center">
          <p className="text-muted-foreground text-xs">No document image uploaded</p>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   INLINE ID PROOF EDITOR — for Edit Modal
══════════════════════════════════════════ */
const InlineIdProofEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  let parsed: { type?: string; number?: string; documentUrl?: string } | null = null;
  try { parsed = value ? (typeof value === 'string' ? JSON.parse(value) : value) : null; } catch {}

  const handleSave = () => {
    try {
      JSON.parse(draft);
      onChange(draft);
      setEditing(false);
    } catch {
      alert("Please enter valid JSON");
    }
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-2">
        <textarea autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
          className={inputCls} rows={3} placeholder='{"type":"pan","number":"ABCDE1234F"}' />
        <p className="text-[10px] text-muted-foreground">Note: Document URL will be set automatically by the backend</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setDraft(value); setEditing(false); }}
            className="flex-1 py-1.5 rounded-xl text-xs font-bold text-muted-foreground bg-muted hover:bg-muted/80 transition-colors">Cancel</button>
          <button type="button" onClick={handleSave}
            className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">Save</button>
        </div>
      </div>
    );
  }

  if (parsed) {
    return (
      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => { setDraft(value); setEditing(true); }}
          className="w-full flex items-center justify-between bg-muted/50 border border-border rounded-xl px-4 py-3 text-left hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Type</p>
              <p className="text-sm font-bold text-foreground uppercase">{parsed.type || '—'}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Number</p>
              <p className="text-sm font-mono font-semibold text-foreground">{parsed.number || '—'}</p>
            </div>
          </div>
          <Pencil size={13} className="text-muted-foreground group-hover:text-blue-400 transition-colors flex-shrink-0" />
        </button>
        {parsed.documentUrl ? (
          <a href={parsed.documentUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
            <img src={parsed.documentUrl} alt="ID Document"
              className="w-full max-h-40 object-cover rounded-xl border border-border group-hover:opacity-80 transition-opacity cursor-pointer" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <ExternalLink size={11} /> Open full image
              </div>
            </div>
          </a>
        ) : (
          <div className="bg-muted/50 border border-dashed border-border rounded-xl py-3 text-center">
            <p className="text-muted-foreground text-xs">No document image</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { try { JSON.parse(draft); onChange(draft); } catch {} }}
        className={inputCls} rows={2} placeholder='{"type":"aadhaar","number":"XXXX-XXXX-5678"}' />
    </div>
  );
};

/* ══════════════════════════════════════════
   VEHICLE POPUP
══════════════════════════════════════════ */
const VehiclePopup = ({ resident, onClose }: { resident: any; onClose: () => void }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(resident.vehicles || []);
  const [type, setType] = useState<VehicleType>("car");
  const [model, setModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dispatch = useAppDispatch();

  const handleAdd = async () => {
    setAdding(true);
    const res = await dispatch(addVehicle({ userId: resident._id, data: { type, model, vehicleNumber } }));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(getResidents());
      setModel(""); setVehicleNumber(""); setType("car"); setShowAddForm(false);
    } else { alert(res.payload || "Failed to add vehicle"); }
    setAdding(false);
  };

  const handleDelete = async (vehicleId: string) => {
    setDeletingId(vehicleId);
    const res = await dispatch(deleteVehicle({ userId: resident._id, vehicleId }));
    if (res.meta.requestStatus === "fulfilled") { dispatch(getResidents()); }
    else { alert(res.payload || "Failed to delete vehicle"); }
    setDeletingId(null);
  };

  const typeConfig: Record<VehicleType, { label: string; color: string; bg: string; border: string }> = {
    car:     { label: "Car",     color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200" },
    bike:    { label: "Bike",    color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-200" },
    scooter: { label: "Scooter", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    other:   { label: "Other",   color: "text-foreground",   bg: "bg-muted",  border: "border-border" },
  };

  return (
    <>
      <div className="fixed inset-0 z-[250] bg-black/30 backdrop-blur-[2px]" />
      <div ref={popupRef} className="fixed z-[260] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-2xl shadow-2xl border border-border w-[340px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Car size={17} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-tight">{resident.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{resident.unit?.towerBlock}-{resident.unit?.flatNumber} · Vehicles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors"><X size={15} /></button>
        </div>

        <div className="px-4 py-3 max-h-56 overflow-y-auto space-y-2">
          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center border border-border">
                <Car size={20} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-xs font-medium">No vehicles added yet</p>
            </div>
          ) : vehicles.map((v) => {
            const cfg = typeConfig[v.type] || typeConfig.other;
            return (
              <div key={v._id} className="flex items-center justify-between bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 group hover:border-border transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${cfg.bg} ${cfg.border} border rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className={cfg.color}>{vehicleIcons[v.type]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{v.model || v.type}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{v.vehicleNumber || "No plate"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg border ${vehicleColors[v.type]}`}>{v.type}</span>
                  {v._id && (
                    <button onClick={() => handleDelete(v._id!)} disabled={deletingId === v._id}
                      className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-40">
                      {deletingId === v._id ? <span className="text-[10px] text-muted-foreground">...</span> : <Trash2 size={13} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showAddForm ? (
          <div className="px-4 pb-4 pt-3 border-t border-border space-y-3">
            <div className="grid grid-cols-4 gap-1.5">
              {VEHICLE_TYPES.map((t) => {
                const cfg = typeConfig[t];
                const active = type === t;
                return (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                      active ? `${cfg.bg} ${cfg.color} ${cfg.border} border-2` : "bg-muted/50 text-muted-foreground border-border hover:border-border"
                    }`}>
                    <span className={active ? cfg.color : "text-muted-foreground"}>{vehicleIcons[t]}</span>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
            <input type="text" placeholder="Model (e.g. Honda City)" value={model}
              onChange={(e) => setModel(e.target.value)} className={inputCls} />
            <input type="text" placeholder="Plate Number (MH12AB1234)" value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)} className={inputCls} />
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { setShowAddForm(false); setModel(""); setVehicleNumber(""); }}
                className="flex-1 py-2 rounded-xl text-sm font-bold text-muted-foreground bg-muted hover:bg-muted transition-colors">Cancel</button>
              <button type="button" onClick={handleAdd} disabled={adding}
                className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-60">
                {adding ? "Adding..." : "Add Vehicle"}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 pb-4 pt-3 border-t border-border">
            <button type="button" onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors">
              <PlusCircle size={15} /> Add Vehicle
            </button>
          </div>
        )}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const ResidentDirectory: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem("role") || "guard";
  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, error, selectedResident, residents } = useAppSelector((state) => state.admin);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehiclePopupResident, setVehiclePopupResident] = useState<any | null>(null);
  const [viewResidentData, setViewResidentData] = useState<any | null>(null);
  const [activity, setActivity] = useState<any[]>([]);

  const emptyAddForm = {
    name: '', email: '', password: '', phone: '', familyMembers: 4, role: 'user',
    idProofType: 'aadhaar', idProofNumber: '', idProofDoc: null as File | null,
    vehicles: [] as { type: VehicleType; model: string; vehicleNumber: string }[],
    unit: { flatNumber: '', towerBlock: '', floor: 1, type: '3BHK', areaSqFt: 1450, ownershipType: 'owner', ownerName: '', ownerPhone: '', parkingSlots: '', moveInDate: new Date().toISOString().split('T')[0] },
  };
  const emptyEditForm = {
    name: '', email: '', phone: '', password: '', familyMembers: 4,
    idProof: '', idProofType: 'aadhaar', idProofNumber: '', idProofDoc: null as File | null,
    vehicles: [] as { type: VehicleType; model: string; vehicleNumber: string }[],
    unit: { flatNumber: '', towerBlock: '', floor: 1, type: '3BHK', areaSqFt: 1450, ownershipType: 'owner', ownerName: '', ownerPhone: '', parkingSlots: '', moveInDate: new Date().toISOString().split('T')[0] },
  };

  const [addForm, setAddForm] = useState(emptyAddForm);
  const [editForm, setEditForm] = useState(emptyEditForm);

  useEffect(() => { dispatch(getResidents()); }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      alert(showEditModal ? "Resident Updated Successfully!" : "Resident Added Successfully!");
      handleCloseAdd(); handleCloseEdit();
      dispatch(resetAdminState()); dispatch(getResidents());
    }
    if (error) { alert("Error: " + error); dispatch(resetAdminState()); }
  }, [isSuccess, error]);

  const handleCloseAdd = () => { setShowAddModal(false); setAddForm(emptyAddForm); };
  const handleCloseEdit = () => { setShowEditModal(false); setCurrentEditingId(null); setEditForm(emptyEditForm); };

  const handleEditClick = async (res: any) => {
    setCurrentEditingId(res._id);
    const result = await dispatch(getResidentById(res._id));
    const fullRes = result.meta.requestStatus === 'fulfilled' ? (result as any).payload : res;
    const idProofObj = fullRes.idProof ? (typeof fullRes.idProof === 'string' ? JSON.parse(fullRes.idProof) : fullRes.idProof) : null;
    setEditForm({
      name: fullRes.name || '', email: fullRes.email || '', phone: fullRes.phone || '', password: '',
      familyMembers: fullRes.familyMembers || 1,
      idProof: fullRes.idProof ? JSON.stringify(fullRes.idProof) : '',
      idProofType: idProofObj?.type || 'aadhaar',
      idProofNumber: idProofObj?.number || '',
      idProofDoc: null,
      vehicles: (fullRes.vehicles || []).map((v: any) => ({ type: v.type, model: v.model || '', vehicleNumber: v.vehicleNumber || '' })),
      unit: {
        flatNumber: fullRes.unit?.flatNumber || '', towerBlock: fullRes.unit?.towerBlock || '',
        floor: fullRes.unit?.floor || 1, type: fullRes.unit?.type || '3BHK', areaSqFt: fullRes.unit?.areaSqFt || 1450,
        ownershipType: fullRes.unit?.ownershipType || 'owner', ownerName: fullRes.unit?.ownerName || '',
        ownerPhone: fullRes.unit?.ownerPhone || '', parkingSlots: fullRes.unit?.parkingSlots?.join(', ') || '',
        moveInDate: fullRes.unit?.moveInDate ? new Date(fullRes.unit.moveInDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      },
    });
    setShowEditModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", addForm.name); form.append("email", addForm.email);
    form.append("phone", addForm.phone); form.append("password", addForm.password);
    form.append("role", addForm.role); // NEW: Sending role to backend
    form.append("familyMembers", String(addForm.familyMembers));
    form.append("unit", JSON.stringify({ ...addForm.unit, parkingSlots: addForm.unit.parkingSlots.split(",").map(s => s.trim()).filter(Boolean) }));
    if (addForm.idProofType && addForm.idProofNumber) {
      form.append("idProof", JSON.stringify({ type: addForm.idProofType, number: addForm.idProofNumber }));
    }
    if (addForm.idProofDoc) form.append("idProofDoc", addForm.idProofDoc);
    if (addForm.vehicles.length > 0) form.append("vehicles", JSON.stringify(addForm.vehicles));
    dispatch(addNewResident(form));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditingId) return;
    const form = new FormData();
    form.append("name", editForm.name); form.append("phone", editForm.phone);
    form.append("familyMembers", String(editForm.familyMembers));
    if (editForm.password) form.append("password", editForm.password);
    const unitPayload: any = {
      flatNumber: editForm.unit.flatNumber, towerBlock: editForm.unit.towerBlock,
      floor: editForm.unit.floor, type: editForm.unit.type, areaSqFt: editForm.unit.areaSqFt,
      ownershipType: editForm.unit.ownershipType, moveInDate: editForm.unit.moveInDate,
      parkingSlots: editForm.unit.parkingSlots.split(",").map(s => s.trim()).filter(Boolean),
    };
    if (editForm.unit.ownershipType === 'tenant') { unitPayload.ownerName = editForm.unit.ownerName; unitPayload.ownerPhone = editForm.unit.ownerPhone; }
    form.append("unit", JSON.stringify(unitPayload));
    if (editForm.idProofType && editForm.idProofNumber) {
      form.append("idProof", JSON.stringify({ type: editForm.idProofType, number: editForm.idProofNumber }));
    }
    if (editForm.idProofDoc) form.append("idProofDoc", editForm.idProofDoc);
    if (editForm.vehicles.length > 0) form.append("vehicles", JSON.stringify(editForm.vehicles));
    dispatch(updateResident({ id: currentEditingId, data: form }));
  };

const handleViewDetails = async (residentId: string) => {
  const result = await dispatch(getResidentById(residentId));
  
  if (result.meta.requestStatus === 'fulfilled') {
    setViewResidentData((result as any).payload);

    const actRes = await dispatch(getUserActivity(residentId));

    if (actRes.meta.requestStatus === "fulfilled") {
      const data = (actRes as any).payload?.data || (actRes as any).payload;

      if (data.length === 0) {
        setActivity([
          { action: "User Logged In", createdAt: new Date() },
          { action: "Payment Done", createdAt: new Date() }
        ]);
      } else {
        setActivity(data);
      }
    } else {
      setActivity([]);
    }

    setShowResidentModal(true);
  }
};

  const filteredResidents = residents?.filter((res: any) =>
    res.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.unit?.flatNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avatarColors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500'];
  const getAvatarColor = (name: string) => avatarColors[name?.charCodeAt(0) % avatarColors.length] || 'bg-muted';

  const isGuard = role === 'guard';

  return (
    <DashboardLayout role={role as any}>
      <div className="max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              <h1 className="text-2xl font-black text-foreground tracking-tight">Resident Directory</h1>
            </div>
            <p className="text-muted-foreground text-sm pl-3.5">Manage and monitor all members of your society</p>
          </div>
          {!isGuard && (
            <button onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95">
              <Plus size={16} /> Add New Member
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Users, label: "Total Members", value: String(residents?.length || 0), color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { icon: CheckCircle, label: "Verified", value: "94.2%", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { icon: Clock, label: "Pending KYC", value: "12", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} className={`bg-card rounded-2xl border ${border} p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`${bg} ${color} p-3 rounded-xl`}><Icon size={20} /></div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">{label}</p>
                <p className="text-2xl font-black text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search by name, email, flat..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:border-blue-300 transition-colors" />
            </div>
            <span className="text-xs text-muted-foreground font-semibold ml-auto">{filteredResidents?.length || 0} residents</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  {["Resident", "Unit", "Occupancy", "Contact", "Status", "Action"].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredResidents?.length > 0 ? filteredResidents.map((res: any) => (
                  <tr key={res._id} className="hover:bg-muted/50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${getAvatarColor(res.name)} rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0`}>
                          {res.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{res.name}</p>
                          <p className="text-[11px] text-muted-foreground">Joined {new Date(res.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center"><Building2 size={13} className="text-muted-foreground" /></div>
                        <span className="text-sm font-bold text-foreground">{res.unit?.towerBlock}-{res.unit?.flatNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${res.unit?.ownershipType === 'owner' ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'}`}>
                        {res.unit?.ownershipType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-sm text-foreground"><Phone size={11} className="text-muted-foreground" /> {res.phone}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Mail size={11} /> {res.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${res.kyc?.verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${res.kyc?.verified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {res.kyc?.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {!isGuard && (
                          <>
                            <button onClick={() => dispatch(toggleResidentStatus(res._id))} title={res.isActive ? "Deactivate" : "Activate"}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200 flex-shrink-0 ${res.isActive ? 'bg-emerald-500' : 'bg-muted'}`}>
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-card shadow-sm transition-transform duration-200 ${res.isActive ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                            </button>
                            <button
                              onClick={() => setVehiclePopupResident(vehiclePopupResident?._id === res._id ? null : res)}
                              title="Manage Vehicles"
                              className={`p-1.5 rounded-lg transition-all relative ${vehiclePopupResident?._id === res._id ? 'text-blue-600 bg-blue-100' : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50'}`}>
                              <Car size={15} />
                              {res.vehicles?.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                  {res.vehicles.length}
                                </span>
                              )}
                            </button>
                          </>
                        )}
                        <button onClick={() => handleViewDetails(res._id)} className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
                          <Eye size={15} />
                        </button>
                        {!isGuard && (
                          <button onClick={() => handleEditClick(res)} className="p-1.5 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
                            <Pencil size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center"><Users size={24} className="text-muted-foreground" /></div>
                        <p className="text-muted-foreground text-sm font-semibold">No residents found</p>
                        {searchQuery && <p className="text-muted-foreground text-xs">Try a different search term</p>}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── VEHICLE POPUP ── */}
        {vehiclePopupResident && (
          <VehiclePopup resident={vehiclePopupResident} onClose={() => setVehiclePopupResident(null)} />
        )}

        {/* ── ADD MODAL ── */}
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden">
              <div className="px-8 py-6 border-b border-border flex justify-between items-center">
                <div><h2 className="text-xl font-black text-foreground">Add New Resident</h2><p className="text-xs text-muted-foreground mt-0.5">Register a new society member</p></div>
                <button onClick={handleCloseAdd} className="p-2 hover:bg-muted rounded-xl text-muted-foreground"><X size={18} /></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto">
                  <SectionHeader icon={<User size={13} />} label="Personal Information" color="text-blue-600" />
                  <FormField label="Full Name"><input type="text" required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} className={inputCls} placeholder="Sneha Joshi" /></FormField>
                  <FormField label="Phone Number"><input type="text" required value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} className={inputCls} placeholder="+91 98765 43210" /></FormField>
                  <FormField label="Email Address"><input type="email" required value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} className={inputCls} placeholder="sneha@gmail.com" /></FormField>
                  <FormField label="Password"><input type="password" required value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} className={inputCls} placeholder="••••••••" /></FormField>
                  <FormField label="Account Role">
                    <select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })} className={inputCls}>
                      <option value="user">Residential User (Resident)</option>
                      <option value="guard">Security Guard (Gate)</option>
                    </select>
                  </FormField>
                  <FormField label="Family Members"><input type="number" value={addForm.familyMembers} onChange={e => setAddForm({ ...addForm, familyMembers: Number(e.target.value) })} className={inputCls} /></FormField>

                  <SectionHeader icon={<Home size={13} />} label="Unit Details" color="text-emerald-600" />
                  <FormField label="Flat / Unit No."><input type="text" required value={addForm.unit.flatNumber} onChange={e => setAddForm({ ...addForm, unit: { ...addForm.unit, flatNumber: e.target.value } })} className={inputCls} placeholder="301" /></FormField>
                  <FormField label="Tower / Block"><input type="text" required value={addForm.unit.towerBlock} onChange={e => setAddForm({ ...addForm, unit: { ...addForm.unit, towerBlock: e.target.value } })} className={inputCls} placeholder="B" /></FormField>
                  <FormField label="Floor"><input type="number" value={addForm.unit.floor} onChange={e => setAddForm({ ...addForm, unit: { ...addForm.unit, floor: Number(e.target.value) } })} className={inputCls} /></FormField>
                  <FormField label="Ownership Type">
                    <select value={addForm.unit.ownershipType} onChange={e => setAddForm({ ...addForm, unit: { ...addForm.unit, ownershipType: e.target.value } })} className={inputCls}>
                      <option value="owner">Owner</option><option value="tenant">Tenant</option>
                    </select>
                  </FormField>
                  {addForm.unit.ownershipType === 'tenant' && (<>
                    <FormField label="Owner Name"><input type="text" value={addForm.unit.ownerName} onChange={e => setAddForm({ ...addForm, unit: { ...addForm.unit, ownerName: e.target.value } })} className={inputCls} placeholder="Suresh Patel" /></FormField>
                    <FormField label="Owner Phone"><input type="text" value={addForm.unit.ownerPhone} onChange={e => setAddForm({ ...addForm, unit: { ...addForm.unit, ownerPhone: e.target.value } })} className={inputCls} placeholder="+91 91234 00000" /></FormField>
                  </>)}

                  <SectionHeader icon={<Car size={13} />} label="Additional Info" color="text-amber-600" />
                  <div className="col-span-full">
                    <FormField label="Parking Slots (comma separated)">
                      <input type="text" placeholder="P-1, P-2" value={addForm.unit.parkingSlots} onChange={e => setAddForm({ ...addForm, unit: { ...addForm.unit, parkingSlots: e.target.value } })} className={inputCls} />
                    </FormField>
                  </div>

                  <SectionHeader icon={<User size={13} />} label="ID Proof" color="text-violet-600" />
                  <FormField label="ID Type">
                    <select value={addForm.idProofType} onChange={e => setAddForm({ ...addForm, idProofType: e.target.value })} className={inputCls}>
                      <option value="aadhaar">Aadhaar</option>
                      <option value="pan">PAN</option>
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving Licence</option>
                      <option value="voter_id">Voter ID</option>
                    </select>
                  </FormField>
                  <FormField label="ID Number">
                    <input type="text" placeholder="e.g. ABCDE1234F" value={addForm.idProofNumber} onChange={e => setAddForm({ ...addForm, idProofNumber: e.target.value })} className={inputCls} />
                  </FormField>
                  <div className="col-span-full flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">ID Document (Photo/Scan)</label>
                    {addForm.idProofDoc ? (
                      <div className="flex flex-col gap-2">
                        <img src={URL.createObjectURL(addForm.idProofDoc)} alt="ID Preview" className="w-full max-h-40 object-cover rounded-xl border border-border" />
                        <button type="button" onClick={() => setAddForm({ ...addForm, idProofDoc: null })}
                          className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors self-start">Remove</button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-6 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                        <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center"><Plus size={16} className="text-muted-foreground" /></div>
                        <p className="text-xs font-semibold text-muted-foreground">Click to upload image</p>
                        <p className="text-[10px] text-muted-foreground">PNG, JPG supported</p>
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) setAddForm({ ...addForm, idProofDoc: f }); }} />
                      </label>
                    )}
                  </div>

                  <SectionHeader icon={<Car size={13} />} label="Vehicles (Optional)" color="text-blue-600" />
                  <div className="col-span-full flex flex-col gap-3">
                    {addForm.vehicles.map((v, i) => (
                      <div key={i} className="flex flex-col gap-2 bg-muted/50 border border-border rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Vehicle {i + 1}</p>
                          <button type="button" onClick={() => setAddForm({ ...addForm, vehicles: addForm.vehicles.filter((_, idx) => idx !== i) })}
                            className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X size={13} /></button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <select value={v.type} onChange={e => { const vs = [...addForm.vehicles]; vs[i].type = e.target.value as VehicleType; setAddForm({ ...addForm, vehicles: vs }); }} className={inputCls}>
                            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                          </select>
                          <input type="text" placeholder="Model (Honda City)" value={v.model}
                            onChange={e => { const vs = [...addForm.vehicles]; vs[i].model = e.target.value; setAddForm({ ...addForm, vehicles: vs }); }} className={inputCls} />
                          <input type="text" placeholder="Number (MH12AB1234)" value={v.vehicleNumber}
                            onChange={e => { const vs = [...addForm.vehicles]; vs[i].vehicleNumber = e.target.value; setAddForm({ ...addForm, vehicles: vs }); }} className={inputCls} />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setAddForm({ ...addForm, vehicles: [...addForm.vehicles, { type: 'car', model: '', vehicleNumber: '' }] })}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors">
                      <PlusCircle size={14} /> Add Vehicle
                    </button>
                  </div>

                  <div className="col-span-full bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <p className="text-[11px] text-amber-600 font-semibold">💡 Vehicles can be added after the resident is created — use the 🚗 icon in the table</p>
                  </div>
                </div>
                <div className="px-8 py-5 border-t border-border bg-muted/50/50 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseAdd} className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted">Cancel</button>
                  <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 disabled:opacity-60">
                    {isLoading ? "Saving..." : "Create Resident"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── EDIT MODAL ── */}
        {showEditModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden">
              <div className="px-8 py-6 border-b border-border flex justify-between items-center">
                <div><h2 className="text-xl font-black text-foreground">Update Resident</h2><p className="text-xs text-muted-foreground mt-0.5">Modify details of existing member</p></div>
                <button onClick={handleCloseEdit} className="p-2 hover:bg-muted rounded-xl text-muted-foreground"><X size={18} /></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto">
                  <SectionHeader icon={<User size={13} />} label="Personal Information" color="text-blue-600" />
                  <FormField label="Full Name"><input type="text" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className={inputCls} placeholder="Sneha Joshi" /></FormField>
                  <FormField label="Phone Number"><input type="text" required value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className={inputCls} /></FormField>
                  <FormField label="Email (Read Only)">
                    <div className="w-full bg-muted border border-border rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                      <Mail size={13} className="text-muted-foreground flex-shrink-0" /><span>{editForm.email || '—'}</span>
                    </div>
                  </FormField>
                  <FormField label="New Password (optional)"><input type="password" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} className={inputCls} placeholder="••••••••" /></FormField>
                  <FormField label="Family Members"><input type="number" value={editForm.familyMembers} onChange={e => setEditForm({ ...editForm, familyMembers: Number(e.target.value) })} className={inputCls} /></FormField>

                  <SectionHeader icon={<Home size={13} />} label="Unit Details" color="text-emerald-600" />
                  <FormField label="Flat / Unit No."><input type="text" required value={editForm.unit.flatNumber} onChange={e => setEditForm({ ...editForm, unit: { ...editForm.unit, flatNumber: e.target.value } })} className={inputCls} /></FormField>
                  <FormField label="Tower / Block"><input type="text" required value={editForm.unit.towerBlock} onChange={e => setEditForm({ ...editForm, unit: { ...editForm.unit, towerBlock: e.target.value } })} className={inputCls} /></FormField>
                  <FormField label="Floor"><input type="number" value={editForm.unit.floor} onChange={e => setEditForm({ ...editForm, unit: { ...editForm.unit, floor: Number(e.target.value) } })} className={inputCls} /></FormField>
                  <FormField label="Ownership Type">
                    <select value={editForm.unit.ownershipType} onChange={e => setEditForm({ ...editForm, unit: { ...editForm.unit, ownershipType: e.target.value } })} className={inputCls}>
                      <option value="owner">Owner</option><option value="tenant">Tenant</option>
                    </select>
                  </FormField>
                  {editForm.unit.ownershipType === 'tenant' && (<>
                    <FormField label="Owner Name"><input type="text" value={editForm.unit.ownerName} onChange={e => setEditForm({ ...editForm, unit: { ...editForm.unit, ownerName: e.target.value } })} className={inputCls} /></FormField>
                    <FormField label="Owner Phone"><input type="text" value={editForm.unit.ownerPhone} onChange={e => setEditForm({ ...editForm, unit: { ...editForm.unit, ownerPhone: e.target.value } })} className={inputCls} /></FormField>
                  </>)}
                  <div className="col-span-full">
                    <FormField label="Parking Slots (comma separated)">
                      <input type="text" placeholder="P-1, P-2" value={editForm.unit.parkingSlots} onChange={e => setEditForm({ ...editForm, unit: { ...editForm.unit, parkingSlots: e.target.value } })} className={inputCls} />
                    </FormField>
                  </div>

                  <SectionHeader icon={<User size={13} />} label="ID Proof" color="text-violet-600" />
                  <FormField label="ID Type">
                    <select value={editForm.idProofType} onChange={e => setEditForm({ ...editForm, idProofType: e.target.value })} className={inputCls}>
                      <option value="aadhaar">Aadhaar</option>
                      <option value="pan">PAN</option>
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving Licence</option>
                      <option value="voter_id">Voter ID</option>
                    </select>
                  </FormField>
                  <FormField label="ID Number">
                    <input type="text" placeholder="e.g. ABCDE1234F" value={editForm.idProofNumber} onChange={e => setEditForm({ ...editForm, idProofNumber: e.target.value })} className={inputCls} />
                  </FormField>
                  <div className="col-span-full flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">ID Document (Photo/Scan)</label>
                    {editForm.idProofDoc ? (
                      <div className="flex flex-col gap-2">
                        <img src={URL.createObjectURL(editForm.idProofDoc)} alt="ID Preview" className="w-full max-h-40 object-cover rounded-xl border border-border" />
                        <button type="button" onClick={() => setEditForm({ ...editForm, idProofDoc: null })}
                          className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors self-start">Remove</button>
                      </div>
                    ) : (() => {
                      let existingUrl: string | null = null;
                      try { const parsed = editForm.idProof ? JSON.parse(editForm.idProof) : null; existingUrl = parsed?.documentUrl || null; } catch {}
                      return (
                        <div className="flex flex-col gap-2">
                          {existingUrl && (
                            <div className="relative group">
                              <img src={existingUrl} alt="Current ID Document" className="w-full max-h-40 object-cover rounded-xl border border-border" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={existingUrl} target="_blank" rel="noopener noreferrer"
                                  className="bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <ExternalLink size={11} /> Open full image
                                </a>
                              </div>
                            </div>
                          )}
                          <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all ${existingUrl ? 'py-3 border-border bg-muted/50' : 'py-5 border-border'}`}>
                            <div className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center"><Plus size={14} className="text-muted-foreground" /></div>
                            <p className="text-xs font-semibold text-muted-foreground">{existingUrl ? 'Upload new document (replaces existing)' : 'Click to upload document'}</p>
                            <p className="text-[10px] text-muted-foreground">PNG, JPG supported</p>
                            <input type="file" accept="image/*" className="hidden"
                              onChange={e => { const f = e.target.files?.[0]; if (f) setEditForm({ ...editForm, idProofDoc: f }); }} />
                          </label>
                        </div>
                      );
                    })()}
                  </div>

                  <SectionHeader icon={<Car size={13} />} label="Vehicles" color="text-blue-600" />
                  <div className="col-span-full flex flex-col gap-3">
                    {editForm.vehicles.map((v, i) => (
                      <div key={i} className="flex flex-col gap-2 bg-muted/50 border border-border rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Vehicle {i + 1}</p>
                          <button type="button" onClick={() => setEditForm({ ...editForm, vehicles: editForm.vehicles.filter((_, idx) => idx !== i) })}
                            className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X size={13} /></button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <select value={v.type} onChange={e => { const vs = [...editForm.vehicles]; vs[i].type = e.target.value as VehicleType; setEditForm({ ...editForm, vehicles: vs }); }} className={inputCls}>
                            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                          </select>
                          <input type="text" placeholder="Model (Honda City)" value={v.model}
                            onChange={e => { const vs = [...editForm.vehicles]; vs[i].model = e.target.value; setEditForm({ ...editForm, vehicles: vs }); }} className={inputCls} />
                          <input type="text" placeholder="Number (MH12AB1234)" value={v.vehicleNumber}
                            onChange={e => { const vs = [...editForm.vehicles]; vs[i].vehicleNumber = e.target.value; setEditForm({ ...editForm, vehicles: vs }); }} className={inputCls} />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setEditForm({ ...editForm, vehicles: [...editForm.vehicles, { type: 'car', model: '', vehicleNumber: '' }] })}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors">
                      <PlusCircle size={14} /> Add Vehicle
                    </button>
                  </div>
                </div>
                <div className="px-8 py-5 border-t border-border bg-muted/50/50 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseEdit} className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted">Cancel</button>
                  <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 disabled:opacity-60">
                    {isLoading ? "Updating..." : "Update Resident"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── VIEW MODAL ── */}
        {showResidentModal && viewResidentData && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden">
              <div className="relative px-8 py-6 border-b border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-muted/20" />
                <div className="relative flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${getAvatarColor(viewResidentData.name)} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                      {viewResidentData.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-foreground">{viewResidentData.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase ${viewResidentData.kyc?.verified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {viewResidentData.kyc?.verified ? '✓ Verified' : 'KYC Pending'}
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2.5 py-1 rounded-lg font-black uppercase">{viewResidentData.unit?.ownershipType}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setShowResidentModal(false); setViewResidentData(null); setActivity([]); }}
                    className="p-2 hover:bg-card/80 rounded-xl text-muted-foreground"><X size={18} /></button>
                </div>
              </div>

              {/* ── SCROLLABLE BODY ── */}
              <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[65vh] overflow-y-auto">

                <SectionHeader icon={<User size={13} />} label="Personal Information" color="text-blue-600" />
                <DetailField label="Email Address" value={viewResidentData.email} />
                <DetailField label="Phone Number" value={viewResidentData.phone} />
                <DetailField label="Family Members" value={viewResidentData.familyMembers} />
                <DetailField label="Member Since" value={new Date(viewResidentData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />

                <SectionHeader icon={<User size={13} />} label="ID Proof" color="text-violet-600" />
                <div className="col-span-full">
                  <IdProofCard idProof={viewResidentData.idProof} />
                </div>

                <SectionHeader icon={<Home size={13} />} label="Property Details" color="text-emerald-600" />
                <DetailField label="Flat / Unit" value={`${viewResidentData.unit?.towerBlock}-${viewResidentData.unit?.flatNumber}`} />
                <DetailField label="Floor & Type" value={`${viewResidentData.unit?.floor} Floor (${viewResidentData.unit?.type})`} />
                <DetailField label="Area" value={`${viewResidentData.unit?.areaSqFt} sqft`} />
                <DetailField label="Move-In Date" value={viewResidentData.unit?.moveInDate ? new Date(viewResidentData.unit.moveInDate).toLocaleDateString('en-IN') : "N/A"} />

                {viewResidentData.unit?.ownershipType === 'tenant' && (<>
                  <SectionHeader icon={<Users size={13} />} label="Owner Information" color="text-violet-600" />
                  <DetailField label="Owner Name" value={viewResidentData.unit?.ownerName} />
                  <DetailField label="Owner Phone" value={viewResidentData.unit?.ownerPhone} />
                </>)}

                <SectionHeader icon={<Car size={13} />} label="Vehicles" color="text-blue-600" />
                <div className="col-span-full">
                  {viewResidentData.vehicles?.length > 0 ? (
                    <div className="space-y-2">
                      {viewResidentData.vehicles.map((v: Vehicle) => (
                        <div key={v._id} className="flex items-center gap-3 bg-muted/50 border border-border rounded-xl px-4 py-2.5">
                          <span className="text-xl">{vehicleIcons[v.type] || "🚙"}</span>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-foreground">{v.model || v.type}</p>
                            <p className="text-[11px] text-muted-foreground">{v.vehicleNumber || "No number"}</p>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${vehicleColors[v.type]}`}>{v.type}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-muted-foreground text-xs italic">No vehicles registered</p>}
                </div>

                <SectionHeader icon={<Car size={13} />} label="Parking Slots" color="text-amber-600" />
                <div className="col-span-full flex flex-wrap gap-2">
                  {viewResidentData.unit?.parkingSlots?.length > 0
                    ? viewResidentData.unit.parkingSlots.map((slot: string) => (
                      <span key={slot} className="bg-muted border border-border px-3 py-1.5 rounded-xl text-xs font-black text-foreground">🅿 {slot}</span>
                    ))
                    : <span className="text-muted-foreground text-xs italic">No parking slots assigned</span>
                  }
                </div>

                {/* ── ACTIVITY SECTION (inside modal, after parking) ── */}
                <SectionHeader icon={<Clock size={13} />} label="Recent Activity" color="text-amber-600" />
                <div className="col-span-full space-y-2">
                  {activity?.length > 0 ? (
                    activity.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-muted/50 border border-border rounded-xl px-4 py-3">
                        <div className="w-7 h-7 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Clock size={13} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.action}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {new Date(item.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-muted/50 border border-dashed border-border rounded-xl py-6 text-center">
                      <p className="text-muted-foreground text-xs">No activity found</p>
                    </div>
                  )}
                </div>

              </div>
              {/* ── MODAL FOOTER ── */}
              <div className="px-8 py-4 border-t border-border bg-muted/50/50 flex justify-end">
                <button onClick={() => { setShowResidentModal(false); setViewResidentData(null); setActivity([]); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

const SectionHeader = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
  <div className={`col-span-full flex items-center gap-2 ${color} font-black text-[10px] uppercase tracking-widest pt-2 pb-1 border-b border-border`}>{icon} {label}</div>
);
const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{label}</label>
    {children}
  </div>
);
const DetailField = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{label}</label>
    <div className="bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground">{value || "N/A"}</div>
  </div>
);

export default ResidentDirectory;