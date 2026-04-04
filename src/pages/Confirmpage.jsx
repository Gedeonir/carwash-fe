import { useState } from "react";
import { Button, Card, Badge, TopBar } from "../components/UI";

const PAYMENT_METHODS = [
  { id: "momo", name: "MTN Mobile Money", icon: "📱", desc: "Pay with your MTN MoMo" },
  { id: "airtel", name: "Airtel Money", icon: "📲", desc: "Pay with Airtel Money" },
  { id: "card", name: "Card / Bank", icon: "💳", desc: "Visa, Mastercard" },
  { id: "cash", name: "Cash on arrival", icon: "💵", desc: "Pay when we arrive" },
];

export default function ConfirmPage({ navigate, bookingData }) {
  const [payment, setPayment] = useState("momo");
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => navigate("tracking", {}), 1600);
  };

  const rows = [
    ["Service", bookingData.service?.name || "Standard Wash"],
    ["Date", bookingData.date || "Today"],
    ["Time", bookingData.time || "10:00"],
    ["Location", bookingData.location || "KG 9 Ave, Kimihurura"],
    ["Duration", bookingData.service?.time || "60 min"],
  ];

  const total = bookingData.total || 10000;

  return (
    <div className="min-h-screen bg-surface-100 pb-32">
      <TopBar title="Confirm Booking" onBack={() => navigate("location")} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Success animation area */}
        {confirming && (
          <div className="fixed inset-0 bg-surface-900/95 z-50 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary-500/15 flex items-center justify-center mb-6 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-primary-500/25 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00C9B1" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
            <h2 className="font-display text-3xl text-white mb-2">Booking Confirmed!</h2>
            <p className="text-surface-400">Your wash is scheduled. Redirecting...</p>
          </div>
        )}

        {/* Booking details */}
        <Card glow className="p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg text-surface-900">Booking Summary</h3>
            <Badge variant="warning">Draft</Badge>
          </div>
          <div className="space-y-3">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-surface-400">{label}</span>
                <span className="text-surface-900 font-medium text-right max-w-[60%]">{value}</span>
              </div>
            ))}
            {bookingData.notes && (
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Notes</span>
                <span className="text-surface-900 font-medium text-right max-w-[60%]">{bookingData.notes}</span>
              </div>
            )}
          </div>
          {bookingData.addons?.length > 0 && (
            <div className="border-t border-white/8 mt-4 pt-4">
              <div className="text-xs text-surface-500 mb-2">Add-ons</div>
              <div className="flex flex-wrap gap-2">
                {bookingData.addons.map(id => (
                  <span key={id} className="text-xs bg-accent-400/10 border border-accent-400/20 text-accent-400 rounded-full px-2.5 py-0.5 capitalize">{id}</span>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-white/8 mt-5 pt-5 flex justify-between items-center">
            <span className="font-medium text-surface-900">Total amount</span>
            <div className="text-right">
              <div className="font-display text-2xl text-primary-600">{total.toLocaleString()} RWF</div>
              <div className="text-xs text-surface-500">incl. all taxes</div>
            </div>
          </div>
        </Card>

        {/* Washer assigned */}
        <Card className="p-4 mb-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center font-display text-white text-lg flex-shrink-0">JN</div>
          <div className="flex-1">
            <div className="text-sm font-medium text-surface-900">Jean Nkurunziza</div>
            <div className="text-xs text-surface-400">Your assigned washer · ⭐ 4.9</div>
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-700 hover:bg-surface-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C9B1" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.73-.73a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </button>
        </Card>

        {/* Payment */}
        <div className="mb-5">
          <h3 className="font-display text-lg text-surface-900 mb-3">Payment method</h3>
          <div className="flex flex-col gap-2">
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} onClick={() => setPayment(m.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${payment === m.id ? "border-primary-500 bg-primary-50" : "border-white/8 bg-surface-50 hover:border-white/15"}`}>
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-surface-900">{m.name}</div>
                  <div className="text-xs text-surface-500">{m.desc}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${payment === m.id ? "border-primary-500 bg-primary-500" : "border-white/25"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex justify-between gap-8 text-center py-4">
          {[["🔒", "Secure payment"], ["✅", "Verified washers"], ["↩️", "Free reschedule"]].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-lg">{icon}</span>
              <span className="text-xs text-surface-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-surface-900/95 backdrop-blur-md border-t border-white/8 p-4 z-30">
        <div className="max-w-2xl mx-auto">
          <Button className="w-full h-12" onClick={handleConfirm} disabled={confirming}>
            {confirming ? "Processing..." : `Confirm & Pay ${total.toLocaleString()} RWF →`}
          </Button>
        </div>
      </div>
    </div>
  );
}