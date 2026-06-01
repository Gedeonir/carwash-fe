import React from "react";
import { Button, Card, TopBar, ProgressSteps, Input, ResponseCard } from "../components/UI";
import { useBookingStore } from "../utils/bookingStore";
import NavBar from "../components/NavBar";

const TIME_WINDOWS = [
  { label: "Morning", range: ["08:00", "11:00"] },
  { label: "Afternoon", range: ["12:00", "15:00"] },
  { label: "Evening", range: ["16:00", "18:00"] },
  { label: "Night", range: ["19:00", "23:00"] },
];

function getDates() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);

    return {
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : days[d.getDay()],
      display: `${d.getDate()} ${months[d.getMonth()]}`,
      iso: d.toISOString(), // ✅ store real date
    };
  });
}

const generateSlots = (range, selectedDate) => {
  if (!range) return [];

  const [start, end] = range;

  const now = new Date();
  const isToday =
    selectedDate &&
    new Date(selectedDate).toDateString() === now.toDateString();

  const slots = [];

  let current = parseInt(start.split(":")[0], 10);
  const endHour = parseInt(end.split(":")[0], 10);

  while (current <= endHour) {
    const hourString = `${String(current).padStart(2, "0")}:00`;

    if (isToday) {
      const slotTime = new Date();
      slotTime.setHours(current, 0, 0, 0);

      if (slotTime <= now) {
        current++;
        continue;
      }
    }

    slots.push(hourString);
    current++;
  }

  return slots;
};

const formatLocalDate = (date) => {
  const d = new Date(date); 
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const Schedule = ({ navigate }) => {
  const booking = useBookingStore((s) => s.booking);
  const updateBooking = useBookingStore((s) => s.updateBooking); 
    

  const dates = getDates();

  const slots = generateSlots(booking.timeWindow?.range,booking.date);

  const canNext = !!(
    booking.date &&
    (booking.time || booking.customTime)
  );

  const handleNext = () => {
    navigate("/booking/location");
  };

  const finalTime = booking.time || booking.customTime;

  console.log(booking);
  

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
          current={1}
        />

        <div className="max-w-2xl mx-auto px-4 py-3 bg-surface-50">
          <TopBar
            title="Choose schedule"
            onBack={() => navigate("/booking")}
          />

          <p className="text-surface-500 text-sm mb-6">
            Choose your preferred date and time
          </p>

          {/* ================= DATE ================= */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-surface-400 mb-3">
              Select date
            </h3>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {dates.slice(0, 10).map((d, i) => (
                <button
                  key={i}
                  onClick={() =>
                    updateBooking({
                      date: formatLocalDate(d.iso),
                    })
                  }
                  className={`flex flex-col items-center min-w-[70px] py-3 px-2 rounded-xl border transition-all
                  ${
                    booking.date === formatLocalDate(d.iso)
                      ? "border-primary-500 bg-primary-100"
                      : "border-white/8 bg-surface-100"
                  }`}
                >
                  <span className="text-xs text-surface-400">
                    {d.label}
                  </span>
                  <span className="text-xs font-medium text-surface-500">
                    {d.display}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ================= TIME WINDOW ================= */}
          <div className="mb-2">
            <h3 className="text-sm font-medium text-surface-400 mb-3">
              Choose time period
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {TIME_WINDOWS.map((w) => (
                <button
                  key={w.label}
                  onClick={() =>
                    updateBooking({
                      timeWindow: w,
                      time: null,
                      customTime: null,
                    })
                  }
                  className={`p-3 rounded-xl border text-center
                  ${
                    booking.timeWindow?.label === w.label
                      ? "border-primary-500 bg-primary-100"
                      : "border-white/10"
                  }`}
                >
                  <div className="text-sm font-medium text-surface-400">{w.label}</div>
                  <div className="text-xs text-surface-400">
                    {w.range[0]} - {w.range[1]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ================= SLOTS ================= */}
          {booking.timeWindow && (slots.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-surface-400 mb-3">
                Available times
              </h3>

              <div className="grid grid-cols-4 gap-2">
                {slots.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      updateBooking({
                        time: t,
                        customTime: null,
                      })
                    }
                    className={`py-3 rounded-xl border text-sm text-surface-900
                    ${
                      booking.time === t
                        ? "border-primary-500 bg-primary-100"
                        : "border-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ):(
            <ResponseCard type="info" message={"No slots available"} className="text-xs text-surface-400 mb-6 text-center"></ResponseCard>
          ))}

          {/* ================= CUSTOM TIME ================= */}
          <div className="mb-6">
            <p className="text-xs text-surface-400 mb-1">
              Not seeing your time?
            </p>

            <Input
              type="time"
              value={booking.customTime || ""}
              onChange={(e) =>
                updateBooking({
                  customTime: e.target.value,
                  time: null,
                  timeWindow: null,
                })
              }
            />
          </div>

          {/* ================= SUMMARY ================= */}
          {booking.service && (
            <Card className="p-4 mt-6">
              <h4 className="text-sm font-medium text-surface-400 mb-3">
                Booking summary
              </h4>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-surface-400">{booking.service.name}</span>
                <span className="text-surface-500">
                  {booking.service.price.toLocaleString()} RWF
                </span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-surface-400">Date</span>
                <span className="text-surface-500">
                  {booking.date
                    ? new Date(booking.date).toDateString()
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-surface-400">Time</span>
                <span className="text-surface-500">{finalTime || "-"}</span>
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

              <div className="border-t mt-3 pt-3 flex justify-between">
                <span className="text-surface-400">Total</span>
                <span className="text-primary-500 font-semibold">
                  {booking.total?.toLocaleString()} RWF
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="fixed bottom-0 inset-x-0 bg-surface-50 border-t p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            className="w-full h-12"
            disabled={!canNext}
            onClick={handleNext}
          >
            Set Location →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;