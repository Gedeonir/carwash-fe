import { useState } from "react";
import { Card, Badge, StatCard, Button, TopBar } from "../components/UI";

const BOOKINGS = [
  { id: "IK-001", customer: "Amira Kagabo", service: "Premium Detail", time: "09:00", location: "Kimihurura", status: "in-progress", washer: "Jean N.", amount: 18000 },
  { id: "IK-002", customer: "James Mukuralinda", service: "Standard", time: "10:30", location: "Kiyovu", status: "heading", washer: "Pascal M.", amount: 10000 },
  { id: "IK-003", customer: "Claudine Uwera", service: "Basic Wash", time: "11:00", location: "Remera", status: "confirmed", washer: "Eric K.", amount: 5000 },
  { id: "IK-004", customer: "David Bizimana", service: "Standard", time: "13:00", location: "Gisozi", status: "confirmed", washer: "Unassigned", amount: 10000 },
  { id: "IK-005", customer: "Marie Iradukunda", service: "Premium Detail", time: "14:30", location: "Nyamirambo", status: "completed", washer: "Jean N.", amount: 18000 },
  { id: "IK-006", customer: "Patrick Nsabimana", service: "Basic Wash", time: "15:00", location: "Kibagabaga", status: "completed", washer: "Pascal M.", amount: 5000 },
];

const WASHERS = [
  { name: "Jean Nkurunziza", status: "busy", rating: 4.9, jobs: 2, zone: "Kimihurura", avatar: "JN" },
  { name: "Pascal Mugisha", status: "heading", rating: 4.8, jobs: 1, zone: "Kiyovu", avatar: "PM" },
  { name: "Eric Kayumba", status: "available", rating: 4.7, jobs: 0, zone: "Remera", avatar: "EK" },
  { name: "Alice Mutoni", status: "available", rating: 4.9, jobs: 0, zone: "CBD", avatar: "AM" },
];

const STATUS_CONFIG = {
  "confirmed": { label: "Confirmed", variant: "info" },
  "heading": { label: "En Route", variant: "warning" },
  "in-progress": { label: "In Progress", variant: "primary" },
  "completed": { label: "Completed", variant: "success" },
  "cancelled": { label: "Cancelled", variant: "error" },
};

const WASHER_STATUS = {
  available: "bg-success/15 text-success",
  busy: "bg-warning/15 text-warning",
  heading: "bg-info/15 text-info",
};

export default function AdminDashboard({ navigate }) {
  const [tab, setTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = filterStatus === "all" ? BOOKINGS : BOOKINGS.filter(b => b.status === filterStatus);
  const todayRevenue = BOOKINGS.filter(b => b.status === "completed").reduce((s, b) => s + b.amount, 0);
  const activeJobs = BOOKINGS.filter(b => ["in-progress","heading"].includes(b.status)).length;


  return (
    <div className="min-h-screen bg-surface-900">
      <div className="max-w-7xl mx-auto px-6 py-8">


        {/* BOOKINGS */}
        {tab === "bookings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl text-white">Bookings</h1>
              <div className="flex gap-2">
                {["all","confirmed","heading","in-progress","completed"].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${filterStatus === s ? "bg-primary-500 border-primary-500 text-surface-900" : "border-white/10 text-surface-400 hover:text-white hover:border-white/25"}`}>
                    {s === "all" ? "All" : s.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    {["ID", "Customer", "Service", "Time", "Location", "Washer", "Amount", "Status"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-surface-500 pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(b => {
                    const sc = STATUS_CONFIG[b.status];
                    return (
                      <tr key={b.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3.5 pr-4 text-xs font-mono text-surface-500">{b.id}</td>
                        <td className="py-3.5 pr-4 text-sm text-white font-medium">{b.customer}</td>
                        <td className="py-3.5 pr-4 text-sm text-surface-300">{b.service}</td>
                        <td className="py-3.5 pr-4 text-sm text-surface-300">{b.time}</td>
                        <td className="py-3.5 pr-4 text-sm text-surface-400">{b.location}</td>
                        <td className="py-3.5 pr-4 text-sm text-surface-300">{b.washer}</td>
                        <td className="py-3.5 pr-4 text-sm text-white">{b.amount.toLocaleString()} RWF</td>
                        <td className="py-3.5 pr-4"><Badge variant={sc.variant}>{sc.label}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEAM */}
        {tab === "team" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl text-white">Team Management</h1>
              <Button size="sm">+ Add Washer</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {WASHERS.map(w => (
                <Card key={w.name} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center font-display text-primary-400 text-lg flex-shrink-0">{w.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white">{w.name}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${WASHER_STATUS[w.status]}`}>{w.status}</span>
                      </div>
                      <div className="text-xs text-surface-400 mb-3">Zone: {w.zone} · Rating: ⭐ {w.rating}</div>
                      <div className="grid grid-cols-3 gap-2">
                        {[["Today", `${w.jobs} jobs`], ["Week", "12 jobs"], ["Rating", `${w.rating} ★`]].map(([l, v]) => (
                          <div key={l} className="bg-surface-700/40 rounded-lg p-2 text-center">
                            <div className="text-xs text-surface-400">{l}</div>
                            <div className="text-sm font-medium text-white mt-0.5">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {tab === "customers" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl text-white">Customer Accounts</h1>
              <div className="text-sm text-surface-400">Total: 247 customers</div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { name: "Amira Kagabo", email: "amira@example.com", washes: 12, spent: "187,000", lastWash: "Today", tier: "Gold", avatar: "AK" },
                { name: "James Mukuralinda", email: "james@example.com", washes: 7, spent: "95,000", lastWash: "3 days ago", tier: "Silver", avatar: "JM" },
                { name: "Claudine Uwera", email: "claudine@example.com", washes: 18, spent: "312,000", lastWash: "Yesterday", tier: "Platinum", avatar: "CU" },
                { name: "David Bizimana", email: "david@example.com", washes: 3, spent: "28,000", lastWash: "1 week ago", tier: "Bronze", avatar: "DB" },
                { name: "Marie Iradukunda", email: "marie@example.com", washes: 9, spent: "142,000", lastWash: "4 days ago", tier: "Gold", avatar: "MI" },
              ].map(c => {
                const tierColor = { Platinum: "text-info border-info/20 bg-info/10", Gold: "text-accent-400 border-accent-400/20 bg-accent-400/10", Silver: "text-surface-300 border-white/10 bg-white/5", Bronze: "text-warning border-warning/20 bg-warning/10" };
                return (
                  <Card key={c.name} className="p-4 hover:border-white/15 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-medium flex-shrink-0">{c.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white text-sm">{c.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${tierColor[c.tier]}`}>{c.tier}</span>
                        </div>
                        <div className="text-xs text-surface-400 truncate">{c.email}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-medium text-white">{c.washes} washes</div>
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
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <div>
            <h1 className="font-display text-2xl text-white mb-6">Reports & Analytics</h1>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <StatCard label="Monthly Revenue" value="847,000 RWF" trend={18} color="primary"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>} />
              <StatCard label="Total Washes" value="341" trend={22} color="success"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
              <StatCard label="Repeat Customers" value="67%" trend={5} color="accent"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="font-display text-base text-white mb-4">Revenue by service</h3>
                {[["Premium Detail", 18000, 45], ["Standard", 10000, 35], ["Basic Wash", 5000, 20]].map(([name, price, pct]) => (
                  <div key={name} className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-surface-300">{name}</span>
                      <span className="text-white">{pct}%</span>
                    </div>
                    <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{width:`${pct}%`}} />
                    </div>
                  </div>
                ))}
              </Card>

              <Card className="p-5">
                <h3 className="font-display text-base text-white mb-4">Popular zones</h3>
                {[["Kimihurura", 28], ["Kiyovu", 22], ["Remera", 18], ["Nyamirambo", 15], ["Other", 17]].map(([zone, pct]) => (
                  <div key={zone} className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-surface-300">{zone}</span>
                      <span className="text-white">{pct}%</span>
                    </div>
                    <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-400 rounded-full" style={{width:`${pct}%`}} />
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}