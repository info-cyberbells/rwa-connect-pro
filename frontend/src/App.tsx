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
// import Admin from "./pages/SocietySetup/Admin/Admin"

import SocietyIdentitySetup from "./pages/SocietySetup/SuperAdmin/SocietyIdentitySetup"
import StructureStep from "./pages/SocietySetup/User/StructureStep"
import AddressStep from "./pages/SocietySetup/User/AddressStep"
import FinalizeSetup from "./pages/SocietySetup/User/FinalizeSetup"
import AdminDetailsStep from "./pages/SocietySetup/Admin/AdminDetailsStep"
import AdminDashboard from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/AdminDashboard"
import GlobalSocietyDirectory from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/GlobalSocietyDirectory"
import SocietyDetails from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SocietyDetails"
import RegistrationReview from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/RegistrationReview"
import SupportTickets from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SupportTickets"
import GlobalPayments from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/GlobalPayments"
import NotificationsHub from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/NotificationsHub"
import DocumentCenter from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/DocumentCenter"
import SecurityAndPreferences from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SecurityAndPreferences"
import SuperAdminSettings from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SuperAdminSettings"
import SystemSettings from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SystemSettings";

import { Sidebar } from "lucide-react";

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
          {/* societyIdentity */}
          {/* <Route path="/admin/*" element={<Admin />} /> */}
          <Route path="/societyIdentitySetup/*" element={<SocietyIdentitySetup />} />
          <Route path="/structureStep/*" element={< StructureStep />} />
          <Route path="/addressStep/*" element={< AddressStep />} />
          <Route path="/finalizeSetup/*" element={< FinalizeSetup />} />
          <Route path="/adminDetailsStep/*" element={< AdminDetailsStep />} />

          <Route path="/sidebar/*" element={<Sidebar />} />
          <Route path="/adminDashboard/*" element={<AdminDashboard />} />
        <Route path="/globalSocietyDirectory" element={<GlobalSocietyDirectory />} />
<Route path="/globalSocietyDirectory/:id" element={<SocietyDetails />} />
          <Route path="/globalPayments/*" element={<GlobalPayments/>} />
          <Route path="/registrationReview/*" element={<RegistrationReview/>} />
          <Route path="/support-Tickets/*" element={<SupportTickets/>} />
          <Route path="/notificationsHub/*" element={<NotificationsHub/>} />
          <Route path="/documentCenter/*" element={<DocumentCenter/>} />
          <Route path="/superAdminSettings/*" element={<SuperAdminSettings/>} />
          <Route path="/securityAndPreferences/*" element={<SecurityAndPreferences/>} />
          <Route path="/systemSettings/*" element={<SystemSettings/>} />


        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
