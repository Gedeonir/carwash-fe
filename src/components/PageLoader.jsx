import { useEffect, useState } from "react";

const MESSAGES = [
  "Getting your app ready...",
  "Loading data...",
  "Almost there...",
  "Polishing the details...",
];

export default function PageLoader({ message }) {
  const [dots, setDots] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Animated dots
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);

  // Cycle through messages
  useEffect(() => {
    const t = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  // Fake progress bar — fills quickly to 80%, slows, waits for real load
  useEffect(() => {
    let raf;
    let current = 0;
    const tick = () => {
      if (current < 80) current += 0.6;
      else if (current < 92) current += 0.08;
      setProgress(Math.min(current, 92));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const displayMessage = message || MESSAGES[msgIndex];

  return (
    <div
      className="min-h-screen bg-surface-50 flex flex-col items-center justify-center relative overflow-hidden"
      role="status"
      aria-label="Loading page"
      aria-live="polite"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,197,66,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,66,0.04) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 480,
          height: 480,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          background:
            "radial-gradient(circle, rgba(245,197,66,0.10) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Centre content */}
      <div className="relative z-10 flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {/* Outer spinning ring */}
            <svg
              width="72" height="72" viewBox="0 0 72 72"
              className="absolute inset-0"
              style={{ animation: "spin-slow 2.8s linear infinite" }}
            >
              <circle
                cx="36" cy="36" r="32"
                fill="none"
                stroke="rgba(245,197,66,0.15)"
                strokeWidth="1.5"
              />
              <circle
                cx="36" cy="36" r="32"
                fill="none"
                stroke="#F5C542"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="28 174"
                strokeDashoffset="0"
              />
            </svg>

            {/* Inner pulsing ring */}
            <svg
              width="72" height="72" viewBox="0 0 72 72"
              className="absolute inset-0"
              style={{ animation: "spin-slow 2s linear infinite reverse" }}
            >
              <circle
                cx="36" cy="36" r="24"
                fill="none"
                stroke="rgba(245,197,66,0.08)"
                strokeWidth="1"
              />
              <circle
                cx="36" cy="36" r="24"
                fill="none"
                stroke="rgba(245,197,66,0.4)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="10 140"
              />
            </svg>

            {/* Logo text */}
            <div className="w-[72px] h-[72px] flex items-center justify-center">
              <span
                className="font-display text-white"
                style={{ fontSize: 22, letterSpacing: "-0.01em" }}
              >
                I<span style={{ color: "#F5C542" }}>.</span>
              </span>
            </div>
          </div>

          <div className="text-center">
            <p
              className="font-display text-white"
              style={{ fontSize: 26, letterSpacing: "-0.01em" }}
            >
              Ikinamba<span style={{ color: "#F5C542" }}>.</span>
            </p>
            <p className="text-surface-500 text-xs tracking-widest uppercase mt-0.5">
              Mobile Car Wash
            </p>
          </div>
        </div>

        {/* Wash animation — three droplets bouncing */}
        <div className="flex items-end gap-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background: "#F5C542",
                opacity: 0.85,
                animation: `drop-bounce 1.2s ease-in-out ${i * 0.18}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Message */}
        <div className="h-5 flex items-center">
          <p
            key={msgIndex}
            className="text-surface-400 text-sm"
            style={{
              animation: "fade-msg 0.4s ease forwards",
            }}
          >
            {displayMessage}
            <span style={{ color: "#F5C542", letterSpacing: 1 }}>
              {".".repeat(dots)}
            </span>
          </p>
        </div>
      </div>

      {/* Progress bar — bottom of screen */}
      <div
        className="absolute bottom-0 left-0 right-0"
        aria-hidden="true"
      >
        <div
          style={{
            height: 2,
            background: "rgba(245,197,66,0.12)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, rgba(245,197,66,0.6), #F5C542)",
              transition: "width 0.3s ease",
              borderRadius: "0 2px 2px 0",
            }}
          />
        </div>
      </div>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes drop-bounce {
          0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.85; }
          45%       { transform: translateY(-18px) scaleY(1.1); opacity: 1; }
          55%       { transform: translateY(-18px) scaleY(1.1); opacity: 1; }
          80%       { transform: translateY(0) scaleY(0.85); opacity: 0.7; }
        }
        @keyframes fade-msg {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}