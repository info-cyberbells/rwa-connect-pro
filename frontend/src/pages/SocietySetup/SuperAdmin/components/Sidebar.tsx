import React, { useState } from "react";
import {
  LayoutDashboard,
  Building,
  CreditCard,
  FileText,
  Settings, 
  Menu,
  X,
  Bell,
  Building2,
  HelpCircle,
  Shield, 
  Cog, 
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/adminDashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Societies",
      path: "/globalSocietyDirectory",
      icon: <Building className="w-5 h-5" />,
    },
    {
      name: "Payments",
      path: "/globalPayments",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: "Support Tickets",
      path: "/support-tickets",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      name: "Notifications",
      path: "/notificationsHub",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      name: "Documents",
      path: "/documentCenter",
      icon: <FileText className="w-5 h-5" />,
    },
    
    {
      name: "Super Admin Settings",
      path: "/superAdminSettings",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "System Settings",
      path: "/systemSettings",
      icon: <Cog className="w-5 h-5" />, 
    },
    {
      name: "Security & Prefs",
      path: "/securityAndPreferences",
      icon: <Shield className="w-5 h-5" />, 
    },
  ];

  return (
    <>
      {/* 🔹 Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b z-40 flex items-center px-4">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div className="p-2 rounded-xl bg-blue-600 ml-2">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <span className="ml-4 font-extrabold text-blue-600 text-lg">
          SocietyHub
        </span>
      </div>

      {/* 🔹 Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-lg z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-slate-900">Society</span>
              <span className="text-blue-600">Hub</span>
            </span>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Section */}
        <nav className="flex flex-col px-4 py-6 space-y-1 text-sm font-semibold overflow-y-auto max-h-[calc(100vh-100px)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200
                ${isActive
                  ? "bg-blue-50 text-blue-600 font-bold shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;