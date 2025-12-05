import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function Terms() {
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
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground">
                Last updated: December 5, 2024
              </p>
            </motion.div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using SocietySmartHub ("the Platform"), you agree to be bound by 
                  these Terms and Conditions. If you do not agree to these terms, please do not 
                  use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">2. Description of Services</h2>
                <p className="text-muted-foreground">
                  SocietySmartHub provides a society management platform that enables housing 
                  societies to manage members, track payments, communicate, and handle documents. 
                  The services are provided on a subscription basis.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">3. User Accounts</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must immediately notify us of any unauthorized use of your account</li>
                  <li>One account per user; sharing credentials is prohibited</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">4. User Responsibilities</h2>
                <p className="text-muted-foreground mb-4">As a user of the Platform, you agree to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Use the Platform only for lawful purposes</li>
                  <li>Provide accurate information and documents</li>
                  <li>Not interfere with or disrupt the Platform's operation</li>
                  <li>Not attempt to gain unauthorized access to any part of the Platform</li>
                  <li>Respect the privacy and rights of other users</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">5. Society Administrator Responsibilities</h2>
                <p className="text-muted-foreground mb-4">Society Administrators are additionally responsible for:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Verifying member identities before approval</li>
                  <li>Ensuring accurate society information</li>
                  <li>Managing member access appropriately</li>
                  <li>Complying with applicable data protection laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">6. Subscription and Payments</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Subscriptions are billed monthly or annually as selected</li>
                  <li>Prices are subject to change with 30 days notice</li>
                  <li>Refunds are provided as per our refund policy</li>
                  <li>Failure to pay may result in service suspension</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">7. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content, features, and functionality of the Platform are owned by 
                  SocietySmartHub and are protected by intellectual property laws. You may not 
                  copy, modify, or distribute any part of the Platform without our written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, SocietySmartHub shall not be liable for 
                  any indirect, incidental, special, consequential, or punitive damages arising 
                  from your use of the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">9. Disclaimer</h2>
                <p className="text-muted-foreground">
                  The Platform is provided "as is" without warranties of any kind. We do not 
                  guarantee that the Platform will be uninterrupted, secure, or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">10. Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to terminate or suspend your account at any time for 
                  violation of these terms. Upon termination, your right to use the Platform 
                  will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">11. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws 
                  of India. Any disputes shall be subject to the exclusive jurisdiction of 
                  the courts in Mumbai, Maharashtra.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">12. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may modify these Terms at any time. Continued use of the Platform after 
                  changes constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4">13. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms, contact us at:<br />
                  Email: legal@societysmarthub.com<br />
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
