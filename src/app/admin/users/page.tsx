"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const data = [
    { id: 1, name: "Idowu Oluwadamilare", email: "admin@thepeckersfortelp.com", role: "SUPER ADMIN", status: "ACTIVE" },
  ];

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { 
      header: "Role", 
      accessorKey: "role",
      cell: (item: any) => (
        <Badge variant={item.role === "SUPER ADMIN" ? "destructive" : "default"}>
          {item.role}
        </Badge>
      )
    },
    { header: "Status", accessorKey: "status" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and roles</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <DataTable columns={columns} data={data} searchKey="name" />
        </CardContent>
      </Card>
    </div>
  );
}
