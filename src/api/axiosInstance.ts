import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({ baseURL: "https://dummyjson.com" });

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
