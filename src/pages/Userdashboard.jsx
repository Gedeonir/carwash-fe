import { useState, useEffect, useCallback } from "react";
import { Card, Badge, Button } from "../components/UI";
import { Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/UseAuth";
import api from "../utils/api";
import { useBookingStore } from "../utils/bookingStore";

// ── Status config ─────────────────────────────────────────
const STATUS_CONFIG = {
  confirmed:    { label: "Confirmed",   variant: "info",    progress: 10 },
  assigned:     { label: "Assigned",    variant: "info",    progress: 25 },
  heading:      { label: "En Route",    variant: "warning", progress: 45 },
  arrived:      { label: "Arrived",     variant: "warning", progress: 65 },
  "in-progress":{ label: "In Progress", variant: "primary", progress: 80 },
  completed:    { label: "Completed",   variant: "success", progress: 100 },
  cancelled:    { label: "Cancelled",   variant: "error",   progress: 0 },
};

const ACTIVE_STATUSES = ["confirmed", "assigned", "heading", "arrived", "in-progress"];

const TIPS = [
  { icon: "🌿", title: "Waterless formula",  body: "Our products use up to 95% less water than traditional washes." },
  { icon: <Timer size={22} color="#5A5A5A" />, title: "Book 24h ahead", body: "Get your preferred time slot by booking a day in advance." },
  { icon: "🎁", title: "Refer & earn",       body: "Share your code — you both get 2,000 RWF when they book." },
];

// ── Skeleton components ───────────────────────────────────
function ActiveBookingSkeleton() {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-3xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-20 h-5 bg-surface-200 rounded-full" />
        <div className="w-16 h-4 bg-surface-200 rounded" />
      </div>
      <div className="h-5 bg-surface-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-surface-200 rounded w-1/3 mb-5" />
      <div className="h-2 bg-surface-200 rounded-full mb-5" />
      <div className="h-12 bg-surface-200 rounded-2xl" />
    </div>
  );
}

function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-surface-50 border border-surface-200 rounded-2xl p-4 animate-pulse h-28" />
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-surface-50 border border-surface-200 rounded-2xl p-4 animate-pulse h-20" />
      ))}
    </div>
  );
}

function HistorySkeleton() {
  return (
    <Card className="divide-y divide-surface-100">
      {[1,2,3].map(i => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
          <div className="w-9 h-9 rounded-xl bg-surface-200 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-surface-200 rounded w-1/2" />
            <div className="h-3 bg-surface-200 rounded w-1/3" />
          </div>
          <div className="text-right space-y-1.5">
            <div className="h-3.5 bg-surface-200 rounded w-12" />
            <div className="h-3 bg-surface-200 rounded w-8" />
          </div>
        </div>
      ))}
    </Card>
  );
}

// ── Main component ────────────────────────────────────────
export default function DashboardPage() {
  const navigate  = useNavigate();
  const { user, getServices } = useAuth();

  const firstName = (user?.name || user?.email || "there").split(" ")[0].split("@")[0];
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // ── State ──────────────────────────────────────────────
  const [activeBooking,  setActiveBooking]  = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [services,       setServices]       = useState([]);
  const [stats,          setStats]          = useState({ totalWashes: 0, totalSpent: 0, avgRating: null });
  const [loyaltyWashes,  setLoyaltyWashes]  = useState(0);

  const [loadingActive,  setLoadingActive]  = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingServices,setLoadingServices]= useState(true);

  const [errorHistory,setErrorHistory]=useState(null)

  // ── Fetch active booking ───────────────────────────────
  const fetchActiveBooking = useCallback(async () => {
    try {
      const res = await api.get("/bookings?limit=20");
      const all = res.data?.data || [];
      const active = all.find(b => ACTIVE_STATUSES.includes(b.status)) || null;
      setActiveBooking(active);
    } catch (_) {
      setActiveBooking(null);
    } finally {
      setLoadingActive(false);
    }
  }, []);

  const {fetchHistory} =useAuth()

  // ── Fetch booking history + stats ─────────────────────
  const handleFetchHistory = async () => {
    try {
      const history = await fetchHistory();
      const all = history || [];

      const completed = all.filter(b => b.status === "completed");
      const recent    = completed.slice(0, 3);

      const totalSpent = completed.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      // Average rating from reviews — only completed bookings that have a review rating
      // (we use booking data; full review fetch would be separate)
      const rated   = completed.filter(b => b.review?.rating);
      const avgRating = rated.length
        ? (rated.reduce((sum, b) => sum + b.review.rating, 0) / rated.length).toFixed(1)
        : null;

      setRecentBookings(recent);
      setLoyaltyWashes(completed.length);
      setStats({
        totalWashes: completed.length,
        totalSpent,
        avgRating,
      });
    } catch (_) {
      setRecentBookings([]);
      setErrorHistory("Failed to load packages. Please try again.");
    } finally {
      setLoadingHistory(false);
    }
  };

  // ── Fetch services for quick book ─────────────────────
  const fetchServices = useCallback(async () => {
    try {
      const result = await getServices();
      if (!result?.error) {
        setServices((result || []).slice(0, 3));
      }
    } catch (_) {
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, [getServices]);

  useEffect(() => {
    fetchActiveBooking();
    handleFetchHistory();
    fetchServices();
  }, []); // eslint-disable-line

  // Poll active booking every 20s if one exists and is in-flight
  useEffect(() => {
    if (!activeBooking || activeBooking.status === "completed") return;
    const t = setInterval(fetchActiveBooking, 20000);
    return () => clearInterval(t);
  }, [activeBooking, fetchActiveBooking]);

  // ── Loyalty progress ───────────────────────────────────
  const GOLD_THRESHOLD   = 10;
  const washesLeft       = Math.max(0, GOLD_THRESHOLD - loyaltyWashes);
  const loyaltyPct       = Math.min(loyaltyWashes, GOLD_THRESHOLD);
  const tier             = user?.loyaltyTier || (loyaltyWashes >= 20 ? "gold" : loyaltyWashes >= 10 ? "silver" : "bronze");
  const tierBadge        = { bronze: "warning", silver: "accent", gold: "primary", platinum: "info" }[tier] || "primary";


  const updateBooking = useBookingStore((state) => state.updateBooking);
    const resetBooking = useBookingStore((state) => state.resetBooking);

  const handleBook = useCallback(
      (service) => {
        resetBooking();
        updateBooking({ service });
        navigate("/booking", {
          state: {
            selected: service._id,
          },
        });
      },
      [navigate],
    );
  // ── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-100 pb-28">
      <NavBar />

      <div className="mx-auto px-5 py-6 space-y-6">

        {/* ── GREETING ── */}
        <div className="flex justify-start gap-2 flex-wrap">
          <p className="text-surface-500 text-3xl">{greeting},</p>
          <h1 className="font-display text-3xl text-surface-900 capitalize">{firstName} 👋</h1>
        </div>

        {/* ── ACTIVE BOOKING CARD ── */}
        {loadingActive ? (
          <ActiveBookingSkeleton />
        ) : activeBooking ? (
          <div className="relative bg-surface-50 border border-surface-300 rounded-3xl p-5 overflow-hidden">

            <div className="flex items-start justify-between mb-4 relative z-10">
              <Badge variant={STATUS_CONFIG[activeBooking.status]?.variant || "info"}>
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block animate-pulse mr-1" />
                {STATUS_CONFIG[activeBooking.status]?.label || activeBooking.status}
              </Badge>
              <button
                onClick={() => navigate("/tracking", { state: { bookingId: activeBooking._id } })}
                className="text-xs text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1 transition-colors"
              >
                Track live
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            <div className="relative z-10 mb-4">
              <h3 className="font-display text-xl text-surface-900 mb-0.5">{activeBooking.service?.name}</h3>
              <p className="text-surface-500 text-sm">
                {new Date(activeBooking.scheduledDate).toLocaleDateString()} · {activeBooking.scheduledTime}
              </p>
            </div>

            {/* Progress bar */}
            <div className="relative z-10 mb-4">
              <div className="flex justify-between text-xs text-surface-500 mb-2">
                <span>Booked</span><span>En Route</span><span>Arrived</span><span>Done</span>
              </div>
              <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${STATUS_CONFIG[activeBooking.status]?.progress || 10}%` }}
                />
              </div>
            </div>

            {/* Washer row */}
            {activeBooking.washer ? (
              <div className="relative z-10 flex items-center justify-between bg-surface-100 rounded-2xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center font-display text-primary-600 text-xs font-medium">
                    {(activeBooking.washer.name || "").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-surface-900">{activeBooking.washer.name}</div>
                    <div className="text-xs text-surface-500">⭐ {activeBooking.washer.rating}</div>
                  </div>
                </div>
                {activeBooking.washer.phone && (
                  <a
                    href={`tel:${activeBooking.washer.phone}`}
                    className="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center hover:bg-primary-500/15 hover:text-primary-600 text-surface-500 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.73-.73a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </a>
                )}
              </div>
            ) : (
              <div className="relative z-10 bg-surface-100 rounded-2xl p-3 text-center">
                <p className="text-xs text-surface-400">Washer not yet assigned — we're on it!</p>
              </div>
            )}
          </div>
        ) : (
          /* No active booking */
          <div className="bg-surface-50 border border-dashed border-surface-300 rounded-3xl p-6 text-center">
            <p className="text-surface-500 text-sm mb-3">No active booking right now</p>
            <Button size="sm" onClick={() => navigate("/booking")}>+ Book a Wash</Button>
          </div>
        )}

        {/* ── QUICK BOOK ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-surface-900">Book again</h2>
            <button
              onClick={() => navigate("/our-services")}
              className="text-xs text-primary-600 hover:text-primary-500 transition-colors font-medium"
            >
              See all →
            </button>
          </div>

          {loadingServices ? (
            <ServicesSkeleton />
          ) : services.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Basics",    price: "5,000",  icon: "💧", time: "45 min", slug: "basic-wash" },
                { label: "Standard", price: "10,000", icon: "✨", time: "60 min", slug: "standard-wash" },
                { label: "Premium",  price: "18,000", icon: "🏆", time: "90 min", slug: "premium-detail" },
              ].map(s => (
                <button
                  key={s.slug}
                  onClick={() => navigate("/booking", { state: { preselect: s.slug } })}
                  className="bg-surface-50 border border-surface-200 hover:border-primary-500/40 hover:bg-primary-500/5 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-sm font-medium text-surface-900 mb-0.5">{s.label}</div>
                  <div className="text-xs text-surface-500 mb-1">{s.time}</div>
                  <div className="text-xs font-display text-primary-600">{s.price} <span className="text-surface-400 font-sans">RWF</span></div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {services.map(s => (
                <button
                  key={s._id}
                  onClick={() => handleBook(s)}
                  className="bg-surface-50 border border-surface-200 hover:border-primary-500/40 hover:bg-primary-500/5 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <div className="flex items-start gap-4">
                        <span className="text-3xl">{s.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display text-lg text-surface-900">
                              {s.name}
                            </h3>
                            <span className="text-xs text-surface-500">
                              · {s.time}
                            </span>
                          </div>
                          <p className="text-sm text-surface-400 mb-3">
                            {s.desc}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {s.includes.slice(0, 3).map((inc) => (
                              <span
                                key={inc}
                                className="text-xs bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5 text-surface-300"
                              >
                                {inc}
                              </span>
                            ))}
                            {s.includes.length > 3 && (
                              <span className="text-xs text-surface-500">
                                +{s.includes.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="font-display text-xl text-primary-600">
                            {s.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-surface-400">RWF</div>
                        </div>
                      </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── STATS ROW ── */}
        {loadingHistory ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Total washes",  stats.totalWashes,                                            "🚗"],
              ["Total spent",   stats.totalSpent > 0 ? `${Math.round(stats.totalSpent/1000)}k RWF` : "0 RWF", "💰"],
              ["Avg rating",    stats.avgRating   ? `${stats.avgRating} ★`  : "—",            "⭐"],
            ].map(([label, value, icon]) => (
              <Card key={label} className="p-4 text-center">
                <div className="text-xl mb-1">{icon}</div>
                <div className="font-display text-base text-surface-900 leading-tight">{value}</div>
                <div className="text-xs text-surface-500 mt-0.5 leading-tight">{label}</div>
              </Card>
            ))}
          </div>
        )}

        {/* ── RECENT HISTORY ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-surface-900">Recent washes</h2>
            <button
              onClick={() => navigate("/profile")}
              className="text-xs text-primary-600 hover:text-primary-500 transition-colors font-medium"
            >
              View all →
            </button>
          </div>

          {loadingHistory ? (
            <HistorySkeleton />
          ) : recentBookings.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-surface-400 text-sm">No completed washes yet.</p>
              <button onClick={() => navigate("/booking")} className="text-xs text-primary-600 hover:text-primary-500 mt-2 block">Book your first wash →</button>
            </Card>
          ) : (
            <Card className="divide-y divide-surface-100">
              {recentBookings.map((b, i) => (
                <div key={b._id || i} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5C542" strokeWidth="2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-surface-900 truncate">{b.service?.name}</div>
                    <div className="text-xs text-surface-500">
                      {new Date(b.scheduledDate).toLocaleDateString([], { day: "numeric", month: "short" })}
                      {b.review?.rating && ` · ${"★".repeat(b.review.rating)}`}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-display text-primary-600">{(b.totalAmount || 0).toLocaleString()}</div>
                    <div className="text-xs text-surface-500">RWF</div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* ── LOYALTY CARD ── */}
        <div className="relative bg-gradient-to-br from-surface-800 to-surface-900 border border-primary-500/20 rounded-3xl p-5 overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary-500/8 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-surface-400 mb-0.5">Loyalty progress</p>
                {washesLeft > 0 ? (
                  <h3 className="font-display text-base text-white capitalize">
                    {washesLeft} more wash{washesLeft !== 1 ? "es" : ""} to {tier === "bronze" ? "Silver" : tier === "silver" ? "Gold" : "Platinum"} 🥇
                  </h3>
                ) : (
                  <h3 className="font-display text-base text-white capitalize">
                    You've reached {tier}! 🎉
                  </h3>
                )}
              </div>
              <Badge variant={tierBadge} className="capitalize">{tier}</Badge>
            </div>
            <div className="flex gap-2 mb-3">
              {Array.from({ length: GOLD_THRESHOLD }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all ${i < loyaltyPct ? "bg-primary-500" : "bg-surface-700"}`}
                />
              ))}
            </div>
            <p className="text-xs text-surface-400">
              {loyaltyWashes} / {GOLD_THRESHOLD} washes · {tier === "bronze" ? "Silver" : "Gold"} unlocks 15% off every booking
            </p>
          </div>
        </div>

        {/* ── TIPS ── */}
        <div>
          <h2 className="font-display text-lg text-surface-900 mb-3">Good to know</h2>
          <div className="flex flex-col gap-3">
            {TIPS.map(tip => (
              <div
                key={tip.title}
                className="flex items-start gap-4 bg-surface-50 border border-surface-200 rounded-2xl px-4 py-4"
              >
                <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <div className="text-sm font-medium text-surface-900 mb-0.5">{tip.title}</div>
                  <div className="text-xs text-surface-500 leading-relaxed">{tip.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/tracking", activeBooking ? { state: { bookingId: activeBooking._id } } : {})}
            className="bg-surface-50 border border-surface-200 hover:border-primary-500/30 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C542" strokeWidth="2" strokeLinecap="round" className="mb-2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div className="text-sm font-medium text-surface-900 mb-0.5">Track wash</div>
            <div className="text-xs text-surface-500">Live status updates</div>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-surface-50 border border-surface-200 hover:border-primary-500/30 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C542" strokeWidth="2" strokeLinecap="round" className="mb-2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <div className="text-sm font-medium text-surface-900 mb-0.5">My profile</div>
            <div className="text-xs text-surface-500">Cars, history, settings</div>
          </button>
        </div>

      </div>
    </div>
  );
}