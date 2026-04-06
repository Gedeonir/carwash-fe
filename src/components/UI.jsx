// ── Button ──────────────────────────────────────────────
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled,
  type = "button",
}) {
  const base =
    "inline-flex items-center justify-center font-sans font-medium rounded-xl transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-primary-500 text-surface-900 hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-glow active:scale-[0.98]",
    ghost:
      "border border-surface-900 text-surface-900 hover:border-primary-500 hover:text-primary-500 hover:-translate-y-0.5",
    outline:
      "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-surface-900 hover:-translate-y-0.5",
    danger:
      "bg-error text-white hover:opacity-90 active:scale-[0.98]",
    white:
      "bg-white text-surface-900 hover:bg-accent-200 hover:-translate-y-0.5 active:scale-[0.98]",
    dark:
      "bg-surface-700 text-white border border-white/10 hover:bg-surface-600 hover:-translate-y-0.5",
  };
  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Input ────────────────────────────────────────────────
export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-surface-400">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-4 -translate-y-1/2 text-surface-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-surface-100 border ${
            error ? "border-error" : "border-white/10"
          } rounded-xl px-4 py-3 text-surface-900 placeholder:text-surface-500
          focus:outline-none focus:ring-2 focus:ring-primary-500/20
          transition-all ${icon ? "pl-11" : ""}`}
        />
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────
export function Card({ children, className = "", glow = false }) {
  return (
    <div
      className={`bg-surface-50 border border-white/8 rounded-2xl backdrop-blur-sm
      ${glow ? "shadow-[0_0_40px_rgba(245,197,66,0.10)] border-primary-500/20" : ""}
      ${className}`}
    >
      {children}
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────
export function Badge({ children, variant = "primary" }) {
  const variants = {
    primary: "bg-surface-900 text-white border-primary-500/25",
    accent:  "bg-white/10 text-surface-900 border-surface-900",
    success: "bg-success bg-opacity-20 text-success border-success",
    warning: "bg-warning bg-opacity-20 text-warning border-warning",
    error:   "bg-error/15 text-error border-error/25",
    info:    "bg-info bg-opacity-20 text-info border-info/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

// ── TopBar ───────────────────────────────────────────────
export function TopBar({ title, onBack, rightAction }) {
  return (
    <div className="sticky top-0 z-40 bg-surface-50 backdrop-blur-md border-b border-white/6">
      <div className="mx-auto flex items-center gap-4 px-4 py-4">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-800 border border-white/8 hover:bg-surface-700 hover:border-primary-500/40 transition-all"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-white"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <h2 className="font-display text-lg text-surface-900 flex-1">{title}</h2>
        {rightAction}
      </div>
    </div>
  );
}

// ── Progress Steps ────────────────────────────────────────
export function ProgressSteps({ steps, current }) {
  return (
    <div className="flex items-center justify-center px-6 py-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all
              ${
                i < current
                  ? "bg-primary-500 border-primary-500 text-surface-900"
                  : i === current
                  ? "bg-surface-800 border-primary-500 text-primary-500"
                  : "bg-surface-800 border-white/10 text-surface-500"
              }`}
            >
              {i < current ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-xs mt-1 whitespace-nowrap ${
                i === current ? "text-primary-400" : "text-surface-500"
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-8 mx-1 mb-4 transition-all ${
                i < current ? "bg-primary-500" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────
export function StatCard({ label, value, icon, trend, color = "primary" }) {
  const colors = {
    primary: "bg-primary-500/15 text-primary-600",
    accent:  "bg-white/10 text-white",
    success: "bg-success/10 text-success",
    info:    "bg-info/10 text-info",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <Badge variant={trend > 0 ? "success" : "error"}>
            {trend > 0 ? "+" : ""}{trend}%
          </Badge>
        )}
      </div>
      <div className="text-2xl font-display text-surface-900 mb-0.5">{value}</div>
      <div className="text-sm text-surface-400">{label}</div>
    </Card>
  );
}

// ── Divider ───────────────────────────────────────────────
export function Divider({ className = "" }) {
  return <div className={`h-px bg-white/8 ${className}`} />;
}