import axios from "axios";

export const api = axios.create({
    baseURL: `https://ugogo-auhdbad8drdma7f6.canadacentral-01.azurewebsites.net`
});

api.interceptors.request.use((request: any) => {
        const token = localStorage.getItem('token');
        console.log(token);
        return {
            ...request,
            headers: {
                ...(token !== null && {Authorization: `Bearer ${token}`}),
                ...request.headers,
                'Access-Control-Allow-Origin': '*'
            },
        };
    },
    (error) => {
        return Promise.reject(error);
    }
);

// axios.interceptors.response.use(
//     (response) => {
//         //const url = response.config.url;
//
//         //setLocalStorageToken(token);
//         return response;
//     },
//     (error) => {
//         if (error.response.status === 401) {
//             //(`unauthorized :)`);
//             //localStorage.removeItem("persist:root");
//             //removeLocalStorageToken
//             //window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     }
// )