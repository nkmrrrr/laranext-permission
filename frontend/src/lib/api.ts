import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,

  // https://www.mochot.com/posts/laravel-sanctum-419-csrf-error
  // withCredentials: true // だけではなく、withXSRFToken: true を指定しないとCSRFトークンが自動で送信されない
  withXSRFToken: true,
});

// リクエストインターセプター: トークンを自動で追加
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター: 401エラーでログアウト
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 型定義
// MEMO: type.ts などに分離しても良いが、ファイル数が増えすぎるので一旦ここにまとめる
export interface User {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
}

export interface Post {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url?: string;
    prev_page_url?: string;
  };
  user_permissions?: {
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
  };
}

// API関数
export const authApi = {
  getCsrfCookie: async () => {
    return api.get("/sanctum/csrf-cookie");
  },

  login: async (email: string, password: string) => {
    return api.post<
      ApiResponse<{
        user: User;
        token: string;
        permissions: string[];
        roles: string[];
      }>
    >("/login", { email, password });
  },

  logout: () => api.post<ApiResponse<null>>("/logout"),

  me: () =>
    api.get<
      ApiResponse<{ user: User; permissions: string[]; roles: string[] }>
    >("/me"),
};

export const postsApi = {
  getAll: (page = 1) => api.get<PaginatedResponse<Post>>(`/posts?page=${page}`),

  getById: (id: number) =>
    api.get<
      ApiResponse<
        Post & { permissions: { can_edit: boolean; can_delete: boolean } }
      >
    >(`/posts/${id}`),

  create: (data: { title: string; content: string; is_published: boolean }) =>
    api.post<ApiResponse<Post>>("/posts", data),

  update: (
    id: number,
    data: { title: string; content: string; is_published: boolean }
  ) => api.put<ApiResponse<Post>>(`/posts/${id}`, data),

  delete: (id: number) => api.delete<ApiResponse<null>>(`/posts/${id}`),
};
