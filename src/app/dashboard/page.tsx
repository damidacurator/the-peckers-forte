"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Sparkles
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { getMemberByEmail, getAllRegisteredMembers } from "@/lib/members";
import { getStoredTransactions, GatewayTransaction } from "@/lib/accelerex";

export default function MemberDashboard() {
  const { user, member } = useAuth();
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [myTransactions, setMyTransactions] = useState<GatewayTransaction[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<GatewayTransaction | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    const email = user.email.toLowerCase();
    const storedMember = getMemberByEmail(email);
    const allTxs = getStoredTransactions();

    // Filter transactions made by this member
    const userTxs = allTxs.filter(
      (tx) => tx.customerEmail.toLowerCase() === email || tx.customerName.toLowerCase() === member?.full_name?.toLowerCase()
    );
    setMyTransactions(userTxs);

    // Sum transactions strictly from real successful transactions
    const txTotal = userTxs
      .filter((tx) => tx.status === "successful")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const calculatedTotal = Number(storedMember?.total_contributions || txTotal || 0);
    setTotalContributions(calculatedTotal);
  }, [user, member]);

  const registrationYear = user?.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {member?.first_name || user?.email?.split("@")[0] || "Member"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Membership ID: <span className="font-mono font-bold text-brand-blue">{member?.membership_number || "TPF-2026-0001"}</span> • Wing: <span className="uppercase font-semibold text-gray-700">{member?.wing || "BOTH"}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/payments">
            <Button className="bg-brand-blue hover:bg-brand-darkBlue text-white font-bold flex items-center gap-2">
              <CreditCard size={16} /> Make Contribution
            </Button>
          </Link>
          <Link href="/dashboard/ledger">
            <Button variant="outline" className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue/5">
              View Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* DEDICATED TOTAL CONTRIBUTIONS SECTION */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-darkBlue via-[#0F172A] to-brand-blue p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-8 top-8 opacity-10 text-white pointer-events-none">
          <TrendingUp size={140} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-gold border border-white/15 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} /> Cumulative Member Portfolio
          </div>

          <div>
            <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
              Total Contributions Contributed
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {formatCurrency(totalContributions)}
              </h2>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  totalContributions > 0
                    ? "text-emerald-400 bg-emerald-950/60 border-emerald-500/30"
                    : "text-slate-300 bg-white/10 border-white/20"
                }`}
              >
                {totalContributions > 0 ? "Active & Increasing" : "No Contributions Yet"}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            {totalContributions > 0
              ? "Every successful payment made via card, bank transfer, or USSD is automatically credited here in real time."
              : "You have not made any contributions yet. Click the button below to make your first payment into the cooperative."}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/dashboard/payments">
              <button className="px-4 py-2.5 bg-brand-gold text-brand-darkBlue rounded-lg text-xs font-bold hover:bg-yellow-400 transition shadow flex items-center gap-2">
                <CreditCard size={15} /> Add to Contribution (+ Pay Now)
              </button>
            </Link>
            <Link href="/dashboard/receipts">
              <button className="px-4 py-2.5 bg-white/10 text-white hover:bg-white/20 rounded-lg text-xs font-semibold border border-white/20 transition flex items-center gap-1.5">
                <Receipt size={15} /> View Receipts ({myTransactions.length})
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contributions"
          value={formatCurrency(totalContributions)}
          icon={<TrendingUp className="h-6 w-6 text-emerald-600" />}
          trend="up"
          changeText="Cumulative sum"
        />
        <StatCard
          title="Successful Payments"
          value={String(myTransactions.length)}
          icon={<CreditCard className="h-6 w-6 text-brand-blue" />}
          trend="neutral"
          changeText="Transactions completed"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(0)}
          icon={<Wallet className="h-6 w-6 text-indigo-600" />}
          trend="neutral"
          changeText="No balance due"
        />
        <StatCard
          title="Member Since"
          value={String(registrationYear)}
          icon={<Calendar className="h-6 w-6 text-amber-600" />}
          trend="neutral"
          changeText="Active account"
        />
      </div>

      {/* RECENT PAYMENTS BREAKDOWN TABLE */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent Contribution Payments</CardTitle>
              <CardDescription className="text-xs">
                Payments made into your member contribution account
              </CardDescription>
            </div>
            <Link href="/dashboard/payments" className="text-xs text-brand-blue hover:underline font-bold">
              Pay Now →
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                      No payments recorded yet. Click <strong>Make Contribution</strong> above to fund your account!
                    </TableCell>
                  </TableRow>
                ) : (
                  myTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs font-bold text-brand-blue">
                        {tx.reference}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-xs font-medium">{tx.type}</TableCell>
                      <TableCell className="text-xs capitalize text-slate-500">{tx.paymentMethod}</TableCell>
                      <TableCell className="text-xs font-bold text-emerald-700">
                        +{formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => setSelectedReceipt(tx)}
                          className="text-xs text-brand-blue hover:underline font-semibold"
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Membership Profile Card */}
        <Card className="shadow-sm border-gray-100 space-y-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Membership Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Member Name:</span>
              <span className="font-bold text-gray-900">{member?.full_name || user?.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Membership ID:</span>
              <span className="font-mono font-bold text-brand-blue">{member?.membership_number || "TPF-2026-0001"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Email:</span>
              <span className="font-mono">{user?.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Status:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase">
                Active Member
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">Payment Engine:</span>
              <span className="font-semibold text-brand-blue">Accelerex RexPay</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900">Payment Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Receipt No:</span>
                <span className="font-mono font-bold">{selectedReceipt.receiptNumber || "RCT-" + selectedReceipt.id.slice(-6)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Reference:</span>
                <span className="font-mono text-brand-blue">{selectedReceipt.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Purpose:</span>
                <span>{selectedReceipt.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-bold text-emerald-700 text-sm">+{formatCurrency(selectedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Channel:</span>
                <span>{selectedReceipt.channel}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-bold uppercase">{selectedReceipt.status}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Date & Time:</span>
                <span>{new Date(selectedReceipt.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <Button
              onClick={() => setSelectedReceipt(null)}
              className="w-full bg-brand-blue hover:bg-brand-darkBlue text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
