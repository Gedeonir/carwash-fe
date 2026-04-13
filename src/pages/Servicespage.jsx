import { useEffect, useState, useCallback } from "react";
import { Button, Card, Badge, ResponseCard } from "../components/UI";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/UseAuth";

// ── Static FAQ (doesn't change often) ─────────────────────
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

const TAG_BADGE = {
  "Most Popular": "info",
  "Best Value": "primary",
  Popular: "warning",
  "Entry Level": "warning",
};

// ── Skeleton card ──────────────────────────────────────────
function ServiceCardSkeleton() {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 animate-pulse flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-surface-200" />
        <div className="w-20 h-5 rounded-full bg-surface-200" />
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-surface-200 rounded w-2/3" />
        <div className="h-3.5 bg-surface-200 rounded w-full" />
        <div className="h-3.5 bg-surface-200 rounded w-3/4" />
      </div>
      <div className="h-8 bg-surface-200 rounded-xl mt-auto" />
    </div>
  );
}

function AddonSkeleton() {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 animate-pulse">
      <div className="w-8 h-8 bg-surface-200 rounded-lg mb-3" />
      <div className="h-3.5 bg-surface-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-surface-200 rounded w-full mb-1" />
      <div className="h-3 bg-surface-200 rounded w-1/2 mb-3" />
      <div className="h-4 bg-surface-200 rounded w-1/3" />
    </div>
  );
}

// ── Main service card ──────────────────────────────────────
function ServiceCard({ service, selected, onSelect, onBook }) {
  const isSelected = selected === service._id;
  const isPopular = service.tag === "Most Popular";

  return (
    <Card
      className={`
        group relative flex flex-col bg-surface-50 rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-pointer`}
    >
      {/* Popular ribbon */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary-500 text-surface-900 text-[10px] font-semibold px-3 py-1 rounded-bl-xl tracking-wide">
          POPULAR
        </div>
      )}

      <div className="p-6 flex flex-col flex-1 ">
        {/* Top row: icon + tag */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${isSelected ? "bg-primary-500/15" : "bg-surface-100 group-hover:bg-primary-500/10"}`}
          >
            {service.icon || "💧"}
          </div>
          {/* {service.tag && !isPopular && (
            <Badge variant={TAG_BADGE[service.tag] || "primary"}>{service.tag}</Badge>
          )} */}
        </div>

        {/* Name + description */}
        <h3 className="font-display text-xl text-surface-900 mb-1 leading-tight">
          {service.name}
        </h3>
        <p className="text-sm text-surface-500 leading-relaxed mb-4 flex-1">
          {service.description}
        </p>

        {/* Duration chips */}
        <div className="flex flex-nowrap justify-between gap-2 mb-5">
          <div>
            <span className="text-xs bg-surface-100 text-surface-500 rounded-full px-2.5 py-1">
              ⏱ {service.durationMinutes} min
            </span>
          </div>

          {/* Price */}
          <div className="flex justify-between mb-4">
            <div>
              <span className="font-display text-3xl text-surface-900">
                {service.price.toLocaleString()}
              </span>
              <span className="text-sm text-surface-400 ml-1">RWF</span>
            </div>
          </div>
        </div>
        {/* Expanded: includes / excludes */}
        <div className="mb-4 bg-surface-100 rounded-xl p-4 border border-surface-200">
          {(service.includes || []).length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
                Included
              </p>
              <div className="flex flex-col gap-1">
                {service.includes.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-xs text-surface-600"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00C9B1"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
          {(service.excludes || []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">
                Not included
              </p>
              <div className="flex flex-col gap-1">
                {service.excludes.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-xs text-surface-400"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(service._id);
          }}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200
            ${
              isSelected
                ? "bg-primary-500 text-surface-900 hover:bg-primary-600 shadow-[0_4px_14px_rgba(0,201,177,0.35)]"
                : "bg-surface-100 text-surface-600 border border-surface-200 hover:bg-primary-500 hover:text-surface-900 hover:border-primary-500"
            }
          `}
        >
          Book this wash →
        </button>
      </div>
    </Card>
  );
}

// ── Addon card ─────────────────────────────────────────────
function AddonCard({ addon }) {
  return (
    <div
      className={`
        w-full text-left p-4 rounded-xl transition-all duration-200
      `}
    >
      <p className="font-semibold text-sm text-surface-900 mb-1">
        {addon.name}
      </p>
      <p className="text-xs text-surface-500 leading-relaxed mb-2">
        {addon.description || addon.desc}
      </p>
      <p className={`text-sm font-display font-semibold`}>
        +{addon.price.toLocaleString()} RWF
      </p>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function ServicesPage({ navigate }) {
  const { getServices } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSvc, setSelectedSvc] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  async function fetchServices() {
    try {
      setLoading(true);
      setError(null);

      const result = await getServices();

      if (result?.error) throw new Error("API error");

      setServices(result || []);
    } catch (err) {
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Collect all add-ons across services (deduped by name)
  const allAddons = services.length
    ? [
        ...new Map(
          services.flatMap((s) => s.addOns || []).map((a) => [a.name, a]),
        ).values(),
      ]
    : [];

  const toggleAddon = useCallback((name) => {
    setSelectedAddons((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );
  }, []);

  const handleBook = useCallback(
    (serviceId) => {
      navigate("/booking", {
        state: {
          selected: serviceId,
        },
      });
    },
    [navigate],
  );

  // Computed totals for the sticky summary bar
  const selectedService = services.find((s) => s._id === selectedSvc);
  const selectedAddonObjs = allAddons.filter((a) =>
    selectedAddons.includes(a.name),
  );
  const addonTotal = selectedAddonObjs.reduce((sum, a) => sum + a.price, 0);
  const grandTotal = (selectedService?.price || 0) + addonTotal;
  const hasSelection = !!selectedSvc;

  return (
    <div className="min-h-screen bg-surface-100">
      <NavBar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="w-full mx-auto px-4 pt-24 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-xs font-medium text-primary-500 tracking-wider uppercase">
            Country-wide coverage
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-surface-900 mb-3 leading-tight">
          Professional washes,
          <span className="text-primary-500 italic"> at your doorstep</span>
        </h1>
        <p className="text-surface-500 text-base max-w-xl mx-auto leading-relaxed">
          Every package uses eco-friendly, paint-safe products. Our washers are
          trained, vetted, and rated by real customers.
        </p>
      </section>

      <div className="w-full mx-auto px-4 pb-20">
        {/* ── ERROR ──────────────────────────────────────── */}
        {error && (
          <ResponseCard
            title="Error"
            message={error}
            type="error"
            onRetry={fetchServices}
          />
        )}

        {/* ── SERVICE GRID ───────────────────────────────── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-surface-900">
              Choose your package
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? [1, 2, 3].map((i) => <ServiceCardSkeleton key={i} />)
              : services.map((s) => (
                  <ServiceCard
                    key={s._id}
                    service={s}
                    selected={selectedSvc}
                    onSelect={setSelectedSvc}
                    onBook={handleBook}
                  />
                ))}
          </div>
        </section>

        {/* ── TRUST SIGNALS ──────────────────────────────── */}
        <section className="mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "🌿",
                title: "Eco-friendly",
                sub: "Waterless, paint-safe products that protect your car and the environment.",
              },
              {
                icon: "🔒",
                title: "Vetted washers",
                sub: "Every washer is background checked, trained, and reviewed by customers.",
              },
              {
                icon: "💯",
                title: "100% Guaranteed",
                sub: "Not happy? We re-do the service or issue a full refund — no questions asked.",
              },
            ].map(({ icon, title, sub }) => (
              <div
                key={title}
                className="flex gap-4 bg-surface-50 border border-surface-200 rounded-2xl p-5"
              >
                <span className="text-3xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-semibold text-surface-900 text-sm mb-1">
                    {title}
                  </p>
                  <p className="text-xs text-surface-500 leading-relaxed">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────── */}
        <section className="mb-14 w-full">
          <h2 className="font-display text-2xl text-surface-900 mb-6">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-2">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-all ${faqOpen === i ? "border-primary-500/30 bg-surface-50" : "border-surface-200 bg-surface-50 hover:border-primary-500/20"}`}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full text-left flex items-center justify-between gap-4 px-5 py-4"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${faqOpen === i ? "text-primary-600" : "text-surface-700"}`}
                  >
                    {item.q}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={faqOpen === i ? "#00C9B1" : "#94a3b8"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={`flex-shrink-0 transition-transform duration-200 ${faqOpen === i ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-4 border-t border-surface-200">
                    <p className="text-sm text-surface-500 leading-relaxed pt-3">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────── */}
        <div className="bg-gradient-to-br from-surface-800 to-surface-900 border border-primary-500/20 rounded-2xl p-6 text-center">
          <h3 className="font-display text-xl text-white mb-2">
            Ready to book?
          </h3>
          <p className="text-sm text-surface-400 mb-5">
            Pick your service and we'll come to you.
          </p>
          <Button size="lg" onClick={() => navigate("booking")}>
            Book a Wash →
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
