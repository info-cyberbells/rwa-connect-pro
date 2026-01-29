import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard Pages
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import SocietyAdminDashboard from "./pages/dashboard/SocietyAdminDashboard";
import MemberDashboard from "./pages/dashboard/MemberDashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/*" element={<SuperAdminDashboard />} />

          {/* Society Admin Routes */}
          <Route path="/society-admin" element={<SocietyAdminDashboard />} />
          <Route path="/society-admin/*" element={<SocietyAdminDashboard />} />

          {/* Member Routes */}
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/member/*" element={<MemberDashboard />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
