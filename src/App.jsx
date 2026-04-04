import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/Userdashboard";
import BookingPage from "./pages/Bookingpage";
import LocationPage from "./pages/Locationpage";
import ConfirmPage from "./pages/Confirmpage";
import TrackingPage from "./pages/Trackingpage";
import ReviewPage from "./pages/ReviewPage";
import AdminDashboard from "./pages/Admindashboard";
import ProfilePage from "./pages/Profilepage";
import NotificationsPage from "./pages/Notificationspage";
import ServicesPage from "./pages/Servicespage";
import BottomNav from "./components/Bottomnav";
import { ToastContainer } from "./components/Toast";
import { Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/Admin/DashboardLayout";
import Overview from "./pages/Admin/Overview";
import { Bookings } from "./pages/Admin/Bookings";
import Customers from "./pages/Admin/Customers";
import Team from "./pages/Admin/Team";
import Analytics from "./pages/Admin/Analytics";


export default function App() {
  const [bookingData, setBookingData] = useState({});

  const navigate = useNavigate();

  const sharedProps = { navigate, bookingData };

  return (
    <Routes>
      <Route path="/" element={<LandingPage {...sharedProps}/>} />
      <Route path="/our-services" element={<ServicesPage {...sharedProps}/>} />
      <Route path="/auth" element={<AuthPage {...sharedProps}/>} />
      <Route path="/dashboard" element={<DashboardPage {...sharedProps}/>} />
      <Route path="/booking" element={<BookingPage {...sharedProps}/>} />
      <Route path="/location" element={<LocationPage {...sharedProps}/>} />
      <Route path="/confirm" element={<ConfirmPage {...sharedProps}/>} />
      <Route path="/tracking" element={<TrackingPage {...sharedProps}/>} />
      <Route path="/review" element={<ReviewPage {...sharedProps}/>} />

      <Route path="/admin/overview" element={<Overview {...sharedProps}/>} />
      <Route path="/admin/bookings" element={<Bookings {...sharedProps}/>} />
      <Route path="/admin/customers" element={<Customers {...sharedProps}/>} />
      <Route path="/admin/team" element={<Team {...sharedProps}/>} />
      <Route path="/admin/analytics" element={<Analytics {...sharedProps}/>} />
      <Route path="/admin" element={<DashboardLayout {...sharedProps}/>} />
      <Route path="/profile" element={<ProfilePage {...sharedProps}/>} />
      <Route path="/notifications" element={<NotificationsPage {...sharedProps}/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}