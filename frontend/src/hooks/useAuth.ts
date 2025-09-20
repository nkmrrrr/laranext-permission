import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  token_type: string;
}

// ヘルスチェック
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ["health-check"],
    queryFn: async () => {
      const { data } = await apiClient.get("/health-check");
      return data;
    },
  });
};

// ログイン
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<LoginResponse> => {
      const { data } = await apiClient.post("/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      queryClient.setQueryData(["user"], data.user);
    },
  });
};

// ログアウト
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });
};

// 認証済みユーザー情報取得
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get("/user");
      return data;
    },
    enabled: !!localStorage.getItem("auth_token"),
    retry: false,
  });
};
