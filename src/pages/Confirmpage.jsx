import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Badge,
  TopBar,
  ResponseCard,
  ProgressSteps,
} from "../components/UI";
import { useBookingStore } from "../utils/bookingStore";
import { useAuth } from "../context/UseAuth";
import NavBar from "../components/NavBar";
import { ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatBookingDate = (dateStr, time) => {
  const currentYear = new Date().getFullYear();

  const fullDate = `${dateStr} ${currentYear} ${time}`;

  return new Date(fullDate).toISOString();
};

const PAYMENT_METHODS = [
  {
    id: "momo",
    name: "MTN Mobile Money",
    icon: "📱",
    desc: "Pay with your MTN MoMo",
  },
  {
    id: "airtel",
    name: "Airtel Money",
    icon: "📲",
    desc: "Pay with Airtel Money",
  },
  { id: "card", name: "Card / Bank", icon: "💳", desc: "Visa, Mastercard" },
  {
    id: "cash",
    name: "Cash on arrival",
    icon: "💵",
    desc: "Pay when we arrive",
  },
];

function WasherSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-white bg-surface-100 animate-pulse">
      <div className="flex gap-3 items-center">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-surface-200" />

        {/* Text */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-surface-200 rounded" />
          <div className="h-3 w-24 bg-surface-200 rounded" />
        </div>
      </div>

      {/* Status badge */}
      <div className="h-6 w-20 rounded bg-surface-200" />
    </div>
  );
}

export const WashersList = ({ onClose }) => {
  const booking = useBookingStore((state) => state.booking);
  const updateBooking = useBookingStore((state) => state.updateBooking);

  const { getWashers } = useAuth();

  const [washersResponse, setWashersResponse] = useState({
    loading: false,
    error: null,
    success: null,
    washers: [],
  });

  async function fetchWashers() {
    try {
      setWashersResponse((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const result = await getWashers();

      if (result?.error) throw new Error("API error");

      setWashersResponse((prev) => ({
        ...prev,
        loading: false,
        success: true,
        washers: result || [],
        error: null,
      }));
    } catch (err) {
      setWashersResponse((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load washers. Please try again.",
      }));
    }
  }

  useEffect(() => {
    fetchWashers();
  }, []);

  const userLocation = {
    lat: booking.location.coordinates?.lat,
    lng: booking.location.coordinates?.lng,
  };

  const [filter, setFilter] = useState("all");

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  const washers = washersResponse.washers
    ?.map((w) => ({
      ...w,
      distance: getDistance(
        userLocation.lat,
        userLocation.lng,
        w.zone?.coordinates?.lat,
        w.zone?.coordinates?.lng,
      ),
    }))
    .filter((w) => {
      if (filter === "all") return true;
      return w.isAvailable === filter;
    })
    .sort((a, b) => a.distance - b.distance);

  const selectedWasher = booking.washer?.id;

  return (
    <div className="bg-surface-50 px-4 py-3">
      <TopBar title="Select preferred washer" onBack={onClose} />
      {/* FILTER BUTTONS */}
      <div className="flex gap-2 flex-wrap mt-4 mb-4">
        {[
          { key: "all", label: "All" },
          { key: true, label: "Available" },
          { key: false, label: "Busy" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              filter === f.key
                ? "bg-primary-500 border-primary-500 text-surface-900"
                : "border-white/10 text-surface-400 hover:text-primary-500 hover:border-white/25"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* WASHERS LIST */}
      <div className="space-y-3 mb-4">
        {washersResponse.loading ? (
          [1, 2, 3].map((i) => <WasherSkeleton key={i} />)
        ) : washers.length === 0 ? (
          <ResponseCard
            title="No washers found"
            message={"No available washers found nearby"}
            type="info"
          />
        ) : (
          washers.map((w) => (
            <div
              key={w.id}
              className={`flex cursor-pointer items-center justify-between p-4 rounded-xl border border-white ${
                selectedWasher === w.id
                  ? "bg-primary-100 border-primary-500 shadow-[0_0_12px_rgba(0,201,177,0.2)]"
                  : "bg-surface-100 border-white hover:border-primary-300"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (booking.washer?.id === w.id)
                  updateBooking({ washer: null });
                else updateBooking({ washer: w });
              }}
            >
              <div className="flex gap-3 items-center">
                {w?.avatar ? (
                  <img
                    src={w.avatar}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-display text-sm text-primary-50">
                    {w?.initials}
                  </div>
                )}
                <div>
                  <div className="text-surface-500 font-medium">{w.name} </div>
                  <div className="text-xs text-surface-500">
                    {w.distance.toFixed(1)} km away
                  </div>
                </div>
              </div>

              <div
                className={`text-xs px-2 py-1 rounded ${
                  w.isAvailable
                    ? "bg-green-500 bg-opacity-10 border border-green-500 text-green-400"
                    : "bg-red-500 bg-opacity-10 border border-red-500 text-red-400"
                }`}
              >
                {w.isAvailable ? "Available" : "Busy"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function ConfirmPage({ navigate, bookingData }) {
  const [confirming, setConfirming] = useState(false);
  const booking = useBookingStore((state) => state.booking);
  const updateBooking = useBookingStore((state) => state.updateBooking);
  const [showWashers, setShowWashers] = useState(false);
  const [error, setErrors] = useState(null);

  const [loading, setLoading] = useState(false);
  const { createBooking } = useAuth();

  const payment = booking?.payment;

  const buildBookingPayload = (booking) => {
    return {
      service: booking.service?._id,

      addOns: booking.addons.map((a) => ({
        _id: a._id,
        name: a.name,
        price: a.price,
      })),

      scheduledDate: formatBookingDate(booking.date, booking.time),// make sure it's ISO or valid date
      scheduledTime: booking.time,

      location: booking.location, // already object? good

      paymentMethod: booking.paymentMethod || "cash",

      tip: booking.tip || 0,
    };
  };

  const handleConfirm = async () => {
    setLoading(true);
    const payload = buildBookingPayload(booking);

    const book = await createBooking(payload);
    if (book.error) {
      console.log(book.error);
      setErrors({
        general: book.error?.message || "Booking a wash failed",
      });
      setLoading(false);
      return;
    }

    setConfirming(true);

    setTimeout(() => navigate("/booking/tracking", {}), 2000);
  };

  const rows = [
    ["Service", booking.service?.name || "N/A"],
    ["Date", booking.date || "N/A"],
    ["Time", booking.time || "N/A"],
    ["Location", booking.location.address || "N/A"],
    ["Duration", booking.service?.durationMinutes + "min" || "N/A"],
  ];

  const total = booking.total;
  

  return (
    <div className="min-h-screen bg-surface-100 pb-32">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 pt-24">
        <ProgressSteps
          steps={[
            ["Service", "/booking"],
            ["Schedule", "/booking/schedule"],
            ["Location", "/booking/location"],
            ["Confirm", "/booking/confirm"],
          ]}
          current={3}
        />
        {!showWashers ? (
          <div>
            <Card glow className="mb-2 px-4">
              <TopBar
                title="Booking Summary"
                onBack={() => navigate("/booking/location")}
              />
            </Card>

            {/* Success animation area */}
            {confirming && (
              <div className="fixed inset-0 bg-surface-900 bg-opacity-10 z-50 flex flex-col items-center justify-center">
                <div className="bg-surface-50 w-full md:w-1/2 px-4 py-8 flex flex-col items-center justify-content rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center mb-6 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#00C9B1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="font-display text-3xl text-surface-900 mb-2">
                    Booking Confirmed!
                  </h2>
                  <p className="text-surface-500">
                    Your wash is scheduled. Redirecting...
                  </p>
                </div>
              </div>
            )}

            {/* Booking details */}
            <Card glow className="p-6 mb-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-surface-900"></h3>
                <Badge variant="warning">Draft</Badge>
              </div>
              <div className="space-y-3">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-surface-400">{label}</span>
                    <span className="text-surface-900 font-medium text-right max-w-[60%]">
                      {value}
                    </span>
                  </div>
                ))}
                {booking.notes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Notes</span>
                    <span className="text-surface-900 font-medium text-right max-w-[60%]">
                      {booking.notes}
                    </span>
                  </div>
                )}
              </div>
              {booking.addons?.length > 0 && (
                <div className="border-t border-white/8 mt-4 pt-4">
                  <div className="text-xs text-surface-500 mb-2">Add-ons</div>
                  <div className="flex flex-wrap gap-2">
                    {booking.addons.map((item) => (
                      <span
                        key={item.id}
                        className="text-xs bg-accent-200 border border-accent-600 text-accent-600 rounded-full px-2.5 py-0.5 capitalize"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-white/8 mt-5 pt-5 flex justify-between items-center">
                <span className="font-medium text-surface-900">
                  Total amount
                </span>
                <div className="text-right">
                  <div className="font-display text-2xl text-primary-600">
                    {total.toLocaleString()} RWF
                  </div>
                  <div className="text-xs text-surface-500">
                    incl. all taxes
                  </div>
                </div>
              </div>
            </Card>

            {/* Washer assigned */}
            {booking.washer ? (
              <Card className="p-4 mb-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center font-display text-white text-lg flex-shrink-0">
                  {booking.washer?.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-surface-900">
                    {booking.washer?.name}
                  </div>
                  <div className="text-xs text-surface-400">
                    Your assigned washer · ⭐ {booking.washer?.rating}
                  </div>
                </div>
                <button
                  onClick={() => setShowWashers(!showWashers)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-700 hover:bg-surface-600 transition-colors"
                >
                  <ArrowLeftRight />
                </button>
              </Card>
            ) : (
              <ResponseCard
                type="warning"
                title={"No washer selected"}
                message={"Please select a washer"}
                onRetry={() => setShowWashers(!showWashers)}
                text="Choose washer"
              />
            )}

            {/* Payment */}
            <div className="mb-5">
              <h3 className="font-display text-lg text-surface-900 mb-3">
                Payment method
              </h3>
              <div className="flex flex-col gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => updateBooking({ payment: m })}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${payment.id === m.id ? "border-primary-500 bg-primary-50" : "border-white/8 bg-surface-50 hover:border-white/15"}`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-surface-900">
                        {m.name}
                      </div>
                      <div className="text-xs text-surface-500">{m.desc}</div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${payment === m.id ? "border-primary-500 bg-primary-500" : "border-white/25"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Trust signals */}
            <div className="flex justify-between gap-8 text-center py-4">
              {[
                ["🔒", "Secure payment"],
                ["✅", "Verified washers"],
                ["↩️", "Free reschedule"],
              ].map(([icon, label]) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="text-lg">{icon}</span>
                  <span className="text-xs text-surface-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <WashersList onClose={() => setShowWashers(!showWashers)} />
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-surface-50 backdrop-blur-md border-t border-white/8 p-4 z-30">
        <div className="max-w-2xl mx-auto">
          <Button
            className="w-full h-12"
            onClick={handleConfirm}
            disabled={confirming}
          >
            {loading
              ? "Processing..."
              : `Confirm & Pay ${total.toLocaleString()} RWF →`}
          </Button>
        </div>
      </div>
    </div>
  );
}
