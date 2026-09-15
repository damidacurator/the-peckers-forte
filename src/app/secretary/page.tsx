"use client";

import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, CheckSquare, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SecretaryDashboard() {
  const pendingRegistrations: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Secretary Dashboard</h1>
        <p className="text-muted-foreground">Manage members, approvals, and communications</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value="1"
          icon={<Users className="h-6 w-6" />}
          trend="neutral"
          changeText="Active"
        />
        <StatCard
          title="Pending Approvals"
          value="0"
          icon={<CheckSquare className="h-6 w-6 text-gray-400" />}
        />
        <StatCard
          title="Active Announcements"
          value="0"
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="System Status"
          value="Active"
          icon={<Activity className="h-6 w-6 text-green-500" />}
        />
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Pending Registrations</span>
              <Link href="/secretary/approvals">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRegistrations.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No pending registrations. All applications have been reviewed.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRegistrations.map((user, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-semibold text-sm">{user.name}</h4>
                      <p className="text-xs text-gray-500">{user.wing} • {user.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
