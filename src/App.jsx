import { useState } from "react";
import { lazy, Suspense } from "react";

const LandingPage = lazy(() => import("./pages/Landingpage"));
const AuthPage = lazy(() => import("./pages/Authpage"));
const DashboardPage = lazy(() => import("./pages/Userdashboard"));
const BookingPage = lazy(() => import("./pages/Bookingpage"));
const LocationPage = lazy(() => import("./pages/Locationpage"));
const ConfirmPage = lazy(() => import("./pages/Confirmpage"));
const TrackingPage = lazy(() => import("./pages/Trackingpage"));
const ReviewPage = lazy(() => import("./pages/Reviewpage"));
const ProfilePage = lazy(() => import("./pages/Profilepage"));
const NotificationsPage = lazy(() => import("./pages/Notificationspage"));
const ServicesPage = lazy(() => import("./pages/Servicespage"));
const ContactPage = lazy(() => import("./pages/ContactUs"));

// Admin
const DashboardLayout = lazy(() => import("./pages/Admin/DashboardLayout"));
const Overview = lazy(() => import("./pages/Admin/Overview"));
const Bookings = lazy(() => import("./pages/Admin/Bookings"));
const Customers = lazy(() => import("./pages/Admin/Customers"));
const Team = lazy(() => import("./pages/Admin/Team"));
const Analytics = lazy(() => import("./pages/Admin/Analytics"));

const NotFound = lazy(() => import("./pages/NotFound"));
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
const PageLoader = lazy(() => import("./components/PageLoader"));

export default function App() {
  const [bookingData, setBookingData] = useState({});

  const navigate = useNavigate();

  const sharedProps = { navigate, bookingData, onBook: (data) => setBookingData(data)};

  return (
    <div>
      <Suspense fallback={<PageLoader />}>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<LandingPage {...sharedProps} />} />
            <Route
              path="/our-services"
              element={<ServicesPage {...sharedProps} />}
            />
            <Route path="/auth" element={<AuthPage {...sharedProps} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["customer"]} path={"/auth"}>
                  <DashboardPage {...sharedProps} />
                </ProtectedRoute>
              }
            />
            <Route path="/booking" element={<BookingPage {...sharedProps} />} />
            <Route
              path="/location"
              element={<LocationPage {...sharedProps} />}
            />
            <Route path="/confirm" element={<ConfirmPage {...sharedProps} />} />
            <Route
              path="/tracking"
              element={<TrackingPage {...sharedProps} />}
            />
            <Route path="/review" element={<ReviewPage {...sharedProps} />} />
            <Route path="/contact" element={<ContactPage {...sharedProps} />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]} path={"/auth"}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                path="overview"
                element={<Overview {...sharedProps} />}
              />
              <Route path="bookings" element={<Bookings {...sharedProps} />} />
              <Route
                path="customers"
                element={<Customers {...sharedProps} />}
              />
              <Route path="team" element={<Team {...sharedProps} />} />
              <Route
                path="analytics"
                element={<Analytics {...sharedProps} />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["customer"]} path={"/auth"}>
                  <ProfilePage {...sharedProps} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={<NotificationsPage {...sharedProps} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </Suspense>
    </div>
  );
}
