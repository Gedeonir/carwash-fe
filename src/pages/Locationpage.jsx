import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Card,
  TopBar,
  ProgressSteps,
  ResponseCard,
} from "../components/UI";
import { MapPin } from "lucide-react";
import { useAuth } from "../context/UseAuth";
import { useBookingStore } from "../utils/bookingStore";
import NavBarClient from "../components/NavBarClient";


const SAVED = [
  {
    id: "home",
    label: "Home",
    address: "KG 9 Ave, Kimihurura, Kigali",
    icon: "🏠",
    lat: -1.95,
    lng: 30.06,
  },
  {
    id: "work",
    label: "Work",
    address: "KN 4 St, CBD, Kigali",
    icon: "🏢",
    lat: -1.94,
    lng: 30.06,
  },
];

const SUGGESTIONS = [
  "Kiyovu, Kigali",
  "Nyamirambo, Kigali",
  "Remera, Kigali",
  "Kibagabaga, Kigali",
  "Gisozi, Kigali",
  "Gacuriro, Kigali",
];

const WASHERS = [
  {
    id: "w1",
    name: "John",
    lat: -1.95,
    lng: 30.06,
    status: "available",
  },
  {
    id: "w2",
    name: "Mike",
    lat: -1.9,
    lng: 30.08,
    status: "busy",
  },
  {
    id: "w3",
    name: "Alex",
    lat: -1.97,
    lng: 30.04,
    status: "available",
  },
];
export default function LocationPage({ navigate, bookingData }) {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");
  const [notes, setNotes] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { user } = useAuth();
  const booking = useBookingStore((state) => state.booking);
  const updateBooking = useBookingStore((state) => state.updateBooking);

  const finalLocation =
    selected === "custom"
      ? { address: custom, ...coords }
      : SAVED.find((s) => s.id === selected);

  const useCurrentLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        setCoords({
          lat: latitude,
          lng: longitude,
        });

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        );

        const data = await res.json();


        setCustom({
          Lat: `${data.lat}`,
          Lng: `${data.lon}`,
          display_name: data.display_name,
        });

        setSelected("custom");
        setLoadingLocation(false);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Please enable location access");
        setLoadingLocation(false);
      },
    );
  };

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
    lat: -1.95,
    lng: 30.06,
  };

  const [filter, setFilter] = useState("all");

  const washers = washersResponse.washers
    ?.map((w) => ({
      ...w,
      distance: getDistance(
        userLocation.lat,
        userLocation.lng,
        w.savedLocations[0]?.coordinates?.lat,
        w.savedLocations[0]?.coordinates?.lng,
      ),
    }))
    .filter((w) => {
      if (filter === "all") return true;
      return w.isAvailable === filter;
    })
    .sort((a, b) => a.distance - b.distance);

    console.log(user);

  return (
    <div className="min-h-screen bg-surface-50 pb-32">
       {user ? (
        <NavBarClient />
      ) : (
        <TopBar title="Book Your Wash" onBack={() => navigate("schedule")} />
      )}
      <ProgressSteps steps={["Service", "Schedule", "Location"]} current={2} />

      <div className="max-w-2xl mx-auto px-4">
        <h2 className="font-display text-2xl text-surface-900 mb-2">
          Set your location
        </h2>
        <p className="text-surface-500 text-sm mb-6">
          We'll come right to you — home, work, or anywhere you need us.
        </p>

        {/* 🏠 SAVED LOCATIONS */}
        {user && !user?.isGuest && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-surface-500 mb-3">
              Saved locations
            </h3>

            <div className="flex flex-col gap-3">
              {user?.savedLocations?.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelected(loc.id);
                    setCustom("");
                    setCoords({ lat: loc.lat, lng: loc.lng });
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    selected === loc.id
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-white/10 bg-surface-800/50"
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-100 text-surface-900 text-lg">
                    {loc.label ==="Home"? "🏠" :"🏢"}
                  </div>

                  <div className="flex-1">
                    <div className="text-sm font-medium text-surface-500">
                      {loc.label}
                    </div>
                    <div className="text-xs text-surface-500 truncate">
                      {loc.address}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ✍️ CUSTOM ADDRESS */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-surface-500 mb-3">
            My current address
          </h3>

          <div className="relative">
            <Input
              placeholder="e.g. KG 123 St, Kigali"
              value={custom?.display_name || ""}
              disabled={true}
              onChange={() => {}}
            />
            <div className="mt-2 py-2">
              <button
                onClick={useCurrentLocation}
                className="text-sm text-info hover:text-surface-900 transition-colors flex items-center justify-start gap-2 animate-bounce"
                variant="dark"
                size="sm"
              >
                {loadingLocation ? (
                  "Locating..."
                ) : (
                  <>
                    <MapPin size={15} /> Use my current location
                  </>
                )}
              </button>
            </div>

            {/* Suggestions */}
            {showSuggest && custom && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-800 border border-white/10 rounded-xl z-20">
                {SUGGESTIONS.filter((s) =>
                  s.toLowerCase().includes(custom.toLowerCase()),
                )
                  .slice(0, 4)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setCustom(s);
                        setShowSuggest(false);
                        setSelected("custom");
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-surface-700"
                    >
                      {s}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          {/* FILTER BUTTONS */}
          <div className="flex gap-2 flex-wrap mb-4">
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
          {/* <div className="space-y-3 mb-4">
            <label className="text-sm text-surface-500">
              Please select washer.
            </label>
            {washers.length === 0 ? (
              <ResponseCard
            title="No washers found"
            message={"No available washers found nearby"}
            type="info"
          />
            ) : (
              washers.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-surface-800/50"
                >
                  <div className="flex gap-3 items-center">
                    {w?.avatar ? (
                      <img
                        src={w.avatar}
                        alt="profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-display text-sm text-primary-50">
                        {w?.initials}
                      </div>
                    )}
                    <div>
                      <div className="text-surface-500 font-medium">
                        {w.name}{" "}
                      </div>
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
          </div> */}
        </div>

        <div className="mb-6">
          <label className="text-sm text-surface-500">
            Access notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full mt-2 p-3 rounded-xl bg-surface-100 border border-white/10 text-surface-900 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            placeholder="Gate code, parking info..."
          />
        </div>

        {/* 📦 SUMMARY */}
        {booking.service && (
          <Card className="p-4">
            <div className="text-sm text-surface-400">Your booking</div>

            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-900">Service</span>
                <span className="text-primary-600">{booking.service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-900">Total</span>
                <span className="text-primary-600">
                  {booking.total?.toLocaleString()} RWF
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* 🚀 CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-surface-900/95 backdrop-blur-md border-t border-white/10 p-4 z-30">
        <div className="max-w-2xl mx-auto">
          <Button
            className="w-full h-12"
            disabled={!finalLocation}
            onClick={() => {
              (updateBooking({ location: finalLocation, notes }),
                navigate("confirm"));
            }}
          >
            Review & Confirm →
          </Button>
        </div>
      </div>
    </div>
  );
}
