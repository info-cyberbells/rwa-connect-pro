import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
   Menu, X, LogOut, User, Bell, Megaphone,
  LayoutDashboard, Users, CreditCard, FileText, 
  Settings, MessageSquare, ClipboardList, Shield, Building, 
  Home, UserCheck, HardHat, ShieldCheck,Wrench,AlertOctagon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import authService from "@/auth/authServices";
import { useDispatch } from "react-redux";



interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "super-admin" | "society-admin" | "member" | "residential-admin";
}

const navigationConfig = {
  "super-admin": [
    { icon: LayoutDashboard, label: "Dashboard", href: "/super-admin" },
    { icon: Building, label: "Societies", href: "/super-admin/societies" },
    { icon: Users, label: "Society Admins", href: "/super-admin/admins" },
    { icon: CreditCard, label: "Subscriptions", href: "/super-admin/subscriptions" },
    { icon: Settings, label: "Settings", href: "/super-admin/settings" },
  ],
  "society-admin": [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Resident Directory", href: "/residentDirectory" },
      { icon: Building, label: "My Society", href: "/my-society" },

    { icon: Megaphone, label: "Notice Board", href: "/noticeBoard" },
    { icon: CreditCard, label: "Finances", href: "/finances" },
    { icon: Bell, label: "NotificationHub", href: "/notificationHub" },
    { icon: MessageSquare, label: "Complaints", href: "/complaintsDetail" },
    { icon: AlertOctagon, label: "Fine", href: "/addPenaltyFine" },
    { icon: Wrench, label: "Maintenance", href: "/maintenance" },
    { icon: ClipboardList, label: "Registrations", href: "/society-admin/registrations" },
    { icon: FileText, label: "Documents", href: "/society-admin/documents" },
    { icon: Settings, label: "Settings", href: "/adminSettings" },
  ],
  "residential-admin": [
    { icon: LayoutDashboard, label: "Dashboard", href: "/residentialDashboard" },
    { icon: Home, label: "Payments", href: "/residentialPayments/" },
    { icon: UserCheck, label: "Notices", href: "/societyNotices" },
    { icon: ShieldCheck, label: "Support", href: "/residentialSupport" },
    { icon: HardHat, label: "Profile", href: "/profileHub" },
    { icon: FileText, label: "Settings", href: "/residential/docs" },
    { icon: Settings, label: "Config", href: "/residential/settings" },
  ],
  "member": [
    { icon: LayoutDashboard, label: "Dashboard", href: "/member" },
    { icon: CreditCard, label: "My Payments", href: "/member/payments" },
    { icon: Bell, label: "Notices", href: "/member/notices" },
    { icon: FileText, label: "Documents", href: "/member/documents" },
    { icon: MessageSquare, label: "Support", href: "/member/support" },
    { icon: User, label: "Profile", href: "/member/profile" },
  ],
};

const societyAdminNavbarLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Resident Directory", href: "/residentDirectory" },
  { label: "Billing", href: "/finances" },
  { label: "Complaints", href: "/complaintsDetail" },
  { label: "Notices", href: "/noticeBoard" },
];

const roleLabels = {
  "super-admin": "Super Admin",
  "society-admin": "Society Admin",
  "residential-admin": "Residential Admin",
  member: "Member",
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = navigationConfig[role] || [];

  // Role based checks
  const isSuperAdmin = role === "super-admin";
  const isResidentialAdmin = role === "residential-admin";
  const isSocietyAdmin = role === "society-admin";
  const isMember = role === "member";
  const isSocietyOrResidential = isSocietyAdmin || isResidentialAdmin;

const dispatch = useDispatch();

const handleLogout = async () => {
  try {
    await authService.logout(); // Call API


    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    navigate("/login", { replace: true });
    localStorage.clear()
  } catch (error) {
    console.error("Logout failed:", error);

    toast({
      title: "Logout Failed",
      description: "Something went wrong.",
      variant: "destructive",
    });
  }
};
  return (
    <div className="min-h-screen bg-muted/30">
      
      {/* 1. SIDEBAR */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[100] w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out",
          
          // Super Admin sidebar
          isSuperAdmin && (sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
          
          // Residential Admin  toggle  sidebar
          isResidentialAdmin && (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
          
          // Society Admin toggle sidebar
isSocietyAdmin && (sidebarOpen ? "translate-x-0 mt-16 lg:mt-20 shadow-xl" : "-translate-x-full mt-16 lg:mt-20 shadow-xl"),
          
          // Member sidebar
          isMember && (sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-800 tracking-tight">SocietySmartHub</span>
            </div>
          </div>

          <div className="px-6 py-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
              <Shield size={12} /> {roleLabels[role]}
            </span>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm font-semibold text-red-500">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 2. TOP HEADER */}
      
      {isSocietyOrResidential ? (
        /* HEADER A: Society Admin & Residential Admin  */
        <header className="fixed top-0 left-0 right-0 z-[80] bg-white border-b border-slate-100 h-16 lg:h-20 shadow-sm">
          <nav className="h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-all"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-100">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800 hidden md:block">SocietySmartHub</span>
              </div>
            </div>

            {role === "society-admin" && (
              <div className="hidden lg:flex items-center gap-1">
                {societyAdminNavbarLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link key={link.href} to={link.href} className={cn("px-4 py-2 text-sm font-semibold relative", isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800")}>
                      {link.label}
                      {isActive && <div className="absolute bottom-[-22px] lg:bottom-[-30px] left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 relative"><Bell size={20} /></button>
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none">Admin User</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Head Secretary</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                </div>
              </div>
            </div>
          </nav>
        </header>
        
      ) : (/* HEADER B: Super Admin & Members   */
        
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border lg:ml-64">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <button className="relative p-2 rounded-lg hover:bg-muted"><Bell className="w-5 h-5" /></button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md"><User className="w-4 h-4" /></div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 3. MAIN CONTENT AREA */}
    <div className={cn(
  "transition-all duration-300", 
  (isSuperAdmin || isMember) && "lg:pl-64", 
  isResidentialAdmin && (sidebarOpen ? "lg:pl-64" : "lg:pl-0"),
  isSocietyAdmin && (sidebarOpen ? "pl-64" : "pl-0")
)}>
  <main className={cn(
    "p-4 lg:p-8 min-h-screen",
    isSocietyOrResidential ? "pt-24 lg:pt-32" : "pt-20 lg:pt-8"
  )}>
    {children}
  </main>
</div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[65] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}