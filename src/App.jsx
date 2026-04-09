import { useState } from "react";
import LandingPage from "./pages/Landingpage";
import AuthPage from "./pages/Authpage";
import DashboardPage from "./pages/Userdashboard";
import BookingPage from "./pages/Bookingpage";
import LocationPage from "./pages/Locationpage";
import ConfirmPage from "./pages/Confirmpage";
import TrackingPage from "./pages/Trackingpage";
import ReviewPage from "./pages/Reviewpage";
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
import ContactPage from "./pages/ContactUs";
import AdminLogin from "./pages/Admin/Signin";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [bookingData, setBookingData] = useState({});

  const navigate = useNavigate();

  const sharedProps = { navigate, bookingData };

  return (
    <div>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<LandingPage {...sharedProps} />} />
        <Route
          path="/our-services"
          element={<ServicesPage {...sharedProps} />}
        />
        <Route path="/auth" element={<AuthPage {...sharedProps} />} />
        <Route path="/dashboard" element={<DashboardPage {...sharedProps} />} />
        <Route path="/booking" element={<BookingPage {...sharedProps} />} />
        <Route path="/location" element={<LocationPage {...sharedProps} />} />
        <Route path="/confirm" element={<ConfirmPage {...sharedProps} />} />
        <Route path="/tracking" element={<TrackingPage {...sharedProps} />} />
        <Route path="/review" element={<ReviewPage {...sharedProps} />} />
        <Route path="/contact" element={<ContactPage {...sharedProps} />} />

        <Route path="/admin/signin" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            // <ProtectedRoute allowedRoles={["admin"]} path={"/admin/signin"}>
              <DashboardLayout />
            // </ProtectedRoute>
          }
        >
          <Route
            index
            path="overview"
            element={<Overview {...sharedProps} />}
          />
          <Route path="bookings" element={<Bookings {...sharedProps} />} />
          <Route path="customers" element={<Customers {...sharedProps} />} />
          <Route path="team" element={<Team {...sharedProps} />} />
          <Route path="analytics" element={<Analytics {...sharedProps} />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/profile" element={<ProfilePage {...sharedProps} />} />
        <Route
          path="/notifications"
          element={<NotificationsPage {...sharedProps} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
