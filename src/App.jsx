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
const AddTeamMember=lazy(()=> import("./pages/Admin/AddTeamMember"));

const NotFound = lazy(() => import("./pages/NotFound"));
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import { useAuth } from "./context/UseAuth";
const Schedule = lazy(() => import("./pages/Schedule"));
const PageLoader = lazy(() => import("./components/PageLoader"));

export default function App() {
  const [bookingData, setBookingData] = useState({});

  const navigate = useNavigate();
  const {user}=useAuth()

  const sharedProps = {
    navigate,
    bookingData,
    onBook: (data) => setBookingData(data),
    user
  };

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
            <Route
              path="/booking"
              element={
                <ProtectedRoute
                  allowedRoles={["customer", "admin"]}
                  path={"/auth"}
                  screen={"choose"}
                >
                  <BookingPage {...sharedProps} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/booking/schedule"
              element={
                <ProtectedRoute
                  allowedRoles={["customer", "admin"]}
                  path={"/auth"}
                  screen={"choose"}
                >
                  <Schedule {...sharedProps} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/location"
              element={
                <ProtectedRoute
                  allowedRoles={["customer", "admin"]}
                  path={"/auth"}
                  screen={"choose"}
                >
                  <LocationPage {...sharedProps} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/confirm"
              element={
                <ProtectedRoute
                  allowedRoles={["customer", "admin"]}
                  path={"/auth"}
                  screen={"choose"}
                >
                  <ConfirmPage {...sharedProps} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/tracking"
              element={<TrackingPage {...sharedProps} />}
            />
            <Route path="/review" element={<ReviewPage {...sharedProps} />} />
            <Route path="/contact" element={<ContactPage {...sharedProps} />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute
                  allowedRoles={["admin"]}
                  path={"/auth"}
                  screen={"login"}
                >
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
              <Route
                path="profile"
                element={<ProfilePage {...sharedProps} />}
              />

              <Route
                path="team/new"
                element={<AddTeamMember {...sharedProps} />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  allowedRoles={["customer"]}
                  path={"/auth"}
                  screen={"login"}
                >
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
