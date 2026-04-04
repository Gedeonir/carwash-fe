import { useState } from "react";
import { Button, Input, Card, TopBar, ProgressSteps } from "../components/UI";

const SAVED = [
  { id: "home", label: "Home", address: "KG 9 Ave, Kimihurura, Kigali", icon: "🏠" },
  { id: "work", label: "Work", address: "KN 4 St, CBD, Kigali", icon: "🏢" },
];

const SUGGESTIONS = [
  "Kiyovu, Kigali", "Nyamirambo, Kigali", "Remera, Kigali",
  "Kibagabaga, Kigali", "Gisozi, Kigali", "Gacuriro, Kigali",
];

export default function LocationPage({ navigate, bookingData }) {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");
  const [notes, setNotes] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  const finalLocation = selected === "custom" ? custom : SAVED.find(s => s.id === selected)?.address;

  return (
    <div className="min-h-screen bg-surface-50 pb-32">
      <TopBar title="Where should we come?" onBack={() => navigate("booking")} />
      <ProgressSteps steps={["Service", "Schedule", "Location"]} current={2} />

      <div className="max-w-2xl mx-auto px-4">
        <h2 className="font-display text-2xl text-surface-900 mb-2">Set your location</h2>
        <p className="text-surface-500 text-sm mb-6">We'll come right to you — home, work, or anywhere in Kigali</p>

        {/* Saved locations */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-surface-400 mb-3">Saved locations</h3>
          <div className="flex flex-col gap-3">
            {SAVED.map(loc => (
              <button key={loc.id} onClick={() => { setSelected(loc.id); setCustom(""); }}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${selected === loc.id ? "border-primary-500 bg-primary-500/8" : "border-white/8 bg-surface-800/50 hover:border-white/20"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${selected === loc.id ? "bg-primary-500/15" : "bg-surface-700"}`}>{loc.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-surface-900 text-sm">{loc.label}</div>
                  <div className="text-xs text-surface-500 truncate">{loc.address}</div>
                </div>
                {selected === loc.id && (
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom location */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-surface-300 mb-3">Enter a custom address</h3>
          <div className="relative">
            <Input
              placeholder="e.g. KG 123 St, Kimironko, Kigali"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setSelected("custom"); setShowSuggest(e.target.value.length > 0); }}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
            />
            {showSuggest && custom.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-800 border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                {SUGGESTIONS.filter(s => s.toLowerCase().includes(custom.toLowerCase())).slice(0, 4).map(s => (
                  <button key={s} onClick={() => { setCustom(s); setShowSuggest(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-surface-200 hover:bg-surface-700/50 flex items-center gap-3 border-b border-white/5 last:border-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-white/8 relative h-48 bg-surface-800/50">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,201,177,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,201,177,0.04)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C9B1" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            {finalLocation ? (
              <div className="text-center px-4">
                <div className="text-sm font-medium text-white">{finalLocation}</div>
                <div className="text-xs text-primary-400 mt-0.5">Pin confirmed</div>
              </div>
            ) : (
              <p className="text-sm text-surface-400">Map preview</p>
            )}
          </div>
          {finalLocation && <div className="absolute inset-0 bg-primary-500/5 pointer-events-none rounded-2xl ring-2 ring-primary-500/25" />}
        </div>

        {/* Special notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-300 mb-2">Access notes <span className="text-surface-500 font-normal">(optional)</span></label>
          <textarea
            placeholder="e.g. Gate code is 1234, park in Slot B..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none text-sm transition-all"
          />
        </div>

        {/* Booking summary */}
        {bookingData.service && (
          <Card className="p-4">
            <h4 className="text-sm font-medium text-surface-300 mb-3">Your booking</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-surface-400">Service</span><span className="text-white">{bookingData.service?.name}</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Date</span><span className="text-white">{bookingData.date}</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Time</span><span className="text-white">{bookingData.time}</span></div>
              <div className="border-t border-white/8 pt-2 flex justify-between">
                <span className="font-medium text-white">Total</span>
                <span className="font-display text-primary-400">{bookingData.total?.toLocaleString()} RWF</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-surface-900/95 backdrop-blur-md border-t border-white/8 p-4 z-30">
        <div className="max-w-2xl mx-auto">
          <Button className="w-full h-12" disabled={!finalLocation}
            onClick={() => navigate("confirm", { location: finalLocation, notes })}>
            Review & Confirm →
          </Button>
        </div>
      </div>
    </div>
  );
}