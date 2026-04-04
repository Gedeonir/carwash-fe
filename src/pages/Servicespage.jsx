import { useState } from "react";
import { Button, Card, Badge, TopBar } from "../components/UI";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const SERVICES = [
  {
    id: "basic",
    name: "Basic Wash",
    price: 5000,
    time: "45 min",
    icon: "💧",
    tag: "Entry Level",
    tagVariant: "info",
    desc: "A thorough exterior clean that gets your car looking fresh fast. Perfect for regular upkeep.",
    includes: [
      "Exterior hand wash",
      "Wheel & tyre clean",
      "Window wipe (exterior)",
      "Door jamb wipe",
      "Air freshener",
    ],
    excludes: ["Interior vacuum", "Dashboard wipe", "Wax or polish"],
  },
  {
    id: "standard",
    name: "Standard Wash",
    price: 10000,
    time: "60 min",
    icon: "✨",
    tag: "Most Popular",
    tagVariant: "primary",
    desc: "Our bestseller. A complete clean inside and out — everything your car needs to feel brand new.",
    includes: [
      "Everything in Basic",
      "Interior vacuum (seats, mats, boot)",
      "Dashboard & console wipe",
      "Door panels clean",
      "Window clean (interior + exterior)",
      "Tyre dressing",
    ],
    excludes: ["Wax or polish", "Leather treatment"],
  },
  {
    id: "premium",
    name: "Premium Detail",
    price: 18000,
    time: "90 min",
    icon: "🏆",
    tag: "Best Value",
    tagVariant: "accent",
    desc: "A full professional detail that leaves your car showroom-ready. Wax, polish, and every nook cleaned.",
    includes: [
      "Everything in Standard",
      "Clay bar paint decontamination",
      "Hand wax & machine polish",
      "Leather seat conditioning",
      "Engine bay wipe",
      "Headlight restoration",
      "Tyre shine application",
    ],
    excludes: [],
  },
];

const ADDONS = [
  { id: "engine", name: "Engine Bay Clean", price: 3000, icon: "🔧", desc: "Full degreasing and rinse of engine bay" },
  { id: "seats", name: "Seat Shampoo", price: 4000, icon: "🪑", desc: "Deep shampoo for fabric or leather seats" },
  { id: "ceramic", name: "Ceramic Coating", price: 15000, icon: "💎", desc: "Long-lasting paint protection (lasts 6–12 months)" },
  { id: "odor", name: "Odour Eliminator", price: 2000, icon: "🌿", desc: "Ozone treatment to remove stubborn smells" },
];

const FAQ = [
  {
    q: "Do you use waterless products?",
    a: "Yes — all our washes use eco-certified, waterless or low-water formulas that are safe for your paint and the environment.",
  },
  {
    q: "How long does each service take?",
    a: "Basic: ~45 min, Standard: ~60 min, Premium: ~90 min. Times may vary based on car size and condition.",
  },
  {
    q: "Can I reschedule or cancel?",
    a: "You can reschedule or cancel up to 2 hours before your booking at no charge. Same-day cancellations may incur a small fee.",
  },
  {
    q: "What if I'm not satisfied?",
    a: "We offer a 100% satisfaction guarantee. If you're not happy, we'll re-do the service or refund you — no questions asked.",
  },
];

export default function ServicesPage({ navigate }) {
  const [expanded, setExpanded] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);

  return (
    <div className="min-h-screen bg-surface-100">
      {/* <TopBar title="Our Services" onBack={() => navigate("landing")} /> */}
      <NavBar/>

      <div className="w-full mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span className="text-xs font-medium text-primary-400 tracking-wider uppercase">Kigali-wide coverage</span>
          </div>
          <h1 className="font-display text-3xl text-surface-900 mb-3">
            Professional washes
            <span className="text-primary-500 italic"> at your doorstep</span>
          </h1>
          <p className="text-surface-400 text-sm mx-auto leading-relaxed">
            Every package uses eco-friendly, paint-safe products. Our washers are trained, vetted, and rated by real customers.
          </p>
        </div>

        {/* Service cards */}
        <div className="flex flex-col gap-4 mb-10">
          {SERVICES.map((s) => {
            const open = expanded === s.id;
            return (
              <Card key={s.id} className={`overflow-hidden transition-all ${s.id === "standard" ? "shadow-[0_0_24px_rgba(0,201,177,0.08)]" : ""}`}>
                <button
                  onClick={() => setExpanded(open ? null : s.id)}
                  className="w-full text-left p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-700/60 flex items-center justify-center text-2xl flex-shrink-0">
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-display text-lg text-surface-900">{s.name}</h3>
                        <Badge variant={s.tagVariant}>{s.tag}</Badge>
                      </div>
                      <p className="text-xs text-surface-500 mb-3 leading-relaxed">{s.desc}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-display text-xl text-surface-900">{s.price.toLocaleString()}</span>
                          <span className="text-xs text-surface-400 ml-1">RWF</span>
                          <span className="text-xs text-surface-500 ml-2">· {s.time}</span>
                        </div>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="#64748b" strokeWidth="2" strokeLinecap="round"
                          className={`transition-transform duration-250 ${open ? "rotate-180" : ""}`}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>

                {open && (
                  <div className="px-5 pb-5 border-t border-white/6 pt-4">
                    <p className="text-xs font-medium text-surface-300 mb-2">What's included</p>
                    <div className="flex flex-col gap-1.5 mb-4">
                      {s.includes.map((item) => (
                        <div key={item} className="flex items-start gap-2 text-sm text-surface-200">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C9B1" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {item}
                        </div>
                      ))}
                    </div>
                    {s.excludes.length > 0 && (
                      <>
                        <p className="text-xs font-medium text-surface-500 mb-2">Not included</p>
                        <div className="flex flex-col gap-1.5 mb-4">
                          {s.excludes.map((item) => (
                            <div key={item} className="flex items-start gap-2 text-sm text-surface-500">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              {item}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <Button
                      className="w-full"
                      variant={s.id === "standard" ? "primary" : "outline"}
                      onClick={() => navigate("booking", { preselect: s.id })}>
                      Book {s.name} →
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="mb-10">
          <h2 className="font-display text-xl text-surface-900 mb-1">Add-ons</h2>
          <p className="text-sm text-surface-500 mb-4">Enhance any package with optional extras</p>
          <div className="grid grid-cols-2 gap-3">
            {ADDONS.map((a) => (
              <Card key={a.id} className="p-4 hover:border-primary-500/25 transition-all">
                <div className="text-2xl mb-3">{a.icon}</div>
                <div className="font-medium text-surface-900 text-sm mb-1">{a.name}</div>
                <div className="text-xs text-surface-500 leading-relaxed mb-3">{a.desc}</div>
                <div className="font-display text-base text-primary-500">+{a.price.toLocaleString()} RWF</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            ["🌿", "Eco-friendly", "Waterless, safe products"],
            ["🔒", "Vetted washers", "Background checked"],
            ["💯", "Guaranteed", "100% satisfaction"],
          ].map(([icon, title, sub]) => (
            <div key={title} className="text-center bg-surface-50 border border-white/6 rounded-xl p-4">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-xs font-medium text-surface-900 mb-1">{title}</div>
              <div className="text-xs text-surface-500 leading-tight">{sub}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="font-display text-xl text-surface-900 mb-4">FAQ</h2>
          <div className="flex flex-col gap-2">
            {FAQ.map((item, i) => (
              <button
                key={i}
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full text-left bg-surface-800/40 border border-white/6 rounded-xl p-4 hover:border-white/12 transition-all">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-surface-500">{item.q}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"
                    className={`flex-shrink-0 transition-transform duration-250 ${faqOpen === i ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {faqOpen === i && (
                  <p className="text-sm text-surface-400 leading-relaxed mt-3 border-t border-white/6 pt-3">
                    {item.a}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-surface-800 to-surface-900 border border-primary-500/20 rounded-2xl p-6 text-center">
          <h3 className="font-display text-xl text-white mb-2">Ready to book?</h3>
          <p className="text-sm text-surface-400 mb-5">Pick your service and we'll come to you.</p>
          <Button size="lg" onClick={() => navigate("booking")}>Book a Wash →</Button>
        </div>
      </div>
    <Footer/>
    </div>
  );
}