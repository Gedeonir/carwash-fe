import { Button, StatCard, Badge, Card } from "../../components/UI";
import { useNavigate } from "react-router-dom";
import { useAdminStats, useAdminBookings, useWashers } from "./UseAdminData";

const STATUS_CONFIG = {
  confirmed:    { label: "Confirmed",   variant: "info" },
  assigned:     { label: "Assigned",    variant: "info" },
  heading:      { label: "En Route",    variant: "warning" },
  arrived:      { label: "Arrived",     variant: "warning" },
  "in-progress":{ label: "In Progress", variant: "primary" },
  completed:    { label: "Completed",   variant: "success" },
  cancelled:    { label: "Cancelled",   variant: "error" },
  "no-show":    { label: "No Show",     variant: "error" },
};

const WASHER_STATUS = {
  available: "bg-success/15 text-success",
  busy:      "bg-warning/15 text-warning",
  heading:   "bg-info/15 text-info",
};

function StatSkeleton() {
  return(
    <Card className="p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center bg-surface-200`}
        />
          <div  className="w-6 bg-surface-200 h-2 rounded-lg"/>

      </div>
      <div className="text-2xl font-display text-surface-900 mb-0.5 h-2 rounded-lg w-1/5 bg-surface-200"/>
      <div className="text-sm text-surface-400 w-2/5 bg-surface-200 h-2 rounded-lg"/>
    </Card>
  )
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
      <div className="w-8 h-8 rounded-full bg-surface-200 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-surface-200 rounded w-1/3" />
        <div className="h-2.5 bg-surface-200 rounded w-1/2" />
      </div>
      <div className="w-16 h-5 bg-surface-200 rounded-full" />
    </div>
  );
}

export default function Overview() {
  const navigate = useNavigate();

  const { data: stats,    loading: statsLoading }    = useAdminStats();
  const { data: bookRes,  loading: bookingsLoading }  = useAdminBookings({ limit: 10 });
  const { data: washers,  loading: washersLoading }   = useWashers();

  const bookings   = bookRes?.data || [];
  const activeJobs = bookings.filter(b => ["in-progress","heading","arrived"].includes(b.status));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-surface-900">Good morning, Admin 👋</h1>
          <p className="text-surface-400 text-sm mt-1">Here's what's happening today</p>
        </div>
        <Button size="sm" onClick={() => navigate("/admin/bookings")}>View all bookings →</Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          [1,2,3,4].map(i => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Today's Revenue"
              value={`${(stats?.today?.revenue || 0).toLocaleString()} RWF`}
              trend={12} color="primary"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
            />
            <StatCard
              label="Active Jobs"
              value={stats?.today?.activeJobs ?? 0}
              trend={5} color="info"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            />
            <StatCard
              label="Today's Bookings"
              value={stats?.today?.bookings ?? 0}
              trend={8} color="success"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            />
            <StatCard
              label="Avg Rating"
              value="4.9 ★"
              trend={2} color="accent"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
            />
          </>
        )}
      </div>

      {/* Active now + Team */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Active bookings */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base text-surface-900">Active right now</h3>
            {activeJobs.length > 0 && (
              <span className="text-xs bg-primary-500/10 text-primary-600 border border-primary-500/20 rounded-full px-2.5 py-0.5 font-medium">
                {activeJobs.length} job{activeJobs.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          {bookingsLoading ? (
            <div className="space-y-2">{[1,2,3].map(i => <RowSkeleton key={i} />)}</div>
          ) : activeJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-surface-400 text-sm">No active jobs right now</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeJobs.map(b => {
                const sc = STATUS_CONFIG[b.status] || {};
                const initials = (b.customer?.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <div key={b._id} className="flex items-center gap-3 p-3 bg-surface-100 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary-500/15 flex items-center justify-center text-primary-600 text-xs font-medium flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-surface-900 truncate">{b.customer?.name}</div>
                      <div className="text-xs text-surface-400 truncate">
                        {b.location?.address?.split(",")[0]} · {b.washer?.name || "Unassigned"}
                      </div>
                    </div>
                    <Badge variant={sc.variant}>{sc.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Team status */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base text-surface-900">Team status</h3>
            <button onClick={() => navigate("/admin/team")} className="text-xs text-primary-600 hover:text-primary-500 transition-colors font-medium">
              Manage →
            </button>
          </div>
          {washersLoading ? (
            <div className="space-y-2">{[1,2,3].map(i => <RowSkeleton key={i} />)}</div>
          ) : (washers || []).length === 0 ? (
            <p className="text-surface-400 text-sm text-center py-8">No washers found</p>
          ) : (
            <div className="space-y-3">
              {(washers || []).map(w => {
                const statusKey = w.isAvailable ? "available" : "busy";
                const initials  = (w.name || "?").slice(0, 2).toUpperCase();
                return (
                  <div key={w._id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center font-medium text-primary-600 text-xs flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-surface-900 truncate">{w.name}</div>
                      <div className="text-xs text-surface-400">{w.zone || "—"} · ⭐ {w.rating}</div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${WASHER_STATUS[statusKey] || "bg-surface-100 text-surface-500"}`}>
                      {statusKey}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}