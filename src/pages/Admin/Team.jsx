import { useState } from "react";
import { Card, Button, Badge } from "../../components/UI";
import { useWashers, updateWasher } from "./useAdminData";

const STATUS_STYLE = {
  available: "bg-success/15 text-success",
  busy: "bg-warning/15 text-warning",
};

function WasherSkeleton() {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-200 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 bg-surface-200 rounded w-1/3" />
            <div className="h-5 bg-surface-200 rounded-full w-16" />
          </div>
          <div className="h-3 bg-surface-200 rounded w-1/2" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-surface-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Team({ navigate }) {
  const { data: washers, loading, error, refetch } = useWashers();
  const [editing, setEditing] = useState(null); // washer _id being edited
  const [zoneEdit, setZoneEdit] = useState("");
  const [saving, setSaving] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const handleToggleAvailability = async (washer) => {
    setSaving(washer._id);
    setSaveError(null);
    try {
      await updateWasher(washer._id, { isAvailable: !washer.isAvailable });
      refetch();
    } catch (err) {
      setSaveError(
        err?.response?.data?.message || "Failed to update availability",
      );
    } finally {
      setSaving(null);
    }
  };

  const handleZoneSave = async (washer) => {
    if (!zoneEdit.trim()) return;
    setSaving(washer._id);
    setSaveError(null);
    try {
      await updateWasher(washer._id, { zone: zoneEdit.trim() });
      setEditing(null);
      refetch();
    } catch (err) {
      setSaveError(err?.response?.data?.message || "Failed to update zone");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-surface-900">
            Team Management
          </h1>
          {!loading && washers && (
            <p className="text-sm text-surface-400 mt-0.5">
              {washers.length} washer{washers.length !== 1 ? "s" : ""} ·{" "}
              {(washers || []).filter((w) => w.isAvailable).length} available
            </p>
          )}
        </div>
        <Button size="sm" onClick={() => navigate("/admin/team/new")}>
          + Add Washer
        </Button>
      </div>

      {/* Error */}
      {(error || saveError) && (
        <div className="mb-5 bg-error/8 border border-error/25 rounded-xl px-4 py-3 text-sm text-error flex justify-between">
          {saveError || error}
          <button
            onClick={() => setSaveError(null)}
            className="text-error hover:opacity-70"
          >
            ✕
          </button>
        </div>
      )}

      {/* Availability summary bar */}
      {!loading && washers && washers.length > 0 && (
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          {[
            {
              label: "All",
              count: washers.length,
              color: "bg-surface-200 text-surface-700",
            },
            {
              label: "Available",
              count: washers.filter((w) => w.isAvailable).length,
              color: "bg-success/15 text-success",
            },
            {
              label: "Busy",
              count: washers.filter((w) => !w.isAvailable).length,
              color: "bg-warning/15 text-warning",
            },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${color}`}
            >
              <span>{label}</span>
              <span className="font-bold">{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Washer grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => <WasherSkeleton key={i} />)
        ) : !washers || washers.length === 0 ? (
          <div className="col-span-2 text-center py-16">
            <p className="text-surface-400 text-sm">
              No washers found. Add your first washer to get started.
            </p>
          </div>
        ) : (
          washers.map((w) => {
            const statusKey = w.isAvailable ? "available" : "busy";
            const initials = (w.name || "?").slice(0, 2).toUpperCase();
            const isSavingThis = saving === w._id;
            const isEditingZone = editing === w._id;

            return (
              <Card
                key={w._id}
                className="p-5 hover:border-surface-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center font-display text-surface-50 text-lg flex-shrink-0">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + status */}
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-surface-900 truncate">
                        {w.name}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize flex-shrink-0 ml-2 ${STATUS_STYLE[statusKey]}`}
                      >
                        {statusKey}
                      </span>
                    </div>

                    {/* Zone (editable) */}
                    <div className="flex items-center gap-2 mb-3">
                      {isEditingZone ? (
                        <div className="flex flex-col w-full">
                          <input
                            type="text"
                            value={zoneEdit}
                            onChange={(e) => setZoneEdit(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleZoneSave(w)
                            }
                            className="text-xs border border-primary-500 rounded-lg px-2 py-1 text-surface-700 focus:outline-none w-full"
                            autoFocus
                          />
                          <div className="flex justify-start gap-2">
                            <button
                              onClick={() => handleZoneSave(w)}
                              disabled={isSavingThis}
                              className="text-xs text-primary-600 hover:text-primary-500 font-medium transition-colors disabled:opacity-50"
                            >
                              {isSavingThis ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="text-xs text-surface-400 hover:text-surface-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative flex flex-col">
                          <span className="text-xs text-surface-500">
                            Zone:{" "}
                            <strong className="text-surface-700">
                              {w.zone?.address || "—"}
                            </strong>
                          </span>
                          <button
                            onClick={() => {
                              setEditing(w._id);
                              setZoneEdit(w.zone?.address || "");
                            }}
                            className="text-xs text-primary-500 hover:text-primary-600 transition-colors w-8"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                      <span className="text-xs text-surface-400 ml-auto">
                        ⭐ {w.rating} ({w.totalReviews} reviews)
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        ["Rating", `${w.rating} ★`],
                        ["Reviews", w.totalReviews || 0],
                        ["Status", w.isAvailable ? "Free" : "Busy"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="bg-surface-100 rounded-lg p-2 text-center"
                        >
                          <div className="text-xs text-surface-400">
                            {label}
                          </div>
                          <div className="text-sm font-semibold text-surface-900 mt-0.5">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Contact + toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {w.email && (
                          <span className="text-xs text-surface-400">
                            {w.email}
                          </span>
                        )}
                        {w.phone && (
                          <span className="text-xs text-surface-400">
                            {w.phone}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleToggleAvailability(w)}
                        disabled={isSavingThis}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50 ${
                          w.isAvailable
                            ? "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20"
                            : "bg-success/10 text-success border border-success/20 hover:bg-success/20"
                        }`}
                      >
                        {isSavingThis
                          ? "Saving..."
                          : w.isAvailable
                            ? "Set unavailable"
                            : "Set available"}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
