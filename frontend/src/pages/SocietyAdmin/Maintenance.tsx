import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowLeft, Upload, X, Search, Check } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { createCharge, getResidents ,getChargeById } from "../../features/admin/adminSlice";
import { toast } from "sonner";

const Maintenance = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem("role") || "guard";
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const residents = useAppSelector((state) => state.admin.residents);
const selectedCharge = useAppSelector((state) => state.admin.selectedCharge); 

  const [formData, setFormData] = useState({
    title: "",
    category: "maintenance",
    unitType: "1BHK",
    amount: "",
    dueDay: 31,
    dueMonth: new Date().getMonth(),
    dueYear: new Date().getFullYear(),
    appliedTo: "all",
    targetUsers: [],
    description: "",
    proofImageUrl: null,
  });

  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 

  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const CATEGORIES = [
    { value: "maintenance", label: "Maintenance" },
    { value: "event",       label: "Event"       },
    { value: "fine",        label: "Fine"         },
    { value: "penalty",     label: "Penalty"      },
    { value: "other",       label: "Other"        },
  ];

  const UNIT_TYPES = [
    "all","1BHK","2BHK","3BHK","4BHK","studio","penthouse","shop","office",
  ];

  const APPLIED_TO_OPTIONS = [
    { value: "all",      label: "All Units"      },
    { value: "specific", label: "Specific Users" },
  ];

  const daysInMonth = new Date(formData.dueYear, formData.dueMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    dispatch(getResidents());
  }, [dispatch]);
useEffect(() => {
  if (id) {
    dispatch(getChargeById(id));
  }
}, [id, dispatch]);
useEffect(() => {
  if (selectedCharge && id) {
    const dueDate = new Date(selectedCharge.dueDate);
    setFormData({
      title: selectedCharge.title || "",
      category: selectedCharge.category || "maintenance",
      unitType: selectedCharge.unitType || "all",
      amount: String(selectedCharge.amount || ""),
      dueDay: dueDate.getDate(),
      dueMonth: dueDate.getMonth(),
      dueYear: dueDate.getFullYear(),
      appliedTo: selectedCharge.appliedTo || "all",
      targetUsers: selectedCharge.targetUsers?.map((u: any) =>
        typeof u === "string" ? u : u._id
      ) || [],
      description: selectedCharge.description || "",
      proofImageUrl: selectedCharge.proofImageUrl || null,
    });
  }
}, [selectedCharge, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildDueDate = () => {
    const d = new Date(formData.dueYear, formData.dueMonth, formData.dueDay, 23, 59, 59);
    return d.toISOString();
  };

  // ✅ Resident select/deselect toggle
  const toggleResident = (residentId) => {
    setFormData((prev) => ({
      ...prev,
      targetUsers: prev.targetUsers.includes(residentId)
        ? prev.targetUsers.filter((id) => id !== residentId)
        : [...prev.targetUsers, residentId],
    }));
  };

  // ✅ Filtered residents list
  const filteredResidents = residents.filter(
    (r) =>
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    // 1. Basic validation
    if (!formData.title || !formData.amount) {
      toast.error("Title and amount are required");
      return;
    }

    // 2. Specific users check
    if (formData.appliedTo === "specific" && formData.targetUsers.length === 0) {
      toast.error("Please select at least one resident");
      return;
    }

    // 3. ✅ Fine/Penalty
    if (
      (formData.category === "fine" || formData.category === "penalty") &&
      !proofFile
    ) {
      toast.error("Proof image is required for fine/penalty charges");
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category", formData.category);
    form.append("amount", String(Number(formData.amount)));
    form.append("dueDate", buildDueDate());
    form.append("appliedTo", formData.appliedTo);

    // Specific users array append karo
    if (formData.appliedTo === "specific") {
      formData.targetUsers.forEach((uid) => {
        form.append("targetUsers[]", uid);
      });
    }

    // 6. Unit type — "all" nahi ho tabhi bhejo
    if (formData.unitType !== "all") {
      form.append("unitType", formData.unitType);
    }

    // 7. ✅ Proof image attach karo (fine/penalty )
    if (proofFile) {
      form.append("proofImage", proofFile);
    }

    const toastId = toast.loading("Creating charge...");

    try {
      await dispatch(createCharge(form)).unwrap();
      toast.success("Charge created successfully", { id: toastId });
      navigate(-1);
    } catch (err) {
      toast.error(err?.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role={role as any}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-card rounded-full border hover:border-border"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {id ? "Edit Maintenance Charge" : "Create Maintenance Charge"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your society maintenance billing
            </p>
          </div>
        </div>

        <main className="bg-card rounded-3xl shadow-sm border border-border p-8">

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Title */}
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Charge Title"
            className="w-full mb-6 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 border rounded-xl outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* Unit Type */}
          <select
            name="unitType"
            value={formData.unitType}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 border rounded-xl outline-none"
          >
            {UNIT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Amount */}
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full mb-6 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Description"
            className="w-full mb-6 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
          />

          {/* ✅ Applied To — All Units ya Specific Users */}
          <div className="mb-6">
            <label className="block text-[13px] font-bold mb-3 text-muted-foreground uppercase tracking-wider">
              Apply To
            </label>
            <div className="flex gap-3">
              {APPLIED_TO_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      appliedTo: opt.value,
                      targetUsers: [],
                    }))
                  }
                  className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                    formData.appliedTo === opt.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-card text-slate-600 border-border hover:bg-blue-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Specific Users Section */}
          {formData.appliedTo === "specific" && (
            <div className="mb-6 border border-border rounded-2xl p-4 bg-muted/50/30">

              <label className="block text-[13px] font-bold mb-3 text-muted-foreground uppercase tracking-wider">
                Select Residents
              </label>

              {/* Search Input */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or unit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-card outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                />
              </div>

              {/* Residents List */}
              <div className="max-h-48 overflow-y-auto rounded-xl border border-border bg-card">
                {filteredResidents.length > 0 ? (
                  filteredResidents.map((r) => {
                    const isSelected = formData.targetUsers.includes(r._id);
                    return (
                      <div
                        key={r._id}
                        onClick={() => toggleResident(r._id)}
                        className={`flex justify-between items-center px-4 py-3 cursor-pointer border-b border-slate-50 last:border-0 transition-colors ${
                          isSelected ? "bg-blue-50" : "hover:bg-muted/50"
                        }`}
                      >
                        <div>
                          <p className={`text-sm font-bold ${isSelected ? "text-blue-700" : "text-slate-700"}`}>
                            {r.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Unit: {r.unitNumber || r.flatNumber || "—"}
                          </p>
                        </div>
                        {/* Checkmark  */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-slate-300"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-6">
                    No residents found
                  </p>
                )}
              </div>

              {/* ✅ Selected Users Tags */}
              {formData.targetUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.targetUsers.map((uid) => {
                    const r = residents.find((x) => x._id === uid);
                    return (
                      <span
                        key={uid}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                      >
                        {r?.name || uid}
                        <X
                          size={12}
                          className="cursor-pointer hover:text-blue-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleResident(uid);
                          }}
                        />
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Counter */}
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {formData.targetUsers.length} resident(s) selected
              </p>
            </div>
          )}

          {/* Due Date */}
          <div className="mb-6">
            <label className="block text-[13px] font-bold mb-2 text-muted-foreground uppercase tracking-wider">
              Due Date
            </label>

            <div className="border border-border rounded-2xl p-6 bg-muted/50/30">
              {/* Month & Year */}
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <select
                    name="dueMonth"
                    value={formData.dueMonth}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dueMonth: Number(e.target.value),
                        dueDay: Math.min(
                          prev.dueDay,
                          new Date(prev.dueYear, Number(e.target.value) + 1, 0).getDate()
                        ),
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-card border border-border rounded-xl appearance-none outline-none"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>

                <div className="relative w-32">
                  <select
                    name="dueYear"
                    value={formData.dueYear}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dueYear: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-card border border-border rounded-xl appearance-none outline-none"
                  >
                    {[2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Days Calendar */}
              <div className="grid grid-cols-7 text-center gap-y-2">
                {["S","M","T","W","T","F","S"].map((d, i) => (
                  <div key={i} className="text-[10px] font-black text-muted-foreground pb-2">
                    {d}
                  </div>
                ))}
                {days.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, dueDay: d }))}
                    className={`py-2 text-sm rounded-xl font-bold ${
                      formData.dueDay === d
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-50 text-slate-600"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs text-muted-foreground text-center font-medium">
                Due: {MONTHS[formData.dueMonth]} {formData.dueDay}, {formData.dueYear}
              </p>
            </div>
          </div>

          {/* Upload Proof */}
          <label className={`flex items-center gap-3 w-full px-4 py-3 border border-dashed rounded-xl cursor-pointer mb-6 hover:bg-muted/50 transition-colors ${
            (formData.category === "fine" || formData.category === "penalty") && !proofFile
              ? "border-red-300 bg-red-50/30"
              : "border-border"
          }`}>
            <Upload className={`w-5 h-5 ${
              (formData.category === "fine" || formData.category === "penalty") && !proofFile
                ? "text-red-400"
                : "text-muted-foreground"
            }`} />
            <span className="text-sm text-muted-foreground">
              {proofFile
                ? proofFile.name
                : (formData.category === "fine" || formData.category === "penalty")
                  ? "Upload proof image (Required) *"
                  : "Upload image or PDF (Optional)"
              }
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setProofFile(file);
              }}
            />
          </label>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : "Post Charge"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 border py-3 rounded-xl font-semibold hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
          </div>

        </main>
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;