import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    category: "General",
    questions: [
      {
        question: "What is SocietySmartHub?",
        answer: "SocietySmartHub is a comprehensive society management platform that helps housing societies manage members, track payments, communicate effectively, and handle documents - all in one place. It's designed specifically for Indian residential communities.",
      },
      {
        question: "Who can use SocietySmartHub?",
        answer: "SocietySmartHub is designed for housing societies, apartment complexes, gated communities, and cooperative housing societies. It supports three user roles: Super Admin (platform owner), Society Admin (society committee), and Members (residents).",
      },
      {
        question: "Is SocietySmartHub available in multiple languages?",
        answer: "Currently, SocietySmartHub is available in English with Hindi support coming soon. We're planning to add more regional languages based on user demand.",
      },
    ],
  },
  {
    category: "Registration & Onboarding",
    questions: [
      {
        question: "How do I register my society on SocietySmartHub?",
        answer: "Societies can register themselves through the sign-in page or contact our team for assistance. Our onboarding team can help set up the society account and provide admin access to the committee.",
      },
      {
        question: "How do members register on the platform?",
        answer: "Members can self-register through the member registration portal. They need to provide their details including Aadhaar number and upload Aadhaar documents for verification. The registration is then approved by the Society Admin.",
      },
      {
        question: "What documents are required for member registration?",
        answer: "Members need to provide: Full Name, Flat Number, Contact Number, Email, Aadhaar Number, and upload their Aadhaar document for identity verification.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        question: "How does the payment system work?",
        answer: "Members view their pending dues on the dashboard, make payments through their preferred method, and upload payment proof (screenshot/receipt) on the platform. The Society Admin then verifies and approves the payment.",
      },
      {
        question: "What types of payments can be tracked?",
        answer: "The platform supports tracking of Maintenance Fees, Club Membership charges, Parking fees, and any other society-defined charges. You can customize charge types based on your society's needs.",
      },
      {
        question: "Is online payment integration available?",
        answer: "Currently, we support payment proof upload system where members pay through their preferred method and upload proof. Direct payment gateway integration is available on Premium plans.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    questions: [
      {
        question: "Is my data secure on SocietySmartHub?",
        answer: "Yes, we take data security very seriously. All data is encrypted in transit and at rest. We use enterprise-grade security measures and are compliant with Indian data protection regulations.",
      },
      {
        question: "Who can see member information?",
        answer: "Member information is only visible to Society Admins and the members themselves. We follow strict privacy policies and data is never shared with third parties.",
      },
      {
        question: "Why is Aadhaar verification required?",
        answer: "Aadhaar verification helps ensure authentic member registration and prevents unauthorized access. It's a crucial security measure for maintaining accurate society records.",
      },
    ],
  },
  {
    category: "Pricing & Plans",
    questions: [
      {
        question: "Is there a free trial available?",
        answer: "Yes, all our plans come with a 14-day free trial. You can explore all features without providing payment details upfront.",
      },
      {
        question: "Can I change my plan later?",
        answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected from your next billing cycle.",
      },
      {
        question: "What happens if we exceed the member limit?",
        answer: "If your society grows beyond your plan's member limit, you'll be notified to upgrade. You won't lose any data, and the upgrade process is seamless.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="container mx-auto container-padding relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl hero-gradient mb-6"
            >
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-heading font-bold mb-6"
            >
              Frequently Asked <span className="text-gradient">Questions</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Find answers to common questions about SocietySmartHub.
              Can't find what you're looking for? Contact our support team.
            </motion.p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-heading font-bold mb-6">{category.category}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${categoryIndex}-${index}`}
                      className="bg-card rounded-xl card-shadow border-none px-6"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-16 pb-12 bg-muted/50">
        <div className="container mx-auto container-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our support team is here to help. Reach out and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/contact">
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
