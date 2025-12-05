import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/faq", label: "FAQ" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
  resources: [
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
    { href: "/contact", label: "Support" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-primary">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold">
                SocietySmartHub
              </span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm">
              The smartest way to manage your society. Streamline operations, enhance communication, and simplify payments for your residential community.
            </p>
            <div className="flex flex-col gap-3 text-sm text-background/70">
              <a href="mailto:contact@societysmarthub.com" className="flex items-center gap-2 hover:text-background transition-colors">
                <Mail className="w-4 h-4" />
                contact@societysmarthub.com
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-background transition-colors">
                <Phone className="w-4 h-4" />
                +91 12345 67890
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Mumbai, Maharashtra, India
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* App Store Links */}
            <div className="mt-6 space-y-3">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-background/10 rounded-lg hover:bg-background/20 transition-colors text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Google Play
              </a>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-background/10 rounded-lg hover:bg-background/20 transition-colors text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                App Store
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} SocietySmartHub. All rights reserved.
          </p>
          <p className="text-sm text-background/60">
            Developed by{" "}
            <a
              href="https://cyberbells.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background hover:underline"
            >
              Cyberbells ITES Services Pvt Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
