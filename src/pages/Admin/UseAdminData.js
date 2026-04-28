import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../utils/api";

// ── Generic fetch hook ────────────────────────────────────
export function useAdminFetch(fetchFn, deps = [], options = {}) {
  const { immediate = true, initialData = null } = options;
  const [data,    setData]    = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);
  const abortRef = useRef(null);

const execute = useCallback(async (...args) => {
  if (abortRef.current) abortRef.current.abort();

  const controller = new AbortController();
  abortRef.current = controller;

  setLoading(true);
  setError(null);

  try {
    const result = await fetchFn(...args, controller.signal);

    if (abortRef.current === controller) {
      setData(result);
    }

    return result;
  } catch (err) {
    if (err.name !== "CanceledError" && err.name !== "AbortError") {
      if (abortRef.current === controller) {
        setError(err?.response?.data?.message || "Something went wrong");
      }
    }
    return null;
  } finally {
    if (abortRef.current === controller) {
      setLoading(false);
    }
  }
}, deps);

  useEffect(() => {
    if (immediate) execute();
    return () => abortRef.current?.abort();
  }, deps); // eslint-disable-line

  return { data, loading, error, refetch: execute, setData };
}

// ── Stats ─────────────────────────────────────────────────
export function useAdminStats() {
  return useAdminFetch(
    async (signal) => {
      const res = await api.get("/bookings/stats", { signal });
      return res.data.data;
    },
    [],
    { initialData: null }
  );
}

// ── All bookings (admin) ──────────────────────────────────
export function useAdminBookings(params = {}) {
  const { status, date, washer, page = 1, limit = 20 } = params;
  return useAdminFetch(
    async (signal) => {
      const q = new URLSearchParams({ page, limit });
      if (status && status !== "all") q.set("status", status);
      if (date)   q.set("date",   date);
      if (washer) q.set("washer", washer);
      const res = await api.get(`/bookings/admin/all?${q}`, { signal });
      return res.data;
    },
    [status, date, washer, page, limit],
    { initialData: null }
  );
}

// ── Washers ───────────────────────────────────────────────
export function useWashers(params = {}) {
  const { available } = params;
  return useAdminFetch(
    async (signal) => {
      const q = new URLSearchParams();
      if (available !== undefined) q.set("available", available);
      const res = await api.get(`/users/washers?${q}`, { signal });
      return res.data.data.washers;
    },
    [available],
    { initialData: [] }
  );
}

// ── Customers ─────────────────────────────────────────────
export function useCustomers(params = {}) {
  const { search = "", page = 1, limit = 20 } = params;
  return useAdminFetch(
    async (signal) => {
      const q = new URLSearchParams({ page, limit, role: "customer" });
      if (search) q.set("search", search);
      const res = await api.get(`/users?${q}`, { signal });
      return res.data;
    },
    [search, page, limit],
    { initialData: { data: [], meta: {} } }
  );
}

// ── Mutation helpers ──────────────────────────────────────
export async function assignWasherToBooking(bookingId, washerId) {
  const res = await api.patch(`/bookings/${bookingId}/assign`, { washerId });
  return res.data;
}

export async function updateBookingStatus(bookingId, status, reason) {
  const res = await api.patch(`/bookings/${bookingId}/status`, { status, reason });
  return res.data;
}

export async function updateWasher(washerId, updates) {
  const res = await api.put(`/users/${washerId}`, updates);
  return res.data;
}