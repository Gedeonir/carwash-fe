import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Card, ResponseCard } from "../components/UI";
import { useAuth } from "../context/UseAuth";
import api from "../utils/api";

// ── Washer status transitions ─────────────────────────────
// Washers can only push these specific transitions
const WASHER_ACTIONS = {
  assigned:     { next: "heading",      label: "Start Heading",   icon: "🚗", color: "bg-info text-white" },
  heading:      { next: "arrived",      label: "Mark Arrived",    icon: "📍", color: "bg-warning text-white" },
  arrived:      { next: "in-progress",  label: "Start Wash",      icon: "💧", color: "bg-primary-500 text-surface-900" },
  "in-progress":{ next: "completed",   label: "Mark Complete",   icon: "✅", color: "bg-success text-white" },
};

const STATUS_CONFIG = {
  assigned:     { label: "Assigned",    variant: "info",    dot: "bg-info" },
  heading:      { label: "En Route",    variant: "warning", dot: "bg-warning" },
  arrived:      { label: "Arrived",     variant: "warning", dot: "bg-warning" },
  "in-progress":{ label: "In Progress", variant: "primary", dot: "bg-primary-500" },
  completed:    { label: "Completed",   variant: "success", dot: "bg-success" },
  cancelled:    { label: "Cancelled",   variant: "error",   dot: "bg-error" },
  "no-show":    { label: "No Show",     variant: "error",   dot: "bg-error" },
};

const TABS = [
  { id: "today",     label: "Today" },
  { id: "upcoming",  label: "Upcoming" },
  { id: "completed", label: "History" },
];

// ── Helpers ───────────────────────────────────────────────
function formatTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const today    = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (d >= today && d < tomorrow) return "Today";
  if (d >= tomorrow && d < new Date(tomorrow.getTime() + 86400000)) return "Tomorrow";
  return d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Skeleton ──────────────────────────────────────────────
function JobSkeleton() {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-24 h-5 bg-surface-200 rounded-full" />
        <div className="w-16 h-5 bg-surface-200 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-surface-200 rounded w-1/2" />
        <div className="h-3 bg-surface-200 rounded w-3/4" />
        <div className="h-3 bg-surface-200 rounded w-2/3" />
      </div>
      <div className="h-10 bg-surface-200 rounded-xl" />
    </div>
  );
}

// ── Job card ──────────────────────────────────────────────
function JobCard({ booking, onStatusUpdate, updating }) {
  const [expanded, setExpanded] = useState(false);
  const action     = WASHER_ACTIONS[booking.status];
  const sc         = STATUS_CONFIG[booking.status] || {};
  const isUpdating = updating === booking._id;

  const customer  = booking.customer;
  const service   = booking.service;
  const location  = booking.location;
  const addOns    = booking.addOns || [];

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all ${
      booking.status === "in-progress"
        ? "border-primary-500 bg-primary-500"
        : booking.status === "heading" || booking.status === "arrived"
        ? "border-warning bg-warning"
        : "border-surface-200 bg-surface-50"
    }`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot || "bg-surface-300"} ${
              ["heading","arrived","in-progress"].includes(booking.status) ? "animate-pulse" : ""
            }`} />
            <Badge variant={sc.variant || "primary"}>{sc.label || booking.status}</Badge>
          </div>
          <div className="text-right">
            <div className="font-display text-base text-surface-900">{(booking.totalAmount || 0).toLocaleString()} RWF</div>
            <div className="text-xs text-surface-400 font-mono mt-0.5">{booking.bookingRef}</div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-surface-900 text-sm">{service?.name || "—"}</h3>
            <p className="text-xs text-surface-500 mt-0.5">
              {formatDate(booking.scheduledDate)} · {booking.scheduledTime}
              {service?.durationMinutes && ` · ~${service.durationMinutes} min`}
            </p>
            <p className="text-xs text-surface-500 mt-1 truncate">
              📍 {location?.address || "No address"}
            </p>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"
            className={`flex-shrink-0 ml-3 mt-0.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-4 border-t border-surface-100 pt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Customer */}
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-1.5">Customer</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-500/15 flex items-center justify-center text-primary-600 text-xs font-semibold flex-shrink-0">
                  {(customer?.name || booking.guestName || "?").slice(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">
                    {customer?.name || booking.guestName || "Guest"}
                    {booking.isGuest && <span className="text-xs text-surface-400 ml-1">(guest)</span>}
                  </p>
                  {(customer?.phone || booking.guestPhone) && (
                    <a
                      href={`tel:${customer?.phone || booking.guestPhone}`}
                      className="text-xs text-primary-600 hover:text-primary-500 transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      {customer?.phone || booking.guestPhone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Service details */}
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-1.5">Service</p>
              <p className="text-sm font-medium text-surface-900">{service?.name}</p>
              <p className="text-xs text-surface-500">{service?.durationMinutes} min · {(service?.price || 0).toLocaleString()} RWF</p>
            </div>
          </div>

          {/* Full address */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-1.5">Location</p>
            <p className="text-sm text-surface-700">{location?.address || "—"}</p>
            {location?.accessNotes && (
              <div className="mt-1.5 bg-warning/8 border border-warning/20 rounded-lg px-3 py-2">
                <p className="text-xs text-warning font-medium">Access notes:</p>
                <p className="text-xs text-surface-600 mt-0.5">{location.accessNotes}</p>
              </div>
            )}
            {location?.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-500 mt-2 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Open in Google Maps →
              </a>
            )}
          </div>

          {/* Add-ons */}
          {addOns.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-1.5">Add-ons</p>
              <div className="flex flex-wrap gap-1.5">
                {addOns.map(a => (
                  <span key={a.name} className="text-xs bg-primary-500/8 border border-primary-500/20 text-primary-700 rounded-full px-2.5 py-0.5">
                    {a.name} · {a.price.toLocaleString()} RWF
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-1.5">Payment</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-700 capitalize">{booking.paymentMethod?.replace("-", " ")}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                booking.paymentStatus === "paid"
                  ? "bg-success/12 text-success"
                  : "bg-warning/12 text-warning"
              }`}>
                {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>

          {/* Timeline */}
          {booking.timeline && (
            <div className="mb-4 bg-surface-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Timeline</p>
              <div className="space-y-1">
                {[
                  ["Confirmed",    booking.timeline.confirmedAt],
                  ["Assigned",     booking.timeline.assignedAt],
                  ["Heading",      booking.timeline.headingAt],
                  ["Arrived",      booking.timeline.arrivedAt],
                  ["Started",      booking.timeline.startedAt],
                  ["Completed",    booking.timeline.completedAt],
                ].filter(([, ts]) => ts).map(([label, ts]) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-surface-500">{label}</span>
                    <span className="text-surface-700 font-medium">{formatTime(ts)} · {timeAgo(ts)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action button */}
      {action && (
        <div className="px-5 pb-5">
          <button
            onClick={() => onStatusUpdate(booking._id, action.next)}
            disabled={isUpdating}
            className={`
              w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2
              transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
              ${action.color}
            `}
          >
            {isUpdating ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Updating...
              </>
            ) : (
              <>{action.icon} {action.label}</>
            )}
          </button>
        </div>
      )}

      {/* Completed — show review if any */}
      {booking.status === "completed" && booking.review && (
        <div className="px-5 pb-5 border-t border-surface-100 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-accent-500 text-sm">{"★".repeat(booking.review.rating || 0)}</span>
            {booking.review.comment && (
              <p className="text-xs text-surface-500 italic">"{booking.review.comment}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main washer dashboard ─────────────────────────────────
export default function WasherDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab,  setActiveTab]  = useState("today");
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [updating,   setUpdating]   = useState(null); // booking._id being updated
  const [updateError,setUpdateError]= useState(null);
  const [available,  setAvailable]  = useState(user?.isAvailable ?? true);
  const [togglingAvail, setTogglingAvail] = useState(false);
  const pollRef = useRef(null);

  // ── Fetch all washer bookings ──────────────────────────
  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get("/bookings?limit=50");
      setBookings(res.data?.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load your jobs. Pull to refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    // Poll every 30s for new assignments
    pollRef.current = setInterval(fetchBookings, 30000);
    return () => clearInterval(pollRef.current);
  }, [fetchBookings]);

  // ── Filter bookings by tab ─────────────────────────────
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

  const filtered = {
    today: bookings.filter(b => {
      const d = new Date(b.scheduledDate);
      return d >= today && d < tomorrow && !["completed","cancelled","no-show"].includes(b.status);
    }),
    upcoming: bookings.filter(b => {
      const d = new Date(b.scheduledDate);
      return d >= tomorrow && !["cancelled","no-show"].includes(b.status);
    }),
    completed: bookings.filter(b => ["completed","cancelled","no-show"].includes(b.status)),
  };

  // Sort: active jobs first, then by scheduled time
  const ACTIVE_ORDER = { "in-progress": 0, arrived: 1, heading: 2, assigned: 3 };
  filtered.today.sort((a, b) => (ACTIVE_ORDER[a.status] ?? 99) - (ACTIVE_ORDER[b.status] ?? 99));
  filtered.upcoming.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  filtered.completed.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

  // ── Status update ──────────────────────────────────────
  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    setUpdateError(null);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      await fetchBookings(); // refresh
    } catch (err) {
      setUpdateError(err?.response?.data?.message || "Failed to update status. Try again.");
    } finally {
      setUpdating(null);
    }
  };

  // ── Toggle availability ────────────────────────────────
  const handleToggleAvailability = async () => {
    setTogglingAvail(true);
    try {
      await api.put("/auth/me", { isAvailable: !available });
      setAvailable(a => !a);
    } catch (_) {
      // silent — availability toggle is best-effort
    } finally {
      setTogglingAvail(false);
    }
  };

  // ── Stats from bookings ────────────────────────────────
  const completedAll  = bookings.filter(b => b.status === "completed");
  const completedToday = completedAll.filter(b => {
    const d = new Date(b.scheduledDate);
    return d >= today && d < tomorrow;
  });
  const earningsToday = completedToday.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const earningsTotal = completedAll.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const initials = (user?.name || "?").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-surface-100">

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-40 bg-surface-50 backdrop-blur-xs border-b border-surface-200">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-3.5">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary-500/15 flex items-center justify-center font-display text-primary-600 font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-surface-400">{greeting}</p>
            <p className="font-semibold text-surface-900 text-sm truncate">{user?.name || "Washer"}</p>
          </div>

          {/* Availability toggle */}
          <button
            onClick={handleToggleAvailability}
            disabled={togglingAvail}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all disabled:opacity-60 ${
              available
                ? "border-success/30 bg-success/10 text-success"
                : "border-surface-300 bg-surface-100 text-surface-500"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${available ? "bg-success animate-pulse" : "bg-surface-400"}`} />
            {togglingAvail ? "..." : available ? "Available" : "Off duty"}
          </button>

          {/* Logout */}
          <button
            onClick={async () => { await logout(); navigate("/auth"); }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 hover:bg-surface-200 text-surface-500 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5 bg-surface-50 mt-8 rounded-lg">

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Today's jobs",   value: completedToday.length,                              icon: "✅", color: "text-success" },
            { label: "Today's earnings", value: earningsToday > 0 ? `${(earningsToday/1000).toFixed(1)}k` : "0", icon: "💰", color: "text-primary-600" },
            { label: "Total washes",   value: completedAll.length,                                icon: "🚗", color: "text-surface-700" },
          ].map(s => (
            <Card key={s.label} className="p-4 text-center bg-white">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className={`font-display text-lg leading-tight ${s.color}`}>{s.value}</div>
              <div className="text-xs text-surface-400 mt-0.5 leading-tight">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* ── ACTIVE JOB HERO (if any) ── */}
        {(() => {
          const activeJob = bookings.find(b => b.status === "in-progress");
          if (!activeJob) return null;
          const customer = activeJob.customer;
          return (
            <div className="bg-gradient-to-br from-primary-500/12 to-primary-500/4 border-2 border-primary-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">Wash in progress</span>
              </div>
              <h3 className="font-display text-lg text-surface-900 mb-0.5">{activeJob.service?.name}</h3>
              <p className="text-sm text-surface-500 mb-3">
                {customer?.name || activeJob.guestName} · {activeJob.scheduledTime}
              </p>
              <p className="text-xs text-surface-600 mb-4">📍 {activeJob.location?.address}</p>
              <button
                onClick={() => handleStatusUpdate(activeJob._id, "completed")}
                disabled={updating === activeJob._id}
                className="w-full py-3 bg-success text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {updating === activeJob._id ? (
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ) : "✅"}
                {updating === activeJob._id ? "Updating..." : "Mark wash complete"}
              </button>
            </div>
          );
        })()}

        {/* ── UPDATE ERROR ── */}
        {updateError && (
          <div className="bg-error/8 border border-error/25 rounded-xl px-4 py-3 text-sm text-error flex items-center justify-between">
            {updateError}
            <button onClick={() => setUpdateError(null)} className="text-error hover:opacity-70 ml-3">✕</button>
          </div>
        )}

        {/* ── TABS ── */}
        <div className="flex gap-1 rounded-xl p-1">
          {TABS.map(t => {
            const count = filtered[t.id]?.length || 0;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === t.id
                    ? "bg-primary-500 text-surface-900"
                    : "text-surface-500 hover:text-surface-700"
                }`}
              >
                {t.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === t.id
                      ? t.id === "today" ? "bg-primary-500 text-surface-900" : "bg-surface-100 text-surface-500"
                      : "bg-surface-300/70 text-surface-500"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── FETCH ERROR ── */}
        {error && (
            <ResponseCard
            title={"Error"}
            message={error}
            onRetry={fetchBookings}
            type="error"/>
        )}

        {/* ── JOB LIST ── */}
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <JobSkeleton key={i} />)}</div>
        ) : filtered[activeTab]?.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">
              {activeTab === "today" ? "🎉" : activeTab === "upcoming" ? "📅" : "📋"}
            </div>
            <h3 className="font-display text-lg text-surface-700 mb-1">
              {activeTab === "today"
                ? "No jobs for today"
                : activeTab === "upcoming"
                ? "No upcoming jobs"
                : "No history yet"
              }
            </h3>
            <p className="text-sm text-surface-400">
              {activeTab === "today"
                ? "Stay available — new jobs may be assigned soon."
                : activeTab === "upcoming"
                ? "Check back later for new bookings."
                : "Your completed jobs will appear here."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {filtered[activeTab].map(b => (
              <JobCard
                key={b._id}
                booking={b}
                onStatusUpdate={handleStatusUpdate}
                updating={updating}
              />
            ))}
          </div>
        )}

        {/* ── RATING CARD (bottom) ── */}
        {user?.rating > 0 && (
          <div className="bg-gradient-to-br from-surface-800 to-surface-900 border border-primary-500/20 rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-surface-400 mb-1">Your rating</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl text-white">{user.rating}</span>
                  <span className="text-primary-400 text-lg">★</span>
                </div>
                <p className="text-xs text-surface-400 mt-1">{user.totalReviews} review{user.totalReviews !== 1 ? "s" : ""}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-surface-400 mb-1">Zone</p>
                <p className="text-sm font-semibold text-white">{user.zone || "—"}</p>
                <p className="text-xs text-surface-400 mt-1">Total washes: {completedAll.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}