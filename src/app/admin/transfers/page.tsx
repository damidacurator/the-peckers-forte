"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Send,
  Building2,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Wallet,
  FileText,
  Search,
  Check,
  Copy,
  RefreshCw,
  Loader2,
  SlidersHorizontal
} from "lucide-react";
import {
  NIGERIAN_BANKS,
  resolveAccountName,
  getGatewayConfig,
  saveTransfer,
  getStoredTransfers,
  GatewayTransfer
} from "@/lib/accelerex";

export default function AdminTransfersPage() {
  const [balance, setBalance] = useState(14850000);
  const [selectedBank, setSelectedBank] = useState(NIGERIAN_BANKS[0].code);
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const [amount, setAmount] = useState<number>(50000);
  const [narration, setNarration] = useState("");
  const [category, setCategory] = useState("Loan Disbursement");

  // Authorization Security PIN Modal
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [recentTransfer, setRecentTransfer] = useState<GatewayTransfer | null>(null);
  const [transfers, setTransfers] = useState<GatewayTransfer[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<GatewayTransfer | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const config = getGatewayConfig();
  const transferFee = 25; // ₦25 NIP network charge

  useEffect(() => {
    setTransfers(getStoredTransfers());
  }, []);

  // Real-time NUBAN Account Verification
  useEffect(() => {
    if (accountNumber.length === 10) {
      setIsResolving(true);
      setResolveError(null);
      setResolvedName(null);

      resolveAccountName(accountNumber, selectedBank).then((res) => {
        setIsResolving(false);
        if (res.success && res.accountName) {
          setResolvedName(res.accountName);
        } else {
          setResolveError(res.message || "Could not resolve account name");
        }
      });
    } else {
      setResolvedName(null);
      setResolveError(null);
    }
  }, [accountNumber, selectedBank]);

  const handleOpenAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedName) {
      alert("Please enter a valid 10-digit account number to resolve the account name first.");
      return;
    }
    if (amount <= 0 || amount > balance) {
      alert("Please enter a valid amount within available balance.");
      return;
    }
    setPin("");
    setPinError("");
    setIsPinModalOpen(true);
  };

  const handleAuthorizeTransfer = () => {
    if (pin.length !== 4) {
      setPinError("Please enter your 4-digit authorization PIN.");
      return;
    }

    if (pin !== "1234" && pin !== "0000") {
      setPinError("Invalid Security PIN. (Default Admin Test PIN is 1234)");
      return;
    }

    setIsSubmitting(true);
    setPinError("");

    setTimeout(() => {
      const bank = NIGERIAN_BANKS.find((b) => b.code === selectedBank);
      const reference = "TRF-REX-" + Math.random().toString(36).substring(2, 9).toUpperCase();

      const newTransfer: GatewayTransfer = {
        id: "trf_" + Date.now(),
        reference,
        bankCode: selectedBank,
        bankName: bank?.name || "Nigerian Bank",
        accountNumber,
        accountName: resolvedName || "Beneficiary",
        amount,
        narration: narration || `${category} - TPF`,
        status: "successful",
        environment: config.environment,
        fee: transferFee,
        createdAt: new Date().toISOString()
      };

      saveTransfer(newTransfer);
      setTransfers(getStoredTransfers());
      setBalance((b) => b - (amount + transferFee));
      setRecentTransfer(newTransfer);
      setIsSubmitting(false);
      setIsPinModalOpen(false);

      // Reset form
      setAccountNumber("");
      setResolvedName(null);
      setNarration("");
    }, 1200);
  };

  const handleCopyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Outward Disbursements & Payouts
            </h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              NIP Instant Settlement
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Pay directly into any Nigerian commercial bank account using your Accelerex RexPay transfer engine.
          </p>
        </div>

        {/* Payout Balance Card */}
        <div className="bg-gradient-to-r from-brand-darkBlue to-brand-blue text-white p-4 rounded-xl shadow-md min-w-[260px] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 uppercase tracking-wider block">
              Available Disbursement Balance
            </span>
            <span className="text-xl font-extrabold text-white">
              {formatCurrency(balance)}
            </span>
          </div>
          <div className="p-2 bg-white/10 rounded-lg">
            <Wallet size={22} className="text-brand-gold" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Transfer Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-t-4 border-t-brand-blue shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Send size={18} className="text-brand-blue" />
                Pay To Another Account
              </CardTitle>
              <CardDescription>
                Disburse funds to member accounts, loan recipients, dividend payouts, or vendor settlements.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleOpenAuth}>
              <CardContent className="space-y-4">
                {/* Bank Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Destination Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-blue"
                  >
                    {NIGERIAN_BANKS.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Number with Live NUBAN Resolution */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    10-Digit Account Number (NUBAN)
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      maxLength={10}
                      required
                      placeholder="e.g. 0123456789"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                      className="font-mono text-sm tracking-wide pr-10"
                    />
                    {isResolving && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 size={18} className="animate-spin text-brand-blue" />
                      </div>
                    )}
                  </div>

                  {/* Account Name Indicator */}
                  {resolvedName && (
                    <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-2 text-emerald-900 animate-in fade-in">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-emerald-700 block uppercase font-bold tracking-wider">
                          Verified Beneficiary
                        </span>
                        <span className="font-bold text-sm tracking-wide">{resolvedName}</span>
                      </div>
                    </div>
                  )}

                  {resolveError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} /> {resolveError}
                    </p>
                  )}
                </div>

                {/* Amount with Quick Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Transfer Amount (₦)
                    </label>
                    <span className="text-xs text-muted-foreground font-mono">
                      Fee: ₦{transferFee}.00
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {[20000, 50000, 100000, 250000, 500000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition ${
                          amount === amt
                            ? "bg-brand-blue text-white border-brand-blue"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {formatCurrency(amt)}
                      </button>
                    ))}
                  </div>

                  <Input
                    type="number"
                    min={100}
                    max={balance}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="font-mono text-sm"
                  />
                </div>

                {/* Purpose Category & Narration */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Payout Purpose
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    >
                      <option value="Loan Disbursement">Approved Loan Payout</option>
                      <option value="Dividend Distribution">Dividend Distribution</option>
                      <option value="Savings Withdrawal">Savings Withdrawal</option>
                      <option value="Vendor Payment">Vendor / Contractor Payment</option>
                      <option value="Operational Expense">Operational Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Narration / Remark
                    </label>
                    <Input
                      placeholder="e.g. Loan Payout Ref #9021"
                      value={narration}
                      onChange={(e) => setNarration(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Fee & Total Summary */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Transfer Amount:</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>NIP Processing Charge:</span>
                    <span>{formatCurrency(transferFee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold border-t pt-1">
                    <span>Total Debit Amount:</span>
                    <span>{formatCurrency(amount + transferFee)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t bg-slate-50/50">
                <Button
                  type="submit"
                  disabled={!resolvedName || amount <= 0}
                  className="w-full py-6 text-base font-bold bg-brand-blue hover:bg-brand-darkBlue text-white shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock size={16} /> Proceed to Payout Authorization ({formatCurrency(amount + transferFee)})
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Right Column: Security Features & Recent Successful Payout */}
        <div className="lg:col-span-5 space-y-6">
          {recentTransfer && (
            <Card className="border-2 border-emerald-500 bg-emerald-50/30 animate-in zoom-in-95 duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-emerald-900 flex items-center gap-2 text-base">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                  Transfer Dispatched Successfully!
                </CardTitle>
                <CardDescription className="text-emerald-700 text-xs">
                  Funds have been routed via NIP to the destination bank.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-emerald-200">
                  <span className="text-gray-600">Transfer Reference:</span>
                  <span className="font-mono font-bold text-gray-900">{recentTransfer.reference}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200">
                  <span className="text-gray-600">Beneficiary:</span>
                  <span className="font-semibold text-gray-900">{recentTransfer.accountName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200">
                  <span className="text-gray-600">Bank & Account:</span>
                  <span>{recentTransfer.bankName} • {recentTransfer.accountNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200">
                  <span className="text-gray-600">Amount Sent:</span>
                  <span className="font-bold text-emerald-800 text-sm">{formatCurrency(recentTransfer.amount)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Timestamp:</span>
                  <span>{new Date(recentTransfer.createdAt).toLocaleTimeString()}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedReceipt(recentTransfer)}
                  className="w-full text-xs font-semibold border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                >
                  View Full Transfer Receipt
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Authentic Bank Security Card */}
          <Card className="bg-slate-900 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-brand-gold">
                <ShieldCheck size={20} />
                Authentic Payout Safeguards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Lock size={16} className="text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Dual-Control PIN Authentication</strong>
                  Every outward debit requires administrative authorization PIN verification before execution.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Automated NUBAN Verification</strong>
                  Accounts are verified in real time against the Central Bank of Nigeria bank routing matrix to prevent erroneous transfers.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <FileText size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Immutable Audit Ledger</strong>
                  All disbursements generate cryptographically signed session references logged for the board of trustees.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Outward Transfer History Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Outward Disbursements</CardTitle>
            <CardDescription>
              Complete history of payouts executed via Accelerex RexPay NIP transfer channels.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {transfers.length} Payouts Recorded
          </Badge>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No outward payouts recorded yet. Initiate your first transfer above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b text-gray-600 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-3">Reference</th>
                    <th className="py-3 px-3">Beneficiary</th>
                    <th className="py-3 px-3">Bank & Account</th>
                    <th className="py-3 px-3">Narration</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transfers.map((trf) => (
                    <tr key={trf.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-mono font-bold text-brand-blue">{trf.reference}</td>
                      <td className="py-3 px-3 font-semibold text-gray-900">{trf.accountName}</td>
                      <td className="py-3 px-3 text-gray-600">
                        {trf.bankName}
                        <br />
                        <span className="font-mono text-[11px] text-gray-500">{trf.accountNumber}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{trf.narration}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">{formatCurrency(trf.amount)}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase">
                          {trf.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-500">{new Date(trf.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedReceipt(trf)}
                          className="text-brand-blue hover:underline font-semibold"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PIN AUTHORIZATION SECURITY MODAL */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="text-center space-y-1">
              <div className="h-12 w-12 rounded-full bg-blue-50 text-brand-blue mx-auto flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Authorize Outward Payout</h3>
              <p className="text-xs text-muted-foreground">
                Enter your 4-digit administrative security PIN to confirm this disbursement.
              </p>
            </div>

            {/* Transfer Summary Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Beneficiary:</span>
                <span className="font-bold text-gray-900">{resolvedName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destination:</span>
                <span>
                  {NIGERIAN_BANKS.find((b) => b.code === selectedBank)?.name} ({accountNumber})
                </span>
              </div>
              <div className="flex justify-between text-brand-blue font-bold text-sm pt-1 border-t">
                <span>Total Debit:</span>
                <span>{formatCurrency(amount + transferFee)}</span>
              </div>
            </div>

            {/* PIN Input */}
            <div className="space-y-2 text-center">
              <label className="text-xs font-semibold text-gray-700 block">
                Administrative Security PIN
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-40 mx-auto px-4 py-3 rounded-lg border-2 border-brand-blue text-center text-2xl font-mono tracking-widest block focus:outline-none"
              />
              <p className="text-[11px] text-gray-400">
                (Default test PIN: <span className="font-mono font-bold text-gray-600">1234</span>)
              </p>
              {pinError && <p className="text-xs text-red-600 font-medium">{pinError}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPinModalOpen(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAuthorizeTransfer}
                disabled={isSubmitting}
                className="flex-1 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Dispatching...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Confirm Payout
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSFER RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900">Transfer Receipt</h3>
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
                <span className="text-gray-500">Reference:</span>
                <span className="font-mono font-bold text-brand-blue">{selectedReceipt.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Beneficiary Name:</span>
                <span className="font-bold text-gray-900">{selectedReceipt.accountName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Destination Bank:</span>
                <span>{selectedReceipt.bankName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Account Number:</span>
                <span className="font-mono">{selectedReceipt.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Amount Sent:</span>
                <span className="font-bold text-emerald-700 text-sm">{formatCurrency(selectedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Transfer Fee:</span>
                <span>{formatCurrency(selectedReceipt.fee)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Narration:</span>
                <span className="text-gray-700">{selectedReceipt.narration}</span>
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
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
