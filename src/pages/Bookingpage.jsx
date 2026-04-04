import { useState } from "react";
import { Button, Card, Badge, TopBar, ProgressSteps } from "../components/UI";

const SERVICES = [
  { id: "basic", name: "Basic Wash", price: 5000, time: "45 min", desc: "Exterior rinse, hand wash & dry", icon: "💧", includes: ["Exterior hand wash", "Wheel clean", "Window wipe"] },
  { id: "standard", name: "Standard", price: 10000, time: "60 min", desc: "Full exterior + interior vacuum", icon: "✨", includes: ["Everything in Basic", "Interior vacuum", "Dashboard wipe", "Air freshener"], popular: true },
  { id: "premium", name: "Premium Detail", price: 18000, time: "90 min", desc: "Complete detail, wax & polish", icon: "🏆", includes: ["Everything in Standard", "Clay bar treatment", "Wax & polish", "Leather conditioning", "Engine bay wipe"] },
];

const ADDONS = [
  { id: "engine", name: "Engine Bay", price: 3000 },
  { id: "seats", name: "Seat Shampoo", price: 4000 },
  { id: "ceramic", name: "Ceramic Coat", price: 15000 },
];

const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function getDates() {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : days[d.getDay()], date: `${d.getDate()} ${months[d.getMonth()]}`, d };
  });
}

export default function BookingPage({ navigate, bookingData }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [addons, setAddons] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const dates = getDates();
  const selectedService = SERVICES.find(s => s.id === service);
  const addonTotal = addons.reduce((sum, id) => sum + (ADDONS.find(a => a.id === id)?.price || 0), 0);
  const total = (selectedService?.price || 0) + addonTotal;

  const toggleAddon = (id) => setAddons(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const canNext = step === 0 ? !!service : step === 1 ? !!(date && time) : true;

  const handleNext = () => {
    if (step < 1) { setStep(s => s + 1); return; }
    navigate("location", { service: selectedService, addons, date, time, total });
  };

  return (
    <div className="min-h-screen bg-surface-100 pb-32">
      <TopBar title="Book Your Wash" onBack={() => navigate(-1)} />
      <ProgressSteps steps={["Service", "Schedule", "Location"]} current={step} />

      <div className="max-w-2xl mx-auto px-4">

        {/* STEP 0 — Choose service */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-2xl text-surface-900 mb-2">Choose your service</h2>
            <p className="text-surface-500 text-sm mb-6">Select the wash that fits your needs</p>

            <div className="flex flex-col gap-4 mb-8">
              {SERVICES.map(s => (
                <button key={s.id} onClick={() => setService(s.id)}
                  className={`relative text-left p-5 rounded-2xl border transition-all ${service === s.id ? "border-primary-500 bg-primary-500/8 shadow-[0_0_24px_rgba(0,201,177,0.12)]" : "border-white/8 bg-surface-800/50 hover:border-white/20"}`}>
                  {s.popular && <span className="absolute top-4 right-4"><Badge>Most Popular</Badge></span>}
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{s.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-lg text-surface-900">{s.name}</h3>
                        <span className="text-xs text-surface-500">· {s.time}</span>
                      </div>
                      <p className="text-sm text-surface-400 mb-3">{s.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.includes.slice(0, 3).map(inc => (
                          <span key={inc} className="text-xs bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5 text-surface-300">{inc}</span>
                        ))}
                        {s.includes.length > 3 && <span className="text-xs text-surface-500">+{s.includes.length - 3} more</span>}
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="font-display text-xl text-primary-600">{s.price.toLocaleString()}</div>
                      <div className="text-xs text-surface-400">RWF</div>
                    </div>
                  </div>
                  {service === s.id && (
                    <div className="absolute top-4 left-4 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Add-ons */}
            <div className="mb-6">
              <h3 className="font-medium text-surface-900 mb-3">Add-ons <span className="text-surface-500 font-normal text-sm">(optional)</span></h3>
              <div className="flex flex-col gap-2">
                {ADDONS.map(a => (
                  <button key={a.id} onClick={() => toggleAddon(a.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${addons.includes(a.id) ? "border-accent-400/50 bg-accent-400/8" : "border-white/8 bg-surface-800/40 hover:border-white/20"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${addons.includes(a.id) ? "bg-accent-400 border-accent-400" : "border-white/25"}`}>
                        {addons.includes(a.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <span className="text-sm text-surface-900">{a.name}</span>
                    </div>
                    <span className="text-sm text-surface-400">+{a.price.toLocaleString()} RWF</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 — Choose date & time */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl text-surface-900 mb-2">When works for you?</h2>
            <p className="text-surface-500 text-sm mb-6">Choose your preferred date and time slot</p>

            {/* Date picker */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-surface-400 mb-3">Select date</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {dates.slice(0,10).map((d, i) => (
                  <button key={i} onClick={() => setDate(d.date)}
                    className={`flex flex-col items-center min-w-[64px] py-3 px-2 rounded-xl border transition-all flex-shrink-0 ${date === d.date ? "border-primary-500 bg-primary-500/12 shadow-[0_0_16px_rgba(0,201,177,0.15)]" : "border-white/8 bg-surface-800/50 hover:border-white/20"}`}>
                    <span className={`text-xs mb-1 ${date === d.date ? "text-primary-600" : "text-surface-400"}`}>{d.label}</span>
                    <span className={`text-sm font-medium ${date === d.date ? "text-surface-900" : "text-surface-300"}`}>{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time picker */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-surface-400 mb-3">Select time</h3>
              <div className="grid grid-cols-4 gap-2">
                {TIMES.map(t => (
                  <button key={t} onClick={() => setTime(t)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${time === t ? "border-primary-500 bg-primary-500/12 text-primary-500" : "border-white/8 bg-surface-800/50 text-surface-300 hover:border-white/20 hover:text-surface-600"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedService && (
              <Card className="p-4 mt-6">
                <h4 className="text-sm font-medium text-surface-400 mb-3">Booking summary</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-surface-400">{selectedService.name}</span>
                  <span className="text-surface-900">{selectedService.price.toLocaleString()} RWF</span>
                </div>
                {addons.map(id => { const a = ADDONS.find(x => x.id === id); return a ? (
                  <div key={id} className="flex justify-between text-sm mb-1">
                    <span className="text-surface-500">{a.name}</span>
                    <span className="text-surface-900">+{a.price.toLocaleString()} RWF</span>
                  </div>
                ) : null; })}
                <div className="border-t border-white/8 mt-3 pt-3 flex justify-between">
                  <span className="font-medium text-surface-900">Total</span>
                  <span className="font-display text-lg text-primary-500">{total.toLocaleString()} RWF</span>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-surface-50 backdrop-blur-md border-t border-white/8 p-4 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-800 border border-white/10 text-white hover:bg-surface-700 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}
          <Button className="flex-1 h-12" size="md" disabled={!canNext} onClick={handleNext}>
            {step === 1 ? "Set Location →" : "Choose Date & Time →"}
          </Button>
        </div>
      </div>
    </div>
  );
}