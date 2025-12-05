import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Building2, Menu, X, LogOut, User, Bell, 
  LayoutDashboard, Users, CreditCard, FileText, 
  Settings, MessageSquare, ClipboardList, Home,
  Building, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "super-admin" | "society-admin" | "member";
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
    { icon: LayoutDashboard, label: "Dashboard", href: "/society-admin" },
    { icon: Users, label: "Members", href: "/society-admin/members" },
    { icon: ClipboardList, label: "Registrations", href: "/society-admin/registrations" },
    { icon: CreditCard, label: "Payments", href: "/society-admin/payments" },
    { icon: Bell, label: "Announcements", href: "/society-admin/announcements" },
    { icon: FileText, label: "Documents", href: "/society-admin/documents" },
    { icon: MessageSquare, label: "Support Tickets", href: "/society-admin/tickets" },
    { icon: Settings, label: "Settings", href: "/society-admin/settings" },
  ],
  member: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/member" },
    { icon: CreditCard, label: "My Payments", href: "/member/payments" },
    { icon: Bell, label: "Notices", href: "/member/notices" },
    { icon: FileText, label: "Documents", href: "/member/documents" },
    { icon: MessageSquare, label: "Support", href: "/member/support" },
    { icon: User, label: "Profile", href: "/member/profile" },
  ],
};

const roleLabels = {
  "super-admin": "Super Admin",
  "society-admin": "Society Admin",
  member: "Member",
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = navigationConfig[role];

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl hero-gradient">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg">
                Society<span className="text-gradient">SmartHub</span>
              </span>
            </Link>
          </div>

          {/* Role Badge */}
          <div className="px-6 py-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
              <Shield className="w-3 h-3" />
              {roleLabels[role]}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "hero-gradient text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-muted">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
