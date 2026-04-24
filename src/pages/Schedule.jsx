import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/UseAuth";

import {
  Button,
  Card,
  Badge,
  TopBar,
  ProgressSteps,
  ResponseCard,
} from "../components/UI";
import { useBookingStore } from "../utils/bookingStore";
import NavBar from "../components/NavBar";
import NavBarClient from "../components/NavBarClient";

const TIMES = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function getDates() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : days[d.getDay()],
      date: `${d.getDate()} ${months[d.getMonth()]}`,
      d,
    };
  });
}

const Schedule = ({ navigate }) => {
  const booking = useBookingStore((state) => state.booking);
  const updateBooking = useBookingStore((state) => state.updateBooking);
  const resetBooking = useBookingStore((state) => state.resetBooking);

  const [step, setStep] = useState(1);
 

  const dates = getDates();
  console.log(dates);
  
  const selectedService = booking.service;
  const total=booking.total;

  const canNext = step === 1 ? !!(booking.date && booking.time) : true;

  const handleNext = () => {
    navigate("location");
  };

  const {user}=useAuth();

  // console.log(booking);

  return (
    <div className="min-h-screen bg-surface-100 pb-32">
       {user ? (
        <NavBarClient />
      ) : (
        <TopBar title="Book Your Wash" onBack={() => navigate(booking)} />
      )}
      <ProgressSteps steps={["Service", "Schedule", "Location"]} current={1} />
      <div className="max-w-2xl mx-auto px-4 bg-surface-50">
        <p className="text-surface-500 text-sm mb-6">
          Choose your preferred date and time slot
        </p>

        {/* Date picker */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-surface-400 mb-3">
            Select date
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {dates.slice(0, 10).map((d, i) => (
              <button
                key={i}
                onClick={() => updateBooking({date:d.date})}
                className={`flex flex-col items-center min-w-[64px] py-3 px-2 rounded-xl border transition-all flex-shrink-0 ${booking.date === d.date ? "border-primary-500 bg-primary-100 shadow-[0_0_16px_rgba(0,201,177,0.15)]" : "border-white/8 bg-surface-100 hover:border-primary-500"}`}
              >
                <span
                  className={`text-xs mb-1 ${booking.date === d.date ? "text-primary-600" : "text-surface-400"}`}
                >
                  {d.label}
                </span>
                <span
                  className={`text-sm font-medium ${booking.date === d.date ? "text-surface-900" : "text-surface-300"}`}
                >
                  {d.date}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Time picker */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-surface-400 mb-3">
            Select time
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {TIMES.map((t) => (
              <button
                key={t}
                onClick={() => updateBooking({time:t})}
                className={`py-3 rounded-xl border text-sm font-medium transition-all ${booking.time === t ? "border-primary-500 bg-primary-100 text-primary-600" : "border-white/8 bg-surface-100 text-surface-300 hover:border-white/20 hover:text-surface-600"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedService && (
          <Card className="p-4 mt-6">
            <h4 className="text-sm font-medium text-surface-400 mb-3">
              Booking summary
            </h4>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-surface-400">{selectedService.name}</span>
              <span className="text-surface-900">
                {selectedService.price.toLocaleString()} RWF
              </span>
            </div>
            {booking.addons.map((id) => {
              const a = booking.service?.addOns.find((x) => x.id === id);
              return a ? (
                <div key={id} className="flex justify-between text-sm mb-1">
                  <span className="text-surface-400">{a.name}</span>
                  <span className="text-surface-900">
                    +{a.price.toLocaleString()} RWF
                  </span>
                </div>
              ) : null;
            })}
            <div className="border-t border-white/8 mt-3 pt-3 flex justify-between">
              <span className="font-medium text-surface-900">Total</span>
              <span className="font-display text-lg text-primary-500">
                {total.toLocaleString()} RWF
              </span>
            </div>
          </Card>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-surface-50 backdrop-blur-md border-t border-white/8 p-4 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-4">

          <Button
            className="flex-1 h-12"
            size="md"
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
