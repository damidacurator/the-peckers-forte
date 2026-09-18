"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  CreditCard,
  Wallet,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useAuth, CORE_ADMIN_EMAILS } from "@/lib/auth";
import { AccelerexCheckoutModal } from "@/components/payment/AccelerexCheckoutModal";
import { GatewayTransaction } from "@/lib/accelerex";
import { formatCurrency } from "@/lib/utils";
import { generateAndSendOtp, verifyOtpCode } from "@/lib/otp";
import { addUserNotification } from "@/lib/notifications";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Steps: 1..5, then 6 = "Waiting for Gmail Verification"
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paidTx, setPaidTx] = useState<GatewayTransaction | null>(null);
  const REGISTRATION_FEE = 5000;

  // Step 6 OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpCountdown, setOtpCountdown] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isAccountActivated, setIsAccountActivated] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "M",
    dob: "1990-01-01",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    state: "Lagos",
    lga: "Ikeja",
    wing: "BOTH",
    category: "standard",
    nokName: "",
    nokPhone: "",
    nokRel: "Sibling",
  });

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isCoreAdminEmail =
    formData.email.trim().length > 0 &&
    CORE_ADMIN_EMAILS.includes(formData.email.trim().toLowerCase());

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (step === 6 && !isAccountActivated) {
      timer = setInterval(() => {
        setOtpCountdown((c) => Math.max(0, c - 1));
        setResendCooldown((rc) => Math.max(0, rc - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, isAccountActivated]);

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.firstName || !formData.lastName) {
        setError("Please enter your surname and first name.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.email || !formData.phone) {
        setError("Please enter a valid email and phone number.");
        return;
      }
      if (!formData.email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.password) {
        setError("Please choose a secure password.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match. Please re-enter.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Called when payment succeeds: transitions to "Waiting for Gmail Verification"
  const handlePaymentSuccess = async (tx: GatewayTransaction) => {
    setPaidTx(tx);
    setIsCheckoutOpen(false);
    setError("");
    setLoading(true);

    try {
      // Dispatch verification code to THAT user's individual Gmail
      await generateAndSendOtp(formData.email, `${formData.firstName} ${formData.lastName}`);
      setOtpCountdown(600);
      setResendCooldown(60);
      setStep(6); // Step 6 = "Waiting for Gmail Verification"
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setError("Payment received, but failed to dispatch verification code. Please click Resend.");
      setStep(6);
    } finally {
      setLoading(false);
    }
  };

  // Step 5 Submit: If not admin and not paid, open checkout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      nextStep();
      return;
    }

    if (step === 5) {
      if (!isCoreAdminEmail && !paidTx) {
        setIsCheckoutOpen(true);
        return;
      }

      // If core admin, they can move to verification or bypass
      setLoading(true);
      await generateAndSendOtp(formData.email, `${formData.firstName} ${formData.lastName}`);
      setLoading(false);
      setStep(6);
    }
  };

  // Handle 6-digit box changes
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      return;
    }

    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 6).split("");
      const updated = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        if (pasted[i]) updated[i] = pasted[i];
      }
      setOtpDigits(updated);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleanVal[cleanVal.length - 1];
    setOtpDigits(updated);

    if (index < 5 && cleanVal) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Final verification & account activation
  const handleVerifyGmailAndActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code sent to your Gmail.");
      return;
    }

    setLoading(true);

    const verifyResult = verifyOtpCode(formData.email, fullOtp);
    if (!verifyResult.success) {
      setError(verifyResult.message || "Invalid OTP");
      setLoading(false);
      return;
    }

    // OTP confirmed! Formally register & activate account
    try {
      const regPayload = {
        ...formData,
        total_contributions: paidTx ? paidTx.amount : isCoreAdminEmail ? 0 : REGISTRATION_FEE,
        contribution_count: paidTx ? 1 : isCoreAdminEmail ? 0 : 1,
        registration_ref: paidTx?.reference || "CORE-ADMIN-REG",
        receipt_number: paidTx?.receiptNumber || "RCT-CORE-ADM",
        status: "active",
        email_verified_at: new Date().toISOString(),
      };

      await register(regPayload);

      // Create initial Welcome & Payment Notification
      addUserNotification(
        formData.email,
        "Welcome to The Peckers Forte!",
        `Your account has been verified and activated. ₦${Number(regPayload.total_contributions).toLocaleString()} registration deposit has been credited to your ledger.`,
        "payment"
      );

      setIsAccountActivated(true);
    } catch (err: any) {
      setError(err?.message || "Failed to finalize account activation.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendRegistrationOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError("");
    try {
      await generateAndSendOtp(formData.email, `${formData.firstName} ${formData.lastName}`);
      setResendCooldown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (e) {
      setError("Failed to resend code.");
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">
          {step === 6 ? "Gmail Verification" : "Create Cooperative Account"}
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          {step === 6 ? "Final Step: Confirm Ownership of Your Gmail" : `Step ${step} of 5`}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex mb-4 space-x-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded transition-all duration-300 ${
              step >= i ? "bg-brand-blue" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isCoreAdminEmail && step < 6 && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 font-medium animate-in fade-in">
          <Sparkles size={16} className="text-brand-gold shrink-0" />
          <span>
            <strong>Core Administrator Recognized:</strong> Pre-authorized with Super Admin privileges.
          </span>
        </div>
      )}

      {/* STEP 1: Personal Details */}
      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          <h4 className="font-semibold text-sm border-b pb-2 text-gray-800">
            Personal Information
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Surname / Last Name"
              required
              placeholder="e.g. Idowu"
              value={formData.lastName}
              onChange={(e) => updateForm("lastName", e.target.value)}
            />
            <Input
              label="First Name"
              required
              placeholder="e.g. Akinola"
              value={formData.firstName}
              onChange={(e) => updateForm("firstName", e.target.value)}
            />
          </div>
          <Input
            label="Middle Name (Optional)"
            placeholder="e.g. Oluwadamilare"
            value={formData.middleName}
            onChange={(e) => updateForm("middleName", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Gender"
              options={[
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
              ]}
              value={formData.gender}
              onChange={(e) => updateForm("gender", e.target.value)}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              required
              value={formData.dob}
              onChange={(e) => updateForm("dob", e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-darkBlue text-white">
              Next Step
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: Contact Details */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          <h4 className="font-semibold text-sm border-b pb-2 text-gray-800">
            Contact Information
          </h4>
          <Input
            label="Email Address (Gmail)"
            type="email"
            required
            placeholder="e.g. yourname@gmail.com"
            value={formData.email}
            onChange={(e) => updateForm("email", e.target.value)}
          />
          <Input
            label="Phone Number"
            type="tel"
            required
            placeholder="e.g. +2348037221344"
            value={formData.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
          />
          <Input
            label="Residential Address"
            required
            placeholder="e.g. 14 Cooperative Way, Ikeja"
            value={formData.address}
            onChange={(e) => updateForm("address", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="State"
              required
              value={formData.state}
              onChange={(e) => updateForm("state", e.target.value)}
            />
            <Input
              label="LGA"
              required
              value={formData.lga}
              onChange={(e) => updateForm("lga", e.target.value)}
            />
          </div>

          <div className="flex justify-between pt-4 border-t gap-3">
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1 bg-brand-blue hover:bg-brand-darkBlue text-white">
              Next Step
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: Security & Password */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          <h4 className="font-semibold text-sm border-b pb-2 text-gray-800">
            Account Security & Password
          </h4>
          <div className="relative">
            <Input
              label="Choose Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => updateForm("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => updateForm("confirmPassword", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="p-3 bg-slate-50 border rounded-lg text-[11px] text-gray-500 space-y-1">
            <p className="flex items-center gap-1 font-semibold text-gray-700">
              <ShieldCheck size={14} className="text-emerald-600" /> Security Notice
            </p>
            <p>Your password is encrypted and accounts require individual Gmail verification.</p>
          </div>

          <div className="flex justify-between pt-4 border-t gap-3">
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1 bg-brand-blue hover:bg-brand-darkBlue text-white">
              Next Step
            </Button>
          </div>
        </form>
      )}

      {/* STEP 4: Membership Options & Next of Kin */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          <h4 className="font-semibold text-sm border-b pb-2 text-gray-800">
            Membership Options & Next of Kin
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Select Wing"
              options={[
                { value: "BOTH", label: "Both Wings (Recommended)" },
                { value: "CONTRIBUTION", label: "Contribution Wing (PMCS)" },
                { value: "INVESTMENT", label: "Investment Wing (PAP)" },
              ]}
              required
              value={formData.wing}
              onChange={(e) => updateForm("wing", e.target.value)}
            />
            <Select
              label="Category"
              options={[
                { value: "standard", label: "Standard - ₦10,000/mo" },
                { value: "premium", label: "Premium - ₦50,000/mo" },
                { value: "gold", label: "Gold - ₦100,000/mo" },
              ]}
              required
              value={formData.category}
              onChange={(e) => updateForm("category", e.target.value)}
            />
          </div>

          <Input
            label="Next of Kin Full Name"
            required
            placeholder="e.g. Oyindamola Idowu"
            value={formData.nokName}
            onChange={(e) => updateForm("nokName", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Next of Kin Phone"
              required
              placeholder="e.g. +2348037221344"
              value={formData.nokPhone}
              onChange={(e) => updateForm("nokPhone", e.target.value)}
            />
            <Input
              label="Relationship"
              required
              placeholder="e.g. Brother, Sister, Spouse"
              value={formData.nokRel}
              onChange={(e) => updateForm("nokRel", e.target.value)}
            />
          </div>

          <div className="flex justify-between pt-4 border-t gap-3">
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1 bg-brand-blue hover:bg-brand-darkBlue text-white">
              Next Step
            </Button>
          </div>
        </form>
      )}

      {/* STEP 5: Review & Mandatory ₦5,000 Registration Fee Payment */}
      {step === 5 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          <div className="text-center mb-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-1.5" />
            <h4 className="font-bold text-lg text-gray-900">Account Activation & Registration</h4>
            <p className="text-xs text-gray-500">
              Please verify your details and pay the mandatory ₦5,000 registration fee to open your account.
            </p>
          </div>

          <div className="bg-slate-50 border rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-500">Full Name:</span>
              <span className="font-bold text-gray-900">
                {formData.firstName} {formData.middleName} {formData.lastName}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-500">Email:</span>
              <span className="font-mono font-semibold">{formData.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-500">Phone:</span>
              <span>{formData.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-gray-500">Cooperative Wing:</span>
              <span className="font-semibold">{formData.wing}</span>
            </div>
          </div>

          {/* Mandatory ₦5,000 Registration Fee Section */}
          {!isCoreAdminEmail && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-900">Mandatory Registration Fee</h5>
                    <p className="text-[11px] text-gray-600">Official membership activation & ledger opening</p>
                  </div>
                </div>
                <span className="font-extrabold text-base text-emerald-800 font-mono">
                  {formatCurrency(REGISTRATION_FEE)}
                </span>
              </div>

              <div className="bg-white rounded-lg p-3 border border-emerald-100 text-xs space-y-1.5 text-gray-700">
                <div className="flex items-center gap-1.5 font-medium text-emerald-900">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span>Included with your account activation:</span>
                </div>
                <ul className="text-[11px] text-gray-600 space-y-1 pl-4 list-disc">
                  <li>Official cooperative membership number & verification</li>
                  <li>Provisioning of your personal savings and investment ledger</li>
                  <li>Credited balance: ₦5,000.00 is deposited to your ledger</li>
                  <li>Real-time receipt generated via Accelerex RexPay</li>
                </ul>
              </div>

              {paidTx ? (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                    <span>₦5,000.00 Fee Verified via Accelerex</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-800">{paidTx.receiptNumber}</span>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center gap-1.5">
                  <Lock size={13} className="text-amber-700 shrink-0" />
                  <span>Payment of ₦5,000 is required before account verification and login are granted.</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t gap-3">
            <Button type="button" variant="outline" onClick={prevStep} disabled={loading} className="flex-1">
              Back
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className={`flex-1 ${
                step === 5
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  : "bg-brand-blue hover:bg-brand-darkBlue text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </span>
              ) : paidTx || isCoreAdminEmail ? (
                "Proceed to Gmail Verification →"
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CreditCard size={16} /> Pay ₦5,000 & Continue
                </span>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* STEP 6: WAITING FOR GMAIL VERIFICATION */}
      {step === 6 && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {!isAccountActivated ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="h-14 w-14 rounded-full bg-blue-50 text-brand-blue mx-auto flex items-center justify-center shadow-sm relative">
                  <Mail size={26} />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-blue"></span>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Waiting for Gmail Verification</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Payment verified! We have sent a 6-digit confirmation code directly to your registered Gmail address:
                </p>
                <p className="font-mono font-bold text-sm text-brand-blue bg-blue-50/80 py-1.5 px-3 rounded-lg inline-block border border-blue-100">
                  {formData.email}
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-amber-700 shrink-0" />
                  <span>Check Your Inbox or Spam Folder</span>
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Enter the 6-digit code sent to <strong>{formData.email}</strong> below to confirm your account ownership.
                </p>
              </div>

              <form onSubmit={handleVerifyGmailAndActivate} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 text-center mb-3">
                    Enter the 6-Digit Code from your Gmail
                  </label>

                  {/* 6 Digit Input Boxes */}
                  <div className="flex justify-center items-center gap-2 sm:gap-3">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
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

                  <div className="flex items-center justify-between text-xs text-gray-500 mt-4 px-2">
                    <span>
                      Code expires in: <strong className="font-mono text-gray-700">{formatTimer(otpCountdown)}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={handleResendRegistrationOtp}
                      disabled={resendCooldown > 0 || loading}
                      className={`font-semibold transition ${
                        resendCooldown > 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-brand-blue hover:underline"
                      }`}
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || otpDigits.join("").length !== 6}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Verifying Code...
                    </span>
                  ) : (
                    "Verify Gmail & Activate Account →"
                  )}
                </Button>
              </form>
            </div>
          ) : (
            /* ACCOUNT ACTIVATED SUCCESS SCREEN */
            <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">Account Activated & Verified!</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Your Gmail has been verified, ₦5,000 initial balance is credited to your ledger, and your account is ready.
                </p>
              </div>

              <div className="bg-slate-50 border rounded-xl p-4 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Verified Email:</span>
                  <span className="font-mono font-semibold text-gray-900">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Initial Ledger Credit:</span>
                  <span className="font-black text-emerald-800">₦5,000.00</span>
                </div>
                {paidTx && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Reference:</span>
                    <span className="font-mono text-brand-blue">{paidTx.reference}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Status:</span>
                  <span className="font-bold text-green-700 uppercase">Active Member</span>
                </div>
              </div>

              <Link href="/dashboard">
                <Button className="w-full py-5 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold shadow-md mt-2">
                  Enter Member Dashboard →
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {step < 6 && (
        <div className="text-center text-xs text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-blue font-bold hover:underline">
            Log in here
          </Link>
        </div>
      )}

      {/* Accelerex Checkout Modal for ₦5,000 Registration Fee */}
      <AccelerexCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={REGISTRATION_FEE}
        paymentType="Membership Registration Fee"
        customerName={`${formData.firstName} ${formData.lastName}`.trim() || formData.email}
        customerEmail={formData.email.trim()}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
