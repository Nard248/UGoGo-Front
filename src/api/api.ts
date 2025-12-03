import axios from "axios";

export const api = axios.create({
  baseURL: `https://ugogo-auhdbad8drdma7f6.canadacentral-01.azurewebsites.net`,
  // baseURL: `http://127.0.0.1:8000/`,
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

api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
          // No refresh token available - redirect to login
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("userDetails");
          localStorage.removeItem("email");
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

        // Clear all auth data
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("userDetails");
        localStorage.removeItem("email");

        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

