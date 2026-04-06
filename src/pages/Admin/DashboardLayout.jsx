import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Badge, Card, Button } from "../../components/UI";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const TABS = [
    { id: "overview", label: "Overview", path: "/admin/overview" },
    { id: "bookings", label: "Bookings", path: "/admin/bookings" },
    { id: "customers", label: "Customers", path: "/admin/customers" },
    { id: "team", label: "Team", path: "/admin/team" },
    { id: "analytics", label: "Analytics", path: "/admin/analytics" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-surface-100">
      
      {/* NAVBAR */}
      <div className="sticky top-0 z-40 bg-surface-50 backdrop-blur-md border-b border-white/6">
        <div className="max-w-7xl mx-auto flex items-center px-4 md:px-6 py-3 md:py-4 gap-3">
          
          {/* Logo */}
          <button
            onClick={() => navigate("/admin/overview")}
            className="font-display text-lg md:text-xl text-surface-900 flex items-center gap-1"
          >
            Ikinamba<span className="text-primary-500">.</span>
          </button>

          {/* Badge (hide on small) */}
          <div className="hidden sm:block">
            <Badge variant="info">Admin</Badge>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex gap-1 ml-6 bg-surface-800/50 rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(t.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname.startsWith(t.path)
                    ? "bg-primary-500 text-surface-900"
                    : "text-surface-400 hover:text-surface-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Avatar */}
          <div className="ml-auto flex items-center gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium">
              AD
            </div>

            {/* Hamburger (mobile only) */}
            <Button
              onClick={() => setOpen(!open)}
              variant="outline"
              size="sm"
              className="md:hidden flex flex-col justify-center items-center"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="fixed inset-x-0 md:hidden px-4 pb-5 pt-3 bg-surface-50 border-t border-white/10">
            <div className="flex flex-col gap-1 min-h-screen">
              {TABS.map((t) => {
                const active = location.pathname.startsWith(t.path);

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setOpen(false);
                      navigate(t.path);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition ${
                      active
                        ? "bg-primary-500/10 text-primary-500"
                        : "text-surface-700 hover:bg-surface-100"
                    }`}
                  >
                    {t.label}
                    {active && (
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <main className="w-full mx-auto px-4 md:px-6 py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;