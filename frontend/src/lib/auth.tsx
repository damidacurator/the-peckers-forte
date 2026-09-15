"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, post, get } from "./api";

interface UserData {
  id: number;
  email: string;
  is_active: boolean;
  roles: string[];
  last_login_at: string | null;
  email_verified_at: string | null;
  created_at: string;
}

interface MemberData {
  id: number;
  membership_number: string;
  surname: string;
  first_name: string;
  full_name: string;
  status: string;
  wing: string;
}

interface AuthContextType {
  user: UserData | null;
  member: MemberData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [member, setMember] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await get<{ user: UserData; member: MemberData | null }>("/auth/me");
          setUser(res.user);
          setMember(res.member);
        }
      } catch (error: any) {
        localStorage.removeItem("token");
        setUser(null);
        setMember(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await post<{ token: string; user: UserData; member: MemberData | null }>("/auth/login", { email, password });
    localStorage.setItem("token", res.token);
    setUser(res.user);
    setMember(res.member);
  };

  const logout = () => {
    // Fire and forget the server logout
    post("/auth/logout").catch(() => {});
    localStorage.removeItem("token");
    setUser(null);
    setMember(null);
  };

  const register = async (data: any) => {
    return await post("/auth/register", data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        member,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
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
