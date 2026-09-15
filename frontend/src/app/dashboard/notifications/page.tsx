"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const notifications: any[] = [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with important alerts</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                <Bell size={28} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">No Notifications</h3>
              <p className="text-sm text-gray-500">
                You are all caught up! New account alerts and payment receipts will show up here.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notif) => (
            <Card key={notif.id} className="shadow-sm border-l-4 border-l-brand-blue">
              <CardContent className="p-4 flex gap-4">
                <div className="p-2 rounded-full h-fit bg-blue-100 text-brand-blue">
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{notif.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
