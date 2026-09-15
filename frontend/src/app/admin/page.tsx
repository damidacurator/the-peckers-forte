"use client";

import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Users, Activity, Shield, Settings } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
        <p className="text-muted-foreground">Manage platform settings, roles, and security</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total System Users"
          value="1"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Admin Staff"
          value="1"
          icon={<Shield className="h-6 w-6" />}
        />
        <StatCard
          title="System Health"
          value="100%"
          icon={<Activity className="h-6 w-6 text-green-500" />}
        />
        <StatCard
          title="Pending Logs"
          value="0"
          icon={<Settings className="h-6 w-6" />}
        />
      </div>
    </div>
  );
}
