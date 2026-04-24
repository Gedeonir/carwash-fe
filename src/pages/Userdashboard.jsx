import { useState } from "react";
import { Card, Badge, Button } from "../components/UI";
import { Bell, Timer } from "lucide-react";
import logo from "../assets/car_wash_logo.png";
import NavBarClient from "../components/NavBarClient";

const UPCOMING = {
  service: "Standard Wash",
  date: "Today",
  time: "10:00 AM",
  location: "KG 9 Ave, Kimihurura",
  washer: "Jean N.",
  status: "confirmed",
  eta: "18 min",
};

const RECENT = [
  { service: "Premium Detail", date: "27 Mar", amount: 18000, rating: 5 },
  { service: "Standard Wash", date: "14 Mar", amount: 10000, rating: 5 },
  { service: "Basic Wash", date: "1 Mar", amount: 5000, rating: 4 },
];

const QUICK_SERVICES = [
  { id: "basic", label: "Basic", price: "5,000", icon: "💧", time: "45 min" },
  {
    id: "standard",
    label: "Standard",
    price: "10,000",
    icon: "✨",
    time: "60 min",
  },
  {
    id: "premium",
    label: "Premium",
    price: "18,000",
    icon: "🏆",
    time: "90 min",
  },
];

const TIPS = [
  {
    icon: "🌿",
    title: "Waterless formula",
    body: "Our products use up to 95% less water than traditional washes.",
  },
  {
    icon: <Timer color="#0A0A0A" />,
    title: "Book 24h ahead",
    body: "Get your preferred time slot by booking a day in advance.",
  },
  {
    icon: "🎁",
    title: "Refer & earn",
    body: "Share your code — you both get 2,000 RWF when they book.",
  },
];

export default function DashboardPage({ navigate, bookingData }) {
  const userName = bookingData?.user || "Amira";
  const firstName = userName.split(" ")[0].split("@")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [notifCount] = useState(2);

  return (
    <div className="min-h-screen bg-surface-100 pb-28">
      {/* ── HEADER ── */}
      <NavBarClient/>

      <div className="mx-auto px-5 py-6 space-y-6">
        {/* ── GREETING ── */}
        <div className="flex justify-start gap-4">
          <p className="text-surface-500 text-3xl">{greeting},</p>
          <h1 className="font-display text-3xl text-surface-900 capitalize">
            {firstName} 👋
          </h1>
        </div>

        {/* ── ACTIVE BOOKING CARD ── */}
        <div className="relative bg-surface-50 border border-surface-500/30 rounded-3xl p-5 overflow-hidden">
          {/* Yellow glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-surface-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <Badge variant="info">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block animate-pulse" />
                Confirmed
              </Badge>
            </div>
            <button
              onClick={() => navigate("tracking")}
              className="text-xs text-primary-600 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
            >
              Track live
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="relative z-10 mb-4">
            <h3 className="font-display text-xl text-surface-900 mb-0.5">
              {UPCOMING.service}
            </h3>
            <p className="text-surface-500 text-sm">
              {UPCOMING.date} · {UPCOMING.time}
            </p>
          </div>

          {/* Progress bar */}
          <div className="relative z-10 mb-4">
            <div className="flex justify-between text-xs text-surface-500 mb-2">
              <span>Booked</span>
              <span>En Route</span>
              <span>Arrived</span>
              <span>Done</span>
            </div>
            <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full w-1/4 transition-all" />
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between bg-surface-700/50 rounded-2xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-display text-primary-400 text-xs">
                JN
              </div>
              <div>
                <div className="text-sm font-medium text-surface-900">
                  Jean Nkurunziza
                </div>
                <div className="text-xs text-surface-500">
                  ⭐ 4.9 · ETA {UPCOMING.eta}
                </div>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-surface-600 flex items-center justify-center hover:bg-primary-500/20 hover:text-primary-400 text-surface-300 transition-all">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.73-.73a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── QUICK BOOK ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-surface-900">
              Book again
            </h2>
            <button
              onClick={() => navigate("services")}
              className="text-xs text-primary-600 hover:text-primary-300 transition-colors font-medium"
            >
              See all →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate("/booking", { preselect: s.id })}
                className="bg-surface-50 border border-white/8 hover:border-primary-500/40 hover:bg-primary-100 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 group active:scale-[0.97]"
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-sm font-medium text-surface-900 mb-0.5">
                  {s.label}
                </div>
                <div className="text-xs text-surface-500 mb-1">{s.time}</div>
                <div className="text-xs font-display text-primary-600">
                  {s.price}{" "}
                  <span className="text-surface-500 font-sans">RWF</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Total wash sessions", "12", "🚗"],
            ["Total spent", "143k RWF", "💰"],
            ["Avg rating", "4.9 ★", "⭐"],
          ].map(([label, value, icon]) => (
            <Card key={label} className="p-4 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="font-display text-base text-surface-900 leading-tight">
                {value}
              </div>
              <div className="text-xs text-surface-500 mt-0.5 leading-tight">
                {label}
              </div>
            </Card>
          ))}
        </div>

        {/* ── RECENT HISTORY ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-surface-900">
              Recent washes
            </h2>
            <button
              onClick={() => navigate("/profile")}
              className="text-xs text-primary-600 hover:text-primary-300 transition-colors font-medium"
            >
              View all →
            </button>
          </div>
          <Card className="divide-y divide-white/6">
            {RECENT.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F5C542"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-surface-900 truncate">
                    {r.service}
                  </div>
                  <div className="text-xs text-surface-500">
                    {r.date} · {"★".repeat(r.rating)}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-display text-primary-600">
                    {r.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-surface-500">RWF</div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* ── LOYALTY CARD ── */}
        <div className="relative bg-gradient-to-br from-surface-800 to-surface-900 border border-primary-500/20 rounded-3xl p-5 overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary-500/8 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-surface-400 mb-0.5">
                  Loyalty progress
                </p>
                <h3 className="font-display text-base text-white">
                  3 more washes to Gold 🥇
                </h3>
              </div>
              <Badge variant="primary">Silver</Badge>
            </div>
            <div className="flex gap-2 mb-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    i < 7 ? "bg-primary-500" : "bg-surface-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-surface-400">
              7 / 10 washes · Gold unlocks 15% off every booking
            </p>
          </div>
        </div>

        {/* ── TIPS / PROMOS ── */}
        <div>
          <h2 className="font-display text-lg text-surface-900 mb-3">
            Good to know
          </h2>
          <div className="flex flex-col gap-3">
            {TIPS.map((tip) => (
              <div
                key={tip.title}
                className="flex items-start gap-4 bg-surface-50 border border-white/6 rounded-2xl px-4 py-4"
              >
                <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <div className="text-sm font-medium text-surface-900 mb-0.5">
                    {tip.title}
                  </div>
                  <div className="text-xs text-surface-500 leading-relaxed">
                    {tip.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/tracking")}
            className="bg-surface-50 border border-white/8 hover:border-primary-500/30 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F5C542"
              strokeWidth="2"
              strokeLinecap="round"
              className="mb-2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div className="text-sm font-medium text-surface-900 mb-0.5">
              Track wash
            </div>
            <div className="text-xs text-surface-500">Live status updates</div>
          </button>
          <button
            onClick={() => navigate("profile")}
            className="bg-surface-50 border border-white/8 hover:border-primary-500/30 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F5C542"
              strokeWidth="2"
              strokeLinecap="round"
              className="mb-2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <div className="text-sm font-medium text-surface-900 mb-0.5">
              My profile
            </div>
            <div className="text-xs text-surface-500">
              Cars, history, settings
            </div>
          </button>
        </div>
      </div>

      {/* ── BOTTOM CTA (no bottom nav overlap) ── */}
      <div className="fixed bottom-4 right-0 z-30 bg-surface-900/95 backdrop-blur-md border-t border-white/6 px-5 pt-3 pb-[calc(72px+env(safe-area-inset-bottom,0px))]">
        <Button
          className="w-full h-12 shadow-md animate-bounce"
          onClick={() => navigate("booking")}
        >
          + Book a New Wash
        </Button>
      </div>
    </div>
  );
}
