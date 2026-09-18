"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle2, Receipt as ReceiptIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { getStoredTransactions, GatewayTransaction } from "@/lib/accelerex";

export default function ReceiptsPage() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<GatewayTransaction[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<GatewayTransaction | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setReceipts([]);
      return;
    }
    const all = getStoredTransactions();
    const email = user.email.trim().toLowerCase();
    const myTxs = all.filter((tx) => tx.customerEmail?.trim().toLowerCase() === email);
    setReceipts(myTxs);
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment & Contribution Receipts</h1>
        <p className="text-sm text-muted-foreground">Download official payment receipts for your cooperative deposits</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Transaction Ref</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Purpose</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                    No receipts generated yet. Receipts appear here automatically upon payment.
                  </TableCell>
                </TableRow>
              ) : (
                receipts.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs font-bold text-gray-900">
                      <span className="flex items-center gap-1.5">
                        <FileText size={14} className="text-brand-blue" />
                        {item.receiptNumber || "RCT-" + item.id.slice(-6)}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-brand-blue">{item.reference}</TableCell>
                    <TableCell className="text-xs">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-xs font-medium">{item.type}</TableCell>
                    <TableCell className="text-xs font-bold text-emerald-800">{formatCurrency(item.amount)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReceipt(item)}
                        className="text-xs font-semibold text-brand-blue border-brand-blue/30 hover:bg-brand-blue/5"
                      >
                        View Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 print:p-0 print:shadow-none">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900">Contribution Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold print:hidden"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Receipt Number:</span>
                <span className="font-mono font-bold text-gray-900">
                  {selectedReceipt.receiptNumber || "RCT-" + selectedReceipt.id.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Reference:</span>
                <span className="font-mono text-brand-blue">{selectedReceipt.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Beneficiary:</span>
                <span className="font-semibold text-gray-900">THE PECKERS FORTE COOPERATIVE</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Paid By:</span>
                <span className="font-bold text-gray-900">{selectedReceipt.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Purpose:</span>
                <span>{selectedReceipt.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-black text-emerald-800 text-base">{formatCurrency(selectedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Payment Channel:</span>
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

            <div className="flex gap-2 pt-2 print:hidden">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex-1 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Print / Save PDF
              </Button>
              <Button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 bg-brand-blue hover:bg-brand-darkBlue text-white text-xs font-bold"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
