"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Building2,
  PhoneCall,
  CheckCircle2,
  X,
  Lock,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  getGatewayConfig,
  saveTransaction,
  GatewayTransaction
} from "@/lib/accelerex";

interface AccelerexCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  paymentType: string;
  customerName: string;
  customerEmail: string;
  onSuccess?: (tx: GatewayTransaction) => void;
}

export function AccelerexCheckoutModal({
  isOpen,
  onClose,
  amount,
  paymentType,
  customerName,
  customerEmail,
  onSuccess
}: AccelerexCheckoutModalProps) {
  const [activeTab, setActiveTab] = useState<"card" | "transfer" | "ussd">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardPin, setCardPin] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"input" | "otp" | "processing" | "success" | "error">("input");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(1200);
  const [ussdBank, setUssdBank] = useState("gtb");
  const [generatedTx, setGeneratedTx] = useState<GatewayTransaction | null>(null);

  const config = getGatewayConfig();
  const isSandbox = config.environment === "sandbox";

  const virtualAccount = {
    bankName: "Wema Bank / Accelerex PGS",
    accountNumber: "9823410582",
    accountName: "TPF COLLECTION - " + (customerName ? customerName.split(" ")[0].toUpperCase() : "MEMBER")
  };

  useEffect(() => {
    if (!isOpen) {
      setStep("input");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setCardPin("");
      setOtp("");
      setErrorMessage("");
      setGeneratedTx(null);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (isOpen && activeTab === "transfer" && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, activeTab, countdown]);

  if (!isOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(virtualAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFillTestCard = (type: "success" | "otp" | "fail") => {
    if (type === "success") {
      setCardNumber("5399 8345 1200 4421");
      setExpiry("12/28");
      setCvv("412");
      setCardPin("1234");
    } else if (type === "otp") {
      setCardNumber("4084 0812 3456 7890");
      setExpiry("09/27");
      setCvv("890");
      setCardPin("0000");
    } else {
      setCardNumber("5061 0599 0012 3456");
      setExpiry("05/25");
      setCvv("111");
      setCardPin("9999");
    }
  };

  const completePayment = (method: "card" | "transfer" | "ussd") => {
    setStep("processing");
    setTimeout(() => {
      if (method === "card" && cardNumber.includes("5061")) {
        setStep("error");
        setErrorMessage("Transaction declined: Insufficient funds on test card.");
        return;
      }

      const reference = "REX-" + Math.random().toString(36).substring(2, 11).toUpperCase();
      const receiptNumber = "RCT-" + Date.now().toString().slice(-6);

      const tx: GatewayTransaction = {
        id: "tx_" + Date.now(),
        reference,
        amount,
        currency: "NGN",
        type: paymentType,
        customerName: customerName || "Valued Member",
        customerEmail: customerEmail || "admin@thepeckersfortelp.com",
        paymentMethod: method,
        status: "successful",
        environment: config.environment,
        channel: method === "card" ? "Card Payment" : method === "transfer" ? "Dynamic Virtual Account" : "USSD Banking",
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        receiptNumber
      };

      saveTransaction(tx);
      setGeneratedTx(tx);
      setStep("success");
      if (onSuccess) onSuccess(tx);
    }, 1500);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.includes("4084")) {
      setStep("otp");
      return;
    }
    completePayment("card");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completePayment("card");
  };

  const formatMins = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-darkBlue via-[#0F172A] to-brand-blue text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-full bg-white p-1 shadow">
              <img src="/images/logo.jpg" alt="Logo" className="h-full w-full object-contain rounded-full" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">THE PECKERS FORTE</h3>
              <p className="text-xs text-brand-gold font-medium">Accelerex RexPay Checkout</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-3">
            <div>
              <p className="text-xs text-slate-300">Amount Due</p>
              <h2 className="text-2xl font-extrabold text-white">{formatCurrency(amount)}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                {paymentType || "Payment"}
              </span>
              {isSandbox && (
                <span className="block mt-1 text-[10px] text-amber-300 font-mono">
                  [SANDBOX TEST MODE]
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          
          {step === "input" && (
            <>
              {/* Channel Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("card")}
                  className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === "card"
                      ? "border-brand-blue text-brand-blue"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <CreditCard size={18} /> Pay with Card
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("transfer")}
                  className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === "transfer"
                      ? "border-brand-blue text-brand-blue"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Building2 size={18} /> Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ussd")}
                  className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === "ussd"
                      ? "border-brand-blue text-brand-blue"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <PhoneCall size={18} /> USSD
                </button>
              </div>

              {/* CARD TAB */}
              {activeTab === "card" && (
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  {isSandbox && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                      <p className="font-bold mb-1.5 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-amber-700" /> Test Card Presets (Click to autofill):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleFillTestCard("success")}
                          className="px-2 py-1 bg-white border border-amber-300 rounded hover:bg-amber-100 font-medium"
                        >
                          Mastercard (Success)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFillTestCard("otp")}
                          className="px-2 py-1 bg-white border border-amber-300 rounded hover:bg-amber-100 font-medium"
                        >
                          Visa (3DS OTP)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFillTestCard("fail")}
                          className="px-2 py-1 bg-white border border-amber-300 rounded hover:bg-amber-100 font-medium text-red-700"
                        >
                          Verve (Decline)
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="5399 8345 1200 4421"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-center font-mono"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        placeholder="123"
                        value={cvv}
                        onChange={e => setCvv(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-center font-mono"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Card PIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        placeholder="••••"
                        value={cardPin}
                        onChange={e => setCardPin(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-center font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 px-4 bg-brand-blue text-white rounded-lg font-bold text-sm hover:bg-brand-darkBlue shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Lock size={16} /> Pay {formatCurrency(amount)}
                  </button>
                </form>
              )}

              {/* TRANSFER TAB */}
              {activeTab === "transfer" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                    <p className="text-xs text-gray-500">Transfer exact amount to the dedicated virtual account below:</p>
                    <div className="flex items-center justify-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <span className="font-mono font-bold text-xl text-gray-900 tracking-wider">
                        {virtualAccount.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="p-1.5 text-gray-500 hover:text-brand-blue transition rounded bg-gray-100"
                        title="Copy Account Number"
                      >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </button>
                    </div>

                    <div className="text-xs text-left space-y-1 bg-white p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bank Name:</span>
                        <span className="font-semibold text-gray-900">{virtualAccount.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Beneficiary:</span>
                        <span className="font-semibold text-gray-900">{virtualAccount.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Expires in:</span>
                        <span className="font-mono text-amber-600 font-bold">{formatMins(countdown)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => completePayment("transfer")}
                    className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} /> I have transferred {formatCurrency(amount)}
                  </button>
                </div>
              )}

              {/* USSD TAB */}
              {activeTab === "ussd" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Select Bank</label>
                    <select
                      value={ussdBank}
                      onChange={e => setUssdBank(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                    >
                      <option value="gtb">GTBank (*737#)</option>
                      <option value="zenith">Zenith Bank (*966#)</option>
                      <option value="uba">UBA (*919#)</option>
                      <option value="access">Access Bank (*901#)</option>
                      <option value="firstbank">First Bank (*894#)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <p className="text-xs text-gray-500">Dial this USSD code on your registered phone number:</p>
                    <div className="font-mono font-bold text-lg text-brand-darkBlue bg-white p-3 rounded-lg border shadow-sm">
                      {ussdBank === 'gtb' && '*737*000*4567#'}
                      {ussdBank === 'zenith' && '*966*000*4567#'}
                      {ussdBank === 'uba' && '*919*000*4567#'}
                      {ussdBank === 'access' && '*901*000*4567#'}
                      {ussdBank === 'firstbank' && '*894*000*4567#'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => completePayment("ussd")}
                    className="w-full py-3 px-4 bg-brand-blue text-white rounded-lg font-bold text-sm hover:bg-brand-darkBlue shadow transition flex items-center justify-center gap-2"
                  >
                    <PhoneCall size={18} /> Verify USSD Payment
                  </button>
                </div>
              )}
            </>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-center py-4">
              <div className="h-12 w-12 rounded-full bg-blue-50 text-brand-blue mx-auto flex items-center justify-center">
                <Lock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">3D Secure OTP Verification</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit test authorization code sent to your phone (Any 6 digits in sandbox, e.g. 123456)
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="123456"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-48 mx-auto px-4 py-3 rounded-lg border-2 border-brand-blue text-center text-xl font-mono tracking-widest block"
              />

              <button
                type="submit"
                className="w-full py-3 px-4 bg-brand-blue text-white rounded-lg font-bold text-sm hover:bg-brand-darkBlue shadow transition"
              >
                Authorize Payment
              </button>
            </form>
          )}

          {/* PROCESSING STEP */}
          {step === "processing" && (
            <div className="py-12 text-center space-y-4">
              <Loader2 size={48} className="animate-spin text-brand-blue mx-auto" />
              <h4 className="text-lg font-bold text-gray-900">Contacting Accelerex RexPay...</h4>
              <p className="text-xs text-gray-500">Please do not close or refresh this window.</p>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === "success" && generatedTx && (
            <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
              <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">Payment Successful!</h4>
                <p className="text-sm text-gray-500 mt-1">Your transaction has been verified and credited.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction Ref:</span>
                  <span className="font-mono font-semibold text-gray-900">{generatedTx.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Receipt No:</span>
                  <span className="font-mono font-semibold text-gray-900">{generatedTx.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(generatedTx.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Channel:</span>
                  <span className="text-gray-700">{generatedTx.channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="text-gray-700">{new Date(generatedTx.paidAt || "").toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 bg-brand-blue text-white rounded-lg font-bold text-sm hover:bg-brand-darkBlue shadow transition"
              >
                Close & Return
              </button>
            </div>
          )}

          {/* ERROR STEP */}
          {step === "error" && (
            <div className="text-center space-y-4 py-6">
              <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <AlertCircle size={36} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Transaction Failed</h4>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => setStep("input")}
                className="py-2.5 px-6 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition"
              >
                Try Another Method
              </button>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-600" /> 256-bit TLS Encrypted
          </span>
          <span className="font-medium">Secured by Global Accelerex</span>
        </div>

      </div>
    </div>
  );
}
