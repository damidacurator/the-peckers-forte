"use client";

import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Wallet, TrendingUp, Users, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function TreasurerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Treasurer Dashboard</h1>
        <p className="text-muted-foreground">Financial overview and collections</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Income Today"
          value={formatCurrency(150000)}
          icon={<Wallet className="h-6 w-6" />}
        />
        <StatCard
          title="Income This Week"
          value={formatCurrency(850000)}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Income This Month"
          value={formatCurrency(4500000)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="up"
          changeText="+12% from last month"
        />
        <StatCard
          title="Outstanding Defaulters"
          value="12"
          icon={<AlertCircle className="h-6 w-6 text-red-500" />}
          trend="down"
          changeText="-3 from last month"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "John Doe", type: "Contribution", amount: 50000 },
                  { name: "Jane Smith", type: "Loan Repayment", amount: 25000 },
                  { name: "Michael Johnson", type: "Levy", amount: 10000 },
                  { name: "Sarah Williams", type: "Contribution", amount: 50000 },
                ].map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs text-gray-500">{item.type}</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Defaulters</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Owed Since</TableHead>
                  <TableHead className="text-right">Amount Owed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Alex Brown", date: "Aug 2024", amount: 150000 },
                  { name: "David Miller", date: "Sep 2024", amount: 50000 },
                  { name: "Lisa Davis", date: "Sep 2024", amount: 35000 },
                ].map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs text-gray-500">{item.date}</TableCell>
                    <TableCell className="text-right text-red-600 font-semibold">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
