import React, { useEffect, useState } from 'react';
import { Search, Bell, Moon, Clock, Info, ShieldAlert, ArrowLeft, User, Phone, CheckCircle2, Calendar, CalendarDays } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { clearSingleNotice, getAllActiveNotices, getAllUserNoticesThunk, getFilteredNoticesThunk, getSingleNotice } from '@/features/User/userSlice';


const SocietyNotices = () => {
  const [view, setView] = useState('list'); 
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

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
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500 text-left">
      <button 
        onClick={() =>{ setView('list'); dispatch(clearSingleNotice())}}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition mb-6 font-semibold"
      >
        <ArrowLeft size={20} /> Back to All Notices
      </button>

      <div className="bg-card rounded-[40px] shadow-sm border border-border overflow-hidden">
        <div className="h-64 bg-muted">
          <img src={notice.imageUrls?.[0]} className="w-full h-full object-cover" alt="banner" />
        </div>
        
        <div className="p-8 md:p-12">
          <div className="flex justify-between">
                    <span
                      className={`w-fit px-3 py-1 text-xs font-semibold uppercase rounded-md text-white mb-4 ${
                        notice.category === "urgent"
                          ? "bg-destructive"
                          : notice.category === "event"
                          ? "bg-primary"
                          : "bg-muted-foreground"
                      }`}
                    >
                      {notice.category}
                    </span>

                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <Calendar size={16} />
                      <span>{formatDateTime(notice.createdAt)}</span>
                    </div>
                  </div>

          <h1 className=" text-2xl md:text-4xl font-black text-foreground mb-6">{notice.title}</h1>
          
          <div className="space-y-6 text-muted-foreground text-lg leading-relaxed mb-10">
            <p className="font-semibold text-sm text-foreground">Posted By {notice?.createdBy?.name}</p>
            <p>{notice.description}</p>
          </div>

          <div className="bg-muted/50 border border-border p-5 rounded-2xl mb-8 flex items-center gap-3">
  <CalendarDays size={20} className="text-primary" />

<div>
  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
    Notice Validity
  </p>

  <div className="flex items-center gap-3 mt-1">
    <p className="text-sm font-semibold text-foreground">
      {formatDateOnly(notice.visibleFrom)} → {formatDateOnly(notice.visibleUntil)}
    </p>

    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
        notice.isActive
          ? "bg-success/10 text-success border border-success/20"
          : "bg-destructive/10 text-destructive border border-destructive/20"
      }`}
    >
      {notice.isActive ? "Active" : "Expired"}
    </span>
  </div>
</div>
</div>

          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 mb-10">
             <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
               <Info size={18} /> Important Instructions:
             </h4>
             <p className="text-muted-foreground text-sm">Please follow the guidelines mentioned above. For any queries, contact the admin office.</p>
          </div>

          <button className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition flex items-center justify-center gap-2">
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
          <h1 className="text-[28px] font-bold text-foreground">Society Notices</h1>
          <p className="text-muted-foreground text-sm">Community Updates & Alerts</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 bg-card rounded-full shadow-sm border border-border hover:bg-muted transition-colors"><Bell size={20} className="text-foreground" /></button>
        </div>
      </header>

      {/* Tabs / Filters */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 items-center">

        <div className="relative w-full ">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search Notices"
            className="w-full bg-card text-foreground border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
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
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
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
                className="bg-card rounded-[32px] overflow-hidden shadow-sm border border-border"
              >
                <div className="h-56 w-full bg-muted" />
                <div className="p-8 space-y-4">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-6 w-3/4 bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-5/6 bg-muted rounded"></div>
                  <div className="h-10 w-32 bg-muted rounded mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedNotices?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Bell size={40} className="text-muted-foreground/30" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">
              No Notices Available
            </h3>

            <p className="text-muted-foreground text-sm max-w-md">
              There are currently no notices for your society. Please check back later for updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {sortedNotices.map((notice: any) => (
              <div
                key={notice._id}
                className="bg-card rounded-[32px] overflow-hidden shadow-sm border border-border flex flex-col group hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <div className="h-56 w-full bg-muted relative overflow-hidden">
                  {notice.imageUrls?.length > 0 && notice.imageUrls[0] ? (
                    <img
                      src={notice.imageUrls[0]}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="notice"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm font-semibold">
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
                          ? "bg-destructive"
                          : notice.category === "event"
                          ? "bg-primary"
                          : "bg-muted-foreground"
                      }`}
                    >
                      {notice.category}
                    </span>

                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <Calendar size={16} />
                      <span>{formatDateTime(notice.createdAt)}</span>
                    </div>
                  </div>

                  <h3 className="text-[22px] font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {notice.title}
                  </h3>

                  <p className="text-muted-foreground text-[15px] mb-8 line-clamp-2">
                    {notice.description}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedNotice(notice);
                      setView("detail");
                      dispatch(getSingleNotice(notice._id));
                    }}
                    className="mt-auto bg-primary text-primary-foreground px-7 py-3 rounded-xl font-bold self-end shadow-sm hover:shadow-primary/20 transition-all active:scale-95"
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
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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