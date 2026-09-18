"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Wallet, ArrowDownRight, Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { getStoredTransactions, GatewayTransaction } from "@/lib/accelerex";

interface LedgerEntry {
  id: string;
  date: string;
  desc: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
}

export default function LedgerPage() {
  const { user, member } = useAuth();
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    if (!user?.email) {
      setLedgerEntries([]);
      setTotalBalance(0);
      return;
    }

    const email = user.email.trim().toLowerCase();
    const all = getStoredTransactions();
    // STRICTLY filter by current user email
    const userTxs = all
      .filter((tx) => tx.customerEmail?.trim().toLowerCase() === email && tx.status === "successful")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    let runningBalance = 0;
    const entries: LedgerEntry[] = [];

    userTxs.forEach((tx) => {
      runningBalance += Number(tx.amount) || 0;
      entries.push({
        id: tx.id,
        date: new Date(tx.paidAt || tx.createdAt).toLocaleDateString(),
        desc: tx.type || "Cooperative Contribution",
        reference: tx.reference,
        debit: 0,
        credit: Number(tx.amount) || 0,
        balance: runningBalance,
      });
    });

    setLedgerEntries(entries.reverse()); // Show latest on top
    setTotalBalance(runningBalance);
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Financial Ledger</h1>
          <p className="text-sm text-muted-foreground">
            Personal statement of deposits, dues, and verified cooperative contributions
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2 text-xs font-semibold"
          disabled={ledgerEntries.length === 0}
        >
          <Printer size={16} /> Print Statement
        </Button>
      </div>

      {/* Balance Hero Card */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-brand-darkBlue via-[#0e1c36] to-brand-blue text-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
              Cumulative Verified Balance
            </p>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              {formatCurrency(totalBalance)}
            </h2>
            <p className="text-[11px] text-slate-300 font-mono mt-1">
              Account: {member?.membership_number || "TPF-MEMBER"} • {user?.email}
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl">
            <Wallet size={32} className="text-brand-gold" />
          </div>
        </CardContent>
      </Card>

      {/* Ledger Statement Table */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3 border-b bg-slate-50/70 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-gray-900">Transaction Entries</CardTitle>
          <span className="text-xs text-muted-foreground font-mono">
            {ledgerEntries.length} record{ledgerEntries.length === 1 ? "" : "s"}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-900 text-xs">Date</TableHead>
                <TableHead className="font-semibold text-gray-900 text-xs">Description</TableHead>
                <TableHead className="font-semibold text-gray-900 text-xs font-mono">Reference</TableHead>
                <TableHead className="text-right font-semibold text-gray-900 text-xs">Debit (Dr)</TableHead>
                <TableHead className="text-right font-semibold text-gray-900 text-xs">Credit (Cr)</TableHead>
                <TableHead className="text-right font-semibold text-gray-900 text-xs">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                    No personal ledger entries recorded yet. Contributions and payments will reflect here automatically.
                  </TableCell>
                </TableRow>
              ) : (
                ledgerEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-slate-50">
                    <TableCell className="text-xs text-gray-700">{entry.date}</TableCell>
                    <TableCell className="text-xs font-semibold text-gray-900">{entry.desc}</TableCell>
                    <TableCell className="text-xs font-mono text-brand-blue">{entry.reference}</TableCell>
                    <TableCell className="text-right text-xs text-red-600 font-medium">
                      {entry.debit > 0 ? formatCurrency(entry.debit) : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-emerald-700 font-bold">
                      {entry.credit > 0 ? `+${formatCurrency(entry.credit)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs font-black text-gray-900 font-mono">
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
