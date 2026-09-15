"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function LedgerPage() {
  const ledgerEntries = [
    { date: "Oct 15, 2024", desc: "Monthly Contribution", debit: 0, credit: 50000, balance: 1250000 },
    { date: "Sep 15, 2024", desc: "Monthly Contribution", debit: 0, credit: 50000, balance: 1200000 },
    { date: "Aug 15, 2024", desc: "Loan Repayment", debit: 0, credit: 20000, balance: 1150000 },
    { date: "Aug 01, 2024", desc: "Loan Disbursement", debit: 200000, credit: 0, balance: 1130000 },
    { date: "Jul 15, 2024", desc: "Monthly Contribution", debit: 0, credit: 50000, balance: 1330000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Ledger</h1>
          <p className="text-muted-foreground">Detailed financial statement of your account</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} /> Download Statement
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-brand-darkBlue text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle>Current Balance</CardTitle>
            <span className="text-2xl font-bold text-brand-gold">{formatCurrency(1250000)}</span>
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
              {ledgerEntries.map((entry, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{entry.date}</TableCell>
                  <TableCell className="font-medium text-sm">{entry.desc}</TableCell>
                  <TableCell className="text-right text-red-600 text-sm">
                    {entry.debit > 0 ? formatCurrency(entry.debit) : "-"}
                  </TableCell>
                  <TableCell className="text-right text-green-600 text-sm">
                    {entry.credit > 0 ? formatCurrency(entry.credit) : "-"}
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm">
                    {formatCurrency(entry.balance)}
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
