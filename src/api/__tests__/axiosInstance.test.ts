import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { resetLoginAttempts, server } from "../../test/mswServer";
import { useAuthStore } from "../../store/authStore";
import { api } from "../axiosInstance";

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("axios interceptor - refresh & retry", () => {
  beforeEach(() => {
    server.resetHandlers();
    resetLoginAttempts();
    useAuthStore.setState({
      accessToken: "expired-token",
      refreshToken: "valid-refresh-token",
      user: null,
      isAuthenticated: true,
      isInitializing: false,
    });
  });

  it("refreshes the token and retries the original request after a 401", async () => {
    const response = await api.get("/auth/protected-resource");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: "success" });
  });

  it("updates the access token in the store after a successful refresh", async () => {
    await api.get("/auth/protected-resource");

    expect(useAuthStore.getState().accessToken).toBe("new-fake-access-token");
  });
});
