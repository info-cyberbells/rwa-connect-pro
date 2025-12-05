import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    price: "₹499",
    period: "/month",
    description: "Perfect for small societies just getting started.",
    features: [
      "Up to 50 Members",
      "Member Management",
      "Payment Proof System",
      "Admin Dashboard",
      "Basic Notifications",
      "Email Support",
    ],
    popular: false,
  },
  {
    name: "Standard",
    price: "₹999",
    period: "/month",
    description: "Ideal for growing societies with advanced needs.",
    features: [
      "Up to 200 Members",
      "All Basic Features",
      "Document Management",
      "Committee Management",
      "SMS Notifications",
      "Priority Support",
      "Custom Branding",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹1,999",
    period: "/month",
    description: "Complete solution for large societies.",
    features: [
      "Unlimited Members",
      "All Standard Features",
      "Advanced Analytics",
      "Multi-Tower Support",
      "Dedicated Support Manager",
      "API Access",
      "Early Access to New Features",
      "Custom Integrations",
    ],
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I change plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, all plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, and bank transfers for annual subscriptions.",
  },
  {
    question: "Can I get a discount for annual billing?",
    answer: "Yes, annual subscriptions get 2 months free, effectively a 16% discount.",
  },
];

export default function Pricing() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="container mx-auto container-padding relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-heading font-bold mb-6"
            >
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Choose the plan that fits your society's needs. All plans include a 14-day free trial.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding pt-0">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "relative bg-card rounded-3xl p-8 card-shadow",
                  plan.popular && "ring-2 ring-primary scale-105"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full hero-gradient text-primary-foreground text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-heading font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-heading font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">per society</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full hero-gradient flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  asChild
                >
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="section-padding bg-muted/50">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              For federation of societies or special requirements, contact us for a customized enterprise plan.
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-6 card-shadow"
                >
                  <h3 className="font-heading font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
