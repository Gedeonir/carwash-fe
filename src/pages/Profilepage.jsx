import { useState } from "react";
import { Button, Card, Badge, TopBar } from "../components/UI";

const HISTORY = [
  { id: "IK-001", service: "Premium Detail", date: "3 Apr 2025", amount: 18000, status: "completed", washer: "Jean N." },
  { id: "IK-002", service: "Standard Wash", date: "27 Mar 2025", amount: 10000, status: "completed", washer: "Pascal M." },
  { id: "IK-003", service: "Basic Wash", date: "18 Mar 2025", amount: 5000, status: "completed", washer: "Eric K." },
  { id: "IK-004", service: "Standard Wash", date: "10 Mar 2025", amount: 10000, status: "cancelled", washer: "Jean N." },
];

const SAVED_CARS = [
  { plate: "RAB 123A", model: "Toyota RAV4", color: "Silver", year: "2022" },
  { plate: "RAC 456B", model: "Honda CR-V", color: "Black", year: "2020" },
];

function PreferenceRow({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
      <span className="text-sm text-surface-500">{label}</span>
      <button onClick={() => setOn(!on)}
        className={`w-10 h-6 rounded-full relative transition-all duration-250 ${on ? "bg-primary-500" : "bg-surface-700"}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-250 ${on ? "left-5" : "left-1"}`} />
      </button>
    </div>
  );
}

export default function ProfilePage({ navigate }) {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Amira Kagabo",
    email: "amira@example.com",
    phone: "+250 788 123 456",
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const totalSpent = HISTORY.filter(h => h.status === "completed").reduce((s, h) => s + h.amount, 0);
  const totalWashes = HISTORY.filter(h => h.status === "completed").length;

  return (
    <div className="min-h-screen bg-surface-100 pb-24">
      <TopBar title="My Profile" onBack={() => navigate(-1)} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center mb-8 bg-surface-50 py-4">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center font-display text-3xl text-primary-400">
              AK
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center border-1 border-surface-100">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="2.5" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          <h2 className="font-display text-2xl text-surface-900 mb-1">{form.name}</h2>
          <p className="text-surface-500 text-sm mb-3">{form.email}</p>
          <div className="flex gap-2">
            <Badge variant="primary">VIP Member</Badge>
            <Badge variant="success">{totalWashes} Washes</Badge>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            ["Total washes", totalWashes],
            ["Total spent", `${(totalSpent / 1000).toFixed(0)}k RWF`],
            ["Avg rating", "4.8 ★"],
          ].map(([label, value]) => (
            <Card key={label} className="p-4 text-center">
              <div className="font-display text-lg text-surface-900 mb-1">{value}</div>
              <div className="text-xs text-surface-500 leading-tight">{label}</div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl p-1 mb-6">
          {[["profile", "Profile"], ["cars", "My Cars"], ["history", "History"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-primary-500 text-surface-900" : "text-surface-500 hover:text-surface-600"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div className="flex flex-col gap-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-base text-surface-900">Personal Info</h3>
                <button onClick={() => setEditing(!editing)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  ["Full Name", "name", "text"],
                  ["Email address", "email", "email"],
                  ["Phone number", "phone", "tel"],
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="block text-xs text-surface-500 mb-1.5">{label}</label>
                    {editing ? (
                      <input
                        type={type}
                        value={form[key]}
                        onChange={set(key)}
                        className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      />
                    ) : (
                      <p className="text-sm text-surface-900">{form[key]}</p>
                    )}
                  </div>
                ))}
              </div>
              {editing && (
                <Button className="w-full mt-5" onClick={() => setEditing(false)}>
                  Save Changes
                </Button>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-base text-surface-900 mb-2">Notifications</h3>
              <PreferenceRow label="Email notifications" defaultOn={true} />
              <PreferenceRow label="SMS reminders" defaultOn={true} />
              <PreferenceRow label="Push notifications" defaultOn={false} />
              <PreferenceRow label="Promotional offers" defaultOn={false} />
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-base text-white mb-2">Account</h3>
              {["Change password", "Privacy settings", "Referral program"].map((item) => (
                <button key={item}
                  className="w-full text-left text-sm text-surface-500 py-3 border-b border-white/6 last:border-0 hover:text-surface-600 transition-colors flex items-center justify-between">
                  {item}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-surface-600"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
              <button className="w-full text-left text-sm text-error py-3 mt-1 hover:opacity-80 transition-opacity">
                Sign out
              </button>
            </Card>
          </div>
        )}

        {/* ── CARS TAB ── */}
        {tab === "cars" && (
          <div>
            <div className="flex flex-col gap-3 mb-4">
              {SAVED_CARS.map((car, i) => (
                <Card key={i} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-700 flex items-center justify-center text-2xl flex-shrink-0">
                    🚗
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-surface-900 text-sm mb-0.5">{car.model}</div>
                    <div className="text-xs text-surface-500">{car.plate} · {car.color} · {car.year}</div>
                  </div>
                  <button className="text-xs text-surface-500 hover:text-error transition-colors flex-shrink-0">
                    Remove
                  </button>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              + Add another car
            </Button>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div className="flex flex-col gap-3">
            {HISTORY.map((h) => (
              <Card key={h.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-surface-900 text-sm mb-0.5">{h.service}</div>
                    <div className="text-xs text-surface-500">{h.date} · {h.washer}</div>
                  </div>
                  <Badge variant={h.status === "completed" ? "success" : "error"}>
                    {h.status === "completed" ? "Completed" : "Cancelled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-500 font-mono">{h.id}</span>
                  <span className="font-display text-base text-primary-600">
                    {h.amount.toLocaleString()} <span className="text-xs font-sans text-surface-400">RWF</span>
                  </span>
                </div>
                {h.status === "completed" && (
                  <button
                    onClick={() => navigate("booking")}
                    className="text-xs text-primary-400 hover:text-primary-300 mt-2 transition-colors block">
                    Book again →
                  </button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}