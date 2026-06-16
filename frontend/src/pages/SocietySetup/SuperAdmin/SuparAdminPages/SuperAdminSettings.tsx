import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  Edit2,
  Save,
  Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getSuperAdminProfile, updateSuperAdminProfile, updateSuperAdminPassword, updateSuperAdminPreferences } from "@/features/Superadmin/superAdminSlice";
import { toast } from "sonner";

const SuperAdminSettings = () => {
  const dispatch = useAppDispatch();
  const { profile, preferences, settingsLoading, isSaving } = useAppSelector((state) => state.superAdmin);

  const [activeTab, setActiveTab] = useState('Personal Info');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'English (US)'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    dispatch(getSuperAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        language: profile.language === 'hi' ? 'Hindi (IN)' : 'English (US)'
      });
    }
  }, [profile]);

  const handleEditClick = () => {
    setActiveTab('Personal Info');
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  const handlePersonalSave = async () => {
    try {
      await dispatch(updateSuperAdminProfile({
        name: personalInfo.name,
        phone: personalInfo.phone,
        language: personalInfo.language === 'Hindi (IN)' ? 'hi' : 'en'
      })).unwrap();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      await dispatch(updateSuperAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap();
      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error || "Failed to update password");
    }
  };

  const handlePreferenceToggle = async (key: string) => {
    const updatedNotifications = { ...preferences.notifications, [key]: !preferences.notifications[key] };
    try {
      await dispatch(updateSuperAdminPreferences({
        notifications: updatedNotifications
      })).unwrap();
      toast.success("Preferences updated");
    } catch (error: any) {
      toast.error("Failed to update preferences");
    }
  };
  const tabs = ['Personal Info', 'Security', 'Preferences'];

  if (settingsLoading) {
    return (
      <DashboardLayout role='super-admin'>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role='super-admin'>
    <div className="min-h-screen text-foreground">


      {/*Main Content  */}
      <div className="transition-all duration-300">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <header className="mb-8 mt-12 lg:mt-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your profile information and security preferences.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

            {/* Left Column: Profile Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-card rounded-3xl p-6 xl:p-8 shadow-sm border border-border flex flex-col items-center text-center">
                <div className="relative mb-4">
                  {profile?.profilePicUrl ? (
                    <img src={`${import.meta.env.VITE_API_BASE_URL}${profile.profilePicUrl}`} alt="Profile" className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-card shadow-sm" />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl font-bold tracking-wider border-4 border-card shadow-sm">
                      {profile?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-card p-2 rounded-full shadow-md border border-border hover:bg-muted/50 transition-colors">
                    <Camera size={18} className="text-primary" />
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{profile?.name}</h2>
                <p className="text-primary font-medium text-sm mb-6 capitalize">{profile?.role?.replace('_', ' ')}</p>

                <div className="w-full space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 text-muted-foreground overflow-hidden">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm truncate">{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm">{profile?.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm text-left">{profile?.address?.city || 'Not set'}, {profile?.address?.state || ''}</span>
                  </div>
                </div>

                <button 
                  onClick={handleEditClick}
                  className="mt-8 w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              </div>

              {/* Security Score Card  */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-primary-foreground shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-card/20 p-2 rounded-lg backdrop-blur-md">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Security Status</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Account Status: Active</h3>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-card/20 rounded-full overflow-hidden">
                    <div className="h-full bg-card w-[100%] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                  </div>
                  <p className="text-xs font-medium">All systems verified</p>
                </div>
              </div>
            </div>

            {/* Right Column: Settings Forms */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
                {/* Tab Navigation - Scrollable on mobile */}
                <div className="flex border-b border-border px-4 md:px-8 overflow-x-auto no-scrollbar">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 md:px-6 py-5 text-sm font-semibold transition-all relative whitespace-nowrap ${
                        activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 sm:p-6 md:p-8 space-y-8">
                  {/* Personal Info Tab */}
                  {activeTab === 'Personal Info' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground">Full Name</label>
                          <input 
                            type="text" 
                            value={personalInfo.name} 
                            onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground">Email Address</label>
                          <input 
                            type="email" 
                            value={personalInfo.email} 
                            readOnly
                            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/10 outline-none text-muted-foreground cursor-not-allowed" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground">Phone Number</label>
                          <input 
                            type="text" 
                            value={personalInfo.phone} 
                            onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground">Language</label>
                          <div className="relative">
                            <select 
                              value={personalInfo.language}
                              onChange={(e) => setPersonalInfo({...personalInfo, language: e.target.value})}
                              className="w-full appearance-none px-4 py-3 rounded-xl border border-border bg-muted/30 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                            >
                              <option className="bg-card">English (US)</option>
                              <option className="bg-card">Hindi (IN)</option>
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none" size={16} />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button 
                          onClick={handlePersonalSave}
                          disabled={isSaving}
                          className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'Security' && (
                    <div className="space-y-8">
                      <div className="space-y-4 text-left">
                        <h3 className="text-lg font-bold text-foreground">Change Password</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Current Password</label>
                            <input 
                              type="password" 
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">New Password</label>
                              <input 
                                type="password" 
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Confirm Password</label>
                              <input 
                                type="password" 
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end pt-4">
                          <button 
                            onClick={handlePasswordUpdate}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck size={18} />}
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'Preferences' && (
                    <div className="space-y-8 text-left">
                      <h3 className="text-lg font-bold text-foreground">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border">
                          <div>
                            <p className="font-bold text-foreground">Email Notifications</p>
                            <p className="text-xs text-muted-foreground">Receive updates via email</p>
                          </div>
                          <button 
                            onClick={() => handlePreferenceToggle('email')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences?.notifications?.email ? 'bg-primary' : 'bg-muted'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${preferences?.notifications?.email ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border">
                          <div>
                            <p className="font-bold text-foreground">Push Notifications</p>
                            <p className="text-xs text-muted-foreground">Receive real-time dashboard alerts</p>
                          </div>
                          <button 
                            onClick={() => handlePreferenceToggle('push')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences?.notifications?.push ? 'bg-primary' : 'bg-muted'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${preferences?.notifications?.push ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border">
                          <div>
                            <p className="font-bold text-foreground">SMS Notifications</p>
                            <p className="text-xs text-muted-foreground">Receive critical updates on your phone</p>
                          </div>
                          <button 
                            onClick={() => handlePreferenceToggle('sms')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences?.notifications?.sms ? 'bg-primary' : 'bg-muted'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${preferences?.notifications?.sms ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-destructive/10 rounded-3xl p-6 border border-destructive/20 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div>
                  <h3 className="text-lg font-bold text-destructive mb-1">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account credentials.</p>
                </div>
                <button className="px-6 py-3 border border-destructive/20 text-destructive font-bold rounded-xl bg-card hover:bg-destructive hover:text-destructive-foreground transition-all text-sm">
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default SuperAdminSettings;