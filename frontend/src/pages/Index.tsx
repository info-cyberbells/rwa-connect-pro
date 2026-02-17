import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, Users, CreditCard, Shield, Bell, FileText,
  CheckCircle2, ArrowRight, Star, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";

const features = [
  {
    icon: Users,
    title: "Member Management",
    description: "Easily onboard, verify, and manage all society members with Aadhaar verification.",
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    description: "Track maintenance fees, collect payment proofs, and automate reminders.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Send announcements, notices, and alerts to all members instantly.",
  },
  {
    icon: FileText,
    title: "Document Management",
  description: "Store and share society documents securely so members can access them when needed.",
  },
  {
    icon: Shield,
    title: "Verified Identity",
    description: "Ensure authentic member registration with Aadhaar-based verification.",
  },
  {
    icon: Building2,
    title: "Multi-Society Support",
    description: "Manage multiple societies from a single dashboard with ease.",
  },
];

const stats = [
  { value: "500+", label: "Societies" },
  { value: "50,000+", label: "Members" },
  { value: "₹10Cr+", label: "Payments Tracked" },
  { value: "99.9%", label: "Uptime" },
];

const testimonials = [
  {
    quote: "SocietySmartHub transformed how we manage our society. Payment collection is now seamless!",
    author: "Rajesh Sharma",
    role: "President, Green Valley Society",
  },
  {
    quote: "The member verification feature gives us peace of mind. Highly recommended for all societies.",
    author: "Priya Patel",
    role: "Secretary, Sunrise Apartments",
  },
  {
    quote: "Best investment for our society. The dashboard is intuitive and saves us hours every week.",
    author: "Amit Desai",
    role: "Treasurer, Palm Gardens",
  },
];

export default function Index() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto container-padding pt-20 pb-12 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-current" />
                Trusted by 500+ Housing Societies
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6"
            >
              The Smartest Way to{" "}
              <span className="text-gradient">Manage Your Society</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
            Manage members, track payments, and communicate with residents efficiently using a trusted society management platform built for Indian housing communities
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="xl" variant="hero" asChild>
                <Link to="/register">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/how-it-works">See How It Works</Link>
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-16 pb-12 bg-muted/50">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
  Simplifying Everyday Society Management
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
  Handle member onboarding, maintenance billing, payment tracking, and resident
  communication through a single platform built for practical society management.            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-card rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Why Societies Choose <span className="text-gradient">SocietySmartHub</span>
              </h2>
              <div className="space-y-4">
                {[
                  
 "Easy dashboards that help manage daily society work in one place",
 "Member self-registration with Aadhaar verification for better record accuracy",
 "Clear payment tracking with proper records and payment proof options",
 "Automatic notifications for maintenance dues and important updates",
 "Secure storage and sharing of society documents when needed",
 "Approval workflows to manage requests and decisions in an organized way",

                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
              <Button className="mt-8" size="lg" asChild>
                <Link to="/features">
                  Explore All Features
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 hero-gradient rounded-3xl opacity-10 blur-2xl" />
              <div className="relative bg-card rounded-3xl p-8 card-shadow">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">New Member Registered</div>
                      <div className="text-sm text-muted-foreground">Flat A-204, Pending Verification</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-accent rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-success-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">Payment Approved</div>
                      <div className="text-sm text-muted-foreground">₹5,500 - Maintenance Dec 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">Notice Published</div>
                      <div className="text-sm text-muted-foreground">Annual General Meeting - Jan 15</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="pt-16 pb-12 bg-muted/50">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Loved by Society Committees
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what society administrators and members have to say about SocietySmartHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-card rounded-2xl card-shadow"
              >
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-foreground mb-6">{testimonial.quote}</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
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
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
                Ready to Transform Your Society Management?
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Join 500+ societies that have already simplified their operations with SocietySmartHub.
                Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" variant="hero-outline" asChild>
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="ghost" className="text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
