import { createContext, useContext, useState, useCallback, useEffect } from "react";

// ── Context ───────────────────────────────────────────────
const ToastContext = createContext(null);

// ── Icons ─────────────────────────────────────────────────
const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  loading: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

const STYLES = {
  success: "border-success/30 bg-success text-success",
  error:   "border-error/30 bg-error/10 text-error",
  warning: "border-primary-500/40 bg-primary-500/10 text-primary-400",
  info:    "border-info/30 bg-info/10 text-info",
  loading: "border-white/15 bg-surface-700/80 text-white",
};

// ── Single Toast ──────────────────────────────────────────
function Toast({ id, type = "info", title, message, onDismiss, duration = 4000 }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Mount animation
    const show = setTimeout(() => setVisible(true), 10);
    // Auto dismiss
    if (duration && type !== "loading") {
      const hide = setTimeout(() => dismiss(), duration);
      return () => { clearTimeout(show); clearTimeout(hide); };
    }
    return () => clearTimeout(show);
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(id), 320);
  };

  return (
    <div
      onClick={dismiss}
      className={`
        flex items-start gap-3 w-full max-w-sm
        bg-surface-800 border rounded-2xl px-4 py-3.5
        shadow-xl cursor-pointer select-none
        transition-all duration-300
        ${STYLES[type]}
        ${visible && !leaving
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
        }
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{ICONS[type]}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-medium text-white leading-snug mb-0.5">{title}</p>
        )}
        {message && (
          <p className="text-xs text-surface-300 leading-relaxed">{message}</p>
        )}
      </div>

      {/* Dismiss X */}
      {type !== "loading" && (
        <button
          onClick={(e) => { e.stopPropagation(); dismiss(); }}
          className="flex-shrink-0 text-surface-500 hover:text-white transition-colors mt-0.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Progress bar */}
      {duration && type !== "loading" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-current opacity-30 rounded-full"
            style={{
              animation: `shrink ${duration}ms linear forwards`,
              transformOrigin: "left",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((type, title, message, opts = {}) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, type, title, message, ...opts }]);
    return id;
  }, []);

  // Convenience methods
  const methods = {
    success: (title, message, opts) => toast("success", title, message, opts),
    error:   (title, message, opts) => toast("error",   title, message, opts),
    warning: (title, message, opts) => toast("warning", title, message, opts),
    info:    (title, message, opts) => toast("info",    title, message, opts),
    loading: (title, message, opts) => toast("loading", title, message, { duration: 0, ...opts }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={methods}>
      {children}
      <ToastContainerComponent toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Container ─────────────────────────────────────────────
function ToastContainerComponent({ toasts = [], onDismiss }) {
  // When used standalone (without provider), render nothing
  if (!onDismiss) return null;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shrink { from { transform: scaleX(1); } to { transform: scaleX(0); } }
      `}</style>
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full px-4"
        style={{ maxWidth: "420px", pointerEvents: toasts.length ? "auto" : "none" }}
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={onDismiss} />
        ))}
      </div>
    </>
  );
}

// ── Standalone trigger (used in App without provider) ─────
// Keeps a global singleton so App.jsx's <ToastContainer /> works
// without wrapping the whole tree in a Provider.
let _setToasts = null;
let _counter = 0;

function standaloneToast(type, title, message, opts = {}) {
  if (!_setToasts) return;
  const id = ++_counter;
  _setToasts((prev) => [...prev.slice(-4), { id, type, title, message, ...opts }]);
  return id;
}

export const toast = {
  success: (title, msg, opts) => standaloneToast("success", title, msg, opts),
  error:   (title, msg, opts) => standaloneToast("error",   title, msg, opts),
  warning: (title, msg, opts) => standaloneToast("warning", title, msg, opts),
  info:    (title, msg, opts) => standaloneToast("info",    title, msg, opts),
  loading: (title, msg, opts) => standaloneToast("loading", title, msg, { duration: 0, ...opts }),
  dismiss: (id) => _setToasts?.((prev) => prev.filter((t) => t.id !== id)),
};

// The standalone container — used directly in App.jsx as <ToastContainer />
export function StandaloneToastContainer() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return <ToastContainerComponent toasts={toasts} onDismiss={dismiss} />;
}

// Re-export StandaloneToastContainer as ToastContainer so App.jsx import works unchanged
// (App.jsx does: import { ToastContainer } from "./components/Toast")
export { StandaloneToastContainer as ToastContainer };