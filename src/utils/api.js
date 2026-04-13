import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // sends httpOnly refresh cookie
});

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track if we already tried a refresh this session
// to prevent interceptor-level infinite loops
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401s that haven't been retried yet
    // and are NOT the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retried &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        // Another refresh is already in progress — just reject
        return Promise.reject(error);
      }

      originalRequest._retried = true;
      isRefreshing = true;

      try {
        const refreshRes = await api.post("/auth/refresh");
        const newToken = refreshRes.data?.token;

        if (!newToken) throw new Error("No token");

        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest); // retry original request once

      } catch (_) {
        // Refresh failed — clear storage, let the app handle redirect
        localStorage.removeItem("token");
        localStorage.removeItem("carwash-user");
        return Promise.reject(error);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;