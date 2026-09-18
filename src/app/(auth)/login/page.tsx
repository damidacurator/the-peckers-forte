"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  KeyRound,
  Info,
  UserPlus
} from "lucide-react";
import { generateAndSendOtp, verifyOtpCode, maskEmail } from "@/lib/otp";
import { ADMIN_TAB_SESSION_KEY } from "@/components/auth/AdminGuard";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const isAdminRedirect = redirectUrl.startsWith("/admin");
  const isAccessDenied = searchParams.get("denied") === "admin";
  const { validateCredentials, completeLoginAfterOtp } = useAuth();

  // Login steps: "credentials" -> "otp"
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  // Step 1: Credentials state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Step 2: OTP State (6 distinct boxes)
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [maskedUserEmail, setMaskedUserEmail] = useState("");
  const [countdown, setCountdown] = useState(600); // 10 minutes expiry
  const [resendCooldown, setResendCooldown] = useState(60); // 1 minute resend cooldown
  const [deliveryWarning, setDeliveryWarning] = useState<string | null>(null);
  const [testOtpCode, setTestOtpCode] = useState<string | null>(null);

  // Status & loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Input refs for 6-digit boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timers for OTP expiry and 1-minute resend cooldown
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

  // Handle Step 1: Credentials verification & Real OTP dispatch
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

      // Valid credentials! Dispatch real 6-digit OTP code to user's Gmail
      const otpRes = await generateAndSendOtp(email, credCheck.fullName);
      setMaskedUserEmail(otpRes.maskedEmail);
      if (otpRes.isDevMode && otpRes.code) {
        setTestOtpCode(otpRes.code);
      } else {
        setTestOtpCode(null);
      }
      if (otpRes.deliveryWarning) {
        setDeliveryWarning(otpRes.deliveryWarning);
      } else {
        setDeliveryWarning(null);
      }

      setCountdown(600);
      setResendCooldown(60); // 1 minute resend timer
      setOtpDigits(["", "", "", "", "", ""]);
      setStep("otp");

      // Auto-focus first digit box
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err?.message || "Authentication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle individual digit input in the 6 boxes
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      return;
    }

    // If pasted multiple digits
    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, 6).split("");
      const updated = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        if (pastedDigits[i]) {
          updated[i] = pastedDigits[i];
        }
      }
      setOtpDigits(updated);
      const nextFocus = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    // Single digit entry
    const updated = [...otpDigits];
    updated[index] = cleanVal[cleanVal.length - 1];
    setOtpDigits(updated);

    // Auto-advance to next box
    if (index < 5 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard navigation (Backspace & Arrow keys)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Step 2: OTP Verification & Final Login
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const verifyResult = verifyOtpCode(email, fullOtp);
      if (!verifyResult.success) {
        // Strict User Requirement: "If the OTP is wrong, show 'Invalid OTP'."
        setError(verifyResult.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      // OTP verified successfully! Complete session
      await completeLoginAfterOtp(email);

      const cleanEmail = email.trim().toLowerCase();
      const isCore = CORE_ADMIN_EMAILS.includes(cleanEmail);
      let isExecutive = isCore;
      try {
        const raw = localStorage.getItem("tpf_registered_users");
        if (raw) {
          const list = JSON.parse(raw);
          const found = list.find((u: any) => u.email.toLowerCase() === cleanEmail);
          if (found?.roles?.some((r: string) => ["Super Admin", "ADMIN", "Executive"].includes(r))) {
            isExecutive = true;
          }
        }
      } catch (e) {}

      // Routing logic
      if (isExecutive) {
        sessionStorage.setItem(ADMIN_TAB_SESSION_KEY, "true");
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/admin");
        }
      } else {
        if (isAdminRedirect) {
          router.push("/dashboard?denied=admin");
        } else if (redirectUrl && !redirectUrl.startsWith("/admin")) {
          router.push(redirectUrl);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to finalize session.");
      setLoading(false);
    }
  };

  // Handle Resend OTP (Every 1 minute)
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError("");
    setResendSuccess(false);

    try {
      const otpRes = await generateAndSendOtp(email);
      setResendSuccess(true);
      if (otpRes.isDevMode && otpRes.code) {
        setTestOtpCode(otpRes.code);
      }
      setResendCooldown(60); // Reset 1-minute countdown
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      if (otpRes.deliveryWarning) {
        setDeliveryWarning(otpRes.deliveryWarning);
      }
      setTimeout(() => setResendSuccess(false), 5000);
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

          {/* Admin Clearance Required Notice */}
          {isAdminRedirect && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-xl text-xs space-y-1 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <Lock size={15} className="text-amber-700 shrink-0" />
                <span>Executive Administrator Clearance Required</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Direct access to the Executive Administrative Console is protected. Please authenticate with authorized administrator credentials.
              </p>
            </div>
          )}

          {/* Access Denied Notice */}
          {isAccessDenied && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs space-y-1 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-red-900">
                <AlertCircle size={15} className="text-red-600 shrink-0" />
                <span>Access Denied</span>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed">
                The account you signed into does not have executive administrator privileges.
              </p>
            </div>
          )}

          {/* Dedicated Create Account Menu Option */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-brand-darkBlue font-medium">
              <UserPlus size={16} className="text-brand-blue shrink-0" />
              <span>Don&apos;t want to log in?</span>
            </div>
            <Link href="/register">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-brand-blue text-brand-blue font-bold text-xs hover:bg-brand-blue hover:text-white transition"
              >
                Create Account Menu →
              </Button>
            </Link>
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
              placeholder="e.g. yourname@gmail.com"
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

      {/* STEP 2: TWO-STEP VERIFICATION (OTP IN BOXES) SCREEN */}
      {step === "otp" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-full bg-blue-50 text-brand-blue mx-auto flex items-center justify-center shadow-sm">
              <Lock size={26} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Two-Step Verification</h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              We have sent a 6-digit security code to your registered email:
            </p>
            <p className="font-mono font-bold text-sm text-brand-blue bg-blue-50/80 py-1.5 px-3 rounded-lg inline-block border border-blue-100">
              {maskedUserEmail || email}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>A fresh security code has been sent to your email.</span>
            </div>
          )}

          {deliveryWarning && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Info size={15} className="text-amber-700 shrink-0" />
                <span>Notice Regarding Outgoing Email Delivery</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                To receive verification emails directly into any Gmail inbox, add your free <strong>Resend API Key</strong> or <strong>Gmail App Password</strong> to your environment variables.
              </p>
            </div>
          )}

          {testOtpCode && (
            <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center justify-between animate-in fade-in">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-brand-blue">
                  <span>Verification Code:</span>
                  <span className="font-mono text-base font-black tracking-widest bg-white px-2.5 py-0.5 rounded-md border border-blue-300 text-brand-darkBlue shadow-xs">
                    {testOtpCode}
                  </span>
                </div>
                <p className="text-[10px] text-blue-700">
                  (Test mode active: Click Quick Fill or enter this code below)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpDigits(testOtpCode.split(""));
                }}
                className="text-[11px] font-bold text-white bg-brand-blue hover:bg-brand-darkBlue px-3 py-1.5 rounded-lg shadow-xs transition shrink-0 ml-2 cursor-pointer"
              >
                Quick Fill
              </button>
            </div>
          )}

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 text-center mb-3">
                Enter the 6-Digit Code from your Gmail
              </label>

              {/* 6 INTERACTIVE OTP DIGIT BOXES */}
              <div className="flex justify-center items-center gap-2 sm:gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData.getData("text");
                      handleDigitChange(idx, pasted);
                    }}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border-2 transition focus:outline-none focus:ring-4 shadow-sm ${
                      digit
                        ? "border-brand-blue bg-blue-50/30 text-gray-900"
                        : "border-gray-300 bg-white text-gray-700 focus:border-brand-blue focus:ring-brand-blue/20"
                    }`}
                  />
                ))}
              </div>

              {/* TIMERS: 10-MIN EXPIRY & 1-MIN RESEND */}
              <div className="flex items-center justify-between text-xs text-gray-500 mt-4 px-2">
                <span>
                  Code expires in: <strong className="font-mono text-gray-700">{formatTimer(countdown)}</strong>
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
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend Code"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || otpDigits.join("").length !== 6}
              className="w-full py-5 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Verifying OTP...
                </span>
              ) : (
                "Verify & Sign In"
              )}
            </Button>
          </form>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setOtpDigits(["", "", "", "", "", ""]);
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[350px] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          <p className="text-xs text-gray-500 font-medium">Loading authentication console...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
