import React, { useEffect, useState, useRef } from "react";
import {
  Bell,
  Wallet,
  Download,
  CheckCircle2,
  Filter,
  ArrowRight,
  CreditCard,
  Info,
  ShieldCheck,
  Receipt,
  ChevronRight,
  LucideEye,
  UserCheck,
  X,
  Calendar,
  User,
  FileText,
  Clock,
  Upload,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getMyAllCharges,
  getUserPayemntHistory,
  getSingleChargeDetails,
  clearChargeDetails,
  userSubmitPayment,
} from "@/features/User/userSlice";
import { toast } from "@/hooks/use-toast";

const ResidentialPayments = () => {
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("dues");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);

  const [submitDrawerOpen, setSubmitDrawerOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State for Submission
  const [paymentForm, setPaymentForm] = useState({
    chargeId: "",
    chargeAmount: "",
    paymentTitle: "",
    transactionId: "",
    paymentScreenshotUrl: "",
    proofFile: null,
  });

  const {
    myCharges,
    paymentHistory,
    chargeDetails,
    loading,
    singleLoading,
    error,
  } = useSelector((state: RootState) => state.user);

  const dues = myCharges?.charges || [];
  const lastPayments = paymentHistory?.payments || [];

  useEffect(() => {
    dispatch(getMyAllCharges({}));
  }, [dispatch]);

  const toggleBill = (bill: any) => {
    const blockedStatuses = ["approved", "pending"];

    if (blockedStatuses.includes(bill.paymentStatus?.status)) return;

    setSelectedBills((prev) =>
      prev.includes(bill._id)
        ? prev.filter((b) => b !== bill._id)
        : [...prev, bill._id],
    );
  };

  const openChargeDetails = (id: string) => {
    setSelectedChargeId(id);
    setDetailsOpen(true);
    dispatch(getSingleChargeDetails(id));
  };

  const selectedTotal = dues
    .filter((d) => selectedBills.includes(d._id))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const unpaidBills = dues.filter(
    (d) => !["approved", "pending"].includes(d.paymentStatus?.status),
  );

  const totalOutstanding = unpaidBills.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  const validateForm = () => {
    const errors = {};
    if (!paymentForm.transactionId.trim()) errors.transactionId = "Required";
    if (!paymentForm.proofFile) errors.screenshot = "Required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProofSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();

    formData.append("chargeId", paymentForm.chargeId);
    formData.append("transactionId", paymentForm.transactionId);
    formData.append("paymentScreenshot", paymentForm.proofFile);

    try {
      await dispatch(userSubmitPayment(formData)).unwrap();

      console.log("Payment proof submitted");

      resetSubmitForm();
      setSubmitDrawerOpen(false);

      toast({
        title: "Proof submission Successful",
        description: "Payment Proof submitted successfully",
      });

      dispatch(getMyAllCharges());
    } catch (err) {
      console.error("Submission failed:", err);

      setSubmitError(err);
      toast({
        title: " Failed to Submit",
        description: err,
        variant: "destructive",
      });
    }
  };

  const removeProof = () => {
    setPaymentForm((prev) => ({
      ...prev,
      paymentScreenshotUrl: "",
      proofFile: null,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setPaymentForm((prev) => ({
      ...prev,
      paymentScreenshotUrl: previewUrl,
      proofFile: file,
    }));

    setFormErrors((prev) => ({ ...prev, screenshot: null }));
  };

  const resetSubmitForm = () => {
    setFormErrors({});
    setSubmitError("");
    setPaymentForm({
      chargeId: "",
      chargeAmount: "",
      paymentTitle: "",
      transactionId: "",
      paymentScreenshotUrl: "",
      proofFile: null,
    });
  };

  // filters
   const handleChange = (e) => {
      const category = e.target.value;
      if (category === "reset" || category === "") {
      dispatch(getMyAllCharges({}));
    } else {
      dispatch(getMyAllCharges({ category }));
    }
    };

    const handleStatusChange = (e) => {
      const status = e.target.value;

      dispatch(getUserPayemntHistory({ status }));
    };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-50 text-green-600 border-green-100";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-100";
      case "pending":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  return (
    <DashboardLayout role="member">
      <div className=" max-w-5xl mx-auto">
        {/* Header Area */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-foreground">
            Billing & Payments
          </h1>
          {/* <div className="flex items-center gap-6">
          <button className="relative p-2 text-muted-foreground hover:bg-card rounded-full transition-all">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8fafc]"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-bold text-foreground leading-none">Aryan Sharma</p>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium text-right">Resident Owner</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan" alt="avatar" />
            </div>
          </div>
        </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Total & Dues */}
          <div className="lg:col-span-3 space-y-6">
            {/* Total Outstanding Card */}
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Wallet size={28} />
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">
                Total Outstanding
              </p>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl md:text-4xl font-black text-foreground">
                  ₹{totalOutstanding.toLocaleString()}
                </h2>
                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-100">
                  {unpaidBills.length} Bills Due
                </span>
              </div>
              <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                <Info size={14} /> Next billing cycle starts on Nov 01, 2023
              </p>
            </div>

            {/* Tabs & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex bg-muted p-1 rounded-xl border border-border">
                <button
                  onClick={() => setActiveTab("dues")}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                    activeTab === "dues"
                      ? "bg-card text-primary shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  My Charges
                </button>

                <button
                  onClick={() => {
                    setActiveTab("history");
                    dispatch(getUserPayemntHistory({}));
                  }}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                    activeTab === "history"
                      ? "bg-card text-primary shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Past Payments
                </button>
              </div>
              <div className="flex items-center gap-2 justify-center">
                {/* Label with icon */}
                <label
                  htmlFor="filterCategory"
                  className="flex items-center gap-2 text-primary font-bold text-sm"
                >
                  <Filter size={16} /> Filter
                </label>

                {/* Select options */}
                 {/* CATEGORY FILTER */}
                  {activeTab !== "history" && (
                    <select
                      onChange={handleChange}
                      className="bg-card border border-border rounded-md px-3 py-1 text-sm outline-none focus:border-primary text-foreground"
                    >
                      <option value="" className="bg-card">All</option>
                      <option value="maintenance" className="bg-card">Maintenance</option>
                    </select>
                  )}

                  {/* STATUS FILTER FOR HISTORY TAB */}
                  {activeTab === "history" && (
                    <select
                      onChange={handleStatusChange}
                      className="bg-card border border-border rounded-md px-3 py-1 text-sm outline-none focus:border-primary text-foreground"
                    >
                      <option value="" className="bg-card">All Status</option>
                      <option value="pending" className="bg-card">Pending</option>
                      <option value="approved" className="bg-card">Approved</option>
                      <option value="rejected" className="bg-card">Rejected</option>
                    </select>
                  )}
              </div>
            </div>

            {/* Dues List */}
            <div className="space-y-4 text-left">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                {activeTab === "dues"
                  ? "Total Charges"
                  : "Total Payment History"}{" "}
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-black">
                  {activeTab === "dues"
                    ? (myCharges?.count ?? 0)
                    : (paymentHistory?.count ?? 0)}
                </span>
              </h3>

              {/* 🔄 Loading State */}
              {loading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl border border-border bg-card animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 w-2/3">
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      </div>
                      <div className="h-4 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}

              {/* Error State */}
              {!loading && error && (
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-600 text-sm font-semibold">
                  {error}
                </div>
              )}

              {/* Empty State */}
              {!loading &&
                !error &&
                (activeTab === "dues" ? dues.length : lastPayments.length) ===
                  0 && (
                  <div className="bg-card p-8 rounded-2xl border border-border text-center">
                    <p className="text-muted-foreground font-semibold">
                      {activeTab === "dues"
                        ? "No pending bills 🎉"
                        : "No payment history found"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      You're all caught up. No outstanding payments.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                activeTab === "dues" &&
                dues.length > 0 &&
                dues.map((bill) => (
                  <div
                    key={bill._id}
                    // onClick={() => toggleBill(bill)}
                    className={cn(
                      "p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                      selectedBills.includes(bill._id)
                        ? "bg-card border-blue-500 shadow-md ring-1 ring-blue-500"
                        : "bg-card border-border hover:border-border",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* <div
                        className={cn(
                          "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                          selectedBills.includes(bill._id)
                            ? "bg-blue-600 border-blue-600"
                            : "border-border bg-muted/50",
                        )}
                      >
                        {selectedBills.includes(bill._id) && (
                          <CheckCircle2 className="text-white w-4 h-4" />
                        )}
                      </div> */}

                      <div className="space-y-2">
                        <h4 className="font-bold tracking-normal text-[#0F172A]">
                          {bill.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Category: {bill.category.toUpperCase()}
                          {bill?.dueDate &&
                            ` • Due ${new Date(bill.dueDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {["rejected", "unpaid"].includes(
                        bill.paymentStatus?.status,
                      ) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedChargeId(bill._id);
                            setPaymentForm({
                              transactionId: "",
                              paymentScreenshotUrl: "",
                              paymentTitle: bill.title,
                              chargeAmount: bill.amount,
                              chargeId: bill._id,
                            });
                            setSubmitDrawerOpen(true);
                          }}
                          className="mt-1 flex items-center gap-1.5 text-[8px]  md:text-xs font-semibold px-2 py-0.5 md:py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors uppercase tracking-tight"
                        >
                          <Upload size={10} /> Submit Proof
                        </button>
                      )}
                      <div className="text-right">
                        <p className="font-black text-foreground">
                          ₹{bill.amount}
                        </p>
                        <span
                          className={cn(
                            "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                            bill.paymentStatus?.status === "approved" &&
                              "bg-green-50 text-green-600",
                            bill.paymentStatus?.status === "rejected" &&
                              "bg-red-50 text-red-600",
                            bill.paymentStatus?.status !== "approved" &&
                              bill.paymentStatus?.status !== "rejected" &&
                              "bg-orange-50 text-orange-600",
                          )}
                        >
                          {bill.paymentStatus?.status?.toUpperCase()}
                        </span>
                      </div>

                      <button
                        className="view-details"
                        onClick={(e) => {
                          e.stopPropagation();
                          openChargeDetails(bill._id);
                        }}
                      >
                        <LucideEye className="w-5 h-5 text-muted-foreground hover:text-slate-700 transition" />
                      </button>
                    </div>
                  </div>
                ))}

              {!loading &&
                !error &&
                activeTab === "history" &&
                lastPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="p-5 rounded-2xl border border-border bg-card flex items-center justify-between hover:border-border transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          payment.status === "approved" &&
                            "bg-green-50 text-green-600",
                          payment.status === "rejected" &&
                            "bg-red-50 text-red-600",
                          payment.status === "pending" &&
                            "bg-orange-50 text-orange-600",
                        )}
                      >
                        <Receipt size={18} />
                      </div>

                      <div>
                        <h4 className="font-bold text-foreground">
                          {payment.charge?.title}
                        </h4>

                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                          TXN: {payment.transactionId}
                          <span className="flex items-center ml-2 gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full inline-block"></span>

                            {new Date(payment.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </p>

                        {payment.status === "rejected" &&
                          payment.rejectionReason && (
                            <p className="text-xs text-red-500 mt-1">
                              Reason: {payment.rejectionReason}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-foreground text-lg">
                        ₹{payment.amount}
                      </p>

                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                          payment.status === "approved" &&
                            "bg-green-50 text-green-600",
                          payment.status === "rejected" &&
                            "bg-red-50 text-red-600",
                          payment.status === "pending" &&
                            "bg-orange-50 text-orange-600",
                        )}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Column: Payment Summary */}
          {/* <div className="space-y-6">
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Payment Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Amount Selected
                  </span>
                  <span className="text-foreground font-bold">
                    ₹{selectedTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Convenience Fee
                  </span>
                  <span className="text-foreground font-bold">₹0.00</span>
                </div>
                <div className="pt-4 border-t border-dashed flex justify-between items-center">
                  <span className="text-foreground font-bold">
                    Total Payable
                  </span>
                  <span className="text-2xl font-black text-blue-600">
                    ₹{selectedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Pay Now <ArrowRight size={18} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-green-500" /> PCI DSS
                COMPLIANT GATEWAY
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-blue-900">
                    Auto-Pay Active
                  </h5>
                  <p className="text-[10px] text-blue-700/70 mt-1 leading-relaxed">
                    Your monthly maintenance will be auto-debited on Oct 31.
                  </p>
                  <button className="text-[10px] font-black text-blue-600 mt-2 hover:underline">
                    Manage Auto-Pay
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full p-5 bg-card rounded-2xl border border-border flex items-center justify-between text-slate-600 hover:bg-muted/50 transition-all group">
              <div className="flex items-center gap-3">
                <Download
                  size={18}
                  className="text-muted-foreground group-hover:text-blue-600"
                />
                <span className="text-sm font-bold">Download Last Receipt</span>
              </div>
              <Download size={16} className="text-slate-300" />
            </button>
          </div> */}
        </div>
      </div>
      {detailsOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setDetailsOpen(false);
              setSelectedChargeId(null);
              dispatch(clearChargeDetails());
            }}
          />

          <div className="relative w-full max-w-lg bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-card sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Charge Details
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  Reference: #{chargeDetails.charge?._id || ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedChargeId(null);
                  dispatch(clearChargeDetails());
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {singleLoading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : chargeDetails ? (
                <>
                  {/* Hero Section */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="inline-flex px-2 py-1 rounded bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                          {chargeDetails.charge?.category || ""}
                        </span>
                        <h3 className="text-2xl font-black text-foreground leading-tight">
                          {chargeDetails.charge?.title || ""}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-blue-600">
                          ₹{chargeDetails.charge?.amount.toLocaleString() || ""}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">
                          Amount
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        "{chargeDetails.charge?.description || ""}"
                      </p>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-2xl space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Reported By
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        {chargeDetails.charge?.createdBy?.name || ""}
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-2xl space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Incident Date
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        {new Date(
                          chargeDetails.charge?.createdAt,
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Attachment Section */}
                  {chargeDetails.charge?.proofImageUrl && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                        <FileText size={16} className="text-blue-600" />
                        Violation Proof (Image)
                      </div>
                      <div className="relative group rounded-2xl overflow-hidden border border-border bg-muted/50">
                        <img
                          src={chargeDetails.charge?.proofImageUrl}
                          alt="Proof"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button className="bg-card px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2">
                             <Download size={14} /> View Evidence
                           </button>
                        </div> */}
                      </div>
                    </div>
                  )}

                  {/* Payment History Section */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        Payment Status
                      </h4>
                    </div>

                    {chargeDetails.myPayments?.length > 0 ? (
                      <div className="space-y-3">
                        {chargeDetails.myPayments.map((pay) => (
                          <div
                            key={pay._id}
                            className="p-4 border border-border rounded-2xl bg-card space-y-4 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-foreground">
                                  Transaction ID
                                </p>
                                <p className="text-xs font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded leading-none">
                                  {pay.transactionId}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  "text-[9px] font-black px-2 py-1 rounded-md uppercase border",
                                  getStatusStyles(pay.status),
                                )}
                              >
                                {pay.status}
                              </span>
                            </div>

                            {/* Verification Badge */}
                            {pay.status === "approved" && (
                              <div className="flex items-center gap-2 py-2 px-3 bg-green-50/50 rounded-xl border border-green-100/50">
                                <UserCheck
                                  size={14}
                                  className="text-green-600"
                                />
                                <div className="text-[10px]">
                                  <span className="text-muted-foreground font-medium">
                                    Verified at:{" "}
                                  </span>
                                  <span className="text-slate-700 font-bold">
                                    {new Date(pay.reviewedAt).toLocaleString(
                                      "en-IN",
                                    )}
                                  </span>
                                </div>
                              </div>
                            )}

                            {pay.paymentScreenshotUrl && (
                              <div className="pt-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                                  Submitted Receipt
                                </p>

                                <img
                                  src={pay?.paymentScreenshotUrl}
                                  alt="Screenshot"
                                  className="rounded-xl border border-border w-full h-32 object-cover"
                                  // onError={(e) => {
                                  //     e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                                  //     e.target.className = "rounded-xl border border-border w-full h-32 object-contain bg-muted/50 opacity-50";
                                  //   }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted/50 rounded-2xl border border-dashed border-border">
                        <p className="text-xs text-muted-foreground font-medium italic">
                          No payments have been recorded for this charge yet.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-border bg-muted/50/50">
              <button
                onClick={() => {
                  setDetailsOpen(false);
                  dispatch(clearChargeDetails());
                }}
                className="w-full py-4 bg-card border border-border text-slate-600 rounded-2xl font-bold hover:bg-muted/50 transition-all shadow-sm"
              >
                Close Detail View
              </button>
            </div>
          </div>
        </div>
      )}
      {submitDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              if (!singleLoading) setSubmitDrawerOpen(false);
              resetSubmitForm();
            }}
          />
          <div className="relative w-full max-w-lg bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center bg-card sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Submit Payment Proof
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  Reference: #{paymentForm.chargeId}
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmitDrawerOpen(false);
                  resetSubmitForm();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <form onSubmit={handleProofSubmit} className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-900 mb-1">
                    {paymentForm.paymentTitle || ""}
                  </h3>
                  <p className="text-xl font-black text-blue-600">
                    ₹{paymentForm.chargeAmount || ""}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Transaction ID Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                        Transaction ID / UTR
                      </label>
                      {formErrors.transactionId && (
                        <span className="text-[10px] font-bold text-red-500 uppercase">
                          This field is required
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={paymentForm.transactionId}
                      onChange={(e) => {
                        setPaymentForm({
                          ...paymentForm,
                          transactionId: e.target.value,
                        });
                        if (e.target.value)
                          setFormErrors((prev) => ({
                            ...prev,
                            transactionId: null,
                          }));
                      }}
                      placeholder="Enter UPI / Bank reference number"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-sm",
                        formErrors.transactionId
                          ? "border-red-500 bg-red-50 focus:border-red-500"
                          : "border-border focus:border-blue-500 bg-card",
                      )}
                    />
                  </div>

                  {/* Screenshot Preview / Upload */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                        Payment Proof
                      </label>
                      {formErrors.screenshot && (
                        <span className="text-[10px] font-bold text-red-500 uppercase">
                          Proof required
                        </span>
                      )}
                    </div>

                    {paymentForm.paymentScreenshotUrl ? (
                      <div className="relative aspect-video rounded-2xl border border-border bg-muted/50 overflow-hidden group">
                        <img
                          src={paymentForm.paymentScreenshotUrl}
                          className="w-full h-full object-cover"
                          alt="Payment Preview"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={removeProof}
                            className="bg-card/90 hover:bg-card text-red-600 p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                            title="Remove Image"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider">
                          Preview
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all gap-2",
                          formErrors.screenshot
                            ? "border-red-400 bg-red-50 text-red-500"
                            : "border-border bg-muted/50 text-muted-foreground hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500",
                        )}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Upload size={32} />
                        <div className="text-center">
                          <p className="text-xs font-bold uppercase tracking-tight">
                            Click to Upload
                          </p>
                          <p className="text-[10px] opacity-70">
                            PNG, JPG or JPEG up to 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3 items-start">
                  <Info size={16} className="text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-orange-700 leading-relaxed font-medium">
                    Ensure the transaction ID and amount are clearly visible in
                    the Proof. Submitting false proof may lead to permanent
                    account restriction.
                  </p>
                </div>

                {submitError && (
                  <div className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {submitError}
                  </div>
                )}

                <button
                  disabled={singleLoading}
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300 disabled:shadow-none"
                >
                  {singleLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Confirm Payment <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="p-6 border-t border-border bg-muted/50/50">
              <button
                disabled={singleLoading}
                onClick={() => {
                  resetSubmitForm();
                  setSubmitDrawerOpen(false);
                }}
                className="w-full py-4 bg-card border border-border text-slate-600 rounded-2xl font-bold hover:bg-muted/50 transition-all shadow-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResidentialPayments;
