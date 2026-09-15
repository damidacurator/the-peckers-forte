"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");

  const history = [
    { id: "TRX-101", date: "Oct 15, 2024", type: "Monthly Contribution", amount: 50000, status: "COMPLETED" },
    { id: "TRX-100", date: "Sep 15, 2024", type: "Monthly Contribution", amount: 50000, status: "COMPLETED" },
    { id: "TRX-099", date: "Aug 15, 2024", type: "Development Levy", amount: 10000, status: "COMPLETED" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-muted-foreground">Make payments and view payment history</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="border-t-4 border-t-brand-blue shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} className="text-brand-blue" /> Make a Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select 
                label="Payment Type" 
                options={[
                  { value: "", label: "Select Type" },
                  { value: "contribution", label: "Monthly Contribution" },
                  { value: "loan_rep", label: "Loan Repayment" },
                  { value: "levy", label: "Special Levy" }
                ]}
                value={type} onChange={e => setType(e.target.value)}
              />
              <Input 
                label="Amount (₦)" 
                type="number" 
                placeholder="0.00" 
                value={amount} onChange={e => setAmount(e.target.value)}
              />
              <Button className="w-full mt-4" size="lg">Pay via Paystack</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(item.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "COMPLETED" ? "success" : "default"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
