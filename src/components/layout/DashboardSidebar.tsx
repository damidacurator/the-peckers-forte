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
  Send
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, member } = useAuth();

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

  const getLinksByRole = () => {
    const roles = user?.roles || [];
    if (roles.includes("Super Admin") || roles.includes("ADMIN")) return adminLinks;
    if (roles.includes("Treasurer") || roles.includes("TREASURER")) return [...treasurerLinks, ...memberLinks];
    if (roles.includes("Secretary") || roles.includes("SECRETARY")) return [...secretaryLinks, ...memberLinks];
    return memberLinks;
  };

  const links = getLinksByRole();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white flex flex-col hidden md:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6 bg-brand-darkBlue text-white">
        <div className="h-8 w-8 bg-white rounded-full p-0.5">
          <img src="/images/logo.jpg" alt="Logo" className="rounded-full" />
        </div>
        <span className="font-bold">PECKERS FORTE</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-blue/10 text-brand-blue"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-gold text-white flex items-center justify-center font-bold">
            {member?.first_name?.[0] || user?.email?.[0] || "U"}{member?.surname?.[0] || ""}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{member?.full_name || user?.email}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.roles?.[0] || "Member"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
