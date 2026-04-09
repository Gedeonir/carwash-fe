import React from "react";
import { Button, StatCard, Badge, Card } from "../../components/UI";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/car_wash_logo.png";

const BOOKINGS = [
  {
    id: "IK-001",
    customer: "Amira Kagabo",
    service: "Premium Detail",
    time: "09:00",
    location: "Kimihurura",
    status: "in-progress",
    washer: "Jean N.",
    amount: 18000,
  },
  {
    id: "IK-002",
    customer: "James Mukuralinda",
    service: "Standard",
    time: "10:30",
    location: "Kiyovu",
    status: "heading",
    washer: "Pascal M.",
    amount: 10000,
  },
  {
    id: "IK-003",
    customer: "Claudine Uwera",
    service: "Basic Wash",
    time: "11:00",
    location: "Remera",
    status: "confirmed",
    washer: "Eric K.",
    amount: 5000,
  },
  {
    id: "IK-004",
    customer: "David Bizimana",
    service: "Standard",
    time: "13:00",
    location: "Gisozi",
    status: "confirmed",
    washer: "Unassigned",
    amount: 10000,
  },
  {
    id: "IK-005",
    customer: "Marie Iradukunda",
    service: "Premium Detail",
    time: "14:30",
    location: "Nyamirambo",
    status: "completed",
    washer: "Jean N.",
    amount: 18000,
  },
  {
    id: "IK-006",
    customer: "Patrick Nsabimana",
    service: "Basic Wash",
    time: "15:00",
    location: "Kibagabaga",
    status: "completed",
    washer: "Pascal M.",
    amount: 5000,
  },
];

const WASHERS = [
  {
    name: "Jean Nkurunziza",
    status: "busy",
    rating: 4.9,
    jobs: 2,
    zone: "Kimihurura",
    avatar: "JN",
  },
  {
    name: "Pascal Mugisha",
    status: "heading",
    rating: 4.8,
    jobs: 1,
    zone: "Kiyovu",
    avatar: "PM",
  },
  {
    name: "Eric Kayumba",
    status: "available",
    rating: 4.7,
    jobs: 0,
    zone: "Remera",
    avatar: "EK",
  },
  {
    name: "Alice Mutoni",
    status: "available",
    rating: 4.9,
    jobs: 0,
    zone: "CBD",
    avatar: "AM",
  },
];

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", variant: "info" },
  heading: { label: "En Route", variant: "warning" },
  "in-progress": { label: "In Progress", variant: "primary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
};

const WASHER_STATUS = {
  available: "bg-success/15 text-success",
  busy: "bg-warning/15 text-warning",
  heading: "bg-info/15 text-info",
};

const Overview = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered =
    filterStatus === "all"
      ? BOOKINGS
      : BOOKINGS.filter((b) => b.status === filterStatus);
  const todayRevenue = BOOKINGS.filter((b) => b.status === "completed").reduce(
    (s, b) => s + b.amount,
    0,
  );
  const activeJobs = BOOKINGS.filter((b) =>
    ["in-progress", "heading"].includes(b.status),
  ).length;
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between justify-start gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-surface-900">
            Good morning, Admin 👋
          </h1>
          <p className="text-surface-400 text-sm mt-1">
            Here's what's happening today
          </p>
        </div>
        <Button size="sm" onClick={() => navigate("/admin/bookings")}>
          View all bookings →
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Today's Revenue"
          value={`${todayRevenue.toLocaleString()} RWF`}
          trend={12}
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
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <StatCard
          label="Active Jobs"
          value={activeJobs}
          trend={5}
          color="info"
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
          label="Total Bookings"
          value={BOOKINGS.length}
          trend={8}
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
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
        <StatCard
          label="Avg Rating"
          value="4.9 ★"
          trend={2}
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
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
        />
      </div>

      {/* Active bookings quick view */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-display text-base text-surface-900 mb-4">
            Active right now
          </h3>
          <div className="space-y-3">
            {BOOKINGS.filter((b) =>
              ["in-progress", "heading"].includes(b.status),
            ).map((b) => {
              const sc = STATUS_CONFIG[b.status];
              return (
                <div
                  key={b.id}
                  className="flex items-center gap-3 p-3 bg-surface-700/40 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-500/15 flex items-center justify-center text-primary-400 text-xs flex-shrink-0">
                    {b.customer
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-surface-900 truncate">
                      {b.customer}
                    </div>
                    <div className="text-xs text-surface-400">
                      {b.location} · {b.washer}
                    </div>
                  </div>
                  <Badge variant={sc.variant}>{sc.label}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-base text-white mb-4">
            Team status
          </h3>
          <div className="space-y-3">
            {WASHERS.map((w) => (
              <div key={w.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center font-medium text-primary-400 text-xs flex-shrink-0">
                  {w.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-surface-900">{w.name}</div>
                  <div className="text-xs text-surface-400">
                    {w.zone} · ⭐ {w.rating}
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${WASHER_STATUS[w.status]}`}
                >
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
