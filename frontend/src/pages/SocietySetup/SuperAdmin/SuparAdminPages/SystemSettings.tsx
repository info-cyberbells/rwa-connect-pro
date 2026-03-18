import React, { useEffect, useState } from "react";
import {
  Settings,
  Bell,
  Upload,
  CreditCard,
  Info,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  Sparkles,
  Building2,
  DollarSign,
  ListChecks,
  Star,
  AlignLeft,
  IndianRupee,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addSubscriptionPlan,
  deleteSubscriptionPlan,
  getAllSubscriptionPlan,
  getSystemSettings,
  updateNotificationRules,
  updatePlatformConfig,
  updateSubscriptionPlan,
} from "@/features/Superadmin/superAdminSlice";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const [platformName, setPlatformName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const { toast } = useToast();
  const [errors, setErrors] = useState({
    platformName: "",
    supportEmail: "",
    logo: "",
  });

  const [planErrors, setPlanErrors] = useState<Record<string, boolean>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxUnits: "",
    pricePerYear: "",
    features: "",
    isPopular: false,
  });

  const dispatch = useDispatch<AppDispatch>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const {
    systemSettings,
    subscriptionPlans,
    loading,
    loading2,
    loading3,
    error,
    error2,
    error3,
  } = useSelector((state: RootState) => state.superAdmin);

  // Notification states
  const [notifications, setNotifications] = useState({
    registration: { email: false, push: false },
    payment: { email: false, push: false },
    health: { email: false, push: false },
  });

  useEffect(() => {
    dispatch(getSystemSettings());
  }, []);

  useEffect(() => {
    dispatch(getAllSubscriptionPlan());
  }, []);

  useEffect(() => {
    if (!systemSettings?.settings) return;
    if (systemSettings) {
      setPlatformName(systemSettings.settings.platformName);
      setSupportEmail(systemSettings.settings.supportEmail);

      setPreviewLogo(systemSettings.settings.logoUrl);

      setNotifications({
        registration: systemSettings?.settings?.notificationRules
          ?.newSocietyRegistration || { email: false, push: false },
        payment: systemSettings?.settings?.notificationRules
          ?.paymentFailureAlerts || { email: false, push: false },
        health: systemSettings?.settings?.notificationRules
          ?.systemHealthUpdates || { email: false, push: false },
      });

      setUnsavedChanges(false);
    }
  }, [systemSettings]);

  useEffect(() => {
    if (!systemSettings?.settings) return;

    const isChanged =
      JSON.stringify(notifications) !==
      JSON.stringify({
        registration:
          systemSettings?.settings?.notificationRules?.newSocietyRegistration,
        payment:
          systemSettings?.settings?.notificationRules?.paymentFailureAlerts,
        health:
          systemSettings?.settings?.notificationRules?.systemHealthUpdates,
      });

    setUnsavedChanges(isChanged);
  }, [platformName, supportEmail, notifications, systemSettings]);

  const toggleNotification = (
    key: "registration" | "payment" | "health",
    type: "email" | "push",
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: !prev[key][type],
      },
    }));
  };

  const Toggle = ({
    active,
    onClick,
  }: {
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        active ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const handleLogoChange = (file: File) => {
    console.log("File received:", file);
    setLogo(file);
    setPreviewLogo(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, logo: "" }));
  };

  const handleSaveConfig = async () => {
    if (!systemSettings?.settings) return;

    let newErrors = {
      platformName: "",
      supportEmail: "",
      logo: "",
    };

    if (!platformName.trim()) {
      newErrors.platformName = "Platform name is required";
    }

    if (!supportEmail.trim()) {
      newErrors.supportEmail = "Support email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (supportEmail && !emailRegex.test(supportEmail)) {
      newErrors.supportEmail = "Enter a valid email";
    }

    if (!previewLogo && !logo) {
      newErrors.logo = "Logo is required";
    }

    setErrors(newErrors);

    if (newErrors.platformName || newErrors.supportEmail || newErrors.logo)
      return;

    try {
      const original = systemSettings.settings;
      const formData = new FormData();

      if (platformName !== original.platformName) {
        formData.append("platformName", platformName);
      }

      if (supportEmail !== original.supportEmail) {
        formData.append("supportEmail", supportEmail);
      }

      if (logo) {
        formData.append("logo", logo);
      } else if (!previewLogo && original.logoUrl) {
        formData.append("removeLogo", "true");
      }

      if ([...formData.entries()].length === 0) {
        toast({
          title: "No Changes",
          description: "No changes detected",
        });
        return;
      }

      await dispatch(updatePlatformConfig(formData)).unwrap();

      toast({
        title: "Success",
        description: "Changes saved successfully",
      });

      dispatch(getSystemSettings());
      setLogo(null);
    } catch (err: any) {
      console.error("Update failed:", err);

      toast({
        title: "Error",
        description: err?.message || "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotifications = async () => {
    try {
      const payload = {
        newSocietyRegistration: notifications.registration,
        paymentFailureAlerts: notifications.payment,
        systemHealthUpdates: notifications.health,
      };

      console.log("Notification Payload:");
      console.log(payload);

      await dispatch(updateNotificationRules(payload)).unwrap();

      toast({
        title: "Success",
        description: "Notification settings updated",
      });

      dispatch(getSystemSettings());

      setUnsavedChanges(false);
    } catch (err: any) {
      console.error("Notification update failed:", err);

      toast({
        title: "Error",
        description: err || "Failed to update notifications",
        variant: "destructive",
      });
    }
  };

  const handleSavePlan = async () => {
    try {
      const newErrors: Record<string, boolean> = {
        name: !formData.name.trim(),
        description: !formData.description.trim(),
        maxUnits: !formData.maxUnits,
        pricePerYear: !formData.pricePerYear,
        features: !String(formData.features).trim(),
      };

      setPlanErrors(newErrors);

      if (Object.values(newErrors).some(Boolean)) return;

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        maxUnits: Number(formData.maxUnits),
        pricePerYear: Number(formData.pricePerYear),
        features: String(formData.features)
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        isPopular: formData.isPopular,
      };

      if (isEditMode && selectedPlan?._id) {
        // UPDATE
        await dispatch(
          updateSubscriptionPlan({
            id: selectedPlan._id,
            payload,
          }),
        ).unwrap();

        toast({
          title: "Plan Updated",
          description: "Subscription plan updated successfully",
        });
      } else {
        await dispatch(addSubscriptionPlan(payload)).unwrap();

        toast({
          title: "Plan Created",
          description: "New subscription plan added successfully",
        });
      }

      dispatch(getAllSubscriptionPlan());

      setIsModalOpen(false);
      setPlanErrors({});
      setSelectedPlan(null);
    } catch (err: any) {
      console.error("Save plan failed:", err);

      toast({
        title: "Error",
        description: err || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const SkeletonCard = () => (
    <div className="border border-slate-200 rounded-2xl p-6 animate-pulse">
      <div className="h-5 w-24 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-32 bg-slate-200 rounded mb-6" />

      <div className="h-6 w-20 bg-slate-200 rounded mb-6" />

      <div className="space-y-3 mb-6">
        <div className="h-3 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
      </div>

      <div className="h-8 bg-slate-200 rounded w-full" />
    </div>
  );

  return (
    <DashboardLayout role="super-admin">
      <div className="min-h-screen text-slate-900 pb-24">
        <header className="max-w-7xl mx-auto px-4 pb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              System Settings
            </h1>
            <p className="text-slate-500 mt-1">
              Configure global platform parameters and management rules.
            </p>
          </div>
          {/* Notification Bell */}
          <button className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600 fill-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        <main className="max-w-7xl mx-auto px-4 space-y-6 ">
          {/* General Configuration Section */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">General Configuration</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={platformName}
                    placeholder="SocietySmartHub"
                    onChange={(e) => {
                      setPlatformName(e.target.value);
                      setErrors((prev) => ({ ...prev, platformName: "" }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.platformName
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                    } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    placeholder="support@societyhub.io"
                    onChange={(e) => {
                      setSupportEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, supportEmail: "" }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.supportEmail
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                    } focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <label className="text-sm font-medium text-slate-700">
                  Platform Logo
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Preview */}
                  <div
                    className={`relative w-24 h-24 rounded-2xl border overflow-hidden flex items-center justify-center ${
                      errors.logo
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    {previewLogo ? (
                      <img
                        src={previewLogo}
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-400" />
                    )}

                    {/* Remove button */}
                    {previewLogo && (
                      <button
                        onClick={() => {
                          setPreviewLogo(null);
                          setLogo(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Upload */}
                    <label className="cursor-pointer">
                      <span className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        Upload Logo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleLogoChange(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    {/* Save Button */}
                    <button
                      type="button"
                      onClick={handleSaveConfig}
                      disabled={loading2}
                      className={`px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl
                      flex items-center justify-center gap-2
                      min-w-[140px]   // ✅ prevents width jump
                      transition-colors shadow-sm
                      ${
                        loading2
                          ? "bg-green-400 cursor-not-allowed"
                          : "hover:bg-green-700"
                      }`}
                    >
                      {loading2 ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span className="whitespace-nowrap">Saving...</span>
                        </>
                      ) : (
                        <span className="whitespace-nowrap">Save Config</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notification Rules Section */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Notification Rules</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    New Society Registration
                  </h3>
                  <p className="text-sm text-slate-500">
                    Notify super admins when a new society applies for
                    registration.
                  </p>
                </div>
                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Email
                    </span>
                    <Toggle
                      active={notifications.registration.email}
                      onClick={() =>
                        toggleNotification("registration", "email")
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Push
                    </span>
                    <Toggle
                      active={notifications.registration.push}
                      onClick={() => toggleNotification("registration", "push")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Payment Failure Alerts
                  </h3>
                  <p className="text-sm text-slate-500">
                    Critical alerts for subscription or utility payment
                    failures.
                  </p>
                </div>
                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Email
                    </span>
                    <Toggle
                      active={notifications.payment.email}
                      onClick={() => toggleNotification("payment", "email")}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Push
                    </span>
                    <Toggle
                      active={notifications.payment.push}
                      onClick={() => toggleNotification("payment", "push")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    System Health Updates
                  </h3>
                  <p className="text-sm text-slate-500">
                    Weekly reports on server status and platform performance.
                  </p>
                </div>
                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Email
                    </span>
                    <Toggle
                      active={notifications.health.email}
                      onClick={() => toggleNotification("health", "email")}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Push
                    </span>
                    <Toggle
                      active={notifications.health.push}
                      onClick={() => toggleNotification("health", "push")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Subscription Plans Section */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">Subscription Plans</h2>
              </div>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setFormData({
                    name: "",
                    description: "",
                    maxUnits: "",
                    pricePerYear: "",
                    features: "",
                    isPopular: false,
                  });
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Create New Tier
              </button>
            </div>

            <div className="p-6 xl:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading3 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) 
              : error3 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                  <div className="mb-3 p-3 rounded-full bg-red-50">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>

                  <h3 className="text-sm font-semibold text-red-600">
                    Failed to load plans
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    {typeof error3 === "string" ? error3 : "Something went wrong"}
                  </p>

                  <button
                    onClick={() => dispatch(getAllSubscriptionPlan())}
                    className="mt-4 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>

              ) 
              : subscriptionPlans?.plans?.length === 0 ? (
                <div className="col-span-full text-center py-10 text-slate-500">
                  No subscription plans available.
                </div>
              ) : (
                subscriptionPlans?.plans?.map((plan) => (
                  <div
                    key={plan._id}
                    className={`relative rounded-2xl p-6 flex flex-col transition-colors
        ${
          plan.isPopular
            ? "border-2 border-blue-500 bg-blue-50/60 shadow-lg shadow-blue-50"
            : "border border-slate-200 hover:border-blue-200"
        }`}
                  >
                    <button
                      onClick={() => {
                        setPlanToDelete(plan);
                        setIsDeleteModalOpen(true);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Popular Badge */}
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Most Popular
                      </div>
                    )}

                    {/* Header */}
                    <div className="mb-6 mt-2">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        Up to {plan.maxUnits} Units
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold">
                          ₹{plan.pricePerYear.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-sm ml-1">
                          /year
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8 flex-grow">
                      {plan.features?.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 text-sm text-slate-600"
                        >
                          <CheckCircle2 className="w-4 h-4 fill-[#22C55E] text-white" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => {
                        setIsEditMode(true);
                        setSelectedPlan(plan);

                        setFormData({
                          name: plan.name,
                          description: plan.description,
                          maxUnits: plan.maxUnits,
                          pricePerYear: plan.pricePerYear,
                          features: plan.features.join(", "),
                          isPopular: plan.isPopular,
                        });

                        setIsModalOpen(true);
                      }}
                      className={`w-full py-2.5 font-semibold rounded-xl text-sm transition-colors
          ${
            plan.isPopular
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200"
              : "border border-blue-600 text-blue-600 hover:bg-blue-50"
          }`}
                    >
                      Edit Plan
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* Floating Action Bar */}
        {unsavedChanges && (
          <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-300">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                {" "}
                <Info className="w-6 h-6 fill-[#F97316] text-white" />
                <span className="text-sm text-[#64748B] font-medium">
                  You have unsaved changes in 'Notification Rules'.
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (!systemSettings) return;
                    setNotifications({
                      registration:
                        systemSettings.settings.notificationRules
                          .newSocietyRegistration,
                      payment:
                        systemSettings.settings.notificationRules
                          .paymentFailureAlerts,
                      health:
                        systemSettings.settings.notificationRules
                          .systemHealthUpdates,
                    });

                    setUnsavedChanges(false);
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveNotifications}
                 disabled={loading2}
                  className={`flex-1 sm:flex-none px-8 py-2.5 font-semibold rounded-xl flex items-center justify-center gap-2
                  transition-all shadow-md
                  ${
                    loading2
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 text-white"
                  }`}
                >
                  {loading2 ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg  border border-slate-100 overflow-hidden">
            {/* ── Header ── */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {isEditMode ? "Edit Plan" : "Create New Plan"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEditMode
                      ? "Update subscription plan details"
                      : "Configure a new subscription tier"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPlanErrors({});
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Row 1: Name + Description */}
              <div className="grid grid-cols-2 gap-4">
                {/* Plan Name */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <Star className="w-3.5 h-3.5 text-slate-400" />
                    Plan Name
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    placeholder="e.g. Pro, Enterprise"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (e.target.value.trim())
                        setErrors((prev) => ({ ...prev, name: false }));
                    }}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all
                ${
                  planErrors.name
                    ? "border-red-400 focus:ring-red-500/30 focus:border-red-400 bg-red-50/40"
                    : "border-slate-200 focus:ring-blue-500/30 focus:border-blue-400 hover:border-slate-300"
                }`}
                  />
                  {planErrors.name && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Plan name is required
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                    Description
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    placeholder="Short tagline"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (e.target.value.trim())
                        setErrors((prev) => ({ ...prev, description: false }));
                    }}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all
                ${
                  planErrors.description
                    ? "border-red-400 focus:ring-red-500/30 focus:border-red-400 bg-red-50/40"
                    : "border-slate-200 focus:ring-blue-500/30 focus:border-blue-400 hover:border-slate-300"
                }`}
                  />
                  {planErrors.description && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Description is
                      required
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Max Units + Price */}
              <div className="grid grid-cols-2 gap-4">
                {/* Max Units */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Max Units
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={formData.maxUnits}
                    onChange={(e) => {
                      setFormData({ ...formData, maxUnits: e.target.value });
                      if (e.target.value)
                        setErrors((prev) => ({ ...prev, maxUnits: false }));
                    }}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all
                ${
                  planErrors.maxUnits
                    ? "border-red-400 focus:ring-red-500/30 focus:border-red-400 bg-red-50/40"
                    : "border-slate-200 focus:ring-blue-500/30 focus:border-blue-400 hover:border-slate-300"
                }`}
                  />
                  {planErrors.maxUnits ? (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Max units is required
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Maximum units allowed
                    </p>
                  )}
                </div>

                {/* Price Per Year */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                    Price Per Year
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.pricePerYear}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          pricePerYear: e.target.value,
                        });
                        if (e.target.value)
                          setErrors((prev) => ({
                            ...prev,
                            pricePerYear: false,
                          }));
                      }}
                      className={`w-full border rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all
                  ${
                    planErrors.pricePerYear
                      ? "border-red-400 focus:ring-red-500/30 focus:border-red-400 bg-red-50/40"
                      : "border-slate-200 focus:ring-blue-500/30 focus:border-blue-400 hover:border-slate-300"
                  }`}
                    />
                  </div>
                  {planErrors.pricePerYear ? (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Price is required
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Annual billing in INR
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <ListChecks className="w-3.5 h-3.5 text-slate-400" />
                  Features
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <textarea
                  placeholder="e.g. Priority support, Advanced analytics, Custom reports"
                  value={formData.features}
                  onChange={(e) => {
                    setFormData({ ...formData, features: e.target.value });
                    if (e.target.value.trim())
                      setErrors((prev) => ({ ...prev, features: false }));
                  }}
                  rows={3}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all resize-none leading-relaxed
              ${
                planErrors.features
                  ? "border-red-400 focus:ring-red-500/30 focus:border-red-400 bg-red-50/40"
                  : "border-slate-200 focus:ring-blue-500/30 focus:border-blue-400 hover:border-slate-300"
              }`}
                />
                {planErrors.features ? (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> At least one feature is
                    required
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Separate each feature with a comma
                  </p>
                )}
              </div>

              {/* Popular Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Mark as Popular
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Shows a "Most Popular" badge on the card
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isPopular: !formData.isPopular })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    formData.isPopular ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      formData.isPopular ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                {isEditMode
                  ? "Changes apply immediately"
                  : "Plan will be active upon creation"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setPlanErrors({});
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlan}
                  disabled={loading2}
                  className={`px-5 py-2 text-sm font-semibold rounded-xl flex items-center justify-center gap-2
  transition-all active:scale-95 shadow-sm
  ${
    loading2
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 text-white"
  }`}
                >
                  {loading2 ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {isEditMode ? "Saving..." : "Adding..."}
                    </>
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Add Plan"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Plan</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this plan?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await dispatch(
                      deleteSubscriptionPlan(planToDelete._id),
                    ).unwrap();

                    toast({
                      title: "Deleted",
                      description: "Plan deleted successfully",
                    });

                    dispatch(getAllSubscriptionPlan());
                  } catch (err: any) {
                    toast({
                      title: "Error",
                      description: err || "Failed to delete",
                      variant: "destructive",
                    });
                  } finally {
                    setIsDeleteModalOpen(false);
                    setPlanToDelete(null);
                  }
                }}
                disabled={loading2}
                className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2
            ${
              loading2
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } text-white`}
              >
                {loading2 ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SystemSettings;
