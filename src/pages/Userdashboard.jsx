import { useState, useEffect, useCallback, useRef } from "react";
import { Card, Badge, Button } from "../components/UI";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/UseAuth";
import api from "../utils/api";
import Footer from "../components/Footer";

// ─────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  confirmed:     { label: "Confirmed",   variant: "info",    progress: 10 },
  assigned:      { label: "Assigned",    variant: "info",    progress: 25 },
  heading:       { label: "En Route",    variant: "warning", progress: 45 },
  arrived:       { label: "Arrived",     variant: "warning", progress: 65 },
  "in-progress": { label: "In Progress", variant: "primary", progress: 80 },
  completed:     { label: "Completed",   variant: "success", progress: 100 },
  cancelled:     { label: "Cancelled",   variant: "error",   progress: 0 },
};

const ACTIVE_STATUSES = ["confirmed", "assigned", "heading", "arrived", "in-progress"];

const LOYALTY_TIERS = {
  bronze:   { next: "silver",   threshold: 10,  discount: "10%", badge: "warning" },
  silver:   { next: "gold",     threshold: 25,  discount: "15%", badge: "accent" },
  gold:     { next: "platinum", threshold: 50,  discount: "20%", badge: "primary" },
  platinum: { next: null,       threshold: null, discount: "25%", badge: "info" },
};

const TIPS = [
  { icon: "🌿", title: "Waterless formula",  body: "Our products use up to 95% less water than traditional washes." },
  { icon: "⏱",  title: "Book 24h ahead",    body: "Get your preferred time slot by booking a day in advance." },
  { icon: "🎁",  title: "Refer & earn",      body: "Share your referral code — you both get 2,000 RWF when they book." },
];

// ─────────────────────────────────────────────────────────
// SKELETON COMPONENTS
// ─────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`bg-surface-200 rounded-xl animate-pulse ${className}`} />;
}

function ActiveBookingSkeleton() {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-3xl p-5 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <Skeleton className="w-24 h-5 rounded-full" />
        <Skeleton className="w-16 h-4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-48 h-5" />
        <Skeleton className="w-32 h-4" />
      </div>
      <Skeleton className="w-full h-2 rounded-full" />
      <Skeleton className="w-full h-12 rounded-2xl" />
    </div>
  );
}

function ServiceCardSkeleton() {
  return <Skeleton className="h-32 rounded-2xl" />;
}

function StatCardSkeleton() {
  return <Skeleton className="h-20 rounded-2xl" />;
}

function HistoryRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
      <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-1/2 h-3.5" />
        <Skeleton className="w-1/3 h-3" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-12 h-3.5" />
        <Skeleton className="w-8 h-3" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ACTIVE BOOKING CARD
// ─────────────────────────────────────────────────────────
function ActiveBookingCard({ booking, onNavigateTracking }) {
  const cfg     = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed;
  const washer  = booking.washer;
  const service = booking.service;
  const isLive  = ["heading", "arrived", "in-progress"].includes(booking.status);

  return (
    <div className={`relative rounded-3xl p-5 overflow-hidden border-2 transition-all ${
      isLive
        ? "border-primary-500/40 bg-gradient-to-br from-primary-500/8 to-primary-500/3"
        : "border-surface-200 bg-surface-50"
    }`}>
      {/* Glow for live jobs */}
      {isLive && (
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-500/15 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Top row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <Badge variant={cfg.variant}>
          <span className={`w-1.5 h-1.5 rounded-full bg-current inline-block mr-1 ${isLive ? "animate-pulse" : ""}`} />
          {cfg.label}
        </Badge>
        <button
          onClick={() => onNavigateTracking(booking._id)}
          className="text-xs text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1 transition-colors"
        >
          Track live
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Service + date */}
      <div className="relative z-10 mb-4">
        <h3 className="font-display text-xl text-surface-900 mb-0.5">{service?.name}</h3>
        <p className="text-surface-500 text-sm">
          {new Date(booking.scheduledDate).toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
          {" · "}{booking.scheduledTime}
          {service?.durationMinutes && ` · ~${service.durationMinutes} min`}
        </p>
        <p className="text-xs text-surface-400 mt-1 truncate">
          📍 {booking.location?.address}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mb-4">
        <div className="flex justify-between text-xs text-surface-400 mb-2">
          <span>Booked</span><span>En Route</span><span>Arrived</span><span>Done</span>
        </div>
        <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-700"
            style={{ width: `${cfg.progress}%` }}
          />
        </div>
      </div>

      {/* Washer row */}
      <div className="relative z-10">
        {washer ? (
          <div className="flex items-center justify-between bg-white/70 rounded-2xl p-3 border border-surface-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/15 flex items-center justify-center font-semibold text-primary-700 text-xs flex-shrink-0">
                {washer.name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-surface-900">{washer.name}</div>
                <div className="text-xs text-surface-400">
                  {washer.rating > 0 ? `⭐ ${washer.rating}` : "New washer"} · {washer.zone || "Kigali"}
                </div>
              </div>
            </div>
            {washer.phone && (
              <a
                href={`tel:${washer.phone}`}
                className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors shadow-sm"
                title="Call washer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.73-.73a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </a>
            )}
          </div>
        ) : (
          <div className="bg-warning/8 border border-warning/20 rounded-2xl p-3 text-center">
            <p className="text-xs text-warning font-medium">⏳ Assigning your washer — usually within a few minutes</p>
          </div>
        )}
      </div>

      {/* Add-ons if any */}
      {(booking.addOns || []).length > 0 && (
        <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
          {booking.addOns.map(a => (
            <span key={a.name} className="text-xs bg-primary-500/8 border border-primary-500/20 text-primary-700 rounded-full px-2.5 py-0.5">
              {a.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SERVICE QUICK BOOK CARD
// ─────────────────────────────────────────────────────────
function ServiceCard({ service, onClick }) {
  return (
    <button
      onClick={() => onClick(service)}
      className="bg-surface-50 border-2 border-surface-200 hover:border-primary-500/50 hover:bg-primary-500/4 rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] group"
    >
      <div className="text-2xl mb-3">{service.icon || "💧"}</div>
      <div className="text-sm font-semibold text-surface-900 mb-0.5 truncate">{service.name}</div>
      <div className="text-xs text-surface-400 mb-2">{service.durationMinutes} min</div>
      <div className="font-display text-sm text-primary-600 group-hover:text-primary-500 transition-colors">
        {service.price.toLocaleString()} <span className="font-sans text-surface-400 text-xs">RWF</span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// LOYALTY CARD
// ─────────────────────────────────────────────────────────
function LoyaltyCard({ loyaltyPoints, loyaltyTier, completedWashes }) {
  const tier     = loyaltyTier || "bronze";
  const tierInfo = LOYALTY_TIERS[tier] || LOYALTY_TIERS.bronze;
  const tierBadge = tierInfo.badge;

  // Progress within current tier
  const TIER_THRESHOLDS = { bronze: 0, silver: 10, gold: 25, platinum: 50 };
  const currentMin  = TIER_THRESHOLDS[tier] || 0;
  const nextMin     = tierInfo.threshold || currentMin + 10;
  const progress    = Math.min(completedWashes - currentMin, nextMin - currentMin);
  const pct         = tierInfo.next ? Math.round((progress / (nextMin - currentMin)) * 100) : 100;
  const washesLeft  = tierInfo.next ? Math.max(0, nextMin - completedWashes) : 0;

  return (
    <div className="relative bg-gradient-to-br from-surface-800 to-surface-900 border border-primary-500/20 rounded-3xl p-5 overflow-hidden">
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary-500/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary-500/5 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-surface-400 mb-1">Loyalty program</p>
            {washesLeft > 0 ? (
              <h3 className="font-display text-base text-white">
                {washesLeft} more wash{washesLeft !== 1 ? "es" : ""} to{" "}
                <span className="text-primary-400 capitalize">{tierInfo.next}</span> 🥇
              </h3>
            ) : (
              <h3 className="font-display text-base text-white capitalize">
                {tier === "platinum" ? "Maximum tier reached! 🎉" : `${tier} member 🎉`}
              </h3>
            )}
          </div>
          <Badge variant={tierBadge} className="capitalize flex-shrink-0">{tier}</Badge>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-surface-400 mb-1.5">
            <span>{completedWashes} washes</span>
            {tierInfo.next && <span>{nextMin} for {tierInfo.next}</span>}
          </div>
          <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Perks row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { tier: "silver",   label: "Silver",   pts: "10 washes",  perk: "10% off" },
            { tier: "gold",     label: "Gold",      pts: "25 washes",  perk: "15% off" },
            { tier: "platinum", label: "Platinum",  pts: "50 washes",  perk: "25% off" },
          ].map(p => {
            const unlocked = TIER_THRESHOLDS[p.tier] <= completedWashes;
            return (
              <div key={p.tier} className={`rounded-xl p-2.5 text-center transition-all ${unlocked ? "bg-primary-500/15 border border-primary-500/25" : "bg-surface-700/50"}`}>
                <div className={`text-xs font-semibold capitalize mb-0.5 ${unlocked ? "text-primary-400" : "text-surface-500"}`}>{p.label}</div>
                <div className={`text-xs font-bold ${unlocked ? "text-white" : "text-surface-600"}`}>{p.perk}</div>
                <div className={`text-[10px] mt-0.5 ${unlocked ? "text-surface-400" : "text-surface-600"}`}>{p.pts}</div>
                {unlocked && <div className="text-primary-400 text-[10px] mt-0.5">✓ Unlocked</div>}
              </div>
            );
          })}
        </div>

        {/* Points */}
        <p className="text-xs text-surface-500 mt-3 text-center">
          {loyaltyPoints} loyalty points · Earn 10 pts per wash
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate    = useNavigate();
  const { user, getServices } = useAuth();

  const firstName = (user?.name || user?.email || "there").split(" ")[0].split("@")[0];
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // ── State ─────────────────────────────────────────────
  const [activeBooking,   setActiveBooking]   = useState(null);
  const [recentBookings,  setRecentBookings]  = useState([]);
  const [services,        setServices]        = useState([]);
  const [stats,           setStats]           = useState({ totalWashes: 0, totalSpent: 0, avgRating: null });
  const [completedWashes, setCompletedWashes] = useState(0);

  const [loadingActive,   setLoadingActive]   = useState(true);
  const [loadingHistory,  setLoadingHistory]  = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [historyError,    setHistoryError]    = useState(null);

  const pollRef = useRef(null);

  // ── Fetch: active booking ─────────────────────────────
  const fetchActiveBooking = useCallback(async () => {
    try {
      const res = await api.get("/bookings?limit=20&status=");
      const all = res.data?.data || [];
      const active = all.find(b => ACTIVE_STATUSES.includes(b.status)) || null;
      setActiveBooking(active);
    } catch (_) {
      setActiveBooking(null);
    } finally {
      setLoadingActive(false);
    }
  }, []);

  // ── Fetch: history + stats ─────────────────────────────
  const fetchHistory = useCallback(async () => {
    setHistoryError(null);
    try {
      const res  = await api.get("/bookings?limit=50");
      const all  = res.data?.data || [];

      const completed   = all.filter(b => b.status === "completed");
      const totalSpent  = completed.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const rated       = completed.filter(b => b.review?.rating);
      const avgRating   = rated.length
        ? (rated.reduce((s, b) => s + b.review.rating, 0) / rated.length).toFixed(1)
        : null;

      setRecentBookings(completed.slice(0, 3));
      setCompletedWashes(completed.length);
      setStats({ totalWashes: completed.length, totalSpent, avgRating });
    } catch (_) {
      setHistoryError("Couldn't load your wash history.");
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // ── Fetch: services ────────────────────────────────────
  const fetchServices = useCallback(async () => {
    try {
      const result = await getServices();
      if (!result?.error) setServices((result || []).slice(0, 3));
    } catch (_) {
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, [getServices]);

  // ── Mount ──────────────────────────────────────────────
  useEffect(() => {
    fetchActiveBooking();
    fetchHistory();
    fetchServices();
  }, []); // eslint-disable-line

  // ── Poll active booking every 20s while in-flight ─────
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (activeBooking && ACTIVE_STATUSES.includes(activeBooking.status)) {
      pollRef.current = setInterval(fetchActiveBooking, 20000);
    }
    return () => clearInterval(pollRef.current);
  }, [activeBooking?.status, fetchActiveBooking]);

  // ── Navigate to tracking ───────────────────────────────
  const goToTracking = useCallback((bookingId) => {
    navigate(`/booking/tracking/${bookingId}`, { state: { bookingId } });
  }, [navigate]);

  // ── Quick book a service ───────────────────────────────
  const handleQuickBook = useCallback((service) => {
    navigate("/booking", { state: { selected: service._id } });
  }, [navigate]);

  // ── Loyalty data ───────────────────────────────────────
  const loyaltyPoints = user?.loyaltyPoints || 0;
  const loyaltyTier   = user?.loyaltyTier   || "bronze";

  // ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-100">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 md:px-5 py-6 mt-20 space-y-6">

        {/* ── GREETING ── */}
        <div className="flex gap-3 mb-6 text-lg">
          <p className="text-surface-400">{greeting},</p>
          <h1 className="font-display text-surface-900 capitalize">
            {firstName} 👋
          </h1>
        </div>

        {/* ── ACTIVE BOOKING ── */}
        <section>
          {loadingActive ? (
            <ActiveBookingSkeleton />
          ) : activeBooking ? (
            <ActiveBookingCard booking={activeBooking} onNavigateTracking={goToTracking} />
          ) : (
            <div className="bg-surface-50 border-2 border-dashed border-surface-300 rounded-3xl p-6 text-center">
              <div className="text-4xl mb-3">🚗</div>
              <p className="text-surface-600 font-medium mb-1">No active booking</p>
              <p className="text-surface-400 text-sm mb-4">Book a wash and we'll come to you</p>
              <Button size="sm" onClick={() => navigate("/booking")}>+ Book a Wash</Button>
            </div>
          )}
        </section>

        {/* ── QUICK BOOK ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-surface-900">Quick book</h2>
            <button
              onClick={() => navigate("/our-services")}
              className="text-xs text-primary-600 hover:text-primary-500 transition-colors font-medium"
            >
              All services →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {loadingServices
              ? [1,2,3].map(i => <ServiceCardSkeleton key={i} />)
              : services.length > 0
              ? services.map(s => <ServiceCard key={s._id} service={s} onClick={handleQuickBook} />)
              : [
                  { _id: "b", name: "Basic",    icon: "💧", durationMinutes: 45, price: 5000 },
                  { _id: "s", name: "Standard", icon: "✨", durationMinutes: 60, price: 10000 },
                  { _id: "p", name: "Premium",  icon: "🏆", durationMinutes: 90, price: 18000 },
                ].map(s => <ServiceCard key={s._id} service={s} onClick={() => navigate("/booking")} />)
            }
          </div>
        </section>

        {/* ── STATS ── */}
        <section>
          {loadingHistory ? (
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3].map(i => <StatCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total washes",  value: stats.totalWashes, icon: "🚗", color: "text-surface-900" },
                { label: "Total spent",   value: stats.totalSpent > 0 ? `${Math.round(stats.totalSpent/1000)}k RWF` : "0 RWF", icon: "💰", color: "text-primary-600" },
                { label: "Avg rating",    value: stats.avgRating ? `${stats.avgRating} ★` : "—", icon: "⭐", color: "text-surface-900" },
              ].map(({ label, value, icon, color }) => (
                <Card key={label} className="p-4 text-center bg-white">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className={`font-display text-base leading-tight ${color}`}>{value}</div>
                  <div className="text-xs text-surface-400 mt-0.5 leading-tight">{label}</div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── RECENT HISTORY ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-surface-900">Recent washes</h2>
            <button
              onClick={() => navigate("/booking-history")}
              className="text-xs text-primary-600 hover:text-primary-500 transition-colors font-medium"
            >
              View all →
            </button>
          </div>

          {loadingHistory ? (
            <Card className="divide-y divide-surface-100 bg-white">
              {[1,2,3].map(i => <HistoryRowSkeleton key={i} />)}
            </Card>
          ) : historyError ? (
            <Card className="p-5 text-center bg-white">
              <p className="text-surface-400 text-sm mb-3">{historyError}</p>
              <button onClick={fetchHistory} className="text-xs text-primary-600 underline">Retry</button>
            </Card>
          ) : recentBookings.length === 0 ? (
            <Card className="p-6 text-center bg-white">
              <p className="text-surface-400 text-sm mb-3">No completed washes yet</p>
              <button
                onClick={() => navigate("/booking")}
                className="text-xs text-primary-600 hover:text-primary-500 font-medium"
              >
                Book your first wash →
              </button>
            </Card>
          ) : (
            <Card className="divide-y divide-surface-100 bg-white overflow-hidden">
              {recentBookings.map((b, i) => (
                <button
                  key={b._id || i}
                  onClick={() => navigate(`/booking/tracking/${b._id}`, { state: { bookingId: b._id } })}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-surface-900 truncate">{b.service?.name}</div>
                    <div className="text-xs text-surface-400">
                      {new Date(b.scheduledDate).toLocaleDateString([], { day: "numeric", month: "short" })}
                      {b.washer?.name && ` · ${b.washer.name}`}
                      {b.review?.rating ? ` · ${"★".repeat(b.review.rating)}` : " · Not reviewed"}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-display text-primary-600">{(b.totalAmount || 0).toLocaleString()}</div>
                    <div className="text-xs text-surface-400">RWF</div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => navigate("/booking-history")}
                className="w-full py-3 text-xs text-primary-600 hover:text-primary-500 font-medium transition-colors text-center bg-surface-50 hover:bg-surface-100"
              >
                See full history →
              </button>
            </Card>
          )}
        </section>

        {/* ── LOYALTY ── */}
        <LoyaltyCard
          loyaltyPoints={loyaltyPoints}
          loyaltyTier={loyaltyTier}
          completedWashes={completedWashes}
        />

        {/* ── QUICK ACTIONS ── */}
        <section>
          <h2 className="font-display text-lg text-surface-900 mb-3">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Track wash",
                sub:   "Live status updates",
                icon:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C542" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                onClick: () => activeBooking
                  ? navigate(`/booking/tracking/${activeBooking._id}`, { state: { bookingId: activeBooking._id } })
                  : navigate("/booking"),
                disabled: false,
              },
              {
                label: "My profile",
                sub:   "Cars, history, settings",
                icon:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C542" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                onClick: () => navigate("/profile"),
              },
              {
                label: "Notifications",
                sub:   "Alerts & updates",
                icon:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C542" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
                onClick: () => navigate("/notifications"),
              },
              {
                label: "Book a wash",
                sub:   "Schedule a new wash",
                icon:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C542" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                onClick: () => navigate("/booking"),
              },
            ].map(({ label, sub, icon, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="bg-white border-2 border-surface-200 hover:border-primary-500/40 hover:bg-primary-500/3 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <div className="mb-2">{icon}</div>
                <div className="text-sm font-medium text-surface-900">{label}</div>
                <div className="text-xs text-surface-400 mt-0.5">{sub}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ── TIPS ── */}
        <section>
          <h2 className="font-display text-lg text-surface-900 mb-3">Good to know</h2>
          <div className="flex flex-col gap-3">
            {TIPS.map(tip => (
              <div
                key={tip.title}
                className="flex items-start gap-4 bg-white border border-surface-200 rounded-2xl px-4 py-4"
              >
                <span className="text-2xl flex-shrink-0 leading-none mt-0.5">{tip.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-surface-900 mb-0.5">{tip.title}</div>
                  <div className="text-xs text-surface-500 leading-relaxed">{tip.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
      <Footer/>
    </div>
  );
}