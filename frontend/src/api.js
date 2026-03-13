import axios from "axios";
import { ACCESS_TOKEN, API_URL } from "./constants";

const api = axios.create({
  baseURL: API_URL,
});

// This interceptor automatically attaches the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;