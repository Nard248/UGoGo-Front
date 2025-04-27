import axios from "axios";

export const api = axios.create({
  baseURL: `https://ugogo-auhdbad8drdma7f6.canadacentral-01.azurewebsites.net`,
  // baseURL: `http://192.168.5.53:8000`,
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

    if (error.response?.status === 401 && !originalRequest._retry) {      
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) throw new Error("No refresh token available");

        const { data } = await api.post("/users/token/refresh/", {
          refresh: refreshToken,
        });

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

