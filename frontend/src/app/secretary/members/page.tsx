"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
  const data = [
    { id: "PMCS-001", name: "John Doe", phone: "08012345678", wing: "Contribution", status: "ACTIVE" },
    { id: "PAP-045", name: "Jane Smith", phone: "08098765432", wing: "Investment", status: "ACTIVE" },
    { id: "PMCS-088", name: "Michael Johnson", phone: "07011122233", wing: "Both", status: "SUSPENDED" },
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
        <Badge variant={item.status === "ACTIVE" ? "success" : "destructive"}>
          {item.status}
        </Badge>
      )
    },
    { 
      header: "Action", 
      accessorKey: "action",
      cell: () => <Button variant="outline" size="sm">View</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Directory</h1>
          <p className="text-muted-foreground">Manage all cooperative members</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="mb-6 grid grid-cols-3 gap-4">
             <Select 
              options={[
                { value: "", label: "Filter by Wing" },
                { value: "contribution", label: "Contribution" },
                { value: "investment", label: "Investment" }
              ]} 
             />
             <Select 
              options={[
                { value: "", label: "Filter by Status" },
                { value: "active", label: "Active" },
                { value: "suspended", label: "Suspended" }
              ]} 
             />
          </div>
          <DataTable 
            columns={columns} 
            data={data} 
            searchable 
            searchKey="name" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
