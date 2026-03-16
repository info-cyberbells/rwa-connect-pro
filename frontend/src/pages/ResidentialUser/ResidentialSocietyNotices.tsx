import React, { useEffect, useState } from 'react';
import { Search, Bell, Moon, Clock, Info, ShieldAlert, ArrowLeft, User, Phone, CheckCircle2, Calendar, CalendarDays } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { clearSingleNotice, getAllActiveNotices, getAllUserNoticesThunk, getFilteredNoticesThunk, getSingleNotice } from '@/features/User/userSlice';


const SocietyNotices = () => {
  const [view, setView] = useState('list'); 
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categoryMap: Record<string, string> = {
  General: "general",
  Events: "event",
  Urgent: "urgent",
  Alert: "alert",
};


  const dispatch = useDispatch<AppDispatch>();
  const { notices, singleNotice, singleLoading, loading, error  } = useSelector((state: RootState) => state.user );

  useEffect(()=>{
    dispatch(getAllUserNoticesThunk());
  },[dispatch])

  // Detail View Component
  const DetailView = ({ notice }) => (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
      <button 
        onClick={() =>{ setView('list'); dispatch(clearSingleNotice())}}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition mb-6 font-semibold"
      >
        <ArrowLeft size={20} /> Back to All Notices
      </button>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-64 bg-slate-200">
          <img src={notice.imageUrls?.[0]} className="w-full h-full object-cover" alt="banner" />
        </div>
        
        <div className="p-8 md:p-12">
          <div className="flex justify-between">
                    <span
                      className={`w-fit px-3 py-1 text-xs font-semibold uppercase rounded-md text-white mb-4 ${
                        notice.category === "urgent"
                          ? "bg-red-500"
                          : notice.category === "event"
                          ? "bg-blue-500"
                          : "bg-slate-500"
                      }`}
                    >
                      {notice.category}
                    </span>

                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                      <Calendar size={16} />
                      <span>{formatDateTime(notice.createdAt)}</span>
                    </div>
                  </div>

          <h1 className=" text-2xl md:text-4xl font-black text-slate-900 mb-6">{notice.title}</h1>
          
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-10">
            <p className="font-semibold text-sm text-[#475569]">Posted By {notice?.createdBy?.name}</p>
            <p>{notice.description}</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-8 flex items-center gap-3">
  <CalendarDays size={20} className="text-blue-500" />

<div>
  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
    Notice Validity
  </p>

  <div className="flex items-center gap-3 mt-1">
    <p className="text-sm font-semibold text-slate-700">
      {formatDateOnly(notice.visibleFrom)} → {formatDateOnly(notice.visibleUntil)}
    </p>

    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
        notice.isActive
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-red-50 text-red-600 border border-red-200"
      }`}
    >
      {notice.isActive ? "Active" : "Expired"}
    </span>
  </div>
</div>
</div>

          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-10">
             <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
               <Info size={18} /> Important Instructions:
             </h4>
             <p className="text-blue-700 text-sm">Please follow the guidelines mentioned above. For any queries, contact the admin office.</p>
          </div>

          <button className="w-full bg-[#4D88FF] text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-600 transition flex items-center justify-center gap-2">
            <CheckCircle2 size={22} /> Acknowledge Notice
          </button>
        </div>
      </div>
    </div>
  );

const formatDateTime = (dateString: string, includeTime: boolean = true) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
};
 
const priorityOrder: Record<string, number> = {
  critical: 1,
  medium: 2,
  low: 3,
};

const sortedNotices = [...(notices || [])].sort((a, b) => {
  return (
    (priorityOrder[a.priority] || 99) -
    (priorityOrder[b.priority] || 99)
  );
});

const formatDateOnly = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    <DashboardLayout role='member'>
    <div className="min-h-screen ">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B]">Society Notices</h1>
          <p className="text-[#64748B] text-sm">Community Updates & Alerts</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100"><Moon size={20} /></button>
          <button className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100"><Bell size={20} /></button>
        </div>
      </header>

      {/* Tabs / Filters */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 items-center">

        <div className="relative w-full ">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search Notices"
            className="w-full bg-white text-[#475569] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">

          {["All", "Active", "General", "Events", "Urgent", "Alert"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveCategory(tab);
                setView("list");

                if (tab === "All") {
                  dispatch(getAllUserNoticesThunk());
                } else if (tab === "Active"){
                  dispatch(getAllActiveNotices());
                } else {
                  dispatch(
                    getFilteredNoticesThunk(categoryMap[tab])
                  );
                }
              }}
              className={`px-5 py-2 rounded-3xl text-[13px] border font-semibold whitespace-nowrap transition-all ${
                activeCategory === tab
                  ? "bg-[#4D88FF] border-[#4D88FF] text-white"
                  : "bg-white text-[#475569] border-[#E2E8F0]"
              }`}
            >
              {tab}
            </button>
          ))}

        </div>

      </div>


      {/* Conditional Rendering: List or Detail */}
     {view === "list" ? (
        loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100"
              >
                <div className="h-56 w-full bg-slate-200" />
                <div className="p-8 space-y-4">
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                  <div className="h-10 w-32 bg-slate-200 rounded mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedNotices?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Bell size={40} className="text-slate-300" />
            </div>

            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No Notices Available
            </h3>

            <p className="text-slate-400 text-sm max-w-md">
              There are currently no notices for your society. Please check back later for updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {sortedNotices.map((notice: any) => (
              <div
                key={notice._id}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 flex flex-col"
              >
                {/* Image */}
                <div className="h-56 w-full bg-slate-100 relative overflow-hidden">
                  {notice.imageUrls?.length > 0 && notice.imageUrls[0] ? (
                    <img
                      src={notice.imageUrls[0]}
                      className="h-full w-full object-cover"
                      alt="notice"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm font-semibold">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <span
                      className={`w-fit px-3 py-1 text-xs font-semibold uppercase rounded-md text-white mb-4 ${
                        notice.category === "urgent"
                          ? "bg-red-500"
                          : notice.category === "event"
                          ? "bg-blue-500"
                          : "bg-slate-500"
                      }`}
                    >
                      {notice.category}
                    </span>

                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                      <Calendar size={16} />
                      <span>{formatDateTime(notice.createdAt)}</span>
                    </div>
                  </div>

                  <h3 className="text-[22px] font-semibold text-[#0F172A] mb-4">
                    {notice.title}
                  </h3>

                  <p className="text-[#64748B] text-[15px] mb-8 line-clamp-2">
                    {notice.description}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedNotice(notice);
                      setView("detail");
                      dispatch(getSingleNotice(notice._id));
                    }}
                    className="mt-auto bg-[#4D88FF] text-white px-7 py-3 rounded-xl font-bold self-end"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : singleLoading ? (
        <div className="flex justify-center items-center py-32">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <DetailView notice={singleNotice} />
      )
      }
    </div>
    </DashboardLayout>
  );
};

export default SocietyNotices;