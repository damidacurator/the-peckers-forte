"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ReceiptsPage() {
  const receipts = [
    { id: "RCP-101", date: "Oct 15, 2024", type: "Monthly Contribution", amount: 50000 },
    { id: "RCP-100", date: "Sep 15, 2024", type: "Monthly Contribution", amount: 50000 },
    { id: "RCP-099", date: "Aug 15, 2024", type: "Development Levy", amount: 10000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
        <p className="text-muted-foreground">Download your payment receipts</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" /> {item.id}
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{formatCurrency(item.amount)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-brand-blue">
                      <Download size={16} className="mr-2" /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
