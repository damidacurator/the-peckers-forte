"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, CheckCircle2, ShieldCheck, Lock, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AccelerexCheckoutModal } from "@/components/payment/AccelerexCheckoutModal";
import { getStoredTransactions, GatewayTransaction } from "@/lib/accelerex";

export default function PaymentsPage() {
  const { user, member } = useAuth();
  const [amount, setAmount] = useState("10000");
  const [type, setType] = useState("Monthly Contribution");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [history, setHistory] = useState<GatewayTransaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<GatewayTransaction | null>(null);

  useEffect(() => {
    setHistory(getStoredTransactions());
  }, []);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (tx: GatewayTransaction) => {
    setHistory(getStoredTransactions());
  };

  const customerName = member
    ? `${member.firstName} ${member.lastName}`
    : user?.name || "Valued Member";
  const customerEmail = user?.email || "admin@thepeckersfortelp.com";

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Member Payments</h1>
        <p className="text-muted-foreground">Make instant cooperative contributions and review transaction receipts</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="border-t-4 border-t-brand-blue shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} className="text-brand-blue" /> Make a Payment
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleStartPayment}>
              <CardContent className="space-y-4">
                <Select 
                  label="Payment Type" 
                  options={[
                    { value: "Monthly Contribution", label: "Monthly Contribution" },
                    { value: "Share Capital Purchase", label: "Share Capital Purchase" },
                    { value: "Loan Repayment", label: "Loan Repayment" },
                    { value: "Special Development Levy", label: "Special Development Levy" },
                    { value: "Membership Registration Fee", label: "Registration Fee" }
                  ]}
                  value={type}
                  onChange={e => setType(e.target.value)}
                />
                <Input 
                  label="Amount (₦)" 
                  type="number" 
                  min={100}
                  placeholder="0.00" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  required
                />

                <div className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Payment Gateway:</span>
                    <span className="font-semibold text-slate-900">Accelerex RexPay</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Channels:</span>
                    <span>Debit Card / Transfer / USSD</span>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-2 bg-brand-blue hover:bg-brand-darkBlue font-bold" size="lg">
                  Proceed to Pay {amount ? formatCurrency(Number(amount)) : ""}
                </Button>
              </CardContent>
            </form>
          </Card>

          <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-brand-darkBlue space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-brand-blue">
              <ShieldCheck size={16} /> 100% Secure Transaction
            </div>
            <p className="text-slate-600">
              Payments are routed via Accelerex encrypted payment switch and verified in real time. Receipts are immediately generated and credited to your member ledger.
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Payment History</CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                {history.length} Transactions
              </Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                        No payments recorded yet. Complete a payment to see your receipt here.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs font-bold text-brand-blue">
                          {item.reference}
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs font-medium">{item.type}</TableCell>
                        <TableCell className="text-xs capitalize text-slate-600">{item.paymentMethod}</TableCell>
                        <TableCell className="font-semibold text-xs text-gray-900">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                            {item.status.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => setSelectedTx(item)}
                            className="text-brand-blue hover:underline text-xs font-bold"
                          >
                            {item.receiptNumber || "View"}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <AccelerexCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={Number(amount) || 10000}
        paymentType={type}
        customerName={customerName}
        customerEmail={customerEmail}
        onSuccess={handlePaymentSuccess}
      />

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900">Payment Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Receipt No:</span>
                <span className="font-mono font-bold">{selectedTx.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Reference:</span>
                <span className="font-mono text-brand-blue">{selectedTx.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Purpose:</span>
                <span>{selectedTx.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-bold text-brand-blue text-sm">{formatCurrency(selectedTx.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Channel:</span>
                <span>{selectedTx.channel}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-bold uppercase">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Date & Time:</span>
                <span>{new Date(selectedTx.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <Button
              onClick={() => setSelectedTx(null)}
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
