import { create } from "zustand";
import { persist } from "zustand/middleware";

function getTodayISODate() {
  const now = new Date();
  return now.toISOString().split("T")[0]; // "2026-05-04"
}

export const useBookingStore = create(
  persist(
    (set, get) => ({
      booking: {
        service: null,
        addons: [],
        date: getTodayISODate(),
        time: null,
        customTime: null,
        timeWindow: null,
        location: null,
        washer: null,
        notes: null,
        payment: null,
      },

      // 🔥 central update
      updateBooking: (data) =>
        set((state) => {
          const updated = { ...state.booking, ...data };

          return {
            booking: updated,
          };
        }),

      getTotal: () => {
        const { booking } = get();

        const servicePrice = booking.service?.price || 0;

        const addonsTotal = booking.addons.reduce(
          (sum, a) => sum + (a.price || 0),
          0
        );

        return servicePrice + addonsTotal;
      },

      getFinalTime: () => {
        const { booking } = get();
        return booking.time || booking.customTime;
      },

      resetBooking: () =>
        set({
          booking: {
            service: null,
            addons: [],
            date: null,
            time: null,
            customTime: null,
            timeWindow: null,
            location: null,
            washer: null,
            notes: null,
            payment: null,
          },
        }),
    }),
    {
      name: "booking-storage",
    }
  )
);