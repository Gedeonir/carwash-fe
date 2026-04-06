import React from "react";
import DashboardLayout from "./DashboardLayout";
import { BOOKINGS } from "../../utils/data";
import { Card, Badge, StatCard, Button, TopBar } from "../../components/UI";

const Analytics = () => {
  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl text-surface-900 mb-6">
        Reports & Analytics
      </h1>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Monthly Revenue"
          value="847,000 RWF"
          trend={18}
          color="primary"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          }
        />
        <StatCard
          label="Total Washes"
          value="341"
          trend={22}
          color="success"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
        <StatCard
          label="Repeat Customers"
          value="67%"
          trend={5}
          color="accent"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-display text-base text-white mb-4">
            Revenue by service
          </h3>
          {[
            ["Premium Detail", 18000, 45],
            ["Standard", 10000, 35],
            ["Basic Wash", 5000, 20],
          ].map(([name, price, pct]) => (
            <div key={name} className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-surface-500">{name}</span>
                <span className="text-surface-900">{pct}%</span>
              </div>
              <div className="h-2 bg-primary-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-base text-white mb-4">
            Popular zones
          </h3>
          {[
            ["Kimihurura", 28],
            ["Kiyovu", 22],
            ["Remera", 18],
            ["Nyamirambo", 15],
            ["Other", 17],
          ].map(([zone, pct]) => (
            <div key={zone} className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-surface-500">{zone}</span>
                <span className="text-surface-900">{pct}%</span>
              </div>
              <div className="h-2 bg-accent-500 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-400 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
