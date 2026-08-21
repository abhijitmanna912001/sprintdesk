import type {
  DummyJsonLoginResponse,
  DummyJsonRefreshResponse,
} from "../types";
import { api } from "./axiosInstance";

export function loginRequest(username: string, password: string) {
  return api.post<DummyJsonLoginResponse>("/auth/login", {
    username,
    password,
    expiresInMins: 1, // short expiry so we can actually test silent refresh
  });
}

export function refreshRequest(refreshToken: string) {
  return api.post<DummyJsonRefreshResponse>("/auth/refresh", {
    refreshToken,
    expiresInMins: 1,
  });
}
