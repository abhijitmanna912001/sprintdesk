import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

let loginAttempt = 0;

export const server = setupServer(
  http.get("https://dummyjson.com/auth/protected-resource", () => {
    loginAttempt += 1;
    if (loginAttempt === 1) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({ message: "success" });
  }),

  http.post("https://dummyjson.com/auth/refresh", () => {
    return HttpResponse.json({
      accessToken: "new-fake-access-token",
      refreshToken: "new-fake-refresh-token",
    });
  }),
);

export function resetLoginAttempts() {
  loginAttempt = 0;
}
