import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || `http://127.0.0.1:8001`,
  // Production: https://ugogo-backend.blackflower-e8d746fa.eastus.azurecontainerapps.io
});

api.interceptors.request.use(
  (request: any) => {
    const accessToken = localStorage.getItem("access");

    return {
      ...request,
      headers: {
        ...(accessToken !== null && { Authorization: `Bearer ${accessToken}` }),
        ...request.headers,
        // "Access-Control-Allow-Origin": "*",
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints where 401 means "bad credentials", not "expired token"
const AUTH_ENDPOINTS = ['/users/token/', '/users/register/', '/users/forgot-password/', '/users/reset-password/'];

api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // Skip token refresh for auth endpoints — let the component handle the error
    const isAuthEndpoint = AUTH_ENDPOINTS.some(ep => requestUrl.endsWith(ep));

    // Handle 401 Unauthorized errors (token expired) — but not for auth endpoints
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");

      // If user was never logged in (no tokens at all), just reject — don't redirect
      if (!accessToken && !refreshToken) {
        return Promise.reject(error);
      }

      try {
        if (!refreshToken) {
          // Had an access token but no refresh — session is gone, redirect to login
          const { clearUserData } = await import("../utils/auth");
          await clearUserData();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Try to refresh the access token
        // Use plain axios (not api) to avoid interceptor loop
        const { data } = await axios.post(
          `${api.defaults.baseURL}/users/token/refresh/`,
          { refresh: refreshToken }
        );

        // Save new tokens
        localStorage.setItem("access", data.access);
        if (data.refresh) {
          localStorage.setItem("refresh", data.refresh);
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (err: any) {
        // Refresh token is also expired or invalid
        console.error("Token refresh failed - redirecting to login", err);

        // Clear all user data (localStorage + caches) and redirect to login
        const { clearUserData } = await import("../utils/auth");
        await clearUserData();

        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

