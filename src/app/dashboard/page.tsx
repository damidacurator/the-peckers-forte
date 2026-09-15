"use client";

import React from "react";
import { useAuth } from "@/lib/auth";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Wallet, TrendingUp, CreditCard, Calendar, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function MemberDashboard() {
  const { user, member } = useAuth();

  const registrationYear = user?.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {member?.first_name || user?.email || "Member"}
          </h1>
          <p className="text-muted-foreground">
            Membership No: {member?.membership_number || "TPF-0000"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/payments">
            <Button>Make Payment</Button>
          </Link>
          <Link href="/dashboard/ledger">
            <Button variant="outline">View Ledger</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(0)}
          icon={<Wallet className="h-6 w-6" />}
          trend="neutral"
          changeText="No balance due"
        />
        <StatCard
          title="Total Contributions"
          value={formatCurrency(0)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="neutral"
          changeText="No deposits recorded"
        />
        <StatCard
          title="Total Payments Made"
          value="0"
          icon={<CreditCard className="h-6 w-6" />}
        />
        <StatCard
          title="Member Since"
          value={String(registrationYear)}
          icon={<Calendar className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="h-28 text-center text-muted-foreground">
                    No payments recorded yet.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
