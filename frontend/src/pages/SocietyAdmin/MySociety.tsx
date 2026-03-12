import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getMySociety, } from "../../features/admin/adminSlice";
import { DashboardLayout } from "@/components/layout/DashboardLayout"; 

interface SocietyFormData {
  name: string;
  city: string;
  state: string;
  maintenanceDueDay: string;
  currency: string;
  timezone: string;
  line1: string;
  line2: string;
  pincode: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  totalFloors: string;
  totalUnits: string;
  totalTowers: string;
}

const currencies = ["INR", "USD", "EUR"];
const timezones = ["Asia/Kolkata", "UTC", "America/New_York"];

const MySociety = () => {
  const dispatch = useAppDispatch();
  const { society } = useAppSelector((state) => state.admin);

  const [formData, setFormData] = useState<SocietyFormData>({
    name: "",
    city: "",
    state: "",
    maintenanceDueDay: "",
    currency: "",
    timezone: "",
    line1: "",
    line2: "",
    pincode: "",
    country: "",
    contactEmail: "",
    contactPhone: "",
    totalFloors: "",
    totalUnits: "",
    totalTowers: "",
  });

  useEffect(() => {
    console.log("Dispatching getMySociety");
    dispatch(getMySociety())
      .unwrap()
      .then((res) => console.log("Society Data:", res))
      .catch((err) => console.log("Error fetching society:", err));
  }, [dispatch]);

  useEffect(() => {
    if (!society) return;
    setFormData({
      name: society.name || "",
      city: society.address?.city || "",
      state: society.address?.state || "",
      line1: society.address?.line1 || "",
      line2: society.address?.line2 || "",
      pincode: society.address?.pincode || "",
      country: society.address?.country || "",
      maintenanceDueDay: society.settings?.maintenanceDueDay?.toString() || "",
      currency: society.settings?.currency || "",
      timezone: society.settings?.timezone || "",
      contactEmail: society.contactEmail || "",
      contactPhone: society.contactPhone || "",
      totalFloors: society.totalFloors?.toString() || "",
      totalUnits: society.totalUnits?.toString() || "",
      totalTowers: society.totalTowers?.toString() || "",
    });
  }, [society]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted locally:", formData);
  };


  return (
    <DashboardLayout role="society-admin"> 
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl border shadow-sm">
      <h1 className="text-2xl font-bold mb-6">My Society Details</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Society Name" name="name" value={formData.name} onChange={handleChange} />
        <InputField label="Line 1" name="line1" value={formData.line1} onChange={handleChange} />
        <InputField label="Line 2" name="line2" value={formData.line2} onChange={handleChange} />
        <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
        <InputField label="State" name="state" value={formData.state} onChange={handleChange} />
        <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
        <InputField label="Country" name="country" value={formData.country} onChange={handleChange} />
        <InputField label="Contact Email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
        <InputField label="Contact Phone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
        <InputField label="Maintenance Due Day" name="maintenanceDueDay" value={formData.maintenanceDueDay} onChange={handleChange} type="number" />

        <SelectField label="Currency" name="currency" value={formData.currency} onChange={handleChange} options={currencies} />
        <SelectField label="Timezone" name="timezone" value={formData.timezone} onChange={handleChange} options={timezones} />

        <InputField label="Total Floors" name="totalFloors" value={formData.totalFloors} onChange={handleChange} type="number" />
        <InputField label="Total Units" name="totalUnits" value={formData.totalUnits} onChange={handleChange} type="number" />
        <InputField label="Total Towers" name="totalTowers" value={formData.totalTowers} onChange={handleChange} type="number" />

        <div className="md:col-span-2 mt-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl w-full">
            Save Changes
          </button>
        </div>
      </form>
    </div>
    </DashboardLayout>
  );
};

// ─── InputField Component ─────────────────────────────
const InputField = ({ label, name, value, onChange, type = "text" }: any) => (
  <div className="flex flex-col">
    <label className="text-[11px] font-bold text-slate-400 uppercase mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} className="border rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400" />
  </div>
);

// ─── SelectField Component ─────────────────────────────
const SelectField = ({ label, name, value, onChange, options }: any) => (
  <div className="flex flex-col">
    <label className="text-[11px] font-bold text-slate-400 uppercase mb-1">{label}</label>
    <select name={name} value={value} onChange={onChange} className="border rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default MySociety;