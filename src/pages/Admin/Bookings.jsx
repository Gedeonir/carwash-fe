import React from "react";
import DashboardLayout from "./DashboardLayout";
import {
  STATUS_CONFIG,
  BOOKINGS,
  WASHERS,
  WASHER_STATUS,
} from "../../utils/data";
import { useState } from "react";
import { Badge } from "../../components/UI";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered =
    filterStatus === "all"
      ? BOOKINGS
      : BOOKINGS.filter((b) => b.status === filterStatus);
  const todayRevenue = BOOKINGS.filter((b) => b.status === "completed").reduce(
    (s, b) => s + b.amount,
    0,
  );
  const activeJobs = BOOKINGS.filter((b) =>
    ["in-progress", "heading"].includes(b.status),
  ).length;
  return (
    <div>
      <div className="block md:flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-surface-900">Bookings</h1>
        <div className="flex gap-2">
          {["all", "confirmed", "heading", "in-progress", "completed"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-2 md:px-3 py-1.5 rounded-lg border transition-all capitalize ${filterStatus === s ? "bg-primary-500 border-primary-500 text-surface-900" : "border-white/10 text-surface-400 hover:text-surface-900 hover:border-white/25"}`}
              >
                {s === "all" ? "All" : s.replace("-", " ")}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              {[
                "ID",
                "Customer",
                "Service",
                "Time",
                "Location",
                "Washer",
                "Amount",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-medium text-surface-500 pb-3 pr-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((b) => {
              const sc = STATUS_CONFIG[b.status];
              return (
                <tr key={b.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3.5 pr-4 text-xs font-mono text-surface-500">
                    {b.id}
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-surface-900 font-medium">
                    {b.customer}
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-surface-300">
                    {b.service}
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-surface-300">
                    {b.time}
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-surface-400">
                    {b.location}
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-surface-300">
                    {b.washer}
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-primary-600">
                    {b.amount.toLocaleString()} RWF
                  </td>
                  <td className="py-3.5 pr-4">
                    <Badge variant={sc.variant}>{sc.label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.map((b) => {
          const sc = STATUS_CONFIG[b.status];

          return (
            <div
              key={b.id}
              className="bg-surface-50 rounded-xl p-4 border border-white/10 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-surface-500 font-mono">{b.id}</p>
                  <p className="text-sm font-medium text-surface-900">
                    {b.customer}
                  </p>
                </div>
                <Badge variant={sc.variant}>{sc.label}</Badge>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-surface-400">
                <p>
                  <span className="text-surface-500">Service:</span> {b.service}
                </p>
                <p>
                  <span className="text-surface-500">Time:</span> {b.time}
                </p>
                <p>
                  <span className="text-surface-500">Location:</span>{" "}
                  {b.location}
                </p>
                <p>
                  <span className="text-surface-500">Washer:</span> {b.washer}
                </p>
              </div>

              <div className="mt-3 text-primary-600 text-sm font-medium">
                {b.amount.toLocaleString()} RWF
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bookings;
