"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ApprovalsPage() {
  const data: any[] = [];

  const columns = [
    { header: "Reg ID", accessorKey: "id" },
    { header: "Applicant Name", accessorKey: "name" },
    { header: "Target Wing", accessorKey: "wing" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Date Applied", accessorKey: "date" },
    { 
      header: "Action", 
      accessorKey: "action",
      cell: () => (
        <div className="flex gap-2">
          <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
          <Button size="sm" variant="destructive">Reject</Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-muted-foreground">Review and approve new member registrations</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <DataTable 
            columns={columns} 
            data={data} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
