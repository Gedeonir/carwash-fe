import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBookingStore = create(
  persist(
    (set) => ({
      booking: {
        service: null,
        addons: [],
        date: null,
        time: null,
        location: null,
        washer: null,
        notes: null,
        total: 0,
      },
      updateBooking: (data) =>
        set((state) => ({
          booking: { ...state.booking, ...data },
        })),
      resetBooking: () =>
        set({
          booking: {
            service: null,
            addons: [],
            date: null,
            time: null,
            location: null,
            washer: null,
            notes: null,
            total: 0,
          },
        }),
    }),
    {
      name: "booking-storage", // key in localStorage
    },
  ),
);
