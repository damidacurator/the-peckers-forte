"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MembersPage() {
  const data = [
    { id: "TPF-2026-0001", name: "Idowu Oluwadamilare", phone: "+234 801 234 5678", wing: "Both Wings", status: "ACTIVE" },
  ];

  const columns = [
    { header: "Member No", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Wing", accessorKey: "wing" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (item: any) => (
        <Badge variant={item.status === "ACTIVE" ? "success" : "default"}>
          {item.status}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Member Directory</h1>
        <p className="text-muted-foreground">View and manage cooperative members</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <DataTable columns={columns} data={data} searchKey="name" />
        </CardContent>
      </Card>
    </div>
  );
}
