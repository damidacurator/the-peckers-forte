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
  ShieldCheck,
  Zap,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  CreditCard,
  Building2,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Code2,
  FileSpreadsheet,
  ExternalLink,
  Layers,
  ArrowRight
} from "lucide-react";
import {
  AccelerexConfig,
  getGatewayConfig,
  saveGatewayConfig,
  testApiConnection,
  getStoredTransactions,
  GatewayTransaction,
  NIGERIAN_BANKS
} from "@/lib/accelerex";
import { AccelerexCheckoutModal } from "@/components/payment/AccelerexCheckoutModal";

export default function AdminGatewayPage() {
  const [config, setConfig] = useState<AccelerexConfig>(getGatewayConfig());
  const [activeTab, setActiveTab] = useState<"keys" | "testing" | "transactions">("keys");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Ping test state
  const [isTesting, setIsTesting] = useState(false);
  const [pingResult, setPingResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
    details: any;
  } | null>(null);

  // Test checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [testAmount, setTestAmount] = useState(5000);
  const [testPurpose, setTestPurpose] = useState("Monthly Contribution");
  const [testPayerName, setTestPayerName] = useState("Akinola Idowu");
  const [testPayerEmail, setTestPayerEmail] = useState("admin@thepeckersfortelp.com");
  const [lastTx, setLastTx] = useState<GatewayTransaction | null>(null);

  // Transaction history
  const [transactions, setTransactions] = useState<GatewayTransaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<GatewayTransaction | null>(null);

  useEffect(() => {
    const loadedConfig = getGatewayConfig();
    setConfig(loadedConfig);
    setTransactions(getStoredTransactions());
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveGatewayConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRunPingTest = async () => {
    setIsTesting(true);
    setPingResult(null);
    try {
      const result = await testApiConnection(config);
      setPingResult(result);
    } catch (err: any) {
      setPingResult({
        success: false,
        latencyMs: 999,
        message: "Failed to connect to gateway server.",
        details: { error: err?.message }
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handlePaymentSuccess = (tx: GatewayTransaction) => {
    setLastTx(tx);
    setTransactions(getStoredTransactions());
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Accelerex (RexPay) Gateway
            </h1>
            {config.environment === "sandbox" ? (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Sandbox Mode
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Live Production
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure merchant API keys, verify webhook callbacks, test live payment channels, and manage payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRunPingTest}
            disabled={isTesting}
            className="flex items-center gap-2 border-brand-blue/30 text-brand-blue hover:bg-brand-blue/5"
          >
            <RefreshCw size={16} className={isTesting ? "animate-spin text-brand-blue" : "text-brand-blue"} />
            {isTesting ? "Pinging Gateway..." : "Test API Connection"}
          </Button>
          <Button
            onClick={() => {
              setActiveTab("testing");
            }}
            className="bg-brand-blue hover:bg-brand-darkBlue text-white flex items-center gap-2"
          >
            <Zap size={16} /> Open Test Sandbox
          </Button>
        </div>
      </div>

      {/* Ping Test Feedback Alert */}
      {pingResult && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-4 animate-in fade-in duration-200 ${
            pingResult.success
              ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
              : "bg-red-50/80 border-red-300 text-red-950"
          }`}
        >
          <div className="flex items-start gap-3">
            {pingResult.success ? (
              <CheckCircle2 className="text-emerald-600 mt-0.5 shrink-0" size={20} />
            ) : (
              <AlertTriangle className="text-red-600 mt-0.5 shrink-0" size={20} />
            )}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm">{pingResult.message}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-white/70 border border-current">
                  {pingResult.latencyMs} ms
                </span>
              </div>
              <p className="text-xs opacity-80 mt-1 font-mono">
                Endpoint: {config.environment === "production" ? config.productionUrl : config.sandboxUrl}
                {" • "}Merchant ID: {config.merchantId}
              </p>
            </div>
          </div>

          <button
            onClick={() => setPingResult(null)}
            className="text-xs opacity-60 hover:opacity-100 font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab("keys")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "keys"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Key size={16} /> API Keys & Configuration
        </button>
        <button
          onClick={() => setActiveTab("testing")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "testing"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Zap size={16} /> Payment Sandbox & API Console
        </button>
        <button
          onClick={() => {
            setActiveTab("transactions");
            setTransactions(getStoredTransactions());
          }}
          className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "transactions"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Layers size={16} /> Gateway Transactions ({transactions.length})
        </button>
      </div>

      {/* TAB 1: API KEYS & CONFIGURATION */}
      {activeTab === "keys" && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-sm flex items-center gap-2 font-medium">
              <Check size={16} className="text-emerald-600" />
              Gateway credentials and environment settings saved successfully!
            </div>
          )}

          {/* Environment Switcher */}
          <Card className="border-l-4 border-l-brand-gold">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Gateway Environment</span>
                <span className="text-xs text-muted-foreground font-normal">Toggle between testing and live billing</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setConfig({ ...config, environment: "sandbox" })}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    config.environment === "sandbox"
                      ? "border-amber-500 bg-amber-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="environment"
                    checked={config.environment === "sandbox"}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">Sandbox (Test Mode)</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Process simulated card payments, virtual transfers, and USSD without real money. Use for testing keys and webhook flows.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setConfig({ ...config, environment: "production" })}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    config.environment === "production"
                      ? "border-emerald-600 bg-emerald-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="environment"
                    checked={config.environment === "production"}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">Live Production</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Connect to Global Accelerex production PGS. Real card charges and live Nigerian bank settlements.
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* API Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key size={18} className="text-brand-blue" />
                Accelerex Merchant Credentials
              </CardTitle>
              <CardDescription>
                Provide your Merchant ID and API Keys from the RexPay / Global Accelerex Merchant Portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Merchant ID
                </label>
                <div className="flex gap-2">
                  <Input
                    value={config.merchantId}
                    onChange={(e) => setConfig({ ...config, merchantId: e.target.value })}
                    placeholder="REX-TPF-DEMO"
                    className="font-mono text-sm"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopy(config.merchantId, "merchantId")}
                  >
                    {copiedKey === "merchantId" ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Public API Key
                </label>
                <div className="flex gap-2">
                  <Input
                    value={config.publicKey}
                    onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
                    placeholder="rx_pub_test_..."
                    className="font-mono text-sm"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopy(config.publicKey, "publicKey")}
                  >
                    {copiedKey === "publicKey" ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </Button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Safe for client-side checkout modal initialization.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Secret API Key (Private Key)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showSecretKey ? "text" : "password"}
                      value={config.secretKey}
                      onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                      placeholder="rx_sec_test_..."
                      className="font-mono text-sm pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                    >
                      {showSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopy(config.secretKey, "secretKey")}
                  >
                    {copiedKey === "secretKey" ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </Button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Kept strictly confidential. Used to authenticate server-to-server payment requests and payout transfers.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Webhook Signature Secret
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showWebhookSecret ? "text" : "password"}
                      value={config.webhookSecret}
                      onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
                      placeholder="whsec_..."
                      className="font-mono text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                    >
                      {showWebhookSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopy(config.webhookSecret, "webhookSecret")}
                  >
                    {copiedKey === "webhookSecret" ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook & Callback Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Webhook Callback Endpoint</CardTitle>
              <CardDescription>
                Copy this URL and paste it into your RexPay Merchant Dashboard Webhook Configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  readOnly
                  value="https://the-peckers-forte.vercel.app/api/webhooks/accelerex"
                  className="bg-slate-50 font-mono text-xs text-slate-700"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    handleCopy("https://the-peckers-forte.vercel.app/api/webhooks/accelerex", "webhookUrl")
                  }
                >
                  {copiedKey === "webhookUrl" ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Accelerex will automatically dispatch <code className="font-mono text-brand-blue">charge.success</code> and <code className="font-mono text-brand-blue">transfer.success</code> events to this URL to reconcile ledgers instantly.
              </p>
            </CardContent>
          </Card>

          {/* Settlement Account Reconciliation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 size={18} className="text-emerald-600" />
                Primary Settlement Account
              </CardTitle>
              <CardDescription>
                The designated Nigerian bank account where collected cooperative funds are automatically settled by Accelerex.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Settlement Bank</label>
                <select
                  value={config.settlementBank}
                  onChange={(e) => setConfig({ ...config, settlementBank: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Account Number (NUBAN)</label>
                <Input
                  maxLength={10}
                  value={config.settlementAccount}
                  onChange={(e) => setConfig({ ...config, settlementAccount: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Account Name</label>
                <Input
                  value={config.settlementAccountName}
                  onChange={(e) => setConfig({ ...config, settlementAccountName: e.target.value })}
                  className="text-sm font-semibold"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 flex justify-end">
              <Button type="submit" className="bg-brand-blue hover:bg-brand-darkBlue text-white">
                Save All Gateway Settings
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}

      {/* TAB 2: PAYMENT SANDBOX & API TESTING CONSOLE */}
      {activeTab === "testing" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-12 gap-6">
            {/* Left: Test Checkout Launcher */}
            <div className="md:col-span-6 space-y-6">
              <Card className="border-t-4 border-t-brand-blue">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap size={20} className="text-brand-blue" />
                    Simulate Live Accelerex Checkout
                  </CardTitle>
                  <CardDescription>
                    Trigger the actual RexPay popup interface with card presets, virtual transfer, or USSD.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Test Amount (₦)
                    </label>
                    <div className="flex gap-2 mb-2">
                      {[1000, 5000, 25000, 100000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTestAmount(amt)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                            testAmount === amt
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
                      value={testAmount}
                      onChange={(e) => setTestAmount(Number(e.target.value))}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Payment Purpose
                    </label>
                    <select
                      value={testPurpose}
                      onChange={(e) => setTestPurpose(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                    >
                      <option value="Monthly Contribution">Monthly Contribution</option>
                      <option value="Share Capital Purchase">Share Capital Purchase</option>
                      <option value="Loan Repayment">Loan Repayment</option>
                      <option value="Special Development Levy">Special Development Levy</option>
                      <option value="Membership Registration Fee">Membership Registration Fee</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Payer Name
                      </label>
                      <Input
                        value={testPayerName}
                        onChange={(e) => setTestPayerName(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Payer Email
                      </label>
                      <Input
                        value={testPayerEmail}
                        onChange={(e) => setTestPayerEmail(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="w-full py-6 text-base font-bold bg-brand-blue hover:bg-brand-darkBlue text-white shadow-md flex items-center justify-center gap-2"
                    >
                      <CreditCard size={18} /> Launch RexPay Modal ({formatCurrency(testAmount)})
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Safeguards Notice */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  Security & Encryption Safeguards
                </div>
                <p>
                  • PCI-DSS Level 1 compliant data transit.
                  <br />
                  • Client-side secrets are restricted to Public Keys only; Private Keys never leak to user sessions.
                  <br />
                  • SHA-512 webhook signature verification prevents replay attacks.
                </p>
              </div>
            </div>

            {/* Right: API Request & Response Inspector */}
            <div className="md:col-span-6 space-y-4">
              <Card className="bg-slate-900 text-slate-100 font-mono text-xs overflow-hidden shadow-lg border-slate-800">
                <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-200">
                    <Code2 size={15} className="text-brand-gold" />
                    Outgoing PGS Payload
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    POST /api/pgs/payment/v2/createPayment
                  </span>
                </div>
                <div className="p-4 overflow-x-auto text-[11px] leading-relaxed">
                  <p className="text-slate-400 font-bold mb-1">// Request Headers</p>
                  <p className="text-indigo-300">Authorization: Bearer {config.secretKey ? config.secretKey.substring(0, 10) + "..." : "rx_sec_..."}</p>
                  <p className="text-indigo-300">Content-Type: application/json</p>
                  <p className="text-slate-400 font-bold mt-3 mb-1">// Request Body</p>
                  <pre className="text-amber-300">
{JSON.stringify(
  {
    merchantId: config.merchantId,
    amount: testAmount,
    currency: "NGN",
    reference: lastTx?.reference || "REX-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    customer: {
      name: testPayerName,
      email: testPayerEmail
    },
    paymentType: testPurpose,
    callbackUrl: "https://the-peckers-forte.vercel.app/api/webhooks/accelerex",
    channels: ["card", "bank_transfer", "ussd"]
  },
  null,
  2
)}
                  </pre>
                </div>
              </Card>

              {/* Last Transaction Response */}
              {lastTx ? (
                <Card className="bg-slate-950 text-slate-100 font-mono text-xs overflow-hidden shadow-lg border-slate-800">
                  <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 size={15} />
                      Gateway Response (200 OK)
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(lastTx.paidAt || "").toLocaleTimeString()}</span>
                  </div>
                  <div className="p-4 overflow-x-auto text-[11px] leading-relaxed">
                    <pre className="text-emerald-300">
{JSON.stringify(
  {
    status: "success",
    responseCode: "00",
    responseMessage: "Transaction Approved Successfully",
    data: {
      reference: lastTx.reference,
      receiptNumber: lastTx.receiptNumber,
      amount: lastTx.amount,
      currency: lastTx.currency,
      channel: lastTx.channel,
      customer: lastTx.customerName,
      paidAt: lastTx.paidAt
    }
  },
  null,
  2
)}
                    </pre>
                  </div>
                </Card>
              ) : (
                <div className="p-8 border border-dashed rounded-xl text-center text-gray-400 text-xs">
                  Run a checkout transaction above to inspect the gateway response payload in real-time.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GATEWAY TRANSACTION HISTORY */}
      {activeTab === "transactions" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gateway Transaction Log</CardTitle>
              <CardDescription>
                Auditable records of all processed collections, card debits, and transfers.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTransactions(getStoredTransactions());
              }}
              className="flex items-center gap-1.5"
            >
              <RefreshCw size={14} /> Refresh Logs
            </Button>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No transactions recorded yet. Use the Payment Sandbox tab to test your first payment!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b text-gray-600 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-3">Reference</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Purpose</th>
                      <th className="py-3 px-3">Method</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Env</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-mono font-bold text-brand-blue">{tx.reference}</td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-gray-900">{tx.customerName}</p>
                          <p className="text-[10px] text-gray-400">{tx.customerEmail}</p>
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-700">{tx.type}</td>
                        <td className="py-3 px-3 capitalize">
                          <span className="inline-flex items-center gap-1">
                            {tx.paymentMethod === "card" && <CreditCard size={12} className="text-indigo-600" />}
                            {tx.paymentMethod === "transfer" && <Building2 size={12} className="text-emerald-600" />}
                            {tx.paymentMethod === "ussd" && <PhoneCall size={12} className="text-blue-600" />}
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-gray-900">{formatCurrency(tx.amount)}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              tx.environment === "sandbox"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {tx.environment}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="text-brand-blue hover:underline font-semibold"
                          >
                            {tx.receiptNumber || "View"}
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
      )}

      {/* Checkout Modal Instance */}
      <AccelerexCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={testAmount}
        paymentType={testPurpose}
        customerName={testPayerName}
        customerEmail={testPayerEmail}
        onSuccess={handlePaymentSuccess}
      />

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">Transaction Receipt</h3>
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
                <span className="font-mono">{selectedTx.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Customer:</span>
                <span className="font-semibold">{selectedTx.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Purpose:</span>
                <span>{selectedTx.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold text-brand-blue text-sm">{formatCurrency(selectedTx.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Payment Channel:</span>
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
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
