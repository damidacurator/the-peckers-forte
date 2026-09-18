"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, CreditCard, ShieldCheck, Sparkles, Info } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  getUserNotifications,
  markAllUserNotificationsAsRead,
  UserNotification
} from "@/lib/notifications";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  const loadNotifications = () => {
    if (user?.email) {
      setNotifications(getUserNotifications(user.email));
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAllRead = () => {
    if (user?.email) {
      markAllUserNotificationsAsRead(user.email);
      loadNotifications();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay updated with your cooperative alerts and transactions</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-brand-blue border-brand-blue/30 flex items-center gap-1.5"
          >
            <CheckCheck size={14} /> Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="shadow-sm border">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                <Bell size={28} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">No Notifications Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                You are all caught up! Account updates, payment confirmations, and broadcast notices will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`shadow-xs border transition ${
                notif.isRead ? "bg-white opacity-85" : "bg-blue-50/30 border-brand-blue/30"
              }`}
            >
              <CardContent className="p-4 flex gap-3.5 items-start">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    notif.type === "payment"
                      ? "bg-emerald-100 text-emerald-700"
                      : notif.type === "success"
                      ? "bg-blue-100 text-brand-blue"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {notif.type === "payment" ? (
                    <CreditCard size={18} />
                  ) : notif.type === "success" ? (
                    <ShieldCheck size={18} />
                  ) : (
                    <Bell size={18} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2 mb-1">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">{notif.title}</h4>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
