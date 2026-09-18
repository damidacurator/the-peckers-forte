"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";

interface DashboardHeaderProps {
  onOpenMobileMenu?: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: DashboardHeaderProps) {
  const { user, member, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (user?.email) {
      setUnreadCount(getUnreadNotificationCount(user.email));
    } else {
      setUnreadCount(0);
    }
  }, [user]);

  const getDisplayName = () => {
    const rawFullName = (member?.full_name || "").trim();
    if (rawFullName && !rawFullName.toLowerCase().includes("undefined")) {
      return rawFullName;
    }
    const parts = [member?.first_name, member?.surname]
      .filter((p) => p && typeof p === "string" && !p.toLowerCase().includes("undefined") && p.trim().length > 0)
      .map((p) => (p as string).trim());
    if (parts.length > 0) {
      return parts.join(" ");
    }
    if (user?.email) {
      const emailPrefix = user.email.split("@")[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    return "Member";
  };

  const getInitial = () => {
    if (
      member?.first_name &&
      typeof member.first_name === "string" &&
      !member.first_name.toLowerCase().includes("undefined") &&
      member.first_name.trim().length > 0
    ) {
      return member.first_name.trim()[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-slate-100 transition active:scale-95"
        >
          <Menu size={22} />
        </button>

        <div className="hidden md:flex relative w-80 lg:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search member, transaction, etc..."
            className="pl-8 bg-muted/50 border-transparent focus-visible:bg-white text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-full text-gray-500 hover:text-brand-blue hover:bg-blue-50 transition"
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <div className="h-6 w-px bg-gray-200 mx-0.5"></div>

        {user && (
          <div className="flex items-center gap-2.5 text-right">
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-900 leading-none">
                {getDisplayName()}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {user.roles?.includes("Super Admin") ? "Super Admin" : user.roles?.[0] || "Member"}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs border border-brand-blue/20">
              {getInitial()}
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await logout();
          }}
          title="Sign out of THE PECKERS FORTE"
          className="text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline font-semibold">Log out</span>
        </Button>
      </div>
    </header>
  );
}
