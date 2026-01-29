import { motion } from "framer-motion";
import { Building, Users, CreditCard, TrendingUp, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const stats = [
  { label: "Total Societies", value: "156", change: "+12%", icon: Building, color: "bg-primary" },
  { label: "Active Members", value: "12,450", change: "+8%", icon: Users, color: "bg-success" },
  { label: "Monthly Revenue", value: "₹1.2L", change: "+15%", icon: CreditCard, color: "bg-info" },
  { label: "Growth Rate", value: "23%", change: "+5%", icon: TrendingUp, color: "bg-warning" },
];

const recentSocieties = [
  { name: "Green Valley Apartments", members: 120, status: "Active", plan: "Premium" },
  { name: "Sunrise Heights", members: 85, status: "Active", plan: "Standard" },
  { name: "Palm Gardens", members: 200, status: "Active", plan: "Premium" },
  { name: "Lake View Society", members: 45, status: "Pending", plan: "Basic" },
  { name: "Metro Residency", members: 150, status: "Active", plan: "Standard" },
];

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all societies and platform operations</p>
          </div>
          <Button>
            <Plus className="w-4 h-4" />
            Onboard Society
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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
                <span className="flex items-center gap-1 text-sm text-success font-medium">
                  {stat.change}
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-heading font-bold">{stat.value}</p>
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
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Members</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Plan</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentSocieties.map((society, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{society.name}</td>
                    <td className="p-4 text-muted-foreground">{society.members}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          society.status === "Active"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {society.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{society.plan}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
