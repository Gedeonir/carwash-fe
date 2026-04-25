import { useState } from "react";
import { Button, Input, Card, TopBar, ProgressSteps } from "../components/UI";
import { MapPin } from "lucide-react";
import { useAuth } from "../context/UseAuth";
import { useBookingStore } from "../utils/bookingStore";
import NavBar from "../components/NavBar";

export default function LocationPage({ navigate }) {
  const booking = useBookingStore((state) => state.booking);
  const updateBooking = useBookingStore((state) => state.updateBooking);

  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");
  const [notes, setNotes] = useState("");
  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { user } = useAuth();

  const finalLocation =
    selected === "custom"
      ? { address: custom.address, coordinates: { ...coords }, label: "Custom" }
      : user?.savedLocations?.find((s) => s.id === selected);

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
          coordinates: { Lat: `${data.lat}`, Lng: `${data.lon}` },
          address: data.display_name,
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

  return (
    <div className="min-h-screen bg-surface-100 pb-32">
      <NavBar />
      <div className="pt-20">
        <ProgressSteps
          steps={[
            ["Service", "/booking"],
            ["Schedule", "/booking/schedule"],
            ["Location", "/booking/location"],
            ["Confirm", "/booking/confirm"],
          ]}
          current={2}
        />

        <div className="max-w-2xl mx-auto px-4 bg-surface-50">
          <TopBar
            title="Set your location"
            onBack={() => navigate("/booking/schedule")}
          />

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
                      setCoords({
                        lat: loc.coordinates?.lat,
                        lng: loc.coordinates?.lng,
                      });
                    }}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      selected === loc.id
                        ? "border-primary-500 bg-primary-100"
                        : "border-white/10 bg-surface-800/50"
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-100 text-surface-900 text-lg">
                      {loc.label === "Home" ? "🏠" : "🏢"}
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
                value={custom?.address || ""}
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
            </div>
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
                  <span className="text-primary-600">
                    {booking.service.name}
                  </span>
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
      </div>
      {/* 🚀 CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-surface-900/95 backdrop-blur-md border-t border-white/10 p-4 z-30">
        <div className="max-w-2xl mx-auto">
          <Button
            className="w-full h-12"
            disabled={!finalLocation}
            onClick={() => {
              (updateBooking({ location: finalLocation, notes }),
                navigate("/booking/confirm"));
            }}
          >
            Review & Confirm →
          </Button>
        </div>
      </div>
    </div>
  );
}
