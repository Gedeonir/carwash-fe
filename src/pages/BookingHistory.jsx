import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useCallback } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/UI";
import { HistoryRowSkeleton } from "../components/Skeletons";
const BookingHistory = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    setErrors(null);
    setLoading(true);
    try {
      const res = await api.get("/bookings?limit=50");
      const all = res.data?.data || [];
      setHistory(all);
    } catch (_) {
      setErrors({ general: "Couldn't load your wash history." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const STATUS_FILTERS = [
    "all",
    "confirmed",
    "heading",
    "in-progress",
    "completed",
    "cancelled",
  ];

  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [assigning, setAssigning] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [actionError, setActionError] = useState(null);

  const filteredHistory = history.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (dateFilter && !b.scheduledDate.startsWith(dateFilter)) return false;
    return true;
  });

  return (
    <div className="bg-surface-100 min-h-screen">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-4 bg-surface-50 mt-20 min-h-screen">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-xl font-display text-surface-900">
            Booking history
          </h1>
        </div>

        <div className="flex flex-nowrap gap-2 mb-5 overflow-x-auto scrollbar-hide border bg-surface-50 py-3 px-3">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilterStatus(s);
                setPage(1);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize whitespace-nowrap ${
                filterStatus === s
                  ? "bg-primary-500 border-primary-500 text-surface-900 font-medium"
                  : "border-surface-200 text-surface-500 hover:text-surface-900 hover:border-surface-300 bg-surface-50"
              }`}
            >
              {s === "all" ? "All" : s.replace("-", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <Card className="divide-y divide-surface-100 bg-white">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <HistoryRowSkeleton key={i} />
            ))}
          </Card>
        ) : errors ? (
          <Card className="p-5 text-center bg-white">
            <p className="text-surface-400 text-sm mb-3">{errors.general}</p>
            <button
              onClick={fetchHistory}
              className="text-xs text-primary-600 underline"
            >
              Retry
            </button>
          </Card>
        ) : filteredHistory.length === 0 ? (
          filterStatus === "all" ? (
            <Card className="p-6 text-center bg-white">
              <p className="text-surface-400 text-sm mb-3">
                No washes booked yet
              </p>
              <button
                onClick={() => navigate("/booking")}
                className="text-xs text-primary-600 hover:text-primary-500 font-medium"
              >
                Book your first wash →
              </button>
            </Card>
          ) : (
            <Card className="p-6 text-center bg-white">
              <p className="text-surface-400 text-sm mb-3">
                We couldn’t find anything matching your request.
              </p>
            </Card>
          )
        ) : (
          filteredHistory?.map((b, i) => (
            <Card className="divide-y divide-surface-100 bg-surface-50 overflow-hidden mb-3">
              <button
                key={b._id || i}
                onClick={() =>
                  navigate(`/booking/tracking/${b._id}`, {
                    state: { bookingId: b._id },
                  })
                }
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-50 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-surface-900 truncate">
                    {b.service?.name}
                  </div>
                  <div className="text-xs text-surface-400">
                    {new Date(b.scheduledDate).toLocaleDateString([], {
                      day: "numeric",
                      month: "short",
                    })}
                    {b.washer?.name && ` · ${b.washer.name}`}
                    {b.review?.rating
                      ? ` · ${"★".repeat(b.review.rating)}`
                      : " · Not reviewed"}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-display text-primary-600">
                    {(b.totalAmount || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-surface-400">RWF</div>
                </div>
              </button>
            </Card>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
