import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, CreditCard, Bell, FileText, Shield, Building2,
  CheckCircle2, ArrowRight, UserCheck, ClipboardList, MessageSquare,
  Calendar, BarChart3, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";

const mainFeatures = [
  {
    icon: Users,
    title: "Member Management",
    description: "Complete member lifecycle management from registration to approval.",
    features: [
      "Self-registration with Aadhaar verification",
      "Admin approval workflow",
      "Member profile management",
      "Family member linking",
      "Tenant management",
    ],
  },
  {
    icon: CreditCard,
    title: "Payment Management",
    description: "Comprehensive payment tracking and proof submission system.",
    features: [
      "Multiple payment types support",
      "Payment proof upload",
      "Admin approval workflow",
      "Payment history tracking",
      "Due date reminders",
    ],
  },
  {
    icon: Bell,
    title: "Notifications & Announcements",
    description: "Keep everyone informed with instant communication tools.",
    features: [
      "Society-wide announcements",
      "Emergency alerts",
      "Email notifications",
      "SMS integration",
      "Push notifications",
    ],
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Secure storage and sharing of important society documents.",
    features: [
      "Meeting minutes",
      "Bylaws and rules",
      "Financial reports",
      "NOC generation",
      "Secure document sharing",
    ],
  },
  {
    icon: UserCheck,
    title: "Approval Workflows",
    description: "Streamlined approval processes for various requests.",
    features: [
      "Member registration approval",
      "Payment verification",
      "Leave/visitor requests",
      "Facility booking approval",
      "Multi-level approvals",
    ],
  },
  {
    icon: ClipboardList,
    title: "Committee Management",
    description: "Manage your society committee efficiently.",
    features: [
      "Committee member profiles",
      "Role assignment",
      "Term tracking",
      "Meeting scheduling",
      "Voting system",
    ],
  },
];

const additionalFeatures = [
  { icon: MessageSquare, title: "Support Tickets", description: "Resident complaint and query management" },
  { icon: Calendar, title: "Event Management", description: "Society events and facility booking" },
  { icon: BarChart3, title: "Reports & Analytics", description: "Comprehensive society insights" },
  { icon: Settings, title: "Custom Settings", description: "Flexible society configuration" },
  { icon: Shield, title: "Data Security", description: "Enterprise-grade security" },
  { icon: Building2, title: "Multi-Society", description: "Manage multiple societies" },
];

export default function Features() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="container mx-auto container-padding relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-heading font-bold mb-6"
            >
              Powerful Features for <span className="text-gradient">Modern Societies</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Everything you need to manage your housing society efficiently,
              all in one comprehensive platform.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto container-padding">
          <div className="space-y-16">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold mb-4">{feature.title}</h2>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`relative ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="absolute inset-0 hero-gradient rounded-3xl opacity-10 blur-2xl" />
                  <div className="relative bg-card rounded-3xl p-8 card-shadow">
                    <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                      <feature.icon className="w-24 h-24 text-primary/20" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="pt-16 pb-12 bg-muted/50">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">And Much More...</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Additional features to make society management even easier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-card rounded-2xl card-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your free trial today and see how SocietySmartHub can transform your society management.
            </p>
            <Button size="lg" asChild>
              <Link to="/register">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
