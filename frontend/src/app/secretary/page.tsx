"use client";

import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, CheckSquare, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SecretaryDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Secretary Dashboard</h1>
        <p className="text-muted-foreground">Manage members, approvals, and communications</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value="524"
          icon={<Users className="h-6 w-6" />}
          trend="up"
          changeText="+12 this month"
        />
        <StatCard
          title="Pending Approvals"
          value="8"
          icon={<CheckSquare className="h-6 w-6 text-orange-500" />}
        />
        <StatCard
          title="Active Announcements"
          value="3"
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="Recent Activity"
          value="24h"
          icon={<Activity className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-t-4 border-t-orange-500">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Pending Registrations</span>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Emmanuel Ojo", wing: "Contribution", date: "2 hours ago" },
                { name: "Grace Chukwu", wing: "Investment", date: "5 hours ago" },
                { name: "Samuel Peters", wing: "Both Wings", date: "1 day ago" }
              ].map((user, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-semibold text-sm">{user.name}</h4>
                    <p className="text-xs text-gray-500">{user.wing} • {user.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 bg-green-50">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
