import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
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
import SupportTickets from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SupportTickets"
import GlobalPayments from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/GlobalPayments"
import NotificationsHub from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/NotificationsHub"
import DocumentCenter from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/DocumentCenter"
import SecurityAndPreferences from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SecurityAndPreferences"
import SuperAdminSettings from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SuperAdminSettings"
import SystemSettings from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SystemSettings";

import { Sidebar } from "lucide-react";
import Dashboard from "./pages/SocietyAdmin/Dashboard";
import ResidentDirectory from "./pages/SocietyAdmin/ResidentDirectory";
import ComplaintsDetail from "./pages/SocietyAdmin/ComplaintsDetail"
import NoticeBoard from "./pages/SocietyAdmin/NoticeBoard";
import Finances from "./pages/SocietyAdmin/Finances";
import AdminSettings from "./pages/SocietyAdmin/AdminSettings";
import NotificationHub from "./pages/SocietyAdmin/NotificationHub";
import Maintenance from "./pages/SocietyAdmin/Maintenance";
import AddPenaltyFine from "./pages/SocietyAdmin/AddPenaltyFine";

import{DashboardLayout} from "./components/layout/DashboardLayout"
import ResidentialDashboard from "./pages/ResidentialHub/ResidentialDashboard"
import ResidentialPayments from "./pages/ResidentialHub/ResidentialPayments"
import ResidentialsocietyNotices from "./pages/ResidentialHub/ResidentialSocietyNotices"
import ResidentialSupport from "./pages/ResidentialHub/ResidentialSupport"
import ProfileHub from "./pages/ResidentialHub/ProfileHub";


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
          {/* <Route path="/society-admin" element={<SocietyAdminDashboard />} /> */}

          {/* Member Routes */}
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/member/*" element={<MemberDashboard />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

          {/*  Super Admin Routes */}
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
          <Route path="/globalPayments/*" element={<GlobalPayments />} />
          <Route path="/support-Tickets/*" element={<SupportTickets />} />
          <Route path="/notificationsHub/*" element={<NotificationsHub />} />
          <Route path="/documentCenter/*" element={<DocumentCenter />} />
          <Route path="/superAdminSettings/*" element={<SuperAdminSettings />} />
          <Route path="/securityAndPreferences/*" element={<SecurityAndPreferences />} />
          <Route path="/systemSettings/*" element={<SystemSettings />} />

          {/* Society Admin Routes */}
          <Route path="/society-admin/*" element={<SocietyAdminDashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/residentDirectory/*" element={<ResidentDirectory />} />
          <Route path="/complaintsDetail/*" element={<ComplaintsDetail />} />
          <Route path="/noticeBoard/*" element={<NoticeBoard />} />
          <Route path="/finances/*" element={<Finances />} />
          <Route path="/adminSettings/*" element={<AdminSettings />} />
          <Route path="/notificationHub/*" element={<NotificationHub />} />
          <Route path="/maintenance/*" element={<Maintenance/>} />
         <Route path="/addPenaltyFine/*" element={<AddPenaltyFine/>} /> 

         
{/* --- RESIDENTIAL ADMIN ROUTES (With Sidebar) --- */}
<Route 
  element={
    <DashboardLayout role="residential-admin">
      {/* We use Outlet here to render nested child routes within the DashboardLayout */}
      <Outlet /> 
    </DashboardLayout>
  }
>
  {/* All these paths will now render within the DashboardLayout alongside the Sidebar */}
  <Route path="/residentialDashboard" element={<ResidentialDashboard />} />
  <Route path="/residentialPayments" element={<ResidentialPayments />} />
  <Route path="/societyNotices" element={<ResidentialsocietyNotices />} />  
  <Route path="/residentialSupport" element={<ResidentialSupport/>} />  
  <Route path="/profileHub" element={<ProfileHub/>} />  
</Route>
        




        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
