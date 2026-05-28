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
 
import SocietyIdentitySetup from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SocietyRegistrationPages/SocietyIdentitySetup"
import StructureStep from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SocietyRegistrationPages/StructureStep"
import AddressStep from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SocietyRegistrationPages/AddressStep"
import FinalizeSetup from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SocietyRegistrationPages/FinalizeSetup"
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
import DeactivationRequests from "./pages/SocietyAdmin/DeactivationRequests.tsx"
import DailyStaff from "./pages/SocietyAdmin/DailyStaff";
 
// import{DashboardLayout} from "./components/layout/DashboardLayout"
import ResidentialDashboard from "./pages/ResidentialUser/ResidentialDashboard.tsx"
import ResidentialPayments from "./pages/ResidentialUser/ResidentialPayments.tsx"
import ResidentialsocietyNotices from "./pages/ResidentialUser/ResidentialSocietyNotices.tsx"
import ResidentialSupport from "./pages/ResidentialUser/ResidentialSupport.tsx"
import StaffDirectory from "./pages/ResidentialUser/StaffDirectory";
import ProfileHub from "./pages/ResidentialUser/ProfileHub.tsx";
import SocietySetupContainer from "./pages/SocietySetup/SuperAdmin/SuparAdminPages/SocietySetupContainer.tsx";
import MySociety from "./pages/SocietyAdmin/MySociety.tsx";
 
 
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
          <Route path="/Dashboard/*" element={<Dashboard />} />
          <Route path="/super-admin/globalSocietyDirectory" element={<GlobalSocietyDirectory />} />
          <Route path="/super-admin/globalSocietyDirectory/:id" element={<SocietyDetails />} />
          <Route path="/super-admin/register-society" element={<SocietySetupContainer />} />
          <Route path="/super-admin/globalPayments" element={<GlobalPayments />} />
          <Route path="/super-admin/support-Tickets" element={<SupportTickets />} />
          <Route path="/super-admin/document-center" element={<DocumentCenter />} />
          <Route path="/super-admin/Settings" element={<SuperAdminSettings />} />
           <Route path="/super-admin/securityAndPreferences" element={<SecurityAndPreferences />} />
          <Route path="/systemSettings/*" element={<SystemSettings />} />
 
 
 
 
 
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
         
          <Route path="/notificationsHub/*" element={<NotificationsHub />} />
         
         
 
          {/* Society Admin Routes */}
          <Route path="/society-admin/" element={<SocietyAdminDashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/residentDirectory/*" element={<ResidentDirectory />} />
          <Route path="/complaintsDetail/*" element={<ComplaintsDetail />} />
          <Route path="/noticeBoard/*" element={<NoticeBoard />} />
          <Route path="/finances/*" element={<Finances />} />
          <Route path="/adminSettings/*" element={<AdminSettings />} />
          <Route path="/notificationHub/*" element={<NotificationHub />} />
          <Route path="/maintenance/*" element={<Maintenance/>} />
         <Route path="/addPenaltyFine/*" element={<AddPenaltyFine/>} />
         <Route path="/my-society/*" element={<MySociety/>} />
         <Route path="/deactivationrequests" element={<DeactivationRequests />} />
         <Route path="/daily-staff" element={<DailyStaff />} />


          {/* All these paths will now render within the DashboardLayout alongside the Sidebar */}
          <Route path="/residentialDashboard" element={<ResidentialDashboard />} />
          <Route path="/member/payments" element={<ResidentialPayments />} />
          <Route path="/member/notices" element={<ResidentialsocietyNotices />} />  
          <Route path="/member/staff-directory" element={<StaffDirectory />} />
          <Route path="/member/support" element={<ResidentialSupport/>} />  
          <Route path="/member/profile" element={<ProfileHub/>} />
       
 
 
 
 
 
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
 
export default App;