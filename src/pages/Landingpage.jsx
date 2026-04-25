import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { Button, Badge } from "../components/UI";
import logo from "../assets/car_wash_logo.png";
const services = [
  {
    name: "Basic Wash",
    price: "5,000",
    desc: "Exterior clean & rinse",
    icon: "💧",
    tag: "Popular",
  },
  {
    name: "Standard",
    price: "10,000",
    desc: "Exterior + interior vacuum",
    icon: "✨",
    tag: null,
  },
  {
    name: "Premium Detail",
    price: "18,000",
    desc: "Full detail + wax + polish",
    icon: "🏆",
    tag: "Best Value",
  },
];

const steps = [
  {
    n: "01",
    title: "Book online",
    desc: "Pick your service, date & time in under 2 minutes",
    icon: "📱",
  },
  {
    n: "02",
    title: "We come to you",
    desc: "Our team arrives at your home, office or wherever",
    icon: "📍",
  },
  {
    n: "03",
    title: "Shine guaranteed",
    desc: "Premium wash using eco-friendly products",
    icon: "✅",
  },
];

const reviews = [
  {
    name: "Amira K.",
    stars: 5,
    text: "Booked at 8am, team arrived by 9:30. Car looked showroom-new. Will use every week!",
    avatar: "AK",
  },
  {
    name: "James M.",
    stars: 5,
    text: "Incredibly convenient. No more queuing at a car wash. Absolutely love this service.",
    avatar: "JM",
  },
  {
    name: "Claudine R.",
    stars: 5,
    text: "The premium detail was worth every franc. My seats have never looked this clean.",
    avatar: "CR",
  },
];

export default function LandingPage({ navigate }) {
  return (
    <div className="min-h-screen bg-surface-100">
      <NavBar />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Grid — dark charcoal lines, visible on light surface */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(10,10,10,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.06) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="w-full mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2.5 bg-primary-500 border border-primary-500/25 rounded-full px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
              <span className="text-xs font-medium text-surface-900 tracking-widest uppercase">
                Available everywhere
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-5xl leading-[0.95] mb-6 text-surface-900">
              Your car{" "}
              <span className="text-primary-500 italic">can be washed</span>
              <br />
              <span className="relative">
                from anywhere.
                <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-surface-900 rounded-full" />
              </span>
            </h1>
            <p className="text-lg text-surface-500 font-light leading-relaxed mb-10">
              Professional mobile car detailing delivered to your door.
              Eco-friendly, fast, and built around your schedule.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="sm" onClick={() => navigate("auth")}>
                Book a Wash
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate("services")}
              >
                View Services →
              </Button>
            </div>
            <div className="flex justify-between gap-8 pt-6 border-t border-surface-900">
              {[
                ["500+", "Cars washed"],
                ["4.9★", "Avg rating"],
                ["60min", "Service time"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl text-surface-900">
                    {v}
                  </div>
                  <div className="text-xs text-surface-500 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden md:flex justify-center">
            <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-3xl" />
            
            <div className="w-2/4 h-full relative">
              <img
                src={logo}
                alt="Ikinamba Logo"
                className="w-full h-full object-cover drop-shadow-[0_20px_40px_rgba(0,201,177,0.12)]"
              />
            </div>

            {/* Floating cards */}
            <div
              className="absolute top-8 right-0 bg-surface-200/90 rounded-xl p-3 flex items-center gap-3 shadow-xl animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 text-sm">
                ★
              </div>
              <div>
                <div className="text-xs font-medium text-surface-900">
                  Premium Wash
                </div>
                <div className="text-xs text-surface-500">Just completed</div>
              </div>
            </div>
            <div
              className="absolute -bottom-16 left-0 bg-surface-200/90 rounded-xl p-3 flex items-center gap-3 shadow-xl"
              style={{ animation: "bounce 3.5s ease-in-out 1s infinite" }}
            >
              <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center text-success text-sm">
                ✓
              </div>
              <div>
                <div className="text-xs font-medium text-surface-900">
                  Eco-Friendly
                </div>
                <div className="text-xs text-surface-500">
                  Waterless products
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 px-6">
        <div className="w-full mx-auto">
          <div className="text-left mb-16">
            <Badge>How It Works</Badge>
            <h2 className="font-display text-4xl md:text-5xl text-surface-900 mt-4 mb-4">
              Three steps to a{" "}
              <span className="text-primary-500 italic">spotless car</span>
            </h2>
            <p className="text-surface-500 mx-auto">
              We've made car washing as easy as ordering food. No queues, no
              driving around.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div
                key={i}
                className="relative bg-surface-50 border border-white/8 rounded-2xl p-8 hover:border-primary-500/30 transition-all group"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="font-display text-5xl text-surface-900 absolute top-6 right-6">
                  {s.n}
                </div>
                <h3 className="font-display text-xl text-surface-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-surface-500 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-12 px-6 bg-surface-800/30">
        <div className="w-full mx-auto">
          <div className="text-left mb-16">
            <Badge variant="accent">Service Packages</Badge>
            <h2 className="font-display text-4xl md:text-5xl text-surface-900 mt-4">
              Pick your{" "}
              <span className="text-primary-500 italic">perfect wash</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className={`relative bg-surface-50 border rounded-2xl p-7 flex flex-col transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,201,177,0.12)] ${i === 2 ? "border-primary-500/50 shadow-[0_0_30px_rgba(0,201,177,0.08)]" : "border-white/8 hover:border-primary-500/30"}`}
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="flex items-center gap-2 mb-2 justify-between">
                  <h3 className="font-display text-xl text-surface-900">
                    {s.name}
                  </h3>
                  {s.tag && (
                    <Badge
                      variant={i === 0 ? "info" : "primary"}
                      className="self-start mb-4"
                    >
                      {s.tag}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-surface-500 mb-6">{s.desc}</p>
                <div className="mt-auto">
                  <div className="font-display text-3xl text-surface-900 mb-1">
                    {s.price}{" "}
                    <span className="text-sm font-sans text-surface-400">
                      RWF
                    </span>
                  </div>
                  <Button
                    variant={i === 2 ? "primary" : "outline"}
                    className="w-full mt-4"
                    onClick={() => navigate("booking")}
                  >
                    Book this wash
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-12 px-6">
        <div className="w-full mx-auto">
          <div className="text-left mb-16">
            <Badge variant="success">Customer Reviews</Badge>
            <h2 className="font-display text-4xl text-surface-900 mt-4">
              What our customers{" "}
              <span className="text-primary-500 italic">say</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-surface-50 border border-white/8 rounded-2xl p-6 hover:border-primary-500/25 transition-all"
              >
                <div className="flex text-accent-500 text-sm mb-4">
                  {"★".repeat(r.stars)}
                </div>
                <p className="text-surface-400 text-sm leading-relaxed mb-6">
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-primary-400 text-xs font-medium">
                    {r.avatar}
                  </div>
                  <span className="text-sm font-medium text-surface-900">
                    {r.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 md:px-6">
        <div className="w-full mx-auto text-center bg-gradient-to-br from-surface-800 to-surface-900 border border-primary-500/20 rounded-3xl p-16">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Ready for a{" "}
            <span className="text-primary-500 italic">clean car?</span>
          </h2>
          <p className="text-surface-400 mb-8">
            Book in under 2 minutes. We handle the rest.
          </p>
          <Button size="lg" onClick={() => navigate("booking")}>
            Book Your Wash →
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
