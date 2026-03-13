import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ShieldCheck, Database, Lock, Users, Mail } from "lucide-react";

export default function Privacy() {
 const sections = [
  {
    icon: ShieldCheck,
    title: "Introduction",
    content:
      "SocietySmartHub ('we', 'our', 'us') is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our platform.",
  },
  {
    icon: Database,
    title: "Information We Collect",
    list: [
      "Personal details such as name, email, phone number and flat number",
      "Society details including society name and address",
      "Payment proof and transaction references",
      "Usage data like IP address, device info and log data",
    ],
  },
  {
    icon: Users,
    title: "How We Use Your Information",
    list: [
      "To manage society operations",
      "For user verification and authentication",
      "To process and track payments",
      "To send notifications and announcements",
      "To improve our platform services",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content:
      "We implement strong technical and organizational security measures including encrypted communication, secure servers and regular audits to protect your personal information.",
  },
  {
    icon: Users,
    title: "Data Sharing",
    list: [
      "Society administrators for operational management",
      "Trusted service providers that help operate our platform",
      "Legal authorities when required by law",
      "Payment providers for secure transaction processing",
    ],
  },
  {
    icon: Database,
    title: "Data Storage and Retention",
    content:
      "We store your personal data only as long as necessary for providing services, complying with legal obligations, and resolving disputes.",
  },
  {
    icon: ShieldCheck,
    title: "User Rights",
    list: [
      "Access your personal information",
      "Update or correct inaccurate data",
      "Request deletion of your personal information",
      "Withdraw consent for certain data processing activities",
    ],
  },
  {
    icon: Database,
    title: "Cookies and Tracking",
    content:
      "We use cookies and similar technologies to enhance your browsing experience, analyze usage patterns and improve platform performance.",
  },
  {
    icon: Lock,
    title: "Third Party Services",
    content:
      "Our platform may integrate with third-party services such as payment gateways or analytics tools. These services have their own privacy policies governing the use of your information.",
  },
  {
    icon: Users,
    title: "Children's Privacy",
    content:
      "SocietySmartHub services are intended for adults. We do not knowingly collect personal information from individuals under the age of 18.",
  },
  {
    icon: ShieldCheck,
    title: "Policy Updates",
    content:
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated revision date.",
  },
];

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen">

        {/* Header */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto px-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Privacy Policy
            </h1>

            <p className="text-slate-500">
              Your privacy matters to us. Learn how Society Smart Hub protects your information.
            </p>

            <p className="text-sm text-blue-600 mt-2">
              Last Updated • March 2026
            </p>
          </motion.div>
        </section>

        {/* Sections */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-6 space-y-6">

            {sections.map((section, index) => {
              const Icon = section.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all"
                >

                  <div className="flex items-start gap-4">

                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Icon size={18} className="text-blue-600" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-800 mb-2">
                        {index + 1}. {section.title}
                      </h2>

                      {section.content && (
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {section.content}
                        </p>
                      )}

                      {section.list && (
                        <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 text-sm">
                          {section.list.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                  </div>

                </motion.div>
              );
            })}

            {/* Contact Box */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-10 bg-blue-600 text-white rounded-2xl p-8 text-center shadow-lg"
            >

              <Mail className="mx-auto mb-3" size={26} />

              <h3 className="text-xl font-semibold mb-2">
                Have Questions?
              </h3>

              <p className="text-blue-100 text-sm mb-4">
                If you have any questions regarding this privacy policy, feel free to contact our support team.
              </p>

              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
                privacy@societysmarthub.com
              </button>

            </motion.div>

          </div>
        </section>

      </div>
    </PublicLayout>
  );
}