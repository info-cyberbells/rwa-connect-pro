import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function Privacy() {
  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: December 5, 2024
              </p>
            </motion.div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  SocietySmartHub ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you use our society management platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We collect the following types of information:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, flat/unit number, Aadhaar number (for verification purposes only)</li>
                  <li><strong>Society Information:</strong> Society name, address, committee details</li>
                  <li><strong>Payment Information:</strong> Payment proof documents, transaction references</li>
                  <li><strong>Usage Data:</strong> Log data, device information, IP addresses</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the collected information for:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Providing and maintaining our services</li>
                  <li>Member verification and authentication</li>
                  <li>Processing and tracking payments</li>
                  <li>Sending notifications and announcements</li>
                  <li>Customer support and communication</li>
                  <li>Improving our platform and services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information. This includes encryption of data in transit and at rest, 
                  secure servers, and regular security audits. However, no method of transmission over 
                  the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">5. Data Sharing</h2>
                <p className="text-muted-foreground mb-4">We do not sell your personal information. We may share data with:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Society Administrators:</strong> For managing society operations</li>
                  <li><strong>Service Providers:</strong> Who assist in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">7. Cookies</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to enhance your experience, analyze usage, 
                  and provide personalized content. You can control cookie settings through your browser.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for users under 18 years of age. We do not knowingly 
                  collect personal information from children.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">9. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">10. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy, please contact us at:<br />
                  Email: privacy@societysmarthub.com<br />
                  Phone: +91 12345 67890
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
