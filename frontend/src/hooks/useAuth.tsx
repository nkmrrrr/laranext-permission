"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, authApi } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  permissions: string[];
  roles: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const response = await authApi.me();
        setUser(response.data.data.user);
        setPermissions(response.data.data.permissions);
        setRoles(response.data.data.roles);
      }
    } catch (error) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const { user, token, permissions, roles } = response.data.data;

    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    setPermissions(permissions);
    setRoles(roles);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // ログアウトAPIが失敗してもローカルデータは削除
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      setPermissions([]);
      setRoles([]);
    }
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasRole = (role: string) => {
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        roles,
        login,
        logout,
        loading,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
