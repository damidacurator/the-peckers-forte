"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";

export default function AuditLogPage() {
  const data: any[] = [];

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
