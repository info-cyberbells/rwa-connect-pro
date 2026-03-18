import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Monitor,
  Shield,
  CheckCircle2,
  Key,
  SmartphoneNfc,
  Globe,
  ChevronRight,
  Moon,
  MessageSquare,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getActiveSessions,
  getSecurityInfo,
  revokeActiveSession,
} from "@/features/Superadmin/superAdminSlice";
import { useToast } from "@/hooks/use-toast";

// --- HELPER COMPONENTS ---

const ProfileDetail = ({ label, value, valueClass = "font-bold" }) => (
  <div className="flex justify-between items-center text-[13px]">
    <span className="text-slate-400 font-bold tracking-tight uppercase text-[10px]">
      {label}
    </span>
    <span className={`text-slate-700 ${valueClass}`}>{value}</span>
  </div>
);

const ToggleButton = ({ active, onToggle, variant = "soft" }) => {
  // Variant "primary" for security blue, "soft" for notification lavender-blue
  const activeColor = variant === "primary" ? "bg-[#3b82f6]" : "bg-[#adc6ff]";

  return (
    <div
      onClick={onToggle}
      className={`w-14 h-[30px] rounded-full p-1 cursor-pointer transition-all duration-300 flex items-center shadow-inner ${active ? activeColor : "bg-[#e2e8f0]"}`}
    >
      <div
        className={`w-[22px] h-[22px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300 transform ${active ? "translate-x-6.5" : "translate-x-0"}`}
      />
    </div>
  );
};

const PreferenceRow = ({ label, active, onToggle }) => (
  <div className="flex items-center justify-between">
    <span className="text-[13px] font-bold text-slate-500 tracking-tight">
      {label}
    </span>
    <ToggleButton active={active} onToggle={onToggle} variant="soft" />
  </div>
);

const SecurityAndPreferences = () => {
  const [data, setData] = useState({
    profile: {
      name: "System Admin",
      role: "Super Admin View",
      subRole: "Internal Access Control",
      securityLevel: "Enhanced",
      lastLogin: "2 mins ago",
      adminId: "#8821-SA",
      accessLevel: 10,
    },
    security: {
      lastPasswordChange: "Jan 12, 2024",
      passwordUpdateInterval: 90,
      twoFactorEnabled: true,
      authMethods: [
        {
          id: "app",
          name: "Authenticator App",
          detail: "Connected to Google Auth",
          active: true,
        },
        {
          id: "sms",
          name: "SMS Verification",
          detail: "Not configured",
          active: false,
        },
      ],
      sessions: [
        {
          id: 1,
          device: 'MacBook Pro 16"',
          location: "New Delhi, India",
          ip: "192.168.1.1",
          status: "Current Session",
          isPrimary: true,
          type: "desktop",
        },
        {
          id: 2,
          device: "iPhone 15 Pro",
          location: "Mumbai, India",
          ip: "10.0.0.45",
          status: "Active",
          isPrimary: false,
          type: "mobile",
        },
        {
          id: 3,
          device: "Windows Workstation",
          location: "Bengaluru, India",
          ip: "172.16.2.8",
          status: "Active",
          isPrimary: false,
          type: "desktop",
        },
      ],
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      display: {
        language: "English (US)",
        darkMode: false,
      },
    },
  });

  const { toast } = useToast();
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const {
    securityInfo,
    activeSessions,
    loading,
    loading2,
    loading3,
    error,
    error2,
    error3,
  } = useSelector((state: RootState) => state.superAdmin);

  const [activeTab, setActiveTab] = useState("Security");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getSecurityInfo()),
          dispatch(getActiveSessions()),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const togglePreference = (key) => {
    setData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [key]: !prev.preferences.notifications[key],
        },
      },
    }));
  };

  const toggleTwoFactor = () => {
    setData((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: !prev.security.twoFactorEnabled,
      },
    }));
  };

  const toggleDarkMode = () => {
    setData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        display: {
          ...prev.preferences.display,
          darkMode: !prev.preferences.display.darkMode,
        },
      },
    }));
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      setLoadingSessionId(sessionId);

      await dispatch(revokeActiveSession(sessionId)).unwrap();

      toast({
        title: "Session Revoked",
        description: "User session logged out successfully",
      });

      dispatch(getActiveSessions());
    } catch (err: any) {
      console.error("Logout failed:", err);

      toast({
        title: "Failed to Logout",
        description: err || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoadingSessionId(null);
    }
  };

  return (
    <DashboardLayout role="super-admin">
      <div className="min-h-screen text-slate-900">
        <div className="max-w-6xl mx-auto">
          {/* HEADER SECTION */}
          <header className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Security & Preferences
                </h1>
                <p className="text-slate-400 text-sm mt-1 font-medium">
                  Configure internal administrative safety protocols and
                  interface settings.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#eafbf0] text-[#48c774] px-3 py-1.5 rounded-full border border-[#d8f6e4] w-fit h-fit shadow-sm">
                <CheckCircle2 size={14} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Verified Admin
                </span>
              </div>
            </div>
          </header>

          {/* TWO COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            {/* LEFT COLUMN: PROFILE & HEALTH */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-[#f1f5f9] border border-slate-100 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                    <Shield
                      size={48}
                      className="text-slate-300"
                      strokeWidth={1}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#3b82f6] p-2.5 rounded-xl border-4 border-white shadow-lg text-white">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-1 leading-tight">
                  {securityInfo?.name || "Loading..."}
                </h2>
                <p className="text-blue-500 text-[13px] font-bold tracking-tight mb-8">
                  Internal Access Control
                </p>

                <div className="w-full space-y-5 pt-2 border-t border-slate-50 mt-2">
                  <ProfileDetail
                    label="Security Level"
                    value={securityInfo?.securityLevel || "-"}
                    valueClass="text-[#40c057] uppercase font-bold"
                  />
                  <ProfileDetail
                    label="Last Login"
                    value={
                      securityInfo?.lastLoginAt
                        ? new Date(securityInfo.lastLoginAt).toLocaleString()
                        : "-"
                    }
                  />
                  <ProfileDetail
                    label="Admin ID"
                    value={securityInfo?.adminId || "-"}
                    valueClass="font-mono text-slate-400"
                  />
                </div>
              </div>

              <div className="bg-[#0f172a] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-white/10 p-2.5 rounded-xl border border-white/5">
                      <Lock size={18} className="text-blue-400" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      System Health
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">Encrypted Session</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-8">
                    Your current administrative session is protected with
                    end-to-end encryption.
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {["SSL", "AES", "2FA"].map((protocol) => (
                        <div
                          key={protocol}
                          className="w-7 h-7 rounded-full bg-blue-600 border-2 border-[#0f172a] flex items-center justify-center text-[8px] font-black shadow-lg"
                        >
                          {protocol}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Protocols Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SECURITY SETTINGS */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden h-full">
                <div className="flex px-8 border-b border-slate-100">
                  {["Security", "Preferences"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-6 px-4 text-sm font-bold relative transition-all tracking-tight ${activeTab === tab ? "text-blue-600" : "text-slate-300 hover:text-slate-500"}`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.2)]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-10 space-y-12">
                  <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      Password Management
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 font-medium">
                      Regularly updating your password enhances system
                      integrity.
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#f8fafc] border border-slate-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#e2e8f0] p-2.5 rounded-xl text-slate-400 shadow-inner">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Last changed: {data.security.lastPasswordChange}
                          </p>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                            Recommended update every{" "}
                            {data.security.passwordUpdateInterval} days
                          </p>
                        </div>
                      </div>
                      <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:border-slate-300 transition-all active:scale-95">
                        Change Password
                      </button>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-slate-400 font-medium">
                          Add an extra layer of security to your admin account.
                        </p>
                      </div>
                      {/* Primary Blue Variant for Security */}
                      <ToggleButton
                        active={data.security.twoFactorEnabled}
                        onToggle={toggleTwoFactor}
                        variant="primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.security.authMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`
                        p-5 border-2 rounded-2xl flex items-center gap-4 transition-all
                        ${method.active ? "bg-[#f1f7ff] border-[#d9e8ff] shadow-sm" : "bg-white border-slate-100 opacity-60"}
                      `}
                        >
                          <div
                            className={`p-2.5 rounded-xl ${method.active ? "bg-white text-blue-600 shadow-sm border border-blue-50" : "bg-slate-50 text-slate-300"}`}
                          >
                            {method.id === "app" ? (
                              <Smartphone size={20} />
                            ) : (
                              <MessageSquare size={20} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {method.name}
                            </p>
                            <p
                              className={`text-[11px] font-bold ${method.active ? "text-blue-500" : "text-slate-400"}`}
                            >
                              {method.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">
                      Active Sessions
                    </h3>
                    <div className="space-y-4">
                      {loading3 ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-16 bg-slate-100 animate-pulse rounded-xl"
                            />
                          ))}
                        </div>
                      ) : error3 ? (
                        <div className="text-red-500 text-sm font-semibold">
                          {error3}
                        </div>
                      ) : activeSessions?.sessions?.length === 0 ? (
                        <div className="text-slate-400 text-sm text-center py-6">
                          No active sessions found
                        </div>
                      ) : (
                        activeSessions?.sessions?.map((session) => (
                          <div
                            key={session.sessionId}
                            className="p-4 bg-white border border-slate-50 rounded-2xl flex items-center justify-between group hover:border-slate-200 transition-all hover:shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-[#f8fafc] p-3 rounded-xl text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-400 transition-colors">
                                {session.userAgent
                                  ?.toLowerCase()
                                  ?.includes("mobile") ? (
                                  <Smartphone size={20} />
                                ) : (
                                  <Monitor size={20} />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-slate-800">
                                    {session.userAgent || "Unknown Device"}
                                  </p>
                                  {session.isCurrent && (
                                    <span className="text-[10px] font-bold text-[#48c774] flex items-center gap-1.5 uppercase tracking-wider">
                                      <span className="w-1 h-1 bg-[#48c774] rounded-full" />{" "}
                                      Current Session
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                                  {session.ip || "Unknown IP"}
                                </p>
                              </div>
                            </div>

                            {session.isCurrent ? (
                              <span className="text-[10px] font-bold text-slate-400 bg-[#f1f5f9] px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-inner">
                                Current
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  handleLogoutSession(session.sessionId)
                                }
                                disabled={
                                  loadingSessionId === session.sessionId
                                }
                                className="text-[11px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors disabled:opacity-50"
                              >
                                {loadingSessionId === session.sessionId
                                  ? "Logging out..."
                                  : "Log Out"}
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* PREFERENCES SECTION */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-10 tracking-tight">
              Notification & Display Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
              <div className="space-y-7">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300 mb-4">
                  Notifications
                </h4>
                <PreferenceRow
                  label="Email Alerts"
                  active={data.preferences.notifications.email}
                  onToggle={() => togglePreference("email")}
                />
                <PreferenceRow
                  label="Push Notifications"
                  active={data.preferences.notifications.push}
                  onToggle={() => togglePreference("push")}
                />
                <PreferenceRow
                  label="SMS Reports"
                  active={data.preferences.notifications.sms}
                  onToggle={() => togglePreference("sms")}
                />
              </div>

              <div className="space-y-7">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300 mb-4">
                  Display
                </h4>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    System Language
                  </p>
                  <div className="w-full p-4 bg-[#f8fafc] border border-slate-100 rounded-2xl flex items-center justify-between text-sm font-bold text-slate-700 cursor-pointer hover:bg-[#f1f5f9] transition-colors shadow-inner">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-slate-300" />
                      {data.preferences.display.language}
                    </div>
                    <ChevronRight size={18} className="text-slate-200" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <Moon size={18} className="text-slate-300" />
                    <span className="text-sm font-bold text-slate-400 tracking-tight">
                      Dark Mode
                    </span>
                  </div>
                  <ToggleButton
                    active={data.preferences.display.darkMode}
                    onToggle={toggleDarkMode}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              Discard Changes
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-[#3b82f6] text-white rounded-2xl text-[13px] font-bold shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all transform hover:-translate-y-1 active:translate-y-0">
              Update Security Protocols
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SecurityAndPreferences;
