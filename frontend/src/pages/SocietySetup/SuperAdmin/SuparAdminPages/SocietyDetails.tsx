import React, { useEffect } from 'react';
import {
  Building2, MapPin, Phone, Mail, ChevronRight,
 Activity, TrendingUp, Layers,
  MessageSquare, PhoneCall, FileText, Plus, Edit2
} from 'lucide-react';
import Sidebar from "../components/Sidebar";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppDispatch, useAppSelector } from '@/store/store';
import { useParams } from 'react-router-dom';
import { viewSocietyDetailsBySuperAdminThunk } from '@/features/Superadmin/superAdminSlice';

const SocietyDetails: React.FC = () => {

   const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { societyDetails, loading2, error } = useAppSelector((state: RootState) => state.superAdmin);

  useEffect(() => {
    if (id) {
      dispatch(viewSocietyDetailsBySuperAdminThunk(id));
    }
  }, [dispatch, id]);

   if (loading2)
  return (
    <DashboardLayout role="super-admin">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header Skeleton */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-left">
              <div className="w-16 h-16 bg-muted rounded-2xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 sm:h-8 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted/60 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Main Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Section */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
                <div className="h-5 bg-muted rounded w-40"></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-24 bg-muted/50 rounded-2xl"></div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
                <div className="h-5 bg-muted rounded w-48"></div>
                <div className="h-32 bg-muted/50 rounded-2xl"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-muted/50 rounded-xl"></div>
                  <div className="h-12 bg-muted/50 rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-card rounded-3xl p-6 border border-border shadow-sm space-y-6">
                <div className="h-5 bg-muted rounded w-32"></div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-full"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted/60 rounded w-24"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-muted/50 rounded-xl"></div>
                  <div className="h-12 bg-muted/50 rounded-xl"></div>
                </div>
              </div>

              <div className="h-40 bg-muted rounded-3xl"></div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
  
  if (error) return <p className="text-destructive font-bold text-center py-20">{error}</p>;

  const societyAdminData = societyDetails?.users?.list
  ?.filter((user) => user.role === "society_admin")
  ?.map((admin) => ({
    id: admin._id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    designation: admin.designation,
    flatNumber: admin.flatNumber,
    towerBlock: admin.towerBlock,
    isActive: admin.isActive,
    familyMembers: admin.familyMembers,
    kycVerified: admin.kyc?.verified,
  }))[0] || null;


  return (
    <DashboardLayout role="super-admin">
    <div className="flex flex-col lg:flex-row min-h-screen text-foreground">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb & Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <nav className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground flex-wrap mt-12 sm:mt-2">
              <span>Societies</span>
              <ChevronRight size={12} />
              <span className="text-foreground font-semibold">{societyDetails?.society?.name || "Unknown Society"}</span>
            </nav>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button className="px-4 py-2 w-full sm:w-auto bg-card border border-border rounded-lg text-xs font-bold text-muted-foreground hover:bg-muted transition-all shadow-sm flex items-center justify-center gap-2">
                Edit Profile
              </button>
              <button className="px-4 py-2 w-full sm:w-auto bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center">
                Generate Report
              </button>
            </div>
          </div>

          {/* Header Card */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm flex flex-col sm:flex-row sm:items-center gap-6 mb-8 text-left">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                <Building2 size={32} />
              </div>
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{societyDetails?.society?.name || "Unknown Society"}</h1>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                      societyDetails?.society?.isActive === true
                        ? "bg-success/10 text-success"
                        : societyDetails?.society?.isActive === false
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {societyDetails?.society?.isActive === true
                      ? "Active"
                      : societyDetails?.society?.isActive === false
                      ? "Inactive"
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                {[
                  societyDetails?.society?.address?.line1,
                  societyDetails?.society?.address?.line2,
                  societyDetails?.society?.address?.city,
                  societyDetails?.society?.address?.state,
                  societyDetails?.society?.address?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "No Address Available"}
              </div>
                  <div className="flex items-center gap-1.5"><Phone size={14} /> {societyDetails?.society?.contactPhone || "Not Provided"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Content */}
            <div className="col-span-12 lg:col-span-8 space-y-8">

              {/* Structural Overview */}
              <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-left">
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Structural Overview</h3>
                  <span className="text-[10px] font-bold text-primary uppercase mt-2 sm:mt-0">Last Updated: Today</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <OverviewCard label="Towers/Wings" value={societyDetails?.society?.totalTowers || 0} icon={<Layers />} color="bg-primary/10 text-primary" />
                  <OverviewCard label="Total Floors" value={societyDetails?.society?.totalFloors || 0} icon={<Activity />} color="bg-warning/10 text-warning" />
                  <OverviewCard label="Total Units" value={societyDetails?.society?.totalUnits || 0} icon={<Building2 />} color="bg-success/10 text-success" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <MiniBadge label="Occupied" value="215 Units" dot="bg-success" />
                  <MiniBadge label="Vacant" value="25 Units" dot="bg-warning" />
                  <MiniBadge label="Tenants" value="85 Units" dot="bg-primary" />
                  <MiniBadge label="Owners" value="130 Units" dot="bg-indigo-500" />
                </div>
              </div>

              {/* Recent Financials */}
              <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm overflow-x-auto text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Recent Financials</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">Maintenance collection for the last 6 months</p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-xs font-bold text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-md">
                      <TrendingUp size={12} /> +12.5%
                    </span>
                    <select className="bg-muted border-none text-[11px] font-bold text-muted-foreground rounded-lg px-3 py-1.5 focus:ring-0">
                      <option>Year 2023-24</option>
                    </select>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="mb-6 overflow-x-auto">
                  <div className="h-32 w-full flex items-end justify-between px-2 gap-4 border-b border-border">
                    {[40, 35, 45, 30, 55, 65].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="flex-1 bg-muted hover:bg-primary transition-all cursor-pointer group relative"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card text-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-border shadow-sm">
                          {h}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between px-2 gap-4 mt-3">
                    {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, i) => (
                      <div key={i} className="flex-1 text-center text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                        {month}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <FinancialStat label="Collection Rate" value="94.2%" icon="💹" color="text-success" />
                  <FinancialStat label="Defaulters" value="14 Units" icon="⚠️" color="text-destructive" />
                </div>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6 text-left">

              {/* Society Admin Card */}
              <div className="bg-card rounded-3xl p-6 border border-border shadow-sm relative group">
                <button className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 size={16} />
                </button>
                <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider mb-6">Society Admin</h3>
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" className="w-20 h-20 rounded-full border-4 border-muted/50 shadow-md bg-muted" alt="Admin" />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-success border-2 border-card rounded-full"></span>
                  </div>
                  <h4 className="font-extrabold text-foreground text-lg">{societyAdminData?.name || "Admin Name"}</h4>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">Head of Operations</p>
                </div>

                <div className="space-y-3 mb-6">
                  <ContactRow icon={<Mail size={14} />} label="Email Address" value={societyAdminData?.email || "Not provided"} />
                  <ContactRow icon={<Phone size={14} />} label="Phone Number" value={societyAdminData?.phone || "Not provided"} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 border border-border rounded-xl text-xs font-bold text-muted-foreground flex items-center justify-center gap-2 hover:bg-muted transition-all hover:text-foreground">
                    <MessageSquare size={14} /> Message
                  </button>
                  <button className="py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
                    <PhoneCall size={14} /> Call
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <ActionButton icon={<FileText className="text-warning" />} label="12 Pending Tasks" sub="Service requests, complaints" />
                <ActionButton icon={<Plus className="text-primary" />} label="New Announcement" sub="Broadcast to all residents" hasPlus />
              </div>

              {/* Health Score Card */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-primary-foreground shadow-lg shadow-primary/10">
                <div className="flex justify-between items-center mb-8">
                  <div className="p-2 bg-card/10 rounded-lg"><Activity size={18} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Health Score</span>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-extrabold">92</span>
                  <span className="text-xl font-bold opacity-40">/100</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-80 font-medium mb-6">
                  Well-managed society benchmark achieved.
                </p>
                <div className="w-full h-1.5 bg-card/20 rounded-full overflow-hidden">
                  <div className="bg-card h-full w-[92%]"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
    </DashboardLayout>
  );
};

// --- Sub-components ---
const OverviewCard = ({ label, value, icon, color }: any) => (
  <div className={`p-4 sm:p-6 bg-muted/30 border border-border rounded-2xl flex flex-col items-start text-left`}>
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </div>
    <p className="text-2xl font-black text-foreground mb-1">{value}</p>
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
  </div>
);

const MiniBadge = ({ label, value, dot }: any) => (
  <div className="bg-muted/20 p-3 rounded-xl border border-border flex flex-col gap-1 text-left">
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
      <span className="text-[9px] font-bold text-muted-foreground uppercase">{label}</span>
    </div>
    <span className="text-xs font-extrabold text-foreground">{value}</span>
  </div>
);

const ContactRow = ({ icon, label, value }: any) => (
  <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3 text-left border border-border/50">
    <div className="text-primary">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">{label}</span>
      <span className="text-[11px] font-bold text-foreground">{value}</span>
    </div>
  </div>
);

const FinancialStat = ({ label, value, icon, color }: any) => (
  <div className="flex items-center gap-3 text-left">
    <div className="text-xl">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-black ${color}`}>{value}</span>
    </div>
  </div>
);

const ActionButton = ({ icon, label, sub, hasPlus }: any) => (
  <button className="w-full bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4 hover:border-primary/30 transition-all text-left group">
    <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-xs font-bold text-foreground tracking-tight">{label}</h4>
      <p className="text-[10px] text-muted-foreground font-medium">{sub}</p>
    </div>
    {hasPlus ? <Plus size={14} className="text-muted-foreground/30" /> : <ChevronRight size={14} className="text-muted-foreground/30" />}
  </button>
);

export default SocietyDetails;
