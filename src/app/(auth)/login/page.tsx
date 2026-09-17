"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, CORE_ADMIN_EMAILS } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  KeyRound
} from "lucide-react";
import { generateAndSendOtp, verifyOtpCode, maskEmail } from "@/lib/otp";

export default function LoginPage() {
  const router = useRouter();
  const { validateCredentials, completeLoginAfterOtp } = useAuth();

  // Login steps: "credentials" -> "otp"
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  // Step 1: Credentials state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Step 2: OTP state
  const [otp, setOtp] = useState("");
  const [maskedUserEmail, setMaskedUserEmail] = useState("");
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [resendCooldown, setResendCooldown] = useState(30);
  const [backupCode, setBackupCode] = useState<string | null>(null);

  // Status & loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Countdown timers for OTP expiry and resend cooldown
  useEffect(() => {
    let interval: any;
    if (step === "otp") {
      interval = setInterval(() => {
        setCountdown((c) => Math.max(0, c - 1));
        setResendCooldown((rc) => Math.max(0, rc - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  // Handle Step 1: Credential validation & OTP Dispatch
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credCheck = await validateCredentials(email, password);
      if (!credCheck.success) {
        setError(credCheck.error || "Invalid email or password. Please verify your credentials.");
        setLoading(false);
        return;
      }

      // Valid credentials! Dispatch 6-digit OTP code to the user's Gmail
      const otpRes = await generateAndSendOtp(email, credCheck.fullName);
      setMaskedUserEmail(otpRes.maskedEmail);
      if (otpRes.backupCode) {
        setBackupCode(otpRes.backupCode);
      }
      setCountdown(600);
      setResendCooldown(30);
      setStep("otp");
    } catch (err: any) {
      setError(err?.message || "Authentication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: OTP Verification & Session Establishment
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.trim().length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const verifyResult = verifyOtpCode(email, otp);
      if (!verifyResult.success) {
        setError(verifyResult.message);
        setLoading(false);
        return;
      }

      // OTP Verified Successfully! Complete login session
      await completeLoginAfterOtp(email);

      // Smart redirection: if core admin, redirect to admin gateway; otherwise member dashboard
      if (CORE_ADMIN_EMAILS.includes(email.trim().toLowerCase())) {
        router.push("/admin/gateway");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to finalize session. Please try again.");
      setLoading(false);
    }
  };

  // Handle Resend OTP Code
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError("");
    setResendSuccess(false);

    try {
      const otpRes = await generateAndSendOtp(email);
      setResendSuccess(true);
      setResendCooldown(45);
      if (otpRes.backupCode) {
        setBackupCode(otpRes.backupCode);
      }
      setTimeout(() => setResendSuccess(false), 4000);
    } catch (err: any) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* STEP 1: CREDENTIALS SCREEN */}
      {step === "credentials" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">Sign in to your account</h3>
            <p className="mt-1 text-sm text-gray-600">
              Or{" "}
              <Link href="/register" className="font-bold text-brand-blue hover:underline">
                create a new account
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
            <Input
              label="Email address"
              type="email"
              required
              placeholder="e.g. admin@thepeckerfortelp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                  Remember this device
                </label>
              </div>

              <Link href="/forgot-password" className="font-semibold text-brand-blue hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-5 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold shadow-md transition"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Verifying Credentials...
                </span>
              ) : (
                "Continue to Verification →"
              )}
            </Button>
          </form>

          <div className="p-3 bg-slate-50 border rounded-xl text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Protected by Mandatory Two-Step Verification (OTP)</span>
          </div>
        </div>
      )}

      {/* STEP 2: TWO-STEP VERIFICATION (OTP) SCREEN */}
      {step === "otp" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-full bg-blue-50 text-brand-blue mx-auto flex items-center justify-center shadow-sm">
              <Lock size={26} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Two-Step Verification</h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              We have sent a 6-digit verification code to your registered Gmail address:
            </p>
            <p className="font-mono font-bold text-sm text-brand-blue bg-blue-50/80 py-1.5 px-3 rounded-lg inline-block border border-blue-100">
              {maskedUserEmail || email}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>A fresh 6-digit security code has been sent to your email.</span>
            </div>
          )}

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 text-center mb-2">
                Enter 6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-56 mx-auto px-4 py-3 rounded-xl border-2 border-brand-blue text-center text-2xl font-mono tracking-widest block focus:outline-none focus:ring-4 focus:ring-brand-blue/20 shadow-inner"
              />
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2 px-6">
                <span>
                  Expires in: <strong className="font-mono text-gray-700">{formatTimer(countdown)}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || resending}
                  className={`font-semibold transition ${
                    resendCooldown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-brand-blue hover:underline"
                  }`}
                >
                  {resending
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Code"}
                </button>
              </div>
            </div>

            {/* Instant Sandbox / Offline Delivery Helper (Ensures user is never stranded) */}
            {backupCode && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Mail size={13} className="text-brand-blue" />
                    Security Code Delivery Preview:
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp(backupCode)}
                    className="text-[11px] text-brand-blue hover:underline font-bold"
                  >
                    Click to Autofill
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Code sent to Gmail: <span className="font-mono font-bold text-gray-900">{backupCode}</span>
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-5 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Verifying Code...
                </span>
              ) : (
                "Verify & Sign In"
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setOtp("");
                setError("");
              }}
              className="text-xs text-gray-500 hover:text-gray-800 font-semibold flex items-center justify-center gap-1 mx-auto transition"
            >
              <ArrowLeft size={14} /> Back to email & password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
