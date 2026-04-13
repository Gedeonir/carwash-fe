import { createContext, useState, useCallback, useEffect } from "react";

// ── Context ───────────────────────────────────────────────
export const ToastContext = createContext(null);

// ── Icons ─────────────────────────────────────────────────
const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  loading: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

// ── Styles ────────────────────────────────────────────────
const STYLES = {
  warning: "border-primary-500 bg-opacity-30 bg-primary-500 text-primary-900",
  loading: "border-white bg-surface-700 text-white",
      success: "bg-success bg-opacity-30 text-success border-success",
    error: "bg-error bg-opacity-30 text-error border-error-200",
    info: "bg-info bg-opacity-30 text-info border-info",
};

// ── Toast Component ───────────────────────────────────────
function Toast({ id, type = "info", title, message, onDismiss, duration = 4000 }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(id), 300);
  };
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);

    if (duration && type !== "loading") {
      const hide = setTimeout(() => dismiss(), duration);
      return () => {
        clearTimeout(show);
        clearTimeout(hide);
      };
    }

    return () => clearTimeout(show);
  }, []);



  const isHidden = !visible || leaving;

  

  return (
    <div
      onClick={dismiss}
      className={`
        relative flex items-start gap-3 w-full max-w-sm
        px-4 py-3.5
        shadow-md cursor-pointer select-none
        transition-all duration-300
        ${STYLES[type]}
        ${isHidden ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{ICONS[type]}</div>

      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-medium mb-0.5">{title}</p>
        )}
        {message && (
          <p className="text-xs text-surface-300">{message}</p>
        )}
      </div>

      {type !== "loading" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          className="text-surface-500 hover:text-surface-700 transition-all"
        >
          ✕
        </button>
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

    setToasts((prev) => [
      ...prev.slice(-4),
      { id, type, title, message, ...opts },
    ]);

    return id;
  }, []);

  const methods = {
    success: (title, message, opts) => toast("success", title, message, opts),
    error: (title, message, opts) => toast("error", title, message, opts),
    warning: (title, message, opts) => toast("warning", title, message, opts),
    info: (title, message, opts) => toast("info", title, message, opts),

    loading: (title, message, opts) =>
      toast("loading", title, message, { duration: 0, ...opts }),

    dismiss,
  };

  return (
    <ToastContext.Provider value={methods}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ── Container ─────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="fixed top-20 right-0 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={onDismiss} />
        ))}
      </div>
    </>
  );
}