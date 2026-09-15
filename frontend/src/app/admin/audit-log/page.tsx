"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";

export default function AuditLogPage() {
  const data = [
    { id: 1, action: "USER_LOGIN", user: "admin@peckers.com", ip: "192.168.1.1", date: "2024-10-15 10:23:45" },
    { id: 2, action: "PAYMENT_APPROVED", user: "treasurer@peckers.com", ip: "192.168.1.5", date: "2024-10-15 09:12:11" },
    { id: 3, action: "MEMBER_CREATED", user: "sec@peckers.com", ip: "10.0.0.4", date: "2024-10-14 14:05:00" },
  ];

  const columns = [
    { header: "Date/Time", accessorKey: "date" },
    { header: "Action", accessorKey: "action" },
    { header: "User", accessorKey: "user" },
    { header: "IP Address", accessorKey: "ip" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-muted-foreground">Track all system activities</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <DataTable 
            columns={columns} 
            data={data} 
            searchable 
            searchKey="action" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
