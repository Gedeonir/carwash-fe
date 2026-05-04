import { useState } from "react";
import { Badge } from "../../components/UI";
import {
  useAdminBookings,
  useWashers,
  assignWasherToBooking,
  updateBookingStatus,
} from "./UseAdminData";

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", variant: "info" },
  assigned: { label: "Assigned", variant: "info" },
  heading: { label: "En Route", variant: "warning" },
  arrived: { label: "Arrived", variant: "warning" },
  "in-progress": { label: "In Progress", variant: "primary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
  "no-show": { label: "No Show", variant: "error" },
};

// Valid next statuses an admin can set
const ADMIN_TRANSITIONS = {
  confirmed: ["assigned", "cancelled"],
  assigned: ["heading", "cancelled"],
  heading: ["arrived", "cancelled"],
  arrived: ["in-progress"],
  "in-progress": ["completed", "no-show"],
};

function TableSkeleton() {
  return (
    <div className="space-y-3 mt-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-3 border-b border-surface-200 animate-pulse"
        >
          <div className="w-20 h-3 bg-surface-200 rounded" />
          <div className="flex-1 h-3 bg-surface-200 rounded" />
          <div className="w-24 h-3 bg-surface-200 rounded" />
          <div className="w-16 h-5 bg-surface-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function Bookings() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [assigning, setAssigning] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [actionError, setActionError] = useState(null);

  const {
    data: bookRes,
    loading,
    refetch,
  } = useAdminBookings({
    status: filterStatus === "all" ? undefined : filterStatus,
    date: dateFilter || undefined,
    page,
    limit: 15,
  });

  const { data: washers } = useWashers({ available: true });

  const bookings = bookRes?.data || [];
  const meta = bookRes?.meta || {};

  const handleAssign = async (bookingId, washerId) => {
    if (!washerId) return;
    setAssigning(bookingId);
    setActionError(null);
    try {
      await assignWasherToBooking(bookingId, washerId);
      refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Assignment failed");
    } finally {
      setAssigning(null);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingStatus(bookingId);
    setActionError(null);
    try {
      await updateBookingStatus(bookingId, newStatus);
      refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const STATUS_FILTERS = [
    "all",
    "confirmed",
    "assigned",
    "heading",
    "in-progress",
    "completed",
    "cancelled",
  ];  

  return (
    <div>
      {/* Header */}
      <div className="block md:flex items-start justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl text-surface-900 mb-3 md:mb-0">
          Bookings
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Date filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-surface-200 bg-surface-50 text-surface-700 focus:outline-none focus:border-primary-500 transition-colors"
          />
          {dateFilter && (
            <button
              onClick={() => {
                setDateFilter("");
                setPage(1);
              }}
              className="text-xs text-surface-400 hover:text-error transition-colors"
            >
              Clear date ✕
            </button>
          )}
        </div>
      </div>

      {/* Status tabs */}
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

      {/* Error */}
      {actionError && (
        <div className="mb-4 bg-error/8 border border-error/25 rounded-xl px-4 py-3 text-sm text-error flex items-center justify-between">
          {actionError}
          <button
            onClick={() => setActionError(null)}
            className="text-error hover:opacity-70"
          >
            ✕
          </button>
        </div>
      )}

      {/* Summary counts */}
      {!loading && meta.total !== undefined && (
        <p className="text-xs text-surface-400 mb-3">
          Showing {bookings.length} of {meta.total} bookings
          {filterStatus !== "all" && ` · filtered by "${filterStatus}"`}
          {dateFilter && ` · ${dateFilter}`}
        </p>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-surface-50">
        {loading ? (
          <TableSkeleton />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                {[
                  "Ref",
                  "Customer",
                  "Service",
                  "Date / Time",
                  "Location",
                  "Washer",
                  "Amount",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-3 text-xs font-semibold text-surface-500 pb-3 pr-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-12 text-surface-400 text-sm"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const sc = STATUS_CONFIG[b.status] || {};
                  const nextSteps = ADMIN_TRANSITIONS[b.status] || [];
                  const isAssigning = assigning === b._id;
                  const isUpdatingThis = updatingStatus === b._id;

                  return (
                    <tr
                      key={b._id}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="py-3.5 pr-4 text-xs font-mono text-surface-400 whitespace-nowrap">
                        {b.bookingRef}
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="text-sm font-medium text-surface-900 whitespace-nowrap">
                          {b.customer?.name}
                        </div>
                        {b.isGuest && (
                          <div className="text-xs text-surface-400">Guest</div>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-sm text-surface-600 whitespace-nowrap">
                        {b.service?.name}
                      </td>
                      <td className="py-3.5 pr-4 text-sm text-surface-600 whitespace-nowrap">
                        <div>
                          {new Date(b.scheduledDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-surface-400">
                          {b.scheduledTime}
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-sm text-surface-500 max-w-[120px] truncate">
                        {b.location?.address?.split(",")[0]}
                      </td>
                      <td className="py-3.5 pr-4 text-sm text-surface-600 whitespace-nowrap">
                        {b.washer?.name || (
                          <span className="text-surface-300 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-sm font-medium text-primary-600 whitespace-nowrap">
                        {b.totalAmount?.toLocaleString()} RWF
                      </td>
                      <td className="py-3.5 pr-4">
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          {/* Assign washer — only for confirmed without washer */}
                          {b.status === "confirmed" && !b.washer && (
                            <select
                              disabled={isAssigning}
                              defaultValue=""
                              onChange={(e) =>
                                e.target.value &&
                                handleAssign(b._id, e.target.value)
                              }
                              className="text-xs bg-white border border-surface-200 text-surface-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary-500 cursor-pointer disabled:opacity-50"
                            >
                              <option value="" disabled>
                                {isAssigning ? "Assigning..." : "Assign washer"}
                              </option>
                              {(washers || []).map((w) => (
                                <option key={w._id} value={w._id}>
                                  {w.name} ({w.zone})
                                </option>
                              ))}
                            </select>
                          )}

                          {/* Status advance — admin can push status forward */}
                          {nextSteps.length > 0 && (
                            <select
                              disabled={isUpdatingThis}
                              defaultValue=""
                              onChange={(e) =>
                                e.target.value &&
                                handleStatusChange(b._id, e.target.value)
                              }
                              className="text-xs bg-white border border-surface-200 text-surface-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary-500 cursor-pointer disabled:opacity-50"
                            >
                              <option value="" disabled>
                                {isUpdatingThis
                                  ? "Updating..."
                                  : "Update status"}
                              </option>
                              {nextSteps.map((s) => (
                                <option key={s} value={s}>
                                  {s.replace("-", " ")}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-50 rounded-xl p-4 border border-surface-200 animate-pulse"
            >
              <div className="flex justify-between mb-3">
                <div className="w-24 h-3 bg-surface-200 rounded" />
                <div className="w-16 h-5 bg-surface-200 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-surface-200 rounded w-3/4" />
                <div className="h-3 bg-surface-200 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-surface-400 text-sm">
            No bookings found
          </div>
        ) : (
          bookings.map((b) => {
            const sc = STATUS_CONFIG[b.status] || {};
            const nextSteps = ADMIN_TRANSITIONS[b.status] || [];

            return (
              <div
                key={b._id}
                className="bg-surface-50 rounded-xl p-4 border border-surface-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-surface-400 font-mono">
                      {b.bookingRef}
                    </p>
                    <p className="text-sm font-semibold text-surface-900">
                      {b.customer?.name}
                    </p>
                    {b.isGuest && (
                      <span className="text-xs text-surface-400">Guest</span>
                    )}
                  </div>
                  <Badge variant={sc.variant}>{sc.label}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-surface-500 mb-3">
                  <p>
                    <span className="font-medium">Service:</span>{" "}
                    {b.service?.name}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {b.scheduledTime}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(b.scheduledDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Washer:</span>{" "}
                    {b.washer?.name || "Unassigned"}
                  </p>
                  <p className="col-span-2">
                    <span className="font-medium">Location:</span>{" "}
                    {b.location?.address?.split(",")[0]}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-primary-600">
                    {b.totalAmount?.toLocaleString()} RWF
                  </p>
                  <div className="flex gap-2">
                    {b.status === "confirmed" && !b.washer && (
                      <select
                        defaultValue=""
                        onChange={(e) =>
                          e.target.value && handleAssign(b._id, e.target.value)
                        }
                        className="text-xs bg-white border border-surface-200 text-surface-700 rounded-lg px-2 py-1.5 focus:outline-none"
                      >
                        <option value="" disabled>
                          Assign
                        </option>
                        {(washers || []).map((w) => (
                          <option key={w._id} value={w._id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {nextSteps.length > 0 && (
                      <select
                        defaultValue=""
                        onChange={(e) =>
                          e.target.value &&
                          handleStatusChange(b._id, e.target.value)
                        }
                        className="text-xs bg-white border border-surface-200 text-surface-700 rounded-lg px-2 py-1.5 focus:outline-none"
                      >
                        <option value="" disabled>
                          Status
                        </option>
                        {nextSteps.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("-", " ")}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-200">
          <p className="text-xs text-surface-400">
            Page {meta.page} of {meta.pages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-200 bg-surface-50 text-surface-600 disabled:opacity-40 hover:bg-surface-100 transition-colors"
            >
              ← Prev
            </button>
            <button
              disabled={page >= meta.pages}
              onClick={() => setPage((p) => p + 1)}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-200 bg-surface-50 text-surface-600 disabled:opacity-40 hover:bg-surface-100 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
