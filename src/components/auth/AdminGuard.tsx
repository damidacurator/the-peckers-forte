"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, CORE_ADMIN_EMAILS } from "@/lib/auth";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ADMIN_TAB_SESSION_KEY = "tpf_admin_tab_authenticated";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // 1. Not authenticated at all -> Redirect to login
    if (!isAuthenticated || !user) {
      const targetUrl = "/login?redirect=" + encodeURIComponent(pathname || "/admin");
      router.replace(targetUrl);
      return;
    }

    // 2. Check if user is an Administrator
    const isCore = CORE_ADMIN_EMAILS.includes(user.email?.toLowerCase() || "");
    const hasAdminRole = user.roles?.some((r) =>
      ["Super Admin", "ADMIN", "Executive"].includes(r)
    );

    if (!isCore && !hasAdminRole) {
      setAccessDenied(true);
      setIsChecking(false);
      return;
    }

    // 3. Tab-scoped session check:
    // Opening a new tab or direct link entry requires active tab authentication
    const isTabAuthenticated = sessionStorage.getItem(ADMIN_TAB_SESSION_KEY) === "true";

    if (!isTabAuthenticated) {
      // In a new tab, force re-authentication for the protected admin route
      const targetUrl = "/login?redirect=" + encodeURIComponent(pathname || "/admin");
      router.replace(targetUrl);
      return;
    }

    setIsChecking(false);
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-gray-600 tracking-wide">
          Verifying Administrator Security Clearance...
        </p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center space-y-4 border border-red-100">
          <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Restricted Admin Area</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your account does not possess Executive Administrator privileges to access this console.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/dashboard">
              <Button className="w-full bg-brand-blue hover:bg-brand-darkBlue text-white font-bold text-xs">
                Return to Member Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full text-xs">
                Log in with another account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
