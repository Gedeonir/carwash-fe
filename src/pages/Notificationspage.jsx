import { useState } from "react";
import { Card, Badge, TopBar } from "../components/UI";

const NOTIFICATIONS = [
  {
    id: 1, type: "booking", unread: true,
    title: "Booking confirmed!",
    body: "Your Standard Wash is confirmed for today at 10:00 AM. Jean N. is your washer.",
    time: "2 min ago",
    icon: "✅",
  },
  {
    id: 2, type: "tracking", unread: true,
    title: "Jean is on his way",
    body: "Your washer Jean Nkurunziza is heading to KG 9 Ave, Kimihurura. ETA: 18 minutes.",
    time: "14 min ago",
    icon: "🚗",
  },
  {
    id: 3, type: "reminder", unread: true,
    title: "Wash complete!",
    body: "Your Standard Wash has been completed. How was your experience? Leave a review.",
    time: "1 hr ago",
    icon: "✨",
  },
  {
    id: 4, type: "promo", unread: false,
    title: "20% off this weekend",
    body: "Book any Premium Detail this Saturday or Sunday and get 20% off. Use code WEEKEND20.",
    time: "Yesterday",
    icon: "🎁",
  },
  {
    id: 5, type: "reminder", unread: false,
    title: "Your car is due for a wash",
    body: "It's been 2 weeks since your last wash. Keep your car looking great — book now!",
    time: "2 days ago",
    icon: "💧",
  },
  {
    id: 6, type: "booking", unread: false,
    title: "Booking cancelled",
    body: "Your booking IK-004 on 10 Mar was cancelled. No charge was made to your account.",
    time: "3 weeks ago",
    icon: "❌",
  },
  {
    id: 7, type: "promo", unread: false,
    title: "Refer a friend, earn 2,000 RWF",
    body: "Share your referral code with a friend. When they complete their first wash, you both get 2,000 RWF credit.",
    time: "1 month ago",
    icon: "🤝",
  },
];

const TYPE_COLORS = {
  booking: "primary",
  tracking: "info",
  reminder: "accent",
  promo: "success",
};

export default function NotificationsPage({ navigate }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="min-h-screen bg-surface-100 pb-8">
      <TopBar
        title="Notifications"
        onBack={() => navigate(-1)}
        rightAction={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="text-xs text-primary-600 hover:text-primary-700 transition-colors font-medium">
              Mark all read
            </button>
          ) : null
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Unread badge */}
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block" />
              {unreadCount} unread
            </Badge>
          </div>
        )}

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-5 scrollbar-hide">
          {[
            ["all", "All"],
            ["unread", "Unread"],
            ["booking", "Bookings"],
            ["tracking", "Tracking"],
            ["reminder", "Reminders"],
            ["promo", "Offers"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`text-xs px-3 py-1.5 rounded-full border flex-shrink-0 transition-all font-medium ${
                filter === id
                  ? "bg-primary-500 border-primary-500 text-surface-900"
                  : "border-surface-500 text-surface-500 hover:border-primary-500 hover:text-primary-500"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-surface-500 text-sm">No notifications here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  n.unread
                    ? "bg-surface-800/80 border-primary-500/20 shadow-[0_0_20px_rgba(0,201,177,0.05)]"
                    : "bg-surface-800/30 border-white/6 hover:border-white/12"
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                    n.unread ? "bg-primary-500/12" : "bg-surface-700/50"
                  }`}>
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`text-sm font-medium leading-tight ${n.unread ? "text-surface-900" : "text-surface-500"}`}>
                        {n.title}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                        )}
                        <span className="text-xs text-surface-500 whitespace-nowrap">{n.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-surface-400 leading-relaxed line-clamp-2">{n.body}</p>
                    <div className="mt-2">
                      <Badge variant={TYPE_COLORS[n.type] || "primary"}>
                        {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}