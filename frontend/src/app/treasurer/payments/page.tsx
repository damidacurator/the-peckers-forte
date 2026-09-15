"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function AllPaymentsPage() {
  const data = [
    { id: "TRX-101", member: "John Doe", type: "Contribution", amount: 50000, date: "2024-10-15", status: "COMPLETED" },
    { id: "TRX-102", member: "Jane Smith", type: "Loan Repayment", amount: 25000, date: "2024-10-15", status: "COMPLETED" },
    { id: "TRX-103", member: "Mike Johnson", type: "Contribution", amount: 100000, date: "2024-10-14", status: "PENDING" },
  ];

  const columns = [
    { header: "Reference", accessorKey: "id" },
    { header: "Member", accessorKey: "member" },
    { header: "Type", accessorKey: "type" },
    { header: "Date", accessorKey: "date" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (item: any) => <span className="font-semibold">{formatCurrency(item.amount)}</span> 
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (item: any) => (
        <Badge variant={item.status === "COMPLETED" ? "success" : "warning"}>
          {item.status}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Payments</h1>
        <p className="text-muted-foreground">Monitor all transactions across the cooperative</p>
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
