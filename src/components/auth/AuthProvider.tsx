"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { AuthUser, LoginPayload, RegisterPayload } from "@/types/auth";
import { fetchCurrentUser, loginUser, registerUser } from "@/lib/auth-api";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => void;
};

const AUTH_TOKEN_KEY = "velhot.session.token";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem(AUTH_TOKEN_KEY);

    if (!storedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    fetchCurrentUser(storedToken)
      .then((currentUser) => setUser(currentUser))
      .catch(() => {
        window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(payload: LoginPayload) {
    const response = await loginUser(payload);
    window.sessionStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
    setToken(response.access_token);
    const currentUser = await fetchCurrentUser(response.access_token);
    setUser(currentUser);
  }

  async function signUp(payload: RegisterPayload) {
    await registerUser(payload);
    const response = await loginUser({ email: payload.email, password: payload.password });
    window.sessionStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
    setToken(response.access_token);
    const currentUser = await fetchCurrentUser(response.access_token);
    setUser(currentUser);
  }

  function signOut() {
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }

  return context;
}
