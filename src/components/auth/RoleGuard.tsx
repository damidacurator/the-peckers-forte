"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, CORE_ADMIN_EMAILS } from "@/lib/auth";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  portalName: string;
}

export function RoleGuard({ children, allowedRoles, portalName }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    const isCore = CORE_ADMIN_EMAILS.includes(user.email?.toLowerCase() || "");
    const hasRole = user.roles?.some((r) =>
      [...allowedRoles, "Super Admin", "ADMIN"].includes(r)
    );

    if (isCore || hasRole) {
      setAuthorized(true);
    } else {
      setDenied(true);
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading || (!authorized && !denied)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        <p className="text-xs text-gray-500 font-medium">Checking {portalName} permissions...</p>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center space-y-4 border border-red-100">
          <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Restricted {portalName}</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your account does not possess the authorized executive credentials for this portal.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button className="w-full bg-brand-blue hover:bg-brand-darkBlue text-white font-bold text-xs">
                Return to Member Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
