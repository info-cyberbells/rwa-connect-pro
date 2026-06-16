import React, { useEffect } from 'react';
import {
  Building2,
  MapPin,
  ArrowUpRight,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import Sidebar from '@/pages/SocietySetup/SuperAdmin/components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState, useAppSelector } from '@/store/store';
import { getAllSocietiesSuperAdminThunk } from '@/features/Superadmin/superAdminSlice';

const GlobalSocietyDirectory: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { societies, loading, error} = useAppSelector((state: RootState) => state.superAdmin);
  
  useEffect(()=>{
    dispatch(getAllSocietiesSuperAdminThunk());
  },[])

  

  return (
    <DashboardLayout role="super-admin">
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Main */}
      <main className="flex-1">        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 mt-5 lg:mt-0 text-left">
          <div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
              Global Society <span className="text-primary">Directory</span>
            </h1>

            <p className="text-muted-foreground font-medium mt-1">
              Centralized directory for housing infrastructures.
            </p>
          </div>

          <button
          onClick={()=>navigate("/super-admin/register-society")}
          className="w-full sm:w-auto bg-primary text-primary-foreground px-5 py-3 rounded-2xl flex items-center justify-center gap-3 text-sm hover:bg-primary/90 transition shadow-lg shadow-primary/10">
            <Plus size={18} /> New Society
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-card rounded-[32px] shadow-lg border border-border overflow-hidden mb-6 max-w-full">
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center justify-between max-w-full overflow-hidden">
            {/* Search */}
            <div className="relative w-full max-w-full lg:max-w-lg group">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search by Society ID, Manager, or City..."
                className="w-full bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-card rounded-3xl pl-14 pr-6 py-4 text-sm font-semibold outline-none transition-all text-foreground"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto justify-start lg:justify-end">
              <FilterTag label="Active Cities" />
              <FilterTag label="Service Plan" />
              <button className="p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition shadow-sm">
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* Table Wrapper */}
          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[900px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Deployment
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Location
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                      Units
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Management
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {loading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      {/* Name + Logo */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-muted"></div>
                          <div className="space-y-2">
                            <div className="h-3 w-32 bg-muted rounded"></div>
                            <div className="h-2 w-20 bg-muted/60 rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5"><div className="h-3 w-24 bg-muted rounded"></div></td>
                      <td className="px-6 py-5 text-center"><div className="h-6 w-12 bg-muted rounded-lg mx-auto"></div></td>
                      <td className="hidden md:table-cell px-6 py-5"><div className="h-3 w-24 bg-muted rounded"></div></td>
                      <td className="hidden lg:table-cell px-6 py-5"><div className="h-5 w-20 bg-muted rounded-full"></div></td>
                      <td className="px-6 py-5 text-right"><div className="h-8 w-28 bg-muted rounded-xl ml-auto"></div></td>
                    </tr>
                  ))}

                  {error && !loading && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-sm text-red-500 font-medium">
                        {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && societies?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-sm text-muted-foreground">
                        No societies found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    societies?.map((society: any) => (
                      <NodeRow
                        key={society._id}
                        id={society._id}
                        logo={society.logoURL}
                        name={society.name}
                        city={society.address?.city}
                        units={society.totalUnits}
                        admin={society.createdBy?.name}
                        status={society.isActive ? "Active" : "Inactive"}
                        type={society.isActive ? "Active" : "Inactive"}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <ShieldCheck size={16} className="text-emerald-500" />
              Security Verified Grid
            </div>

            {/* <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <button className="w-10 h-10 rounded-xl border flex items-center justify-center">
                <ChevronLeft size={18} />
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
                01
              </button>
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold">
                02
              </button>
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold">
                03
              </button>
              <button className="w-10 h-10 rounded-xl border flex items-center justify-center">
                <ChevronRight size={18} />
              </button>
            </div> */}
          </div>
        </div>
      </main>
    </div>
    </DashboardLayout>
  );
};

const FilterTag = ({ label }: { label: string }) => (
  <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary transition">
    {label}
    <ChevronDown size={14} />
  </button>
);

const NodeRow = ({ name, id, logo ,city, type, units, admin, status }: any) => {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-muted/50 transition border-b border-border/50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <Building2 size={18} />
                )}
              </div>
          <div>
            <p className="font-bold text-sm text-foreground">{name}</p>
            <span className="text-[10px] text-muted-foreground">{id}</span>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <MapPin size={14} />
          {city}
        </div>
      </td>

      <td className="px-4 py-4 text-center">
        <span className="px-3 py-1 text-xs font-bold rounded-lg bg-muted text-foreground">
          {units}
        </span>
      </td>

      <td className="hidden md:table-cell px-4 py-4 text-sm font-medium text-foreground">
        {admin}
      </td>

      <td className="hidden lg:table-cell px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
            status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
          }`}
        >
          {type}
        </span>
      </td>

      <td className="px-4 py-4 text-right">
        <button
          onClick={() => navigate(`/super-admin/globalSocietyDirectory/${id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-bold rounded-xl transition"
        >
          <span className="hidden sm:inline">View Details</span>
          <ArrowUpRight size={14} />
        </button>
      </td>
    </tr>
  );
};

export default GlobalSocietyDirectory;