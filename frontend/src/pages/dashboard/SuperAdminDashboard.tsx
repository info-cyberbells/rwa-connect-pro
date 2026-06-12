import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building, Users, CreditCard, TrendingUp, ArrowUpRight, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axiosInstance from "@/auth/axiosInstance";
import { toast } from "sonner";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalSocieties: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    growthRate: "0%"
  });
  const [recentSocieties, setRecentSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/superadmin/dashboard-stats");
        setStats(response.data.stats);
        setRecentSocieties(response.data.recentSocieties);
      } catch (error) {
        console.error("Failed to fetch superadmin stats", error);
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statConfig = [
    { label: "Total Societies", value: stats.totalSocieties, change: "+12%", icon: Building, color: "bg-primary" },
    { label: "Active Members", value: stats.activeMembers, change: "+8%", icon: Users, color: "bg-success" },
    { label: "Monthly Revenue", value: `₹${stats.monthlyRevenue.toLocaleString()}`, change: stats.growthRate, icon: CreditCard, color: "bg-info" },
    { label: "Growth Rate", value: stats.growthRate, change: "+5%", icon: TrendingUp, color: "bg-warning" },
  ];

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all societies and platform operations</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Onboard Society
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statConfig.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 card-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                {!loading && (
                  <span className="flex items-center gap-1 text-sm text-success font-medium">
                    {stat.change}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                )}
              </div>
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-3xl font-heading font-bold">{stat.value}</p>
              )}
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Societies Table */}
        <div className="bg-card rounded-2xl card-shadow">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-heading font-semibold">Recent Societies</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Society Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Members/Units</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created At</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : recentSocieties.length > 0 ? (
                  recentSocieties.map((society, index) => (
                    <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-4 font-medium">{society.name}</td>
                      <td className="p-4 text-muted-foreground">{society.totalUnits} Units</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            society.isActive
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {society.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(society.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-muted-foreground font-medium">
                      No societies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
