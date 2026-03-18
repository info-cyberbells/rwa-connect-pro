import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  LifeBuoy,
  User,
  Plus,
  Moon,
  Bell,
  ChevronRight,
  X,
  Upload,
  Droplets,
  Zap,
  Volume2,
  Settings,
  CheckCircle2,
  Ticket,
  ClipboardList,
  AlertCircle,
  Calendar,
  Clock,
  ImageIcon,
  MapPin,
  MessageSquare,
  Phone,
  Wrench,
  TrendingUp,
  ArrowUpDown,
  Brush,
  Car,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyComplaints,
  submitComplaint,
  viewComplaintDetails,
} from "@/features/User/userSlice";
import { toast } from "@/hooks/use-toast";

// Mock Data
const INITIAL_TICKETS = [
  {
    id: "HD-892",
    title: "Leaking pipe in Block A",
    date: "Oct 24, 2023",
    status: "PENDING",
    type: "plumbing",
  },
  {
    id: "HD-885",
    title: "Elevator 2 not working",
    date: "Oct 23, 2023",
    status: "IN-PROGRESS",
    type: "utility",
  },
  {
    id: "HD-881",
    title: "Noise complaint - Flat B-102",
    date: "Oct 22, 2023",
    status: "PENDING",
    type: "noise",
  },
];

const RESOLVED_TICKETS = [
  {
    id: "HD-850",
    title: "Street light flickering",
    date: "Oct 20, 2023",
    status: "RESOLVED",
    type: "utility",
  },
];

const recent_RESOLVED_TICKETS = [
  {
    id: "HD-850",
    title: "Street light flickering",
    date: "Oct 20, 2023",
    status: "RESOLVED",
    type: "utility",
  },
];

const ResidentialSupport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [attachment, setAttachment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(
    null,
  );
  const [ticketCounts, setTicketCounts] = useState({
    open: 0,
    resolved: 0,
    inProgress: 0,
  });

  const dispatch = useDispatch<AppDispatch>();

  const {
    myComplaints,
    singleLoading,
    loading,
    complaintDetails,
    error,
    submitError,
    singleViewError,
  } = useSelector((state: RootState) => state.user);

  // Form State
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    preferredVisitTime: "",
    location: "",
    description: "",
    priority: "Low",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getMyComplaints());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === "all" && myComplaints?.complaints) {
      const openCount = myComplaints.complaints.filter(
        (c) => c.status === "open",
      ).length;

      const inProgressCount = myComplaints.complaints.filter(
        (c) => c.status === "in_progress",
      ).length;

      const resolvedCount = myComplaints.complaints.filter(
        (c) => c.status === "resolved",
      ).length;

      setTicketCounts({
        open: openCount,
        resolved: resolvedCount,
        inProgress: inProgressCount,
      });
    }
  }, [myComplaints, activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 10MB validation
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setAttachment({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const setPriority = (val) =>
    setFormData((prev) => ({ ...prev, priority: val }));

  const resetTicketForm = () => {
    setFormData({
      category: "",
      subject: "",
      preferredVisitTime: "",
      location: "",
      description: "",
      priority: "low",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.category) newErrors.category = "Required";
    if (!formData.subject.trim()) newErrors.subject = "Required";
    if (!formData.description.trim()) newErrors.description = "Required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const form = new FormData();

    form.append("type", formData.category);
    form.append("priority", formData.priority.toLowerCase());
    form.append("title", formData.subject);
    form.append("location", formData.location);
    form.append("preferredVisitTime", formData.preferredVisitTime);
    form.append("description", formData.description);

    if (attachment?.file) {
      form.append("images", attachment.file);
    }

    for (let [key, value] of form.entries()) {
      console.log(key, value);
    }

    try {
      const res = await dispatch(submitComplaint(form));

      if (res?.meta?.requestStatus === "fulfilled") {
        toast({
          title: "Ticket Submitted",
          description: "Your complaint has been submitted successfully",
        });

        resetTicketForm();
        setAttachment(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Submission failed:", error);

      toast({
        title: "Failed to Submit",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]";
      case "in_progress":
        return "bg-[#EFF6FF] text-[#3B82F6] border-[#DBEAFE]";
      case "resolved":
        return "bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]";
      default:
        return "bg-slate-50 text-slate-500";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "water_issue":
        return <Droplets className="text-blue-500" size={18} />;
      case "lift_problem":
        return <ArrowUpDown className="text-slate-600" size={18} />;
      case "security":
        return <ShieldCheck className="text-red-500" size={18} />;
      case "cleaning":
        return <Brush className="text-emerald-500" size={18} />;
      case "parking":
        return <Car className="text-blue-600" size={18} />;
      case "electricity":
        return <Zap className="text-amber-500" size={18} />;
      case "other":
      default:
        return <HelpCircle className="text-slate-500" size={18} />;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-600 border-red-100";
      case "medium":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <DashboardLayout role="member">
      <div className="min-h-screen text-[#0F172A]">
        {/* Content Area */}
        <main className=" max-w-5xl mx-auto space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold  text-[#0F172A] tracking-normal">
                Help Desk & Support
              </h2>
              <p className="text-[#64748B] text-base font-medium mt-1">
                Manage your requests and society assistance
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0D6CF2] hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all "
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Ticket</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Ticket className="text-[#3B82F6]" size={32} />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-[#0F172A] tracking-tight">
                  {ticketCounts.open}
                </h3>
                <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wide mt-1">
                  Active Tickets
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="text-[#059669]" size={32} />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-slate-800 tracking-normal">
                  {ticketCounts.resolved}
                </h3>
                <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wide mt-1">
                  Resolved Tickets
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                <TrendingUp className="text-[#059669]" size={32} />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-slate-800 tracking-normal">
                  {ticketCounts.inProgress}
                </h3>
                <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wide mt-1">
                  InProgress Tickets
                </p>
              </div>
            </div>
          </div>

          {/* Tickets Table Section */}
          <div className="bg-white rounded-3xl border border-[#F1F5F9] shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="p-5 border-b bg-[#F8FAFC]/50 border-slate-50 ">
             <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between gap-3 w-full">
              <div className="bg-[#E2E8F0]/80 p-1.5 rounded-2xl flex w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveTab("all");
                    dispatch(getMyComplaints());
                  }}
                  className={`flex px-2 sm:px-12 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "all" ? "bg-white text-[#3B82F6] shadow-sm" : "text-[#64748B] hover:text-slate-700"}`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setActiveTab("active");
                    dispatch(getMyComplaints({ status: "open" }));
                  }}
                  className={`flex px-2 sm:px-12 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "active" ? "bg-white text-[#3B82F6] shadow-sm" : "text-[#64748B] hover:text-slate-700"}`}
                >
                  Active
                </button>
                <button
                  onClick={() => {
                    setActiveTab("in_progress");
                    dispatch(getMyComplaints({ status: "in_progress" }));
                  }}
                  className={`flex px-2 sm:px-12 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "in_progress" ? "bg-white text-[#3B82F6] shadow-sm" : "text-[#64748B] hover:text-slate-700"}`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => {
                    setActiveTab("resolved");
                    dispatch(getMyComplaints({ status: "resolved" }));
                  }}
                  className={`flex-1 px-2 sm:px-12 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "resolved" ? "bg-white text-[#0D6CF2] shadow-sm" : "text-[#64748B] hover:text-slate-700"}`}
                >
                  Resolved
                </button>
              </div>

              {/* Show filter only when ALL tab active */}
    {activeTab === "all" && (
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-blue-600">
          Issue Type
        </label>

        <select
          onChange={(e) =>
            dispatch(getMyComplaints({ type: e.target.value }))
          }
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="">All</option>
          <option value="water_issue">Water Issue</option>
          <option value="lift_problem">Lift Problem</option>
          <option value="security">Security</option>
          <option value="cleaning">Cleaning</option>
          <option value="parking">Parking</option>
          <option value="electricity">Electricity</option>
          <option value="other">Other</option>
        </select>
      </div>
    )}
    </div>
            </div>

            {/* Ticket List */}
            <div className="divide-y divide-slate-50">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="p-5 flex items-center gap-5 animate-pulse"
                    >
                      <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>

                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-40"></div>
                        <div className="h-3 bg-slate-200 rounded w-24"></div>
                      </div>

                      <div className="w-20 h-6 bg-slate-200 rounded"></div>
                    </div>
                  ))
              ) : !myComplaints?.complaints ||
                myComplaints.complaints.length === 0 ? (
                // Empty State
                <div className="p-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <ClipboardList className="text-slate-400" size={22} />
                    </div>

                    <h4 className="font-bold text-slate-700 tracking-wide">
                      No Tickets Found
                    </h4>

                    <p className="text-sm text-slate-400 font-medium">
                      You haven't created any support tickets yet.
                    </p>
                  </div>
                </div>
              ) : (
                myComplaints?.complaints?.map((ticket) => (
                  <div
                    key={ticket._id}
                    onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComplaintId(ticket._id);
                          setDetailsOpen(true);
                          dispatch(viewComplaintDetails(ticket._id));
                        }}
                    className="group p-5 flex items-center gap-5 hover:bg-slate-50/80 transition-all cursor-pointer"
                  >
                    <div className="w-6 sm:w-14 h-6 sm:h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover:scale-105">
                      {getTypeIcon(ticket.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#0F172A] text-md truncate tracking-wide leading-tight">
                        {ticket.title}
                      </h4>
                      <div className="grid grid-cols-1 gap-1 sm:flex sm:items-center sm:gap-2.5 text-xs text-[#64748B] mt-1.5 tracking-wide font-medium">
                        <span className=" py-0.5 rounded text-[#64748B] font-semibold uppercase">
                          Ticket#{ticket._id?.slice(-6)}
                        </span>
                        <span className="w-2 h-2 hidden sm:block bg-slate-300 rounded-full"></span>
                        <span>
                          Date:{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center sm:gap-4">
                      <span
                        className={`px-4 py-1.5 rounded-md text-[8px] sm:text-xs font-black border tracking-wider ${getStatusColor(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                      <ChevronRight
                        size={20}
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   setSelectedComplaintId(ticket._id);
                        //   setDetailsOpen(true);
                        //   dispatch(viewComplaintDetails(ticket._id));
                        // }}
                        className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Section */}
          {/* <div className="pb-12 pt-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">
                Recently Handled
              </h3>
              <button className="text-[#3B82F6] text-xs font-semibold tracking-wide hover:underline underline-offset-4 decoration-2">
                View History
              </button>
            </div>

            <div className="space-y-2">
              {recent_RESOLVED_TICKETS.length === 0 ? (
                <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <ClipboardList className="text-slate-400" size={22} />
                    </div>

                    <h4 className="font-bold text-slate-700 tracking-wide">
                      No Resolved Tickets
                    </h4>

                    <p className="text-sm text-slate-400 font-medium">
                      There are no recently resolved maintenance requests.
                    </p>
                  </div>
                </div>
              ) : (
                recent_RESOLVED_TICKETS.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5"
                  >
                    <div className="w-6 sm:w-12 h-6 sm:h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                      {getTypeIcon(ticket.type)}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold tracking-wide text-[#0F172A]">
                        {ticket.title}
                      </h4>
                      <p className="text-xs text-[#64748B] tracking-wide mt-1 font-medium">
                        Completed on {ticket.date}
                      </p>
                    </div>

                    <div className="flex items-center sm:gap-4">
                      <span className="px-4 py-1.5 rounded-md text-[8px] sm:text-xs font-black border bg-green-50 text-[#059669] border-green-100 tracking-wider">
                        {ticket.status}
                      </span>

                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#059669]">
                        <CheckCircle2 size={20} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div> */}
       
        </main>

        {/* CREATE TICKET MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
              onClick={() => {
                setIsModalOpen(false);
                resetTicketForm();
              }}
            ></div>

            <div className="relative bg-[#e7e9ec] w-full max-w-lg rounded-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
              {/* Modal Header - Fixed */}
              <div className="px-8 pt-4 pb-4 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-semibold tracking-normal text-slate-800">
                    Create New Ticket
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetTicketForm();
                  }}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <form
                onSubmit={handleSubmit}
                className="px-8 pb-8 pt-4 space-y-5 overflow-y-auto scrollbar-hide flex-1"
              >
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide text-[#334155]">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 appearance-none text-sm font-semibold transition-all cursor-pointer
                       ${
                         errors.category
                           ? "border-red-500 bg-red-50 focus:ring-red-500/20"
                           : "border-slate-100 bg-slate-50 focus:ring-blue-500/10"
                       } border`}
                    >
                      <option value="">Select Category</option>
                      <option value="water_issue">Water Issue</option>
                      <option value="lift_problem">Lift Problem</option>
                      <option value="security">Security</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="parking">Parking</option>
                      <option value="`electricity">Electricity</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronRight
                      className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                  {errors.category && (
                    <p className="text-xs text-red-500 font-medium">
                      Please select a category
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold tracking-wide text-[#334155]">
                    Title
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="What's the issue?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full rounded-2xl px-5 py-4 text-sm font-semibold transition-all
                    ${
                      errors.subject
                        ? "border-red-500 bg-red-50 focus:ring-red-500/20"
                        : "border-slate-100 bg-slate-50 focus:ring-blue-500/10"
                    } border`}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold tracking-wide text-[#334155]">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Provide more details about the problem..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full rounded-2xl px-5 py-4 text-sm font-semibold transition-all
                    ${
                      errors.description
                        ? "border-red-500 bg-red-50 focus:ring-red-500/20"
                        : "border-slate-100 bg-slate-50 focus:ring-blue-500/10"
                    } border`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold tracking-wide text-[#334155]">
                    Preferred Visit Time
                  </label>
                  <input
                    type="text"
                    name="preferredVisitTime"
                    placeholder="Morning 9 AM - 12 PM"
                    value={formData.preferredVisitTime}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl px-5 py-4 text-sm font-semibold transition-all border-slate-100 bg-slate-50 focus:ring-blue-500/10 border"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold tracking-wide text-[#334155]">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Tower A, Floor 5, Flat 502"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl px-5 py-4 text-sm font-semibold transition-all border-slate-100 bg-slate-50 focus:ring-blue-500/10 border"
                  />
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold tracking-wide text-[#334155]">
                    Priority
                  </label>
                  <div className="bg-[#F1F5F9] p-1 rounded-lg flex border border-slate-100">
                    {["Low", "Medium", "High"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 uppercase text-xs tracking-widest rounded-md transition-all ${
                          formData.priority === p
                            ? "bg-[#3B82F6] text-white font-medium shadow-lg shadow-blue-100"
                            : "text-[#64748B] font-normal hover:text-slate-600"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold tracking-wide text-[#334155]">
                    Photos / Attachments
                  </label>

                  {!attachment && (
                    <label className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer group">
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>

                      <p className="mt-5 text-sm font-black text-slate-700">
                        Upload Media
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-[0.1em]">
                        PNG, JPG up to 10MB
                      </p>
                    </label>
                  )}

                  {attachment && (
                    <div className="mt-4 relative w-32">
                      <img
                        src={attachment.preview}
                        alt="preview"
                        className="w-full h-24 object-cover rounded-2xl border border-slate-200"
                      />

                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {submitError && (
                  <div className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {submitError}
                  </div>
                )}

                {/* Submit - Action Buttons */}
                <div className="flex gap-4 pt-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetTicketForm();
                    }}
                    className="flex-1 py-3.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-all"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={singleLoading}
                    className="flex-[1.5] py-3.5 bg-[#3B82F6] hover:bg-blue-700 text-white text-xs font-black tracking-widest rounded-lg shadow-xl shadow-blue-100 transition-all active:scale-95"
                  >
                    {singleLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>Submit</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {detailsOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Background */}
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => {
                setDetailsOpen(false);
                setSelectedComplaintId(null);
              }}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Complaint Details
                  </h2>

                  <p className="text-xs text-slate-400">
                    Ticket #{selectedComplaintId}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setDetailsOpen(false);
                    setSelectedComplaintId(null);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-red-50 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {singleLoading ? (
                  <div className="flex flex-col justify-center items-center h-full space-y-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm font-medium animate-pulse">
                      Loading ticket details...
                    </p>
                  </div>
                ) : complaintDetails ? (
                  <>
                    {/* Hero Section */}
                    <div className="space-y-4">
                      <div className=" gap-4">
                        <div className=" flex justify-between ">
                          {complaintDetails?.priority && (
                            <span
                              className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityStyles(complaintDetails.priority)}`}
                            >
                              {complaintDetails.priority.toUpperCase()} Priority
                            </span>
                          )}

                          {complaintDetails?.status && (
                            <span
                              className={`inline-flex px-3 py-1 rounded-md text-[10px] font-black uppercase border ${getStatusStyles(complaintDetails.status)}`}
                            >
                              {complaintDetails.status
                                .replace(/_/g, " ")
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="shrink-0 space-y-1">
                          <h3 className="text-2xl font-black text-slate-900 leading-tight break-words">
                            {complaintDetails?.title || "Complaint Details"}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          "{complaintDetails.description}"
                        </p>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-slate-100 rounded-2xl space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <User size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Submitted By
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-700">
                          {complaintDetails.submittedBy?.name}
                        </p>
                        <p className="text-[10px] text-blue-600 font-bold">
                          Unit {complaintDetails.submittedBy?.unit?.towerBlock}-
                          {complaintDetails.submittedBy?.unit?.flatNumber}
                        </p>
                      </div>
                      <div className="p-4 border border-slate-100 rounded-2xl space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Reported On
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-700">
                          {new Date(
                            complaintDetails.createdAt,
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {new Date(
                            complaintDetails.createdAt,
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Location & Time Info */}
                    <div className="space-y-3">
                      {complaintDetails.location && (
                        <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Location
                            </p>
                            <p className="text-sm font-bold text-slate-700">
                              {complaintDetails.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {complaintDetails.preferredVisitTime && (
                        <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                            <Clock size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Preferred Visit
                            </p>
                            <p className="text-sm font-bold text-slate-700">
                              {complaintDetails.preferredVisitTime}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Assigned Staff Section */}
                    {complaintDetails.assignedTo && (
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                          <Wrench size={16} className="text-blue-600" />
                          Assigned Technician
                        </h4>
                        <div className="p-4 border border-slate-100 rounded-2xl bg-white space-y-4 shadow-sm relative overflow-hidden">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                                {complaintDetails.assignedTo.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">
                                  {complaintDetails.assignedTo.name}
                                </p>
                                <p className="text-xs text-slate-400 font-medium">
                                  {complaintDetails.assignedTo.contact}
                                </p>
                              </div>
                            </div>
                            <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                              <Phone size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Admin Remarks Section */}
                    {complaintDetails.adminRemarks && (
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wider">
                          <AlertCircle size={16} />
                          Admin Remarks
                        </div>
                        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                          <p className="text-sm text-amber-900 font-medium leading-relaxed">
                            {complaintDetails.adminRemarks}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Attachment Section */}
                    {complaintDetails.imageUrls?.length > 0 && (
                      <div className="space-y-3 pt-4 pb-8 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
                          <ImageIcon size={16} className="text-blue-600" />
                          Evidence & Attachments
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {complaintDetails.imageUrls.map((img, index) => (
                            <div
                              key={index}
                              className="relative group rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 h-32"
                            >
                              <img
                                src={img}
                                alt="Proof"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  console.log("Image failed:", img);
                                  e.currentTarget.src =
                                    "https://placehold.co/400x300?text=Image+Error";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle size={32} />
                    </div>
                    <p className="font-semibold">No details found</p>
                    <p className="text-sm">
                      We couldn't retrieve information for this ticket.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResidentialSupport;
