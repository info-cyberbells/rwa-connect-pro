import React, { useState } from 'react';
import { 
  Search, Filter, Paperclip, Send, Smile, Bold, Italic, 
  ChevronRight, User, ArrowUpRight, MessageSquare,
  Info, Clock, FileText, CheckCircle2, Hash, Plus
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const SupportTickets: React.FC = () => {
  const [internalMode, setInternalMode] = useState(false);

  return (

    <DashboardLayout role="super-admin" >
    <div className="flex min-h-screen font-sans">
    

      {/* Main Content */}
      <div className="transition-all duration-300">

        {/* Header */}
 <header className="min-h-[80px] md:h-20 px-4 md:px-8 bg-card border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 z-30 pt-20 md:pt-0 gap-3 md:gap-0 overflow-hidden w-full">
  
  {/* Left Side: Title & Breadcrumbs */}
  <div className="w-full md:w-auto max-w-full">
    <h1 className="text-base md:text-xl font-bold text-foreground tracking-tight leading-tight truncate">
      Pending Global Support <span className='text-blue-600'>Tickets</span>
    </h1>
    <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase mt-1 overflow-x-auto no-scrollbar whitespace-nowrap">
      <span>Dashboard</span> 
      <ChevronRight size={10} className="shrink-0" /> 
      <span className="hidden xs:inline">Support</span> 
      <ChevronRight size={10} className="hidden xs:inline shrink-0" /> 
      <span className="text-foreground truncate">Ticket #SH-2491</span>
    </div>
  </div>
  
  {/* Right Side: Search & Filter */}
  <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end pb-3 md:pb-0">
    <div className="relative flex-1 md:flex-none group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" size={14} />
      <input 
        type="text" 
        placeholder="Search..." 
        className="pl-9 pr-3 py-1.5 md:py-2 bg-muted/50 border border-border rounded-xl text-xs md:text-sm outline-none w-full md:w-48 lg:w-64 focus:ring-2 focus:ring-indigo-500/10 focus:bg-card transition-all" 
      />
    </div>
    <button className="p-2 md:p-2.5 bg-muted/50 border border-border rounded-xl text-muted-foreground hover:bg-card hover:text-indigo-600 transition shadow-sm shrink-0">
      <Filter size={16} />
    </button>
  </div>
</header>

        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          
          {/* Column 1: Ticket List */}
          <div className="w-full lg:w-80 border-r border-border bg-card flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-4 gap-4 shrink-0 no-scrollbar">
            <TicketItem active id="SH-2491" title="Payment Gateway failure at Green Valley" status="CRITICAL" time="2 MIN" />
            <TicketItem id="SH-2104" title="Elevator breakdown in Block C" status="URGENT" time="14 MIN" />
          </div>

          {/* Column 2: Chat / Ticket Thread */}
          <div className="flex-1 flex flex-col bg-muted/20 overflow-y-auto">
            {/* Ticket Subject Header */}
            <div className="p-6 bg-card border-b border-border flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><FileText size={20}/></div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Ticket #SH-2491: Payment Gateway failure</h2>
                <p className="text-[11px] text-muted-foreground font-medium">Reported by <span className="text-foreground font-bold">Amit Sharma</span></p>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 p-6 space-y-6">
              {/* Initial Report */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Initial Report</span>
                  <span className="text-[10px] font-medium text-muted-foreground">10:42 AM</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Residents of Green Valley Heights have been unable to process payments. Razorpay modal fails with '502 Bad Gateway' error.
                </p>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-dashed border-border w-fit">
                  <div className="w-8 h-8 bg-card rounded-lg border border-border flex items-center justify-center text-[10px] font-bold">IMG</div>
                  <span className="text-[11px] font-bold text-muted-foreground">error_screenshot_01.png</span>
                  <span className="text-[10px] text-muted-foreground/60 ml-4">1.2 MB</span>
                </div>
              </div>

              {/* Admin Response */}
              <div className="bg-primary rounded-2xl p-5 shadow-lg shadow-primary/10 max-w-[90%] ml-auto text-primary-foreground">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">You (Super Admin)</span>
                  <span className="text-[10px] opacity-70">10:55 AM</span>
                </div>
                <p className="text-sm leading-relaxed font-medium">
                  I've checked the logs. It seems there was a minor API key sync issue. I am re-validating keys now.
                </p>
              </div>

              {/* Internal Note */}
              <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex gap-3">
                <div className="mt-1 text-warning"><Info size={16}/></div>
                <div>
                  <p className="text-[10px] font-black text-warning uppercase tracking-widest mb-1">Internal Note (Private)</p>
                  <p className="text-sm text-warning/80 leading-relaxed">
                    "Engineering team confirms deployment v2.4.1 caused this. Monitoring sync progress."
                  </p>
                  <p className="text-[9px] font-bold text-warning/60 mt-2">Jun 04 • 11:10 AM</p>
                </div>
              </div>
            </div>

            {/* Reply Input Section */}
            <div className="p-6 bg-card border-t border-border mt-auto">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Quick Templates:</span>
                <button className="text-[10px] font-bold bg-muted/50 border border-border px-3 py-1 rounded-full text-slate-600 hover:bg-card transition flex items-center gap-1.5"><CheckCircle2 size={12}/> Issue Resolved</button>
                <button className="text-[10px] font-bold bg-muted/50 border border-border px-3 py-1 rounded-full text-slate-600 hover:bg-card transition flex items-center gap-1.5"><Clock size={12}/> Need Info</button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <label className="relative inline-flex items-center cursor-pointer scale-75 -ml-2">
                  <input type="checkbox" className="sr-only peer" checked={internalMode} onChange={() => setInternalMode(!internalMode)} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Internal Note Mode</span>
              </div>

              <div className={`rounded-2xl border transition-all p-3 ${internalMode ? 'bg-amber-50/50 border-amber-200' : 'bg-muted/50 border-border focus-within:bg-card focus-within:ring-4 focus-within:ring-indigo-50'}`}>
                <div className="flex gap-4 border-b border-border pb-2 mb-2 text-muted-foreground">
                  <Bold size={16} className="cursor-pointer hover:text-slate-600"/>
                  <Italic size={16} className="cursor-pointer hover:text-slate-600"/>
                  <Paperclip size={16} className="cursor-pointer hover:text-slate-600"/>
                </div>
                <textarea className="w-full bg-transparent border-none outline-none text-sm min-h-[100px] resize-none" placeholder={internalMode ? "Type private note..." : "Type your response here..."} />
                <div className="flex justify-end pt-2">
                  <button className={`px-5 py-2 rounded-xl flex items-center gap-2 text-sm font-bold text-white shadow-lg transition-all active:scale-95 ${internalMode ? 'bg-amber-500 shadow-amber-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
                    {internalMode ? 'Add Note' : 'Send Response'} <Send size={16}/>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Context & Profile */}
          <div className="w-full lg:w-80 border-l border-border bg-card p-6 space-y-8 overflow-y-auto no-scrollbar shrink-0">
            {/* Society Context */}
            <div>
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Society Context</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-center">
                  <p className="text-[9px] font-bold text-indigo-500 uppercase">Residents</p>
                  <p className="text-xl font-black text-foreground">1,240</p>
                </div>
                <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100/50 text-center">
                  <p className="text-[9px] font-bold text-rose-500 uppercase">Active Dues</p>
                  <p className="text-xl font-black text-foreground">$12.4k</p>
                </div>
              </div>
            </div>

            {/* Admin Profile */}
            <div>
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Society Admin Profile</h4>
              <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-muted-foreground"><User size={20}/></div>
                  <div>
                    <p className="text-sm font-black text-foreground">Amit Sharma</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Head Admin</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium">admin@greenvalley.com</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium">+91 98765 43210</p>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl shadow-indigo-100">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Subscription</span>
                <Clock size={14} className="opacity-70"/>
              </div>
              <p className="text-[10px] font-bold opacity-80 uppercase mb-1">Current Plan</p>
              <p className="text-2xl font-black mb-1 italic">Enterprise</p>
              <p className="text-[10px] font-medium opacity-70 italic tracking-wide">Renewing Dec 12, 2024</p>
            </div>

            {/* Related Tickets */}
            <div>
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Related Tickets</h4>
              <div className="space-y-2">
                <RelatedTicket id="SH-2184" title="Bulk notification delay" status="RESOLVED" />
                <RelatedTicket id="SH-1982" title="Login issues for Block A" status="RESOLVED" />
                <button className="w-full py-2 text-[10px] font-black text-indigo-600 hover:text-indigo-700">View all history</button>
              </div>
            </div>

            {/* System Tags */}
            <div>
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">System Tags</h4>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full flex items-center gap-1">#Payments</span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full flex items-center gap-1">#API</span>
                <button className="w-6 h-6 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground">+</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

const TicketItem = ({ id, title, status, time, active }: any) => (
  <div className={`p-4 rounded-2xl border transition-all cursor-pointer min-w-[180px] lg:min-w-0 flex flex-col gap-3 ${
    active ? 'bg-card border-indigo-200 shadow-lg ring-4 ring-indigo-50/30' : 'bg-muted/50 border-transparent hover:bg-card hover:border-border'
  }`}>
    <div className="flex justify-between items-center">
      <span className={`text-[8px] font-black px-2 py-1 rounded-lg ${
        status === 'CRITICAL' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'
      }`}>● {status}</span>
      <span className="text-[9px] font-bold text-muted-foreground">{time}</span>
    </div>
    <p className="text-xs font-black text-foreground leading-tight">{title}</p>
    <div className="flex items-center gap-1.5 mt-1 opacity-60">
      <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[8px] font-bold italic">GV</div>
      <span className="text-[9px] font-bold text-muted-foreground">Green Valley Heights</span>
    </div>
  </div>
);

const RelatedTicket = ({ id, title, status }: any) => (
  <div className="p-3 bg-card border border-border rounded-xl">
    <div className="flex justify-between mb-1">
      <span className="text-[9px] font-bold text-muted-foreground">#{id} • {status}</span>
    </div>
    <p className="text-[11px] font-bold text-slate-700 truncate">{title}</p>
  </div>
);

export default SupportTickets;