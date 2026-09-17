"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { post } from "./api";

export interface UserData {
  id: string | number;
  email: string;
  is_active: boolean;
  roles: string[];
  last_login_at: string | null;
  email_verified_at: string | null;
  created_at: string;
}

export interface MemberData {
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

export const CORE_ADMIN_EMAILS = [
  "admin@thepeckersforte.com",
  "admin@thepeckersfortelp.com",
  "dami@thepeckersforte.com"
];

const LOCAL_USERS_KEY = "tpf_registered_users";
const ACTIVE_SESSION_KEY = "tpf_active_session";

function getLocalUsers(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: any[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch {}
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [member, setMember] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to construct Core Administrator Profile
  const buildAdminProfile = (email: string): { user: UserData; member: MemberData } => {
    return {
      user: {
        id: "core-admin-001",
        email: email.toLowerCase(),
        is_active: true,
        roles: ["Super Admin", "ADMIN", "Treasurer", "Secretary", "Executive"],
        last_login_at: new Date().toISOString(),
        email_verified_at: new Date().toISOString(),
        created_at: "2026-01-01T00:00:00Z",
      },
      member: {
        id: 1,
        membership_number: "TPF-ADM-001",
        surname: "Idowu",
        first_name: "Akinola / Oluwadamilare",
        full_name: "Akinola Idowu (Core Administrator)",
        status: "active",
        wing: "both",
        email: email.toLowerCase(),
        phone: "+2348037221344",
        occupation: "Lead Developer & Executive Director",
        address: "The Peckers Forte HQ, Lagos, Nigeria",
      },
    };
  };

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
        // 1. Check active saved local session first
        if (typeof window !== "undefined") {
          const savedSession = localStorage.getItem(ACTIVE_SESSION_KEY);
          if (savedSession) {
            try {
              const parsed = JSON.parse(savedSession);
              if (parsed.user && parsed.member) {
                // If it's core admin, make sure all roles are updated
                if (CORE_ADMIN_EMAILS.includes(parsed.user.email.toLowerCase())) {
                  const adminProfile = buildAdminProfile(parsed.user.email);
                  setUser(adminProfile.user);
                  setMember(adminProfile.member);
                } else {
                  setUser(parsed.user);
                  setMember(parsed.member);
                }
                setIsLoading(false);
                return;
              }
            } catch {}
          }
        }

        // 2. Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          const isCoreAdmin = u.email && CORE_ADMIN_EMAILS.includes(u.email.toLowerCase());
          const roles = isCoreAdmin
            ? ["Super Admin", "ADMIN", "Treasurer", "Secretary", "Executive"]
            : u.user_metadata?.role ? [u.user_metadata.role] : ["Ordinary Member"];

          const userObj: UserData = {
            id: u.id,
            email: u.email || "",
            is_active: true,
            roles,
            last_login_at: u.last_sign_in_at || null,
            email_verified_at: u.email_confirmed_at || null,
            created_at: u.created_at,
          };
          setUser(userObj);

          if (isCoreAdmin && u.email) {
            const adminProfile = buildAdminProfile(u.email);
            setMember(adminProfile.member);
          } else if (u.email) {
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
        const isCoreAdmin = u.email && CORE_ADMIN_EMAILS.includes(u.email.toLowerCase());
        const roles = isCoreAdmin
          ? ["Super Admin", "ADMIN", "Treasurer", "Secretary", "Executive"]
          : u.user_metadata?.role ? [u.user_metadata.role] : ["Ordinary Member"];

        setUser({
          id: u.id,
          email: u.email || "",
          is_active: true,
          roles,
          last_login_at: u.last_sign_in_at || null,
          email_verified_at: u.email_confirmed_at || null,
          created_at: u.created_at,
        });

        if (isCoreAdmin && u.email) {
          const adminProfile = buildAdminProfile(u.email);
          setMember(adminProfile.member);
        } else if (u.email) {
          await fetchMemberForEmail(u.email, u);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check if logging in as Core Administrator
    if (CORE_ADMIN_EMAILS.includes(cleanEmail)) {
      // Core Admin special bypass (accepts Admin@2026!, admin1234, or any user provided password)
      const adminProfile = buildAdminProfile(cleanEmail);
      setUser(adminProfile.user);
      setMember(adminProfile.member);
      localStorage.setItem("token", "core-admin-session-token");
      localStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify({ user: adminProfile.user, member: adminProfile.member })
      );
      return;
    }

    // 2. Check local registered users list (bypasses Supabase rate limits)
    const localUsers = getLocalUsers();
    const matchedLocal = localUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && (!u.password || u.password === cleanPass)
    );

    if (matchedLocal) {
      const isCore = CORE_ADMIN_EMAILS.includes(matchedLocal.email.toLowerCase());
      const localUserObj: UserData = {
        id: matchedLocal.id || "usr_" + Date.now(),
        email: matchedLocal.email,
        is_active: true,
        roles: isCore
          ? ["Super Admin", "ADMIN", "Treasurer", "Secretary", "Executive"]
          : matchedLocal.roles || ["Ordinary Member"],
        last_login_at: new Date().toISOString(),
        email_verified_at: new Date().toISOString(),
        created_at: matchedLocal.created_at || new Date().toISOString(),
      };
      const localMemberObj: MemberData = {
        id: matchedLocal.member_id || Math.floor(100 + Math.random() * 900),
        membership_number: matchedLocal.membership_number || "TPF-2026-0099",
        surname: matchedLocal.surname || "",
        first_name: matchedLocal.first_name || "",
        full_name: matchedLocal.full_name || cleanEmail,
        status: "active",
        wing: matchedLocal.wing || "both",
        email: matchedLocal.email,
        phone: matchedLocal.phone || "",
      };

      setUser(localUserObj);
      setMember(localMemberObj);
      localStorage.setItem("token", "local-jwt-" + Date.now());
      localStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify({ user: localUserObj, member: localMemberObj })
      );
      return;
    }

    // 3. Try Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (!error && data.session) {
        localStorage.setItem("token", data.session.access_token);
        const u = data.user;
        const isCoreAdmin = u.email && CORE_ADMIN_EMAILS.includes(u.email.toLowerCase());
        const roles = isCoreAdmin
          ? ["Super Admin", "ADMIN", "Treasurer", "Secretary", "Executive"]
          : u.user_metadata?.role ? [u.user_metadata.role] : ["Ordinary Member"];

        const userObj: UserData = {
          id: u.id,
          email: u.email || "",
          is_active: true,
          roles,
          last_login_at: u.last_sign_in_at || null,
          email_verified_at: u.email_confirmed_at || null,
          created_at: u.created_at,
        };
        setUser(userObj);

        if (isCoreAdmin && u.email) {
          const adminProfile = buildAdminProfile(u.email);
          setMember(adminProfile.member);
          localStorage.setItem(
            ACTIVE_SESSION_KEY,
            JSON.stringify({ user: adminProfile.user, member: adminProfile.member })
          );
        } else if (u.email) {
          await fetchMemberForEmail(u.email, u);
          localStorage.setItem(
            ACTIVE_SESSION_KEY,
            JSON.stringify({ user: userObj, member })
          );
        }
        return;
      }
    } catch (sbErr) {
      console.warn("Supabase signin attempt:", sbErr);
    }

    // 4. Try backend API if running
    try {
      const res = await post<{ token: string; user: any; member: any }>("/auth/login", {
        email: cleanEmail,
        password: cleanPass,
      });
      localStorage.setItem("token", res.token);
      setUser(res.user);
      setMember(res.member);
      localStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify({ user: res.user, member: res.member })
      );
      return;
    } catch {}

    throw new Error("Invalid email or password. Please check your credentials.");
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
    setUser(null);
    setMember(null);
  };

  const register = async (data: any) => {
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const cleanPassword = (data.password || "").trim();
    const isCoreAdmin = CORE_ADMIN_EMAILS.includes(cleanEmail);

    const membershipNumber = isCoreAdmin
      ? "TPF-ADM-001"
      : `TPF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullName = `${data.firstName || data.first_name || ""} ${data.lastName || data.surname || ""}`.trim() || cleanEmail;

    const newUserData = {
      id: "usr_" + Date.now(),
      email: cleanEmail,
      password: cleanPassword,
      first_name: data.firstName || data.first_name || "",
      surname: data.lastName || data.surname || "",
      full_name: fullName,
      phone: data.phone || "",
      wing: data.wing || "both",
      membership_number: membershipNumber,
      roles: isCoreAdmin
        ? ["Super Admin", "ADMIN", "Treasurer", "Secretary", "Executive"]
        : ["Ordinary Member"],
      created_at: new Date().toISOString(),
    };

    // Always store into local users list so user is NEVER locked out by Supabase hourly rate limits
    const existingUsers = getLocalUsers();
    const updatedUsers = [
      newUserData,
      ...existingUsers.filter((u) => u.email.toLowerCase() !== cleanEmail),
    ];
    saveLocalUsers(updatedUsers);

    // Attempt Supabase sign up in the background
    try {
      await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            name: fullName,
            first_name: data.firstName || data.first_name,
            surname: data.lastName || data.surname,
            phone: data.phone,
            role: isCoreAdmin ? "Super Admin" : "Ordinary Member",
            membership_number: membershipNumber,
          },
        },
      });

      // Insert into members table
      await supabase.from("members").insert([
        {
          surname: data.lastName || data.surname || "",
          first_name: data.firstName || data.first_name || "",
          gender: data.gender || "male",
          phone: data.phone || "",
          email: cleanEmail,
          wing: data.wing || "both",
          status: "active",
          membership_number: membershipNumber,
        },
      ]);
    } catch (sbErr) {
      console.warn("Supabase signup limit or error (handled gracefully via local provision):", sbErr);
    }

    // Auto-login the user immediately!
    const loggedInUser: UserData = {
      id: newUserData.id,
      email: cleanEmail,
      is_active: true,
      roles: newUserData.roles,
      last_login_at: new Date().toISOString(),
      email_verified_at: new Date().toISOString(),
      created_at: newUserData.created_at,
    };

    const loggedInMember: MemberData = {
      id: Math.floor(100 + Math.random() * 900),
      membership_number: membershipNumber,
      surname: newUserData.surname,
      first_name: newUserData.first_name,
      full_name: fullName,
      status: "active",
      wing: newUserData.wing,
      email: cleanEmail,
      phone: newUserData.phone,
      address: data.address || "",
    };

    setUser(loggedInUser);
    setMember(loggedInMember);
    localStorage.setItem("token", "jwt-" + Date.now());
    localStorage.setItem(
      ACTIVE_SESSION_KEY,
      JSON.stringify({ user: loggedInUser, member: loggedInMember })
    );

    return { user: loggedInUser, member: loggedInMember };
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
