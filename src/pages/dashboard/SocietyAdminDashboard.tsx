import { motion } from "framer-motion";
import { Users, CreditCard, Bell, ClipboardList, ArrowUpRight, UserPlus, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const stats = [
  { label: "Total Members", value: "124", change: "+5", icon: Users, color: "bg-primary" },
  { label: "Pending Approvals", value: "8", change: "New", icon: ClipboardList, color: "bg-warning" },
  { label: "Payment Pending", value: "₹45,000", change: "12 dues", icon: CreditCard, color: "bg-destructive" },
  { label: "Active Notices", value: "3", change: "This month", icon: Bell, color: "bg-info" },
];

const pendingRegistrations = [
  { name: "Amit Sharma", flat: "A-301", phone: "+91 98765 43210", date: "Dec 4, 2024" },
  { name: "Priya Patel", flat: "B-105", phone: "+91 87654 32109", date: "Dec 3, 2024" },
  { name: "Rahul Verma", flat: "C-402", phone: "+91 76543 21098", date: "Dec 2, 2024" },
];

const pendingPayments = [
  { name: "Suresh Kumar", flat: "A-102", amount: "₹5,500", type: "Maintenance", date: "Dec 4, 2024" },
  { name: "Meera Joshi", flat: "B-203", amount: "₹5,500", type: "Maintenance", date: "Dec 3, 2024" },
  { name: "Vikram Singh", flat: "D-101", amount: "₹2,000", type: "Club Fee", date: "Dec 2, 2024" },
];

export default function SocietyAdminDashboard() {
  return (
    <DashboardLayout role="society-admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">Society Dashboard</h1>
            <p className="text-muted-foreground">Green Valley Apartments</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Bell className="w-4 h-4" />
              Post Notice
            </Button>
            <Button>
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
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
                <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-heading font-bold">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Registrations */}
          <div className="bg-card rounded-2xl card-shadow">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Pending Registrations</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="p-4 space-y-4">
              {pendingRegistrations.map((reg, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{reg.name}</p>
                      <p className="text-sm text-muted-foreground">Flat: {reg.flat}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                      Reject
                    </Button>
                    <Button size="sm" variant="success">
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-card rounded-2xl card-shadow">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Payment Verifications</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="p-4 space-y-4">
              {pendingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.name}</p>
                      <p className="text-sm text-muted-foreground">{payment.flat} • {payment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount}</p>
                    <Button size="sm" className="mt-2">Verify</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
