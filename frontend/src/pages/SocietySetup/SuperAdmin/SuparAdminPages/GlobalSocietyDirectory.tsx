import React, { useEffect } from "react";
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
} from "lucide-react";
import Sidebar from "@/pages/SocietySetup/SuperAdmin/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { getAllSocietiesSuperAdminThunk } from "@/features/Superadmin/superAdminSlice";

const GlobalSocietyDirectory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { societies, loading, error } = useAppSelector(
    (state: RootState) => state.superAdmin,
  );

  useEffect(() => {
    dispatch(getAllSocietiesSuperAdminThunk());
  }, []);

  return (
    <DashboardLayout role="super-admin">
      <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden">
        {/* Main */}
        <main className="w-full min-w-0">
          {" "}
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 mt-5 lg:mt-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Global Society <span className="text-blue-600">Directory</span>
              </h1>

              <p className="text-slate-500 font-medium mt-1">
                Centralized directory for 42 housing infrastructures.
              </p>
            </div>

            <button
              onClick={() => navigate("/super-admin/register-society")}
              className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-3 text-sm hover:bg-blue-700 transition"
            >
              New Society
            </button>
          </div>
          {/* Action Bar */}
          <div className="bg-white rounded-[32px] shadow-lg border overflow-hidden mb-6 max-w-full">
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center justify-between max-w-full overflow-hidden">
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full">
                {/* Search */}
                <div className="relative flex-1 min-w-0 group">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search by Society ID, Manager, or City..."
                    className="
        w-full
        bg-slate-50
        border border-slate-200
        focus:border-blue-300 focus:bg-white
        rounded-2xl
        pl-9 pr-4
        py-3
        text-sm font-medium
        outline-none
        transition-all
        placeholder:text-slate-400
      "
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-shrink-0 items-center gap-2">
                  <FilterTag label="Active Cities" />
                  <FilterTag label="Service Plan" />
                  <button className="h-[42px] w-[42px] flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition flex-shrink-0">
                    <Filter size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Table Wrapper */}
            <div className="relative w-full overflow-x-auto">
              <div className="w-full ">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-blue-50/50">
                      <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400">
                        Deployment
                      </th>
                      <th className="px-4 py-3 text-xs hidden md:table-cell font-black uppercase tracking-widest text-slate-400">
                        Location
                      </th>
                      <th className="px-4 py-3 text-xs hidden lg:table-cell font-black uppercase tracking-widest text-slate-400 text-center">
                        Units
                      </th>
                      <th className="hidden lg:table-cell px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400">
                        Management
                      </th>
                      <th className="hidden lg:table-cell px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400">
                        Status
                      </th>
                      <th className="px-4 py-3 hidden md:table-cell text-xs font-black uppercase tracking-widest text-slate-400 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y ">
                    {loading &&
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          {/* Name + Logo */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                              <div className="space-y-2">
                                <div className="h-3 w-32 bg-slate-200 rounded"></div>
                                <div className="h-2 w-20 bg-slate-100 rounded"></div>
                              </div>
                            </div>
                          </td>

                          {/* City */}
                          <td className="px-4 py-4">
                            <div className="h-3 w-24 bg-slate-200 rounded"></div>
                          </td>

                          {/* Units */}
                          <td className="px-4 py-4 text-center">
                            <div className="h-6 w-12 bg-slate-100 rounded-lg mx-auto"></div>
                          </td>

                          {/* Admin (md+) */}
                          <td className="hidden md:table-cell px-4 py-4">
                            <div className="h-3 w-24 bg-slate-200 rounded"></div>
                          </td>

                          {/* Status (lg+) */}
                          <td className="hidden lg:table-cell px-4 py-4">
                            <div className="h-5 w-20 bg-slate-100 rounded-full"></div>
                          </td>

                          {/* Action */}
                          <td className="px-4 py-4 text-right">
                            <div className="h-8 w-28 bg-slate-200 rounded-xl ml-auto"></div>
                          </td>
                        </tr>
                      ))}

                    {error && !loading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-6 text-sm text-red-500 font-medium"
                        >
                          {error}
                        </td>
                      </tr>
                    )}

                    {!loading && !error && societies?.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-6 text-sm text-slate-500"
                        >
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
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
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
  <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition">
    {label}
    <ChevronDown size={14} />
  </button>
);

const NodeRow = ({ name, id, logo, city, type, units, admin, status }: any) => {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-blue-50 transition block md:table-row border md:border-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-3 md:p-0 bg-white md:bg-transparent shadow md:shadow-none">
      <td className="px-2 md:px-4 py-2 md:py-4 ">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <Building2 size={18} />
            )}
          </div>
          <div>
            <p className="font-bold text-sm">{name}</p>
            <span className="text-[10px] text-slate-400">{id}</span>
          </div>
        </div>
      </td>

      <td className="px-4 py-2 md:py-4 hidden md:table-cell">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <MapPin size={14} />
          {city}
        </div>
      </td>

      <td className="px-4 py-2 md:py-4 hidden lg:table-cell">
        <span className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-100">
          {units}
        </span>
      </td>

      <td className="hidden lg:table-cell px-4 py-4 text-sm font-medium">
        {admin}
      </td>

      <td className="hidden lg:table-cell px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
            status === "Active"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          {type}
        </span>
      </td>

      <td className="px-2 md:px-4 py-4 text-right">
        <button
          onClick={() => navigate(`/super-admin/globalSocietyDirectory/${id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white transition"
        >
          <span className="">View Details</span>
          <ArrowUpRight size={14} />
        </button>
      </td>
    </tr>
  );
};

export default GlobalSocietyDirectory;
