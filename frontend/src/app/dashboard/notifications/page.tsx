"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    { id: 1, title: "Payment Received", message: "Your contribution of ₦50,000 has been received and credited to your ledger.", time: "2 hours ago", read: false },
    { id: 2, title: "Dividend Alert", message: "Your 2023 dividend of ₦45,000 has been credited to your bank account.", time: "1 day ago", read: true },
    { id: 3, title: "System Update", message: "The portal will undergo scheduled maintenance this weekend.", time: "3 days ago", read: true },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with important alerts</p>
        </div>
        <button className="text-sm text-brand-blue hover:underline flex items-center gap-1">
          <CheckCircle2 size={16} /> Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card key={notif.id} className={`shadow-sm border-l-4 ${notif.read ? 'border-l-gray-300' : 'border-l-brand-blue bg-blue-50/30'}`}>
            <CardContent className="p-4 flex gap-4">
              <div className={`p-2 rounded-full h-fit ${notif.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-brand-blue'}`}>
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h3>
                  <span className="text-xs text-gray-500">{notif.time}</span>
                </div>
                <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>{notif.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
