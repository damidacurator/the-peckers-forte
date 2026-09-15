"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ReceiptsPage() {
  const receipts: any[] = [];

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
              {receipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                    No receipts generated yet. Receipts will be available here once payments are confirmed.
                  </TableCell>
                </TableRow>
              ) : (
                receipts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" /> {item.id}
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 ml-auto">
                        <Download size={14} /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
