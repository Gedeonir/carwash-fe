import React from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, Badge } from "../../components/UI";
import { BOOKINGS } from "../../utils/data";

const Customers = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-surface-900">Customer Accounts</h1>
        <div className="text-sm text-surface-400">Total: 247 customers</div>
      </div>
      <div className="flex flex-col gap-3">
        {[
          {
            name: "Amira Kagabo",
            email: "amira@example.com",
            washes: 12,
            spent: "187,000",
            lastWash: "Today",
            tier: "Gold",
            avatar: "AK",
          },
          {
            name: "James Mukuralinda",
            email: "james@example.com",
            washes: 7,
            spent: "95,000",
            lastWash: "3 days ago",
            tier: "Silver",
            avatar: "JM",
          },
          {
            name: "Claudine Uwera",
            email: "claudine@example.com",
            washes: 18,
            spent: "312,000",
            lastWash: "Yesterday",
            tier: "Platinum",
            avatar: "CU",
          },
          {
            name: "David Bizimana",
            email: "david@example.com",
            washes: 3,
            spent: "28,000",
            lastWash: "1 week ago",
            tier: "Bronze",
            avatar: "DB",
          },
          {
            name: "Marie Iradukunda",
            email: "marie@example.com",
            washes: 9,
            spent: "142,000",
            lastWash: "4 days ago",
            tier: "Gold",
            avatar: "MI",
          },
        ].map((c) => {
          const tierColor = {
            Platinum: "text-info border-info/20 bg-info/10",
            Gold: "text-accent-400 border-accent-400/20 bg-accent-400/10",
            Silver: "text-surface-300 border-white/10 bg-white/5",
            Bronze: "text-warning border-warning/20 bg-warning/10",
          };
          return (
            <Card
              key={c.name}
              className="p-4 hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-medium flex-shrink-0">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-surface-900 text-sm">
                      {c.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${tierColor[c.tier]}`}
                    >
                      {c.tier}
                    </span>
                  </div>
                  <div className="text-xs text-surface-400 truncate">
                    {c.email}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-white">
                    {c.washes} washes
                  </div>
                  <div className="text-xs text-surface-400">{c.spent} RWF</div>
                </div>
                <div className="text-right flex-shrink-0 hidden md:block">
                  <div className="text-xs text-surface-500">Last wash</div>
                  <div className="text-xs text-surface-300">{c.lastWash}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Customers;
