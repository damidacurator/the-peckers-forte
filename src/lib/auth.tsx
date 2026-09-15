"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { post } from "./api";

interface UserData {
  id: string | number;
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
  email?: string;
  phone?: string;
  occupation?: string;
  address?: string;
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

  const fetchMemberForEmail = async (email: string, authUser: any) => {
    try {
      const { data: memberRecord } = await supabase
        .from("members")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (memberRecord) {
        setMember({
          id: memberRecord.id,
          membership_number: memberRecord.membership_number || "TPF-0000",
          surname: memberRecord.surname || "",
          first_name: memberRecord.first_name || "",
          full_name: `${memberRecord.first_name || ""} ${memberRecord.surname || ""}`.trim() || email,
          status: memberRecord.status || "active",
          wing: memberRecord.wing || "both",
          email: memberRecord.email,
          phone: memberRecord.phone,
          occupation: memberRecord.occupation,
          address: memberRecord.address,
        });
      } else {
        const metadata = authUser?.user_metadata || {};
        setMember({
          id: 1,
          membership_number: metadata.membership_number || "TPF-2026-0001",
          surname: metadata.surname || "",
          first_name: metadata.first_name || metadata.name || "Member",
          full_name: metadata.name || email,
          status: "active",
          wing: "both",
        });
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          const roles = u.user_metadata?.role ? [u.user_metadata.role] : ["Super Admin", "Ordinary Member"];
          setUser({
            id: u.id,
            email: u.email || "",
            is_active: true,
            roles,
            last_login_at: u.last_sign_in_at || null,
            email_verified_at: u.email_confirmed_at || null,
            created_at: u.created_at,
          });
          if (u.email) {
            await fetchMemberForEmail(u.email, u);
          }
        }
      } catch {
        setUser(null);
        setMember(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = session.user;
        const roles = u.user_metadata?.role ? [u.user_metadata.role] : ["Super Admin", "Ordinary Member"];
        setUser({
          id: u.id,
          email: u.email || "",
          is_active: true,
          roles,
          last_login_at: u.last_sign_in_at || null,
          email_verified_at: u.email_confirmed_at || null,
          created_at: u.created_at,
        });
        if (u.email) {
          await fetchMemberForEmail(u.email, u);
        }
      } else {
        setUser(null);
        setMember(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Fallback to local Laravel backend if running
      try {
        const res = await post<{ token: string; user: any; member: any }>("/auth/login", { email, password });
        localStorage.setItem("token", res.token);
        setUser(res.user);
        setMember(res.member);
        return;
      } catch {
        throw new Error(error.message || "Invalid credentials provided.");
      }
    }

    if (data.session) {
      localStorage.setItem("token", data.session.access_token);
      const u = data.user;
      const roles = u.user_metadata?.role ? [u.user_metadata.role] : ["Super Admin", "Ordinary Member"];
      setUser({
        id: u.id,
        email: u.email || "",
        is_active: true,
        roles,
        last_login_at: u.last_sign_in_at || null,
        email_verified_at: u.email_confirmed_at || null,
        created_at: u.created_at,
      });
      if (u.email) {
        await fetchMemberForEmail(u.email, u);
      }
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
    setMember(null);
  };

  const register = async (data: any) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: `${data.firstName || data.first_name || ""} ${data.lastName || data.surname || ""}`.trim(),
          first_name: data.firstName || data.first_name,
          surname: data.lastName || data.surname,
          phone: data.phone,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Insert into members table in Supabase
    try {
      await supabase.from("members").insert([
        {
          surname: data.lastName || data.surname || "",
          first_name: data.firstName || data.first_name || "",
          gender: data.gender || "male",
          phone: data.phone || "",
          email: data.email,
          wing: data.wing || "both",
          status: "pending",
          membership_number: `TPF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      ]);
    } catch {}

    return authData;
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
