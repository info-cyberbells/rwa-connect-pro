import { motion } from "framer-motion";
import { CreditCard, Bell, FileText, MessageSquare, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const paymentDues = [
  { type: "Maintenance", amount: "₹5,500", dueDate: "Dec 10, 2024", status: "pending" },
  { type: "Club Membership", amount: "₹2,000", dueDate: "Dec 15, 2024", status: "pending" },
  { type: "Parking Fee", amount: "₹500", dueDate: "Dec 10, 2024", status: "paid" },
];

const recentNotices = [
  { title: "Annual General Meeting", date: "Jan 15, 2025", type: "Meeting" },
  { title: "Water Supply Maintenance", date: "Dec 8, 2024", type: "Maintenance" },
  { title: "New Year Celebration", date: "Dec 31, 2024", type: "Event" },
];

const paymentHistory = [
  { type: "Maintenance", amount: "₹5,500", date: "Nov 5, 2024", status: "approved" },
  { type: "Maintenance", amount: "₹5,500", date: "Oct 5, 2024", status: "approved" },
  { type: "Club Membership", amount: "₹2,000", date: "Oct 15, 2024", status: "approved" },
];

export default function MemberDashboard() {
  return (
    <DashboardLayout role="member">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold">Welcome, John!</h1>
          <p className="text-muted-foreground">Flat A-204 • Green Valley Apartments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-warning">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold">₹7,500</p>
            <p className="text-muted-foreground text-sm">Pending Dues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-info">
                <Bell className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold">3</p>
            <p className="text-muted-foreground text-sm">New Notices</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold">5</p>
            <p className="text-muted-foreground text-sm">Documents</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-success">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold">0</p>
            <p className="text-muted-foreground text-sm">Open Tickets</p>
          </motion.div>
        </div>

        {/* Payment Dues */}
        <div className="bg-card rounded-2xl card-shadow">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold">Payment Dues</h2>
            <Button>
              <Upload className="w-4 h-4" />
              Upload Payment Proof
            </Button>
          </div>
          <div className="p-4 space-y-4">
            {paymentDues.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.status === "paid" ? "bg-success/20" : "bg-warning/20"
                  }`}>
                    {payment.status === "paid" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{payment.type}</p>
                    <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{payment.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === "paid" 
                      ? "bg-success/10 text-success" 
                      : "bg-warning/10 text-warning"
                  }`}>
                    {payment.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Notices */}
          <div className="bg-card rounded-2xl card-shadow">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Recent Notices</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="p-4 space-y-4">
              {recentNotices.map((notice, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Bell className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notice.title}</p>
                    <p className="text-sm text-muted-foreground">{notice.date}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {notice.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-card rounded-2xl card-shadow">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Payment History</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="p-4 space-y-4">
              {paymentHistory.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.type}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount}</p>
                    <span className="text-xs text-success">Approved</span>
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
