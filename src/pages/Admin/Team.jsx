import React from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, Button } from "../../components/UI";
import { WASHERS, WASHER_STATUS } from "../../utils/data";

const Team = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-surface-900">Team Management</h1>
        <Button size="sm">+ Add Washer</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {WASHERS.map((w) => (
          <Card key={w.name} className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center font-display text-primary-400 text-lg flex-shrink-0">
                {w.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-surface-900">{w.name}</h3>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${WASHER_STATUS[w.status]}`}
                  >
                    {w.status}
                  </span>
                </div>
                <div className="text-xs text-surface-400 mb-3">
                  Zone: {w.zone} · Rating: ⭐ {w.rating}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Today", `${w.jobs} jobs`],
                    ["Week", "12 jobs"],
                    ["Rating", `${w.rating} ★`],
                  ].map(([l, v]) => (
                    <div
                      key={l}
                      className="bg-surface-700/40 rounded-lg p-2 text-center"
                    >
                      <div className="text-xs text-surface-500">{l}</div>
                      <div className="text-sm font-medium text-surface-900 mt-0.5">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;
