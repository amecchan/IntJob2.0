import axios from "axios";

// This is your Django backend base URL
export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";

// Use the local URL where your Django backend is running
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// The interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      // This adds the JWT to the request headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;