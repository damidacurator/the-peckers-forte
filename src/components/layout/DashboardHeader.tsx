"use client";

import React from "react";
import { Bell, Search, Menu, LogOut, User as UserIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/auth";

export function DashboardHeader() {
  const { user, member, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden">
          <Menu size={24} className="text-muted-foreground" />
        </button>
        
        <div className="hidden md:flex relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search member, transaction, etc..." 
            className="pl-8 bg-muted/50 border-transparent focus-visible:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-muted-foreground hover:text-foreground">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
            3
          </span>
        </button>
        
        <div className="h-8 w-px bg-border mx-1"></div>

        {user && (
          <div className="flex items-center gap-2.5 text-right">
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-900 leading-none">
                {member?.full_name || user.email.split("@")[0]}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {user.roles?.includes("Super Admin") ? "Super Admin" : "Member"}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs">
              {(member?.first_name?.[0] || user.email[0] || "U").toUpperCase()}
            </div>
          </div>
        )}
        
        <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
          <LogOut size={18} className="text-muted-foreground hover:text-red-600 transition" />
        </Button>
      </div>
    </header>
  );
}
