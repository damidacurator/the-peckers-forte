"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, FileText, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.roles?.some((r) => ["Super Admin", "ADMIN", "Executive"].includes(r));

  const homeHref = isAdmin ? "/admin" : "/dashboard";

  const tabs = [
    {
      name: "Dashboard",
      href: homeHref,
      icon: LayoutDashboard,
      isActive: pathname === homeHref || pathname === "/dashboard",
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
      isActive: pathname === "/dashboard/payments",
    },
    {
      name: "My Ledger",
      href: "/dashboard/ledger",
      icon: FileText,
      isActive: pathname === "/dashboard/ledger",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-1 px-3 flex items-center justify-around shadow-lg md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-semibold transition active:scale-95",
              tab.isActive
                ? "text-brand-blue font-bold"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            <Icon size={20} className={tab.isActive ? "text-brand-blue stroke-[2.5]" : "text-gray-500"} />
            <span className="mt-0.5">{tab.name}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={onOpenMenu}
        className="flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-brand-blue active:scale-95"
      >
        <Menu size={20} className="text-gray-500" />
        <span className="mt-0.5">Menu</span>
      </button>
    </nav>
  );
}
