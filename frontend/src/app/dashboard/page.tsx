"use client";

import React from "react";
import { useAuth } from "@/lib/auth";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Wallet, TrendingUp, CreditCard, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function MemberDashboard() {
  const { user, member } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {member?.first_name || user?.email || "Member"}</h1>
          <p className="text-muted-foreground">Membership No: {member?.membership_number || "TPF-0000"}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/payments"><Button>Make Payment</Button></Link>
          <Link href="/dashboard/ledger"><Button variant="outline">View Ledger</Button></Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(0)}
          icon={<Wallet className="h-6 w-6" />}
          trend="neutral"
          changeText="All clear"
        />
        <StatCard
          title="Total Contributions"
          value={formatCurrency(1250000)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="up"
          changeText="+₦50,000 this month"
        />
        <StatCard
          title="Total Payments Made"
          value="24"
          icon={<CreditCard className="h-6 w-6" />}
        />
        <StatCard
          title="Member Since"
          value="Jan 2022"
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
                {[
                  { date: "Oct 15, 2024", desc: "Monthly Contribution", amount: 50000, status: "COMPLETED" },
                  { date: "Sep 15, 2024", desc: "Monthly Contribution", amount: 50000, status: "COMPLETED" },
                  { date: "Aug 15, 2024", desc: "Development Levy", amount: 10000, status: "PENDING" },
                ].map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.desc}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(item.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "COMPLETED" ? "success" : "warning"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-900">
                <span className="font-semibold block mb-1">New Message from Admin</span>
                Please update your Next of Kin details in your profile settings.
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700">
                <span className="font-semibold block mb-1">Dividend Payment</span>
                Your 2023 dividend of ₦45,000 has been credited to your bank account.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
