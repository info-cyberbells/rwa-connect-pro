import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Building2, UserPlus, ClipboardCheck, CreditCard, Bell, 
  ArrowRight, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";

const steps = [
  {
    icon: Building2,
    title: "Society Onboarding",
    description: "Your society is registered on SocietySmartHub by our Super Admin. The Society President/Owner receives secure login credentials.",
    details: [
      "Society profile setup",
      "Admin credentials provided",
      "Subscription plan activated",
      "Initial configuration done",
    ],
  },
  {
    icon: UserPlus,
    title: "Member Registration",
    description: "Society members self-register with their details including Aadhaar verification for identity confirmation.",
    details: [
      "Self-registration portal",
      "Aadhaar document upload",
      "Flat/unit assignment",
      "Contact details capture",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Admin Verification",
    description: "Society Admin reviews and approves member registrations. Approved members receive login credentials automatically.",
    details: [
      "Document verification",
      "Approval/rejection workflow",
      "Auto credential generation",
      "Email/SMS notification",
    ],
  },
  {
    icon: CreditCard,
    title: "Payment Management",
    description: "Members view their dues, submit payment proofs, and track payment status. Admins verify and approve payments.",
    details: [
      "View pending dues",
      "Upload payment proof",
      "Admin verification",
      "Status tracking",
    ],
  },
  {
    icon: Bell,
    title: "Stay Connected",
    description: "Access notices, announcements, documents, and raise support tickets. Everything in one place.",
    details: [
      "View announcements",
      "Access documents",
      "Raise support tickets",
      "Update profile",
    ],
  },
];

const userFlows = [
  {
    role: "Super Admin",
    color: "bg-primary",
    tasks: [
      "Onboard new societies",
      "Assign society credentials",
      "Manage subscription plans",
      "Monitor platform activity",
    ],
  },
  {
    role: "Society Admin",
    color: "bg-success",
    tasks: [
      "Verify member registrations",
      "Approve payment proofs",
      "Publish announcements",
      "Manage society settings",
    ],
  },
  {
    role: "Members",
    color: "bg-info",
    tasks: [
      "Self-register & login",
      "Submit payment proofs",
      "View notices & documents",
      "Raise support tickets",
    ],
  },
];

export default function HowItWorks() {
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
              How <span className="text-gradient">SocietySmartHub</span> Works
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              A simple, transparent workflow designed to make society management effortless 
              for administrators and members alike.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto container-padding">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                    {/* Step Number */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center shadow-lg">
                        <step.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 bg-card rounded-2xl p-8 card-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="text-2xl font-heading font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground mb-6">{step.description}</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="pt-16 pb-12 bg-muted/50">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Role-Based Access</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three distinct user roles with specific permissions and responsibilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userFlows.map((flow, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl overflow-hidden card-shadow"
              >
                <div className={`${flow.color} p-6`}>
                  <h3 className="text-xl font-heading font-bold text-primary-foreground">
                    {flow.role}
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {flow.tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto container-padding">
          <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Join hundreds of societies already using SocietySmartHub. 
                Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" variant="hero-outline" asChild>
                  <Link to="/register">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="ghost" className="text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
