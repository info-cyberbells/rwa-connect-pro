import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getDeactivationRequests, approveDeactivationRequest, rejectDeactivationRequest } from "../../features/admin/adminSlice";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  UserX, CheckCircle, XCircle, Building2, Phone,
  MapPin, FileText, ChevronDown, ChevronUp, Search,
  RefreshCw, Clock, Home
} from 'lucide-react';

interface DeactivationRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    unit: {
      flatNumber: string;
      towerBlock: string;
      floor: number;
      type: string;
      ownershipType: string;
    };
  };
  reason: string;
  additionalDetails: string;
  forwardingAddress: string;
  contactNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const REASON_LABELS: Record<string, string> = {
  moving_out: 'Moving Out',
  sold_property: 'Sold Property',
  long_term_travel: 'Long Term Travel',
  other: 'Other',
};

const STATUS_CONFIG = {
  pending:  {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-800 border-yellow-300',
    dot: 'bg-amber-400',
    stat: 'bg-amber-50 border-amber-200',
    statText: 'text-amber-900',
    done: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  approved: {
    label: 'Approved',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-400',
    stat: 'bg-emerald-50 border-emerald-200',
    statText: 'text-emerald-900',
    done: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  rejected: {
    label: 'Rejected',
    badge: 'bg-rose-50 text-rose-800 border-rose-300',
    dot: 'bg-rose-400',
    stat: 'bg-rose-50 border-rose-200',
    statText: 'text-rose-900',
    done: 'bg-rose-50 text-rose-800 border-rose-200',
  },
};

const AVATAR_PALETTE = [
  ['bg-violet-100', 'text-violet-700'],
  ['bg-blue-100',   'text-blue-700'],
  ['bg-emerald-100','text-emerald-700'],
  ['bg-amber-100',  'text-amber-800'],
  ['bg-rose-100',   'text-rose-700'],
  ['bg-cyan-100',   'text-cyan-700'],
];
const getAvatar = (name: string) =>
  AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const DeactivationRequests: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deactivationRequests: requests, deactivationLoading: loading, error } =
    useAppSelector(state => state.admin);
  const { user } = useAppSelector(state => state.auth);
  const role = user?.role || localStorage.getItem("role") || "guard";

  const [expandedId, setExpandedId]           = useState<string | null>(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [statusFilter, setStatusFilter]       = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => { dispatch(getDeactivationRequests()); }, [dispatch]);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    await dispatch(approveDeactivationRequest(id));
    setActionLoadingId(null);
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id + '_reject');
    await dispatch(rejectDeactivationRequest(id));
    setActionLoadingId(null);
  };

  const filtered = (requests as DeactivationRequest[]).filter(r => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.user?.email?.toLowerCase().includes(q) ||
      r.user?.unit?.flatNumber?.includes(q);
    return matchSearch && (statusFilter === 'all' || r.status === statusFilter);
  });

  const counts = {
    all:      requests.length,
    pending:  requests.filter((r: any) => r.status === 'pending').length,
    approved: requests.filter((r: any) => r.status === 'approved').length,
    rejected: requests.filter((r: any) => r.status === 'rejected').length,
  };

  return (
    <DashboardLayout role={role as any}>
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0">
              <UserX size={20} className="text-rose-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Deactivation Requests</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Review and manage resident deactivation requests</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(getDeactivationRequests())}
            className="flex items-center gap-2 text-xs text-muted-foreground border border-border bg-card hover:bg-muted/50 px-3 py-2 rounded-xl transition-all font-medium">
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-2xl border p-4 text-left transition-all
              ${statusFilter === 'all'
                ? 'bg-slate-800 border-slate-800 ring-2 ring-slate-300 ring-offset-1'
                : 'bg-muted/50 border-border hover:bg-card hover:border-slate-300'}`}>
            <p className={`text-2xl font-black ${statusFilter === 'all' ? 'text-white' : 'text-foreground'}`}>{counts.all}</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${statusFilter === 'all' ? 'text-slate-300' : 'text-muted-foreground'}`}>Total</p>
          </button>

          {(['pending', 'approved', 'rejected'] as const).map(s => {
            const cfg = STATUS_CONFIG[s];
            const active = statusFilter === s;
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`rounded-2xl border p-4 text-left transition-all
                  ${active
                    ? `${cfg.stat} ring-2 ring-offset-1 ${s === 'pending' ? 'ring-amber-300' : s === 'approved' ? 'ring-emerald-300' : 'ring-rose-300'}`
                    : 'bg-card border-border hover:border-slate-300'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <p className={`text-2xl font-black ${active ? cfg.statText : 'text-foreground'}`}>{counts[s]}</p>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${active ? cfg.statText : 'text-muted-foreground'}`}>{cfg.label}</p>
              </button>
            );
          })}
        </div>

        {/* ── Search ── */}
        <div className="relative mb-5">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email or flat..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-20 py-2.5 text-sm bg-card border border-border rounded-xl outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 text-slate-700 placeholder:text-muted-foreground transition-all"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-lg">
            {filtered.length} results
          </span>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-2 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
            <p className="text-rose-600 text-sm font-medium">{error}</p>
            <button onClick={() => dispatch(getDeactivationRequests())}
              className="mt-3 text-xs text-rose-500 underline underline-offset-2">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
              <UserX size={22} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">No requests found</p>
            {searchQuery && <p className="text-xs text-slate-300">Try a different search term</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(req => {
              const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
              const isExpanded = expandedId === req._id;
              const isApproving = actionLoadingId === req._id;
              const isRejecting = actionLoadingId === req._id + '_reject';
              const [avatarBg, avatarText] = getAvatar(req.user?.name);
              const initials = req.user?.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

              return (
                <div key={req._id}
                  className={`bg-card border rounded-2xl overflow-hidden transition-all
                    ${isExpanded ? 'border-indigo-200' : 'border-border hover:border-border'}`}>

                  {/* Card Header Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : req._id)}
                    className="w-full px-5 py-4 flex items-center gap-4 text-left">

                    <div className={`w-11 h-11 rounded-2xl ${avatarBg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-sm font-bold ${avatarText}`}>{initials}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground truncate">{req.user?.name}</span>
                        <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Home size={10} />
                          {req.user?.unit?.towerBlock}-{req.user?.unit?.flatNumber} · {req.user?.unit?.type}
                        </span>
                        <span>{REASON_LABELS[req.reason] || req.reason}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1">
                        <Clock size={10} />
                        {formatDate(req.createdAt)}
                      </span>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                        ${isExpanded ? 'bg-indigo-50' : 'bg-slate-100 hover:bg-slate-200'}`}>
                        {isExpanded
                          ? <ChevronUp size={13} className="text-indigo-500" />
                          : <ChevronDown size={13} className="text-muted-foreground" />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Panel */}
                  {isExpanded && (
                    <div className="border-t border-border px-5 py-4 bg-muted/50/70">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        <DetailItem icon={<FileText size={11} />} label="Reason">
                          {REASON_LABELS[req.reason] || req.reason}
                        </DetailItem>
                        <DetailItem icon={<Phone size={11} />} label="Contact">
                          {req.contactNumber}
                        </DetailItem>
                        <DetailItem icon={<Building2 size={11} />} label="Unit">
                          {req.user?.unit?.type} · {req.user?.unit?.ownershipType}
                        </DetailItem>
                        <div className="col-span-2 sm:col-span-3">
                          <DetailItem icon={<MapPin size={11} />} label="Forwarding Address">
                            {req.forwardingAddress || '—'}
                          </DetailItem>
                        </div>
                        {req.additionalDetails && (
                          <div className="col-span-2 sm:col-span-3">
                            <DetailItem icon={<FileText size={11} />} label="Additional Details">
                              {req.additionalDetails}
                            </DetailItem>
                          </div>
                        )}
                      </div>

                      {req.status === 'pending' ? (
                        <div className="flex gap-2 pt-3 border-t border-border">
                          <button
                            onClick={() => handleApprove(req._id)}
                            disabled={isApproving || isRejecting}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            <CheckCircle size={13} />
                            {isApproving ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            disabled={isRejecting || isApproving}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            <XCircle size={13} />
                            {isRejecting ? 'Rejecting...' : 'Reject'}
                          </button>
                        </div>
                      ) : (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${cfg.done}`}>
                          {req.status === 'approved' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          This request has been {req.status}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const DetailItem = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
      <span className="opacity-70">{icon}</span>
      {label}
    </div>
    <p className="text-xs font-medium text-slate-700 leading-relaxed">{children}</p>
  </div>
);

export default DeactivationRequests;