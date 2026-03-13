import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  Users, 
  Clock, 
  Plus,
  X,
  Loader2,
  Tag,
  Bell,
  User
} from 'lucide-react';
import { DashboardLayout } from "../../components/layout/DashboardLayout"; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { 
  getNotices,
  createNotice, 
    pinNotice,     
  deleteNotice,
updateNotice,
  resetAdminState
} from '../../features/admin/adminSlice';
import { toast } from "sonner";
// ─── Types ─────────────────────────────────────────────────────────────────
interface Notice {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  visibleFrom: string;
  visibleUntil: string;
  isPinned: boolean;
  targetAudience: string;
  createdAt: string;
  imageUrls?: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const getCategoryColor = (category: string): 'blue' | 'purple' => {
  const purpleCategories = ['events', 'general'];
  return purpleCategories.includes(category?.toLowerCase()) ? 'purple' : 'blue';
};

const getTimeAgo = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'urgent': return 'bg-red-50 text-red-600 border-red-100';
    case 'high':   return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    default:       return 'bg-green-50 text-green-600 border-green-100';
  }
};

// ─── Constants ──────────────────────────────────────────────────────────────
const TABS = ['All Notices', 'Official', 'Events', 'General'];
const CATEGORIES = ['official', 'events', 'general', 'maintenance', 'safety', 'community', 'alert'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const AUDIENCES = ['all', 'residents', 'staff', 'owners'];

// ─── Main Component ──────────────────────────────────────────────────────────
const NoticeBoard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { notices, noticesLoading, isLoading, isSuccess, error } = useSelector(
    (state: RootState) => state.admin
  );

  const [activeTab, setActiveTab] = useState('All Notices');
  const [showModal, setShowModal] = useState(false);

  // ── Detail Modal State ──
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'official',
    priority: 'medium',
    visibleFrom: '',
    visibleUntil: '',
    isPinned: 'false',
    targetAudience: 'all',
    images: null as File | null,
  });

  useEffect(() => {
    dispatch(getNotices());
  }, [dispatch]);

 useEffect(() => {
  if (isSuccess && showModal) {
    setShowModal(false);
    setSelectedNotice(null);
    resetForm();
    dispatch(getNotices());
    dispatch(resetAdminState());
  }
}, [isSuccess]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'official',
      priority: 'medium',
      visibleFrom: '',
      visibleUntil: '',
      isPinned: 'false',
      targetAudience: 'all',
      images: null,
    });
  };

  const handleCreateNotice = () => {
    if (!formData.title || !formData.description || !formData.visibleFrom || !formData.visibleUntil) {
      return;
    }
    dispatch(createNotice({
      ...formData,
      visibleFrom: new Date(formData.visibleFrom).toISOString(),
      visibleUntil: new Date(formData.visibleUntil).toISOString(),
    }));
  };

  // ── Read More handler ──
  const handleReadMore = (notice: Notice) => {
    setSelectedNotice(notice);
    setShowDetailModal(true);
  };

  const handlePin = (noticeId: string) => {
  dispatch(pinNotice(noticeId)).then(() => {
    dispatch(getNotices()); // refresh
  });
};
const handleDelete = (noticeId: string) => {
  dispatch(deleteNotice(noticeId)).then(() => {

    toast.success("Notice deleted successfully");

    setShowDetailModal(false);
    setSelectedNotice(null);

    dispatch(getNotices());
  });
};
const handleUpdate = (id: string) => {
  dispatch(updateNotice({
    id,
    noticeData: formData
  })).then(() => {
    toast.success("Notice updated successfully");

    setShowModal(false);
    setSelectedNotice(null);

    dispatch(getNotices());
  });
};
  const filteredNotices = (notices as Notice[]).filter((n) => {
    if (activeTab === 'All Notices') return true;
    // Tab names: 'Official', 'Events', 'General' → compare lowercase
    return n.category?.toLowerCase() === activeTab.toLowerCase();
  });

  const featuredNotice = (notices as Notice[]).find((n) => n.isPinned) || (notices as Notice[])[0];

  return (
    <DashboardLayout role="society-admin">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">

        {/* ── Main Feed ── */}
        <div className="flex-1 min-w-0">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Notice Board</h1>
            <p className="text-sm text-slate-500">Updates, alerts, and events for your community</p>
          </div>

          {/* Featured Card */}
          {featuredNotice ? (
            <div
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 text-white relative overflow-hidden mb-8 shadow-xl shadow-blue-100/50 group cursor-pointer"
              onClick={() => handleReadMore(featuredNotice)}
            >
              <div className="relative z-10">
                <div className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mb-4 backdrop-blur-md border border-white/10">
                  {featuredNotice.category || 'Notice'}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{featuredNotice.title}</h2>
                <p className="text-blue-100 text-[13px] mb-6 max-w-sm opacity-90 leading-relaxed line-clamp-2">
                  {featuredNotice.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[11px] font-bold backdrop-blur-md border border-white/10 shadow-sm">
                    <Calendar size={14} className="text-blue-200" />
                    {new Date(featuredNotice.visibleFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[11px] font-bold backdrop-blur-md border border-white/10 shadow-sm">
                    <Clock size={14} className="text-blue-200" />
                    Until: {new Date(featuredNotice.visibleUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <Users className="absolute -bottom-6 -right-6 text-white/10 w-48 h-48 rotate-12 transition-transform group-hover:scale-110 duration-700" />
            </div>
          ) : !noticesLoading && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 text-white relative overflow-hidden mb-8 shadow-xl shadow-blue-100/50 group">
              <div className="relative z-10">
                <div className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mb-4 backdrop-blur-md border border-white/10">
                  Upcoming Event
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Annual General Meeting</h2>
                <p className="text-blue-100 text-[13px] mb-6 max-w-sm opacity-90 leading-relaxed">
                  Join us for the yearly discussion on community improvements and financial reports.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[11px] font-bold backdrop-blur-md border border-white/10 shadow-sm">
                    <Calendar size={14} className="text-blue-200" /> Oct 05, 2023
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[11px] font-bold backdrop-blur-md border border-white/10 shadow-sm">
                    <Clock size={14} className="text-blue-200" /> 6:00 PM
                  </div>
                </div>
              </div>
              <Users className="absolute -bottom-6 -right-6 text-white/10 w-48 h-48 rotate-12 transition-transform group-hover:scale-110 duration-700" />
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {noticesLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          )}

          {error && !noticesLoading && (
            <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 rounded-xl border border-red-100 mb-4">
              {error}
            </div>
          )}

          {!noticesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice: Notice) => (
                  <NoticeCard
                    key={notice._id}
                    category={notice.category?.toUpperCase()}
                    time={getTimeAgo(notice.createdAt)}
                    title={notice.title}
                    color={getCategoryColor(notice.category)}
                    desc={notice.description}
                    onReadMore={() => handleReadMore(notice)}
                  />
                ))
              ) : notices.length === 0 ? (
                <>
                  <NoticeCard category="OFFICIAL" time="6 hours ago" title="Elevator Maintenance Schedule" color="blue" desc="Please note that Elevator A will undergo routine maintenance this Friday between 10:00 AM and 4:00 PM." onReadMore={() => {}} />
                  <NoticeCard category="REPAIRS" time="12 hours ago" title="Water Tank Cleaning" color="blue" desc="The overhead water tank cleaning is scheduled for Block C. Expect low pressure during afternoon hours." onReadMore={() => {}} />
                  <NoticeCard category="EVENTS" time="Yesterday" title="Yoga Sessions - Winter Batch" color="purple" desc="New yoga sessions are starting from November 1st at the Clubhouse. Registration is now open for all ages." onReadMore={() => {}} />
                  <NoticeCard category="GENERAL" time="2 days ago" title="Parking Lot Painting" color="purple" desc="New line marking will be done in the visitors' parking area. Kindly cooperate with the security team." onReadMore={() => {}} />
                </>
              ) : (
                <div className="col-span-2 text-center py-16 text-slate-400 text-sm font-bold">
                  No notices found for this category.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Community Calendar</h3>
              <button className="text-[10px] text-blue-600 font-black uppercase hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              <CalendarItem date="OCT 22" title="Blood Donation Camp" loc="Parking Lot" />
              <CalendarItem date="OCT 25" title="Annual Gen. Meeting" loc="Auditorium" />
              <CalendarItem date="NOV 02" title="Kids Painting Contest" loc="Park" />
            </div>
          </div>

          <div className="bg-slate-900 rounded-[24px] p-8 text-white text-center shadow-xl shadow-slate-200 border border-slate-800 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="bg-blue-600/20 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-blue-500" strokeWidth={3} />
              </div>
              <h4 className="font-bold mb-2 text-lg">Post a Notice?</h4>
              <p className="text-[10px] text-slate-400 mb-6 font-bold uppercase tracking-widest leading-relaxed">
                Only authorized admins can post official society updates.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3.5 bg-blue-600 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Create Post
              </button>
            </div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
          </div>
        </aside>
      </div>

      {/* ══════════════════════════════════════════
          Notice Detail Modal (Read More)
      ══════════════════════════════════════════ */}
      {showDetailModal && selectedNotice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-20">
          <div className="bg-white rounded-[28px] w-full max-w-lg shadow-2xl overflow-hidden">

            {/* Detail Modal Header */}
            <div className="relative">
              {/* Top color bar based on category */}
              <div className={`h-2 w-full ${getCategoryColor(selectedNotice.category) === 'blue' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`} />

              <div className="flex justify-between items-start px-8 pt-6 pb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Category badge */}
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest border ${
                    getCategoryColor(selectedNotice.category) === 'blue'
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : 'bg-purple-50 text-purple-600 border-purple-100'
                  }`}>
                    {selectedNotice.category?.toUpperCase()}
                  </span>
                  {/* Priority badge */}
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest border ${getPriorityColor(selectedNotice.priority)}`}>
                    {selectedNotice.priority?.toUpperCase()}
                  </span>
                  {/* Pinned badge */}
                  {selectedNotice.isPinned && (
                    <span className="text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                      📌 PINNED
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { setShowDetailModal(false); setSelectedNotice(null); }}
                  className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0"
                >
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Detail Modal Body */}
            <div className="px-8 pb-8 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-800 leading-snug">
                {selectedNotice.title}
              </h2>

              {/* Meta info row */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <Calendar size={12} className="text-blue-400" />
                  From: {new Date(selectedNotice.visibleFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <Clock size={12} className="text-blue-400" />
                  Until: {new Date(selectedNotice.visibleUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Description */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedNotice.description}
                </p>
              </div>

              {/* Images if any */}
              {selectedNotice.imageUrls && selectedNotice.imageUrls.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Attachments</p>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedNotice.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Notice image ${idx + 1}`}
                        className="w-full h-36 object-cover rounded-2xl border border-slate-100"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Footer meta */}
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <User size={12} className="text-slate-300" />
                  Audience: <span className="text-slate-600 ml-1 capitalize">{selectedNotice.targetAudience}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <Bell size={12} className="text-slate-300" />
                  Posted: {getTimeAgo(selectedNotice.createdAt)}
                </div>
              </div>
              {/* Pin / Unpin Button */}
<div className="px-8 pb-6">
  <button
    onClick={() => {
      handlePin(selectedNotice._id);
      setShowDetailModal(false);
      setSelectedNotice(null);
    }}
    className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
      selectedNotice.isPinned
        ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
    }`}
  >
    {selectedNotice.isPinned ? '📌 Unpin Notice' : '📌 Pin Notice'}
  </button>
</div>
<button
  onClick={() => {
    setFormData({
      title: selectedNotice.title,
      description: selectedNotice.description,
      category: selectedNotice.category,
      priority: selectedNotice.priority,
      visibleFrom: selectedNotice.visibleFrom.slice(0,10),
      visibleUntil: selectedNotice.visibleUntil.slice(0,10),
      isPinned: selectedNotice.isPinned ? "true" : "false",
      targetAudience: selectedNotice.targetAudience,
      images: null
    });

    setShowModal(true); // open form modal
    setShowDetailModal(false);
  }}
  className="w-full mt-3 py-3 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700"
>
  Edit Notice
</button>
<button
  onClick={() => {
    handleDelete(selectedNotice._id);
    setShowDetailModal(false);
    setSelectedNotice(null);
  }}
  className="w-full mt-3 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700"
>
  Delete Notice
</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          Create Notice Modal
      ══════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden">

            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Create Notice</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Community Board</p>
              </div>
              <button
                onClick={() => { setShowModal(false); dispatch(resetAdminState()); }}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            <div className="px-8 py-6 space-y-4 max-h-[65vh] overflow-y-auto">

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Notice title"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Write your notice here..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-white"
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Visible From *</label>
                  <input
                    type="date"
                    value={formData.visibleFrom}
                    onChange={(e) => setFormData({ ...formData, visibleFrom: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Visible Until *</label>
                  <input
                    type="date"
                    value={formData.visibleUntil}
                    onChange={(e) => setFormData({ ...formData, visibleUntil: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-white"
                  >
                    {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Pin Notice</label>
                  <select
                    value={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-white"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, images: e.target.files?.[0] || null })}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:uppercase file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}
            </div>

            <div className="px-8 py-5 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => { setShowModal(false); dispatch(resetAdminState()); }}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
             <button
onClick={() => {
  if (selectedNotice) {
    handleUpdate(selectedNotice._id);
  } else {
    handleCreateNotice();
  }
}}
disabled={isLoading}
className="flex-1 py-3 bg-blue-600 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {isLoading ? (
    <>
      <Loader2 size={14} className="animate-spin" />
      {selectedNotice ? "Updating..." : "Posting..."}
    </>
  ) : (
    selectedNotice ? "Update Notice" : "Post Notice"
  )}
</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// ─── Sub Components ──────────────────────────────────────────────────────────

const NoticeCard = ({ category, time, title, color, desc, onReadMore }: any) => (
  <div className="p-6 bg-white rounded-[24px] border border-slate-100 hover:shadow-xl hover:shadow-blue-100/30 transition-all cursor-pointer group border-b-4 hover:border-b-blue-500">
    <div className="flex justify-between items-start mb-4">
      <span className={`text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest ${
        color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
      }`}>
        {category}
      </span>
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{time}</span>
    </div>
    <h4 className="font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors text-lg">{title}</h4>
    <p className="text-[12px] text-slate-400 leading-relaxed mb-6 line-clamp-2">{desc}</p>
    <div className="flex items-center justify-between">
      <button
        onClick={onReadMore}
        className="text-[11px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1 group/btn"
      >
        Read More
        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
        ))}
      </div>
    </div>
  </div>
);

const CalendarItem = ({ date, title, loc }: any) => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex flex-col items-center justify-center font-black text-[9px] shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
      <span className="opacity-60">{date.split(' ')[0]}</span>
      <span className="text-base -mt-1 tracking-tighter text-slate-800 group-hover:text-white">{date.split(' ')[1]}</span>
    </div>
    <div className="min-w-0">
      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{title}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1">
        <span className="w-1 h-1 bg-slate-300 rounded-full" /> {loc}
      </p>
    </div>
  </div>
);

export default NoticeBoard;