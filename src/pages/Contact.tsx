import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { toast } from "@/hooks/use-toast";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

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
              Get in <span className="text-gradient">Touch</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Have questions about SocietySmartHub? We're here to help. 
              Reach out to us and we'll respond as soon as we can.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding pt-0">
        <div className="container mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 bg-card rounded-xl card-shadow"
                >
                  <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <a href="mailto:contact@societysmarthub.com" className="text-muted-foreground hover:text-primary">
                      contact@societysmarthub.com
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      For general inquiries and support
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 bg-card rounded-xl card-shadow"
                >
                  <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <a href="tel:+911234567890" className="text-muted-foreground hover:text-primary">
                      +91 12345 67890
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mon-Sat, 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 bg-card rounded-xl card-shadow"
                >
                  <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">
                      123, Tech Park, Andheri East<br />
                      Mumbai, Maharashtra 400069
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 bg-card rounded-xl card-shadow"
                >
                  <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Response Time</h3>
                    <p className="text-muted-foreground">
                      We typically respond within 24 hours during business days.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-8 card-shadow"
            >
              <h2 className="text-2xl font-heading font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="society">Society Name</Label>
                  <Input id="society" placeholder="Your Society Name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..." 
                    rows={5}
                    required 
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
