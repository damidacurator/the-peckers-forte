"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function LedgerPage() {
  const ledgerEntries: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Ledger</h1>
          <p className="text-muted-foreground">Detailed financial statement of your account</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" disabled={ledgerEntries.length === 0}>
          <Download size={16} /> Download Statement
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-brand-darkBlue text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle>Current Balance</CardTitle>
            <span className="text-2xl font-bold text-brand-gold">{formatCurrency(0)}</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Description</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Debit (Dr)</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Credit (Cr)</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No ledger transactions recorded yet. Transactions will appear once payments or charges occur.
                  </TableCell>
                </TableRow>
              ) : (
                ledgerEntries.map((entry, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.desc}</TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      {entry.debit > 0 ? formatCurrency(entry.debit) : "-"}
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      {entry.credit > 0 ? formatCurrency(entry.credit) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(entry.balance)}
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
