import axios from "axios";

export const api = axios.create({
    baseURL: `https://ugogo-auhdbad8drdma7f6.canadacentral-01.azurewebsites.net`
});

api.interceptors.request.use((request: any) => {
        const accessToken = localStorage.getItem('access');

        return {
            ...request,
            headers: {
                ...(accessToken !== null && {Authorization: `Bearer ${accessToken}`}),
                ...request.headers,
                'Access-Control-Allow-Origin': '*'
            },
        };
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: any) => response, // Pass successful responses as is
    async (error: any) => {
        const originalRequest = error.config;

        // If unauthorized and it's the first retry, attempt refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop

            try {
                const refreshToken = localStorage.getItem("refresh");
                if (!refreshToken) throw new Error("No refresh token available");

                // Request new access token using refresh token
                const { data } = await api.post("/users/token/refresh", { refresh: refreshToken });
                // Store new tokens
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);

                // Retry the failed request with new token
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);
            } catch (err) {
                console.error("Refresh token failed", err);
                localStorage.removeItem('token');
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);