const NAV_ITEMS = [
  {
    id: "landing",
    label: "Home",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "services",
    label: "Services",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" fill={active ? "currentColor" : "none"} />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M8.46 8.46a5 5 0 0 0 0 7.07" />
      </svg>
    ),
  },
  {
    id: "booking",
    label: "Book",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" fill={active ? "currentColor" : "none"} />
        <line x1="16" y1="2" x2="16" y2="6" stroke={active ? "#0A0A0A" : "currentColor"} />
        <line x1="8" y1="2" x2="8" y2="6" stroke={active ? "#0A0A0A" : "currentColor"} />
        <line x1="3" y1="10" x2="21" y2="10" stroke={active ? "#0A0A0A" : "currentColor"} />
        <line x1="8" y1="14" x2="16" y2="14" stroke={active ? "#0A0A0A" : "currentColor"} />
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Alerts",
    badge: 3,
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" fill={active ? "currentColor" : "none"} />
      </svg>
    ),
  },
];

// Pages where BottomNav should be hidden
const HIDDEN_PAGES = ["auth", "admin"];

// The "Book" tab is the special center FAB button
const CENTER_TAB = "booking";

export default function BottomNav({ currentPage, navigate }) {
  if (HIDDEN_PAGES.includes(currentPage)) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-surface-900/95 backdrop-blur-md border-t border-white/8" />

      <div className="relative max-w-lg mx-auto flex items-end justify-around px-2 pb-safe">
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.id;
          const isCenter = item.id === CENTER_TAB;

          if (isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="relative flex flex-col items-center -mt-5 mb-1 group"
              >
                {/* FAB circle */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-glow transition-all duration-250 group-hover:scale-105 group-active:scale-95
                  ${active
                    ? "bg-primary-500 shadow-[0_0_28px_rgba(245,197,66,0.5)]"
                    : "bg-primary-500 hover:bg-primary-400"
                  }`}
                >
                  <span className="text-surface-900">{item.icon(true)}</span>
                </div>
                <span className={`text-xs mt-1.5 font-medium transition-colors ${active ? "text-primary-400" : "text-surface-400"}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="relative flex flex-col items-center gap-1 py-3 px-3 min-w-[52px] group"
            >
              {/* Notification badge */}
              {item.badge && !active && (
                <span className="absolute top-2 right-1.5 w-4 h-4 rounded-full bg-primary-500 text-surface-900 text-[9px] font-bold flex items-center justify-center leading-none">
                  {item.badge}
                </span>
              )}

              {/* Active indicator pill */}
              {active && (
                <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
              )}

              <span
                className={`transition-all duration-200 group-active:scale-90 ${
                  active ? "text-primary-500" : "text-surface-500 group-hover:text-surface-300"
                }`}
              >
                {item.icon(active)}
              </span>

              <span
                className={`text-xs font-medium transition-colors leading-none ${
                  active ? "text-primary-400" : "text-surface-500 group-hover:text-surface-300"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* iOS safe area spacer */}
      <div className="h-safe-bottom bg-surface-900/95" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </div>
  );
}