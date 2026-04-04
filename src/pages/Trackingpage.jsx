import { useState, useEffect } from "react";
import { Button, Card, Badge, TopBar } from "../components/UI";
import { BookOpen, ArrowLeft, Home, Search } from "lucide-react";

const STAGES = [
  {
    id: "confirmed",
    label: "Booking confirmed",
    desc: "Your booking is confirmed and assigned",
    time: "08:00",
    icon: "✓",
  },
  {
    id: "heading",
    label: "Washer heading to you",
    desc: "Jean is on his way to your location",
    time: "09:15",
    icon: "🚗",
  },
  {
    id: "arrived",
    label: "Washer arrived",
    desc: "Jean has arrived at your location",
    time: "09:35",
    icon: "📍",
  },
  {
    id: "washing",
    label: "Wash in progress",
    desc: "Your car is being professionally cleaned",
    time: "09:40",
    icon: "💧",
  },
  {
    id: "done",
    label: "Wash complete!",
    desc: "Your car is sparkling clean",
    time: "10:35",
    icon: "✨",
  },
];

export default function TrackingPage({ navigate, bookingData }) {
  const [currentStage, setCurrentStage] = useState(1);
  const [eta, setEta] = useState(18);

  useEffect(() => {
    const t = setInterval(() => {
      setEta((p) => Math.max(0, p - 1));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const stage = STAGES[currentStage];

  return (
    <div className="min-h-screen bg-surface-100 pb-28">
      <TopBar
        title="Track Your Wash"
        rightAction={
          <Badge variant="success">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block mr-1 animate-pulse" />
            Live
          </Badge>
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Status hero card */}
        <div className="relative bg-gradient-to-br from-surface-800 to-surface-900 border border-primary-500/30 rounded-3xl p-6 mb-6 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <Badge variant="primary" className="mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block mr-1 animate-pulse" />
                {currentStage < 4 ? "In Progress" : "Completed"}
              </Badge>
              <h2 className="font-display text-2xl text-white mb-1">
                {stage.label}
              </h2>
              <p className="text-surface-300 text-sm">{stage.desc}</p>
            </div>
            <div className="text-4xl">{stage.icon}</div>
          </div>
          {currentStage < 4 && (
            <div className="relative z-10 bg-surface-900/40 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-surface-400 mb-0.5">
                  Estimated arrival
                </div>
                <div className="font-display text-2xl text-white">
                  {eta} min
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-surface-400 mb-0.5">Washer</div>
                <div className="text-sm font-medium text-white">Jean N.</div>
                <div className="text-xs text-primary-400">⭐ 4.9</div>
              </div>
            </div>
          )}
        </div>

        {/* Map placeholder */}
        <div className="rounded-2xl overflow-hidden border border-white/8 relative h-44 bg-surface-50 mb-6">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,201,177,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,201,177,0.04)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Moving dot animation */}
            <div className="relative w-48 h-24">
              <div
                className="absolute left-0 top-1/2 w-3 h-3 rounded-full bg-primary-500 -translate-y-1/2"
                style={{ animation: "moveRight 3s ease-in-out infinite" }}
              />
              <div className="absolute inset-0 flex items-center">
                <div className="flex-1 h-px border-t-2 border-dashed border-primary-500" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <div className="text-2xl">🏠</div>
              </div>
            </div>
          </div>
          <style>{`@keyframes moveRight { 0%,100%{left:0} 50%{left:calc(100% - 12px)} }`}</style>
        </div>

        {/* Timeline */}
        <Card className="p-5 mb-5">
          <h3 className="font-display text-base text-white mb-4">Progress</h3>
          <div className="space-y-0">
            {STAGES.map((s, i) => {
              const done = i < currentStage;
              const active = i === currentStage;
              return (
                <div key={s.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 transition-all flex-shrink-0
                      ${
                        done
                          ? "bg-primary-500 border-primary-500 text-surface-900"
                          : active
                            ? "bg-surface-700 border-primary-500 text-primary-400 shadow-[0_0_12px_rgba(0,201,177,0.3)]"
                            : "bg-surface-800 border-white/10 text-surface-500"
                      }`}
                    >
                      {done ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : active ? (
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-surface-600" />
                      )}
                    </div>
                    {i < STAGES.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 my-1 ${done ? "bg-primary-500" : "bg-white/8"}`}
                        style={{ minHeight: "24px" }}
                      />
                    )}
                  </div>
                  <div
                    className={`pb-4 flex-1 ${i === STAGES.length - 1 ? "pb-0" : ""}`}
                  >
                    <div
                      className={`text-sm font-medium ${active ? "text-white" : done ? "text-surface-300" : "text-surface-500"}`}
                    >
                      {s.label}
                    </div>
                    {(done || active) && (
                      <div className="text-xs text-surface-500 mt-0.5">
                        {s.time}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Washer contact */}
        <Card className="p-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center font-display text-white text-lg flex-shrink-0">
              JN
            </div>
            <div className="flex-1">
              <div className="font-medium text-surface-900 text-sm">
                Jean Nkurunziza
              </div>
              <div className="text-xs text-surface-500">
                Professional Detailer · ⭐ 4.9 (312 reviews)
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-700 hover:bg-primary-500/20 hover:text-primary-400 transition-all text-surface-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.73-.73a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-700 hover:bg-primary-500/20 hover:text-primary-400 transition-all text-surface-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </Card>

        {/* Debug controls */}
        <div className="text-center">
          <p className="text-xs text-surface-600 mb-2">Preview controls</p>
          <div className="flex justify-between gap-2">
            <button
              onClick={() => setCurrentStage((s) => Math.max(0, s - 1))}
              className="text-xs px-3 py-1.5 bg-surface-800 text-surface-400 rounded-lg hover:bg-surface-700"
            >
              ← Back
            </button>
            <button
              onClick={() =>
                setCurrentStage((s) => Math.min(STAGES.length - 1, s + 1))
              }
              className="text-xs px-3 py-1.5 bg-surface-800 text-surface-400 rounded-lg hover:bg-surface-700"
            >
              Next stage →
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-3 rounded-lg
                bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                text-white text-sm font-semibold
                shadow-md hover:shadow-lg transition-all duration-150
                w-full sm:w-auto justify-center"
        >
          <Home size={15} />
          Back to home
        </button>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-surface-50 backdrop-blur-md border-t border-white/8 p-4 z-30">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => navigate("booking")}
          >
            Reschedule
          </Button>
          {currentStage >= 4 ? (
            <Button className="flex-1" onClick={() => navigate("review")}>
              Rate & Review →
            </Button>
          ) : (
            <Button variant="outline" className="flex-1">
              Cancel booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
