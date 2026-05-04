import { Card, ResponseCard, StatCard } from "../../components/UI";
import { useAdminStats } from "./UseAdminData";

function BarSkeleton() {
  return (
    <div className="mb-4 animate-pulse">
      <div className="flex justify-between mb-1.5">
        <div className="h-3 bg-surface-200 rounded w-1/4" />
        <div className="h-3 bg-surface-200 rounded w-12" />
      </div>
      <div className="h-2 bg-surface-200 rounded-full" />
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-2xl p-5 animate-pulse h-28" />
  );
}

// Dynamic bar — width relative to the max in the set
function Bar({
  label,
  value,
  displayValue,
  max,
  color = "bg-primary-500",
  subLabel,
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <div>
          <span className="text-surface-700 font-medium">{label}</span>
          {subLabel && (
            <span className="text-surface-400 text-xs ml-2">{subLabel}</span>
          )}
        </div>
        <span className="text-surface-900 font-semibold">
          {displayValue ?? `${pct}%`}
        </span>
      </div>
      <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// Static zone data (not in backend yet — placeholder until location analytics endpoint is added)
const ZONE_DATA = [
  { zone: "Kimihurura", bookings: 28 },
  { zone: "Kiyovu", bookings: 22 },
  { zone: "Remera", bookings: 18 },
  { zone: "Nyamirambo", bookings: 15 },
  { zone: "Other", bookings: 17 },
];

export default function Analytics() {
  const { data: stats, loading, error } = useAdminStats();

  const revenueByService = stats?.revenueByService || [];
  const maxRevenue = Math.max(...revenueByService.map((s) => s.total), 1);
  const maxCount = Math.max(...revenueByService.map((s) => s.count), 1);
  const maxZone = Math.max(...ZONE_DATA.map((z) => z.bookings), 1);

  console.log(error);

  return (
    <div>
      <h1 className="font-display text-2xl text-surface-900 mb-6">
        Reports & Analytics
      </h1>

      {error && (
        <ResponseCard
          message={"Failed to load analytics. Please try again"}
          title={"Error"}
          type="error"
          onRetry={()=>{}}
        />
      )}

      {/* Top stat cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {loading ? (
          [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Revenue"
              value={`${((stats?.overall?.totalRevenue || 0) / 1000).toFixed(0)}k RWF`}
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
              label="Today's Revenue"
              value={`${(stats?.today?.revenue || 0).toLocaleString()} RWF`}
              trend={12}
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
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />
            <StatCard
              label="Total Washes"
              value={stats?.overall?.totalBookings ?? 0}
              trend={22}
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
              label="Completed Today"
              value={stats?.today?.completed ?? 0}
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Revenue by service */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base text-surface-900">
              Revenue by service
            </h3>
            <span className="text-xs text-surface-400">Completed bookings</span>
          </div>
          {loading ? (
            [1, 2, 3].map((i) => <BarSkeleton key={i} />)
          ) : revenueByService.length === 0 ? (
            <p className="text-surface-400 text-sm text-center py-6">
              No completed bookings yet
            </p>
          ) : (
            revenueByService.map((s) => (
              <Bar
                key={s.name}
                label={s.name}
                value={s.total}
                max={maxRevenue}
                displayValue={`${s.total.toLocaleString()} RWF`}
                subLabel={`${s.count} wash${s.count !== 1 ? "es" : ""}`}
                color="bg-primary-500"
              />
            ))
          )}
        </Card>

        {/* Washes by service count */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base text-surface-900">
              Washes by service
            </h3>
            <span className="text-xs text-surface-400">All time</span>
          </div>
          {loading ? (
            [1, 2, 3].map((i) => <BarSkeleton key={i} />)
          ) : revenueByService.length === 0 ? (
            <p className="text-surface-400 text-sm text-center py-6">
              No data yet
            </p>
          ) : (
            revenueByService.map((s) => (
              <Bar
                key={s.name}
                label={s.name}
                value={s.count}
                max={maxCount}
                displayValue={`${s.count} wash${s.count !== 1 ? "es" : ""}`}
                color="bg-primary-400"
              />
            ))
          )}
        </Card>
      </div>

      {/* Second row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Popular zones (static placeholder) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base text-surface-900">
              Popular zones
            </h3>
            <span className="text-xs text-surface-400 bg-surface-100 px-2 py-0.5 rounded-full">
              Sample data
            </span>
          </div>
          {ZONE_DATA.map((z) => (
            <Bar
              key={z.zone}
              label={z.zone}
              value={z.bookings}
              max={maxZone}
              displayValue={`${z.bookings} bookings`}
              color="bg-accent-400"
            />
          ))}
        </Card>

        {/* Today summary */}
        <Card className="p-5">
          <h3 className="font-display text-base text-surface-900 mb-5">
            Today at a glance
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-surface-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                {
                  label: "New bookings",
                  value: stats?.today?.bookings ?? 0,
                  icon: "📋",
                  color: "bg-info/10 text-info",
                },
                {
                  label: "Completed washes",
                  value: stats?.today?.completed ?? 0,
                  icon: "✅",
                  color: "bg-success/10 text-success",
                },
                {
                  label: "Active jobs",
                  value: stats?.today?.activeJobs ?? 0,
                  icon: "🚗",
                  color: "bg-warning/10 text-warning",
                },
                {
                  label: "Revenue earned",
                  value: `${(stats?.today?.revenue || 0).toLocaleString()} RWF`,
                  icon: "💰",
                  color: "bg-primary-500/10 text-primary-600",
                },
              ].map(({ label, value, icon, color }) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 ${color.split(" ")[0]}`}
                >
                  <span className="text-xl">{icon}</span>
                  <span
                    className={`text-sm flex-1 font-medium ${color.split(" ")[1]}`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-base font-display font-semibold ${color.split(" ")[1]}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Lifetime totals */}
          {!loading && stats && (
            <div className="border-t border-surface-200 mt-5 pt-4">
              <p className="text-xs text-surface-400 mb-3 font-medium uppercase tracking-wide">
                All time
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Total bookings", stats.overall?.totalBookings ?? 0],
                  [
                    "Total revenue",
                    `${((stats.overall?.totalRevenue || 0) / 1000).toFixed(0)}k RWF`,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="bg-surface-100 rounded-xl p-3">
                    <div className="text-xs text-surface-400 mb-1">{label}</div>
                    <div className="font-display text-lg text-surface-900">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
