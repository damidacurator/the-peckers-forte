"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function OutstandingPage() {
  const data: any[] = [];

  const columns = [
    { header: "Member ID", accessorKey: "id" },
    { header: "Member Name", accessorKey: "member" },
    { header: "Wing", accessorKey: "wing" },
    { header: "Months Owed", accessorKey: "months" },
    { 
      header: "Amount Owed", 
      accessorKey: "amount",
      cell: (item: any) => <span className="text-red-600 font-semibold">{formatCurrency(item.amount)}</span> 
    },
    { header: "Last Paid", accessorKey: "lastPaid" },
    { 
      header: "Action", 
      accessorKey: "action",
      cell: () => (
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Mail size={14} /> Send Reminder
        </Button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outstanding Balances</h1>
          <p className="text-muted-foreground">Members with pending contributions or levies</p>
        </div>
        <Button>Send Reminders to All</Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <DataTable 
            columns={columns} 
            data={data} 
            searchable 
            searchKey="member" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
