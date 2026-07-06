"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api, setTokens, clearTokens, getToken, refreshToken } from "./api";
import type { User } from "./types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.get<User>("/auth/me/", token);
      setUser(data);
    } catch {
      const newToken = await refreshToken();
      if (newToken) {
        try {
          const data = await api.get<User>("/auth/me/", newToken);
          setUser(data);
        } catch {
          clearTokens();
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username: string, password: string) => {
    const data = await api.post<{ access: string; refresh: string }>("/auth/login/", {
      username,
      password,
    });
    setTokens(data.access, data.refresh);
    const userData = await api.get<User>("/auth/me/", data.access);
    setUser(userData);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    await api.post<User>("/auth/register/", {
      username,
      email,
      password,
      password_confirm: passwordConfirm,
    });
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
