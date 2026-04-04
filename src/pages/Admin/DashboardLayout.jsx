import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge, Card } from "../../components/UI";

const DashboardLayout = ({ children }) => {
      const TABS = [
    { id: "overview", label: "Overview" ,path:"/admin/overview" },
    { id: "bookings", label: "Bookings" ,path:"/admin/bookings" },
    { id: "customers", label: "Customers" ,path:"/admin/customers" },
    { id: "team", label: "Team" ,path:"/admin/team" },
    { id: "analytics", label: "Analytics" ,path:"/admin/analytics" },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-surface-100">
      <div className="sticky top-0 z-40 bg-surface-50 backdrop-blur-md border-b border-white/6">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate("./")}
            className="font-display text-xl text-surface-900 flex items-center gap-1"
          >
            Ikinamba<span className="text-primary-500">.</span>
          </button>
          <Badge variant="info" className="ml-1">
            Admin
          </Badge>
          <div className="flex gap-1 ml-8 bg-surface-800/50 rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(t.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === t.path ? "bg-primary-500 text-surface-900" : "text-surface-400 hover:text-surface-500"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium">
              AD
            </div>
          </div>
        </div>
      </div>

      <div className="w-fullmx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
