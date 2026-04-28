import { useState, useEffect, useRef, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import api from "../utils/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("carwash-user")) || null,
  );
  const [loading, setLoading] = useState(true);

  const isLoadingRef = useRef(false);
  const didLogoutRef = useRef(false);
  // NEW: tracks that we're in a fresh login attempt — suppress loadUser
  const loginInFlightRef = useRef(false);

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("carwash-user");
  }, []);

  const logout = useCallback(async () => {
    didLogoutRef.current = true;
    clearSession();
    try {
      await api.post("/auth/logout");
    } catch (_) {}
  }, [clearSession]);

  const loadUser = useCallback(async () => {
    // ── Skip: explicit logout happened ──────────────────
    if (didLogoutRef.current) return;

    // ── Skip: a login attempt is in progress ────────────
    if (loginInFlightRef.current) return;

    // ── Skip: no token, nothing to restore ──────────────
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // ── Skip: already running ───────────────────────────
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const res = await api.get("/auth/me");
      const fetchedUser = res.data?.data?.user;
      setUser(fetchedUser);
      localStorage.setItem("carwash-user", JSON.stringify(fetchedUser));
    } catch (err) {
      // Only refresh on 401, not network errors or 5xx
      if (err?.response?.status !== 401) {
        return;
      }

      try {
        const refreshRes = await api.post("/auth/refresh");
        const newToken = refreshRes.data?.token;
        if (!newToken) throw new Error("No token");

        localStorage.setItem("token", newToken);

        const userRes = await api.get("/auth/me");
        const fetchedUser = userRes.data?.data?.user;
        setUser(fetchedUser);
        localStorage.setItem("carwash-user", JSON.stringify(fetchedUser));
      } catch (_) {
        // Refresh failed — clear once, do NOT loop
        clearSession();
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [clearSession]);

  // Run once on mount only
  useEffect(() => {
    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signUp = useCallback(async (name, email, phone,password ) => {
    try {
      const res = await api.post("/auth/register", { name,email, password,phone });
      return res.data;
    } catch (error) {
      return { error: error.response?.data || "Registering user failed" };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    // ── Signal: login in flight, suppress any loadUser ──
    loginInFlightRef.current = true;
    didLogoutRef.current = false;

    // ── Clear stale token BEFORE attempting login ────────
    // This is the key fix: if a bad token is in storage and
    // login fails, loadUser won't pick it up and loop.
    localStorage.removeItem("token");
    localStorage.removeItem("carwash-user");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user: loggedInUser } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("carwash-user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      return res.data;
    } catch (error) {
      // Login failed — session already cleared above, nothing to loop on
      return { error: error.response?.data || "Login failed" };
    } finally {
      // Always release the lock after login resolves/rejects
      loginInFlightRef.current = false;
    }
  }, []);

  const guestLogin = useCallback(async (name, phone, email) => {
    loginInFlightRef.current = true;
    didLogoutRef.current = false;
    localStorage.removeItem("token");

    try {
      const res = await api.post("/auth/guest", { name, phone, email });
      const { token, user: guestUser } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("carwash-user", JSON.stringify(guestUser));
      setUser(guestUser);

      return res.data;
    } catch (error) {
      return { error: error.response?.data || "Guest login failed" };
    } finally {
      loginInFlightRef.current = false;
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      const res = await api.put("/auth/me", data);
      const updated = res.data?.data?.user;
      setUser(updated);
      localStorage.setItem("carwash-user", JSON.stringify(updated));
      return res.data;
    } catch (err) {
      return { error: err.response?.data || "Update failed" };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const res = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return res.data;
    } catch (err) {
      return { error: err.response?.data };
    }
  }, []);

  //services interface provided to context consumers
  const getServices = useCallback(async () => {
    try {
      const res = await api.get("/services");
      return res.data?.data?.services;
    } catch (err) {
      return { error: err.response?.data || "Failed to fetch services" };
    }
  }, []);

  //users
  const getWashers = useCallback(async () => {
    try {
      const res = await api.get("/users/washers");

      return res.data?.data?.washers;
    } catch (err) {
      return { error: err.response?.data || "Failed to fetch washers" };
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get("/bookings?limit=50");
      return res.data?.data;
    } catch (err) {
      return { error: err.response?.data || "Failed to fetch washing history" };
    }
  }, []);

  const createBooking = useCallback(async (data) => {
    try {
      const res = await api.post("/bookings", data);
      return res.data;
    } catch (err) {
      return {
        error: err.response?.data || "Failed to create booking session",
      };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        login,
        guestLogin,
        logout,
        loading,
        isAuthenticated: !!user,
        updateProfile,
        changePassword,
        fetchHistory,
        createBooking,

        getServices,

        getWashers,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
