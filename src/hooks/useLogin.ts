import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { loginRequest } from "../api/auth";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => loginRequest(username, password),
    onSuccess: (response) => {
      const { accessToken, refreshToken, ...user } = response.data;
      setAuth(user, accessToken, refreshToken);
    },
  });
}
