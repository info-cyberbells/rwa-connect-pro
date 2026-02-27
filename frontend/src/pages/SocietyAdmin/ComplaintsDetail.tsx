import React, { useState } from 'react';
import { 
  Search, Clock, MapPin, Send, Paperclip, 
  Image as ImageIcon, ChevronLeft, MoreVertical, Lock 
} from 'lucide-react';
import { DashboardLayout } from "../../components/layout/DashboardLayout"; 

// --- Types ---
interface Ticket {
  id: string;
  title: string;
  resident: string;
  location: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  timeAgo: string;
}

const tickets: Ticket[] = [
  { id: 'TK-4521', title: 'Burst Pipe in Kitchen', resident: 'Amit Sharma', location: 'Flat 402-B', category: 'PLUMBING', priority: 'HIGH', timeAgo: '12 mins ago' },
  { id: 'TK-4518', title: 'Elevator B-4 Not Working', resident: 'Mrs. Gupta', location: 'Tower 2', category: 'SECURITY', priority: 'MEDIUM', timeAgo: '2 hours ago' },
  { id: 'TK-4515', title: 'Late Night Noise Complaint', resident: 'Rahul Verma', location: 'Flat 101-A', category: 'GENERAL', priority: 'LOW', timeAgo: '5 hours ago' },
];

const ComplaintsDetail: React.FC = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0].id);

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  return (
    <DashboardLayout role="society-admin">
    
      <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        
        {/* --- Left Sidebar: Ticket List --- */}
        <aside className={`
          ${selectedTicketId ? 'hidden md:flex' : 'flex'} 
          w-full md:w-80 border-r border-slate-50 flex-col bg-slate-50/30
        `}>
          <div className="p-5 border-b border-slate-100 bg-white">
            <h2 className="font-bold text-slate-800 mb-4">Tickets</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search ticket..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`p-5 border-b border-slate-50 cursor-pointer transition-all ${
                  selectedTicketId === ticket.id 
                  ? 'bg-blue-50/50 border-l-4 border-l-blue-600' 
                  : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black text-slate-400">#{ticket.id}</span>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 truncate">{ticket.title}</h4>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-tighter">
                    {ticket.category}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                    <Clock size={10} /> {ticket.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* --- Main Content: Ticket Details --- */}
        <main className={`
          flex-1 flex flex-col bg-white 
          ${!selectedTicketId ? 'hidden md:flex' : 'flex'}
        `}>
          {/* Ticket Header */}
          <header className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedTicketId(null)}
                className="md:hidden p-2 hover:bg-slate-50 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-bold text-slate-800">{activeTicket.title}</h2>
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Open</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                  <MapPin size={12} className="text-blue-500" /> {activeTicket.resident} • {activeTicket.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden sm:block p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreVertical size={20} /></button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Resolve</button>
            </div>
          </header>

          {/* Chat/Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/20 custom-scrollbar">
            {/* Resident Message */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeTicket.resident}`} alt="Resident" />
              </div>
              <div className="max-w-[80%]">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none text-sm text-slate-600 leading-relaxed shadow-sm">
                  There is a major water leakage in the main kitchen pipe. It's flooding the floor and I've had to shut off the main valve. Please send someone urgently.
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">10:45 AM</p>
                
                {/* Dummy Image Attachment */}
                <div className="mt-4 w-40 h-28 bg-slate-100 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
                  <ImageIcon size={24} />
                </div>
              </div>
            </div>

            {/* Admin Reply */}
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-blue-600 shrink-0 flex items-center justify-center text-white text-[10px] font-black border-4 border-blue-50 shadow-sm">AD</div>
              <div className="max-w-[80%] text-right">
                <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none text-sm leading-relaxed shadow-lg shadow-blue-200">
                  Hello Mr. Sharma, I have received your request. Plumber Rajesh has been assigned and is on his way to {activeTicket.location}.
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">11:05 AM</p>
              </div>
            </div>

            {/* Internal Note */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 mx-auto max-w-xl">
              <div className="flex items-center gap-2 text-amber-700 text-[10px] font-black uppercase tracking-widest mb-3">
                <Lock size={12} /> Internal Admin Note
              </div>
              <p className="text-xs text-amber-800/70 italic leading-relaxed">
                Contacted maintenance team. Rajesh is currently at Tower A, will move to {activeTicket.location} next.
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-5 border-t border-slate-50 bg-white">
            <div className="bg-slate-50 rounded-2xl flex items-center gap-3 px-4 py-2 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
              <button className="text-slate-400 hover:text-blue-600 transition-colors"><Paperclip size={20} /></button>
              <input 
                type="text" 
                placeholder="Type your reply..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-slate-700"
              />
              <button className="bg-blue-600 p-2.5 rounded-xl text-white hover:bg-blue-700 shadow-md transition-all active:scale-95">
                <Send size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// --- Helper Components ---
const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles = {
    HIGH: 'bg-rose-50 text-rose-600 border-rose-100',
    MEDIUM: 'bg-amber-50 text-amber-600 border-amber-100',
    LOW: 'bg-slate-100 text-slate-600 border-slate-200'
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider ${styles[priority as keyof typeof styles]}`}>
      {priority}
    </span>
  );
};

export default ComplaintsDetail;