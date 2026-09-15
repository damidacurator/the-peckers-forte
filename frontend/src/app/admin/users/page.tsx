"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const data = [
    { id: 1, name: "Admin Super", email: "admin@peckers.com", role: "ADMIN", status: "ACTIVE" },
    { id: 2, name: "Secetary One", email: "sec@peckers.com", role: "SECRETARY", status: "ACTIVE" },
    { id: 3, name: "Treasury Boss", email: "treasurer@peckers.com", role: "TREASURER", status: "ACTIVE" },
    { id: 4, name: "John Doe", email: "john@member.com", role: "MEMBER", status: "ACTIVE" },
  ];

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { 
      header: "Role", 
      accessorKey: "role",
      cell: (item: any) => (
        <Badge variant={item.role === "ADMIN" ? "destructive" : item.role === "MEMBER" ? "default" : "secondary"}>
          {item.role}
        </Badge>
      )
    },
    { header: "Status", accessorKey: "status" },
    { 
      header: "Action", 
      accessorKey: "action",
      cell: () => <Button variant="outline" size="sm">Edit Role</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and roles</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <DataTable 
            columns={columns} 
            data={data} 
            searchable 
            searchKey="email" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
