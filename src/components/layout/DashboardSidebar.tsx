"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Bell,
  UserCircle,
  FileText,
  Users,
  Settings,
  Shield,
  CreditCard,
  CheckSquare,
  Send,
  X,
  LogOut
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, member, logout } = useAuth();

  const memberLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Ledger", href: "/dashboard/ledger", icon: FileText },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { name: "Receipts", href: "/dashboard/receipts", icon: Receipt },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
  ];

  const treasurerLinks = [
    { name: "Treasurer Dashboard", href: "/treasurer", icon: Wallet },
    { name: "All Payments", href: "/treasurer/payments", icon: CreditCard },
    { name: "Payment Gateway", href: "/admin/gateway", icon: CreditCard },
    { name: "Payouts / Transfers", href: "/admin/transfers", icon: Send },
    { name: "Post Charges", href: "/treasurer/charges", icon: FileText },
    { name: "Outstanding", href: "/treasurer/outstanding", icon: Users },
    { name: "Reports", href: "/treasurer/reports", icon: Receipt },
  ];

  const secretaryLinks = [
    { name: "Secretary Dashboard", href: "/secretary", icon: LayoutDashboard },
    { name: "Member Directory", href: "/secretary/members", icon: Users },
    { name: "Pending Approvals", href: "/secretary/approvals", icon: CheckSquare },
    { name: "Announcements", href: "/secretary/announcements", icon: Bell },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", href: "/admin", icon: Shield },
    { name: "Payment Gateway", href: "/admin/gateway", icon: CreditCard },
    { name: "Payouts / Transfers", href: "/admin/transfers", icon: Send },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Roles & Perms", href: "/admin/roles", icon: Shield },
    { name: "Audit Log", href: "/admin/audit-log", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const executiveLinks = [
    { name: "Executive Console", href: "/admin", icon: Shield },
    { name: "Member Accounts", href: "/admin/users", icon: Users },
    { name: "Disbursements", href: "/admin/transfers", icon: Send },
    { name: "Audit Trail", href: "/admin/audit-log", icon: FileText },
  ];

  const getLinksByRole = () => {
    const roles = user?.roles || [];
    if (roles.includes("Super Admin") || roles.includes("ADMIN")) return adminLinks;
    if (roles.includes("Executive") || roles.includes("EXECUTIVE")) return [...executiveLinks, ...memberLinks];
    if (roles.includes("Treasurer") || roles.includes("TREASURER")) return [...treasurerLinks, ...memberLinks];
    if (roles.includes("Secretary") || roles.includes("SECRETARY")) return [...secretaryLinks, ...memberLinks];
    return memberLinks;
  };

  const links = getLinksByRole();

  const renderNavLinks = (isMobile = false) => (
    <nav className="space-y-1 px-3">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => {
              if (isMobile && onClose) onClose();
            }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-blue/10 text-brand-blue font-bold"
                : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
            )}
          >
            <Icon size={18} className={isActive ? "text-brand-blue" : "text-gray-500"} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );

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
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white flex flex-col hidden md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6 bg-brand-darkBlue text-white">
          <div className="h-8 w-8 bg-white rounded-full p-0.5">
            <img src="/images/logo.jpg" alt="Logo" className="rounded-full" />
          </div>
          <span className="font-bold">PECKERS FORTE</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {renderNavLinks(false)}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-gold text-white flex items-center justify-center font-bold">
              {getInitial()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{getDisplayName()}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.roles?.[0] || "Member"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Slide-Over Drawer with Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          {/* Backdrop overlay */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b px-5 bg-brand-darkBlue text-white">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-white rounded-full p-0.5">
                  <img src="/images/logo.jpg" alt="Logo" className="rounded-full" />
                </div>
                <span className="font-bold text-sm">PECKERS FORTE</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Details in Drawer */}
            <div className="p-4 border-b bg-slate-50 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
                {getInitial()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {getDisplayName()}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono truncate">
                  {user?.roles?.[0] || "Member"}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-3">
              {renderNavLinks(true)}
            </div>

            {/* Logout Button in Drawer */}
            <div className="p-4 border-t bg-slate-50">
              <button
                type="button"
                onClick={async () => {
                  if (onClose) onClose();
                  await logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
