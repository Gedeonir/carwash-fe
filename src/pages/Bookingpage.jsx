import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Badge,
  TopBar,
  ProgressSteps,
  ResponseCard,
} from "../components/UI";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
import { useBookingStore } from "../utils/bookingStore";
import NavBar from "../components/NavBar";

const steps = [
  ["Service", "/booking"],
  ["Schedule", "/booking/schedule"],
  ["Location","/booking/location"],
  ["Confirm","/booking/confirm"]
];

function CardSkeleton() {
  return (
    <div className="animate-pulse p-5 rounded-2xl border border-white/8 bg-surface-50">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-surface-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-surface-200 rounded mb-2"></div>
          <div className="h-4 bg-surface-200 rounded mb-2"></div>
          <div className="h-4 bg-surface-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage({ navigate, bookingData, onBook }) {
  const booking = useBookingStore((state) => state.booking);
  const updateBooking = useBookingStore((state) => state.updateBooking);
  const resetBooking = useBookingStore((state) => state.resetBooking);

  const [step, setStep] = useState(0);

  const [ADDONS, setADDONS] = useState([]);

  const location = useLocation();

  const [service, setService] = useState(location.state?.selected || null);

  const { getServices } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedService = booking.service;
  const selectedServiceId = selectedService?.id;

  const toggleAddon = (addon) => {
    const updated = booking.addons.includes(addon)
      ? booking.addons.filter((x) => x !== addon)
      : [...booking.addons, addon];

    const addonTotal = updated.reduce((sum, a) => sum + (a?.price || 0), 0);

    updateBooking({
      addons: updated,
      total: (booking.service?.price || 0) + addonTotal,
    });
  };

  const canNext = step === 0 ? !!booking.service : true;

  const handleNext = () => {
    navigate("/booking/schedule");
  };

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

  useEffect(() => {
    async function handleAddOns() {
      if (!booking.service || services.length === 0) return;

      const selected = services.find((s) => s.id === selectedServiceId);

      if (selected) {
        setADDONS(selected.addOns || []);
      }
    }
    handleAddOns();
  }, [services, booking.service]);

  console.log(location);
  

  return (
    <div className="min-h-screen bg-surface-100 pb-32">
      <NavBar />
      <div className="pt-20">
        <ProgressSteps
          steps={steps}
          current={step}
        />

        <div className="max-w-2xl mx-auto px-4 bg-surface-50 py-6">
          <TopBar title="Choose your service" />

          {/* STEP 0 — Choose service */}
          {step === 0 && (
            <div>
              <p className="text-surface-500 text-sm mb-6">
                Select the wash that fits your needs
              </p>

              {error && (
                <ResponseCard
                  title="Error"
                  message={error}
                  type="error"
                  onRetry={fetchServices}
                />
              )}

              <div className="flex flex-col gap-4 mb-8">
                {loading
                  ? [1, 2, 3].map((i) => <CardSkeleton key={i} />)
                  : services.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setService(s.id);
                          setADDONS(s.addOns || []);

                          updateBooking({
                            service: s, // store FULL object
                            addons: [],
                            total: s.price,
                          });
                        }}
                        className={`relative text-left p-5 rounded-2xl border transition-all ${selectedServiceId === s.id ? "border-primary-500 bg-primary-100 shadow-[0_0_24px_rgba(0,201,177,0.12)]" : "bg-surface-50 hover:bg-primary-50"}`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl">{s.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display text-lg text-surface-900">
                                {s.name}
                              </h3>
                              <span className="text-xs text-surface-500">
                                · {s.time}
                              </span>
                            </div>
                            <p className="text-sm text-surface-400 mb-3">
                              {s.desc}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {s.includes.slice(0, 3).map((inc) => (
                                <span
                                  key={inc}
                                  className="text-xs bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5 text-surface-300"
                                >
                                  {inc}
                                </span>
                              ))}
                              {s.includes.length > 3 && (
                                <span className="text-xs text-surface-500">
                                  +{s.includes.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="font-display text-xl text-primary-600">
                              {s.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-surface-400">RWF</div>
                          </div>
                        </div>
                        {service === s.id && (
                          <div className="absolute top-4 left-4 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#0A0F1E"
                              strokeWidth="3"
                              strokeLinecap="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
              </div>

              {/* Add-ons */}
              <div className="mb-6">
                <h3 className="font-medium text-surface-900 mb-3">
                  Add-ons{" "}
                  <span className="text-surface-500 font-normal text-sm">
                    (optional)
                  </span>
                </h3>
                <div className="flex flex-col gap-2">
                  {ADDONS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => toggleAddon(a)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${booking.addons.some((addon) => addon._id === a._id) ? "border-primary-500 bg-primary-100" : "border-white/8 bg-surface-800/40 hover:border-white/20"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${booking.addons.some((addon) => addon._id === a._id) ? "bg-primary-500 border-accent-400" : "border-surface-500"}`}
                        >
                          {booking.addons.some(
                            (addon) => addon._id === a._id,
                          ) && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#0A0F1E"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-surface-900">
                          {a.name}
                        </span>
                      </div>
                      <span className="text-sm text-surface-400">
                        +{a.price.toLocaleString()} RWF
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-surface-50 backdrop-blur-md border-t border-white/8 p-4 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-800 border border-white/10 text-white hover:bg-surface-700 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <Button
            className="flex-1 h-12"
            size="md"
            disabled={!canNext}
            onClick={handleNext}
          >
            Choose Date & Time →
          </Button>
        </div>
      </div>
    </div>
  );
}
