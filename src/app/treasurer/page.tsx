"use client";

import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Wallet, TrendingUp, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function TreasurerDashboard() {
  const collections: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Treasurer Dashboard</h1>
        <p className="text-muted-foreground">Financial overview and collections</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Income Today"
          value={formatCurrency(0)}
          icon={<Wallet className="h-6 w-6" />}
        />
        <StatCard
          title="Income This Week"
          value={formatCurrency(0)}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Income This Month"
          value={formatCurrency(0)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="neutral"
          changeText="No collections yet"
        />
        <StatCard
          title="Outstanding Defaulters"
          value="0"
          icon={<AlertCircle className="h-6 w-6 text-gray-400" />}
          trend="neutral"
          changeText="All clear"
        />
      </div>

      <div className="grid gap-6">
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
                {collections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-28 text-center text-muted-foreground">
                      No collections recorded yet. Transactions will display once members pay through the gateway.
                    </TableCell>
                  </TableRow>
                ) : (
                  collections.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.member}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
