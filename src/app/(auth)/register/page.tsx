"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CheckCircle2, ShieldCheck, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useAuth, CORE_ADMIN_EMAILS } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      nextStep();
      return;
    }

    // Step 5: Final submission
    setError("");
    setLoading(true);

    try {
      await register(formData);
      // If core admin, redirect to admin dashboard; otherwise member dashboard
      if (isCoreAdminEmail) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Create Cooperative Account</h3>
        <p className="mt-1 text-sm text-gray-600">Step {step} of 5</p>
      </div>

      {/* Progress Bar */}
      <div className="flex mb-4 space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded transition-all duration-300 ${
              step >= i ? "bg-brand-blue" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in">
          {error}
        </div>
      )}

      {isCoreAdminEmail && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 font-medium animate-in fade-in">
          <Sparkles size={16} className="text-brand-gold shrink-0" />
          <span>
            <strong>Core Administrator Recognized:</strong> This account will be provisioned with full Super Admin, Payout & Gateway privileges.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
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
          </div>
        )}

        {/* STEP 2: Contact Details */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="font-semibold text-sm border-b pb-2 text-gray-800">
              Contact Information
            </h4>
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. admin@thepeckerfortelp.com"
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
          </div>
        )}

        {/* STEP 3: Security & Password */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
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
                <ShieldCheck size={14} className="text-emerald-600" /> Security Guarantee
              </p>
              <p>Your password is encrypted and accounts are provisioned with instant access.</p>
            </div>
          </div>
        )}

        {/* STEP 4: Membership Options & Next of Kin */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
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
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-lg text-gray-900">Review & Confirm</h4>
              <p className="text-xs text-gray-500">
                Please verify your details below to activate your account.
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
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Account Role:</span>
                <span className="font-bold text-brand-blue">
                  {isCoreAdminEmail ? "Super Admin & Executive" : "Active Member"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center">
              By clicking Submit, your account will be activated immediately without delays.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t gap-3">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={loading}
              className="flex-1"
            >
              Back
            </Button>
          ) : (
            <div className="flex-1" />
          )}

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
                <Loader2 size={16} className="animate-spin" /> Creating Account...
              </span>
            ) : step === 5 ? (
              "Submit & Sign In"
            ) : (
              "Next Step"
            )}
          </Button>
        </div>
      </form>

      <div className="text-center text-xs text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-blue font-bold hover:underline">
          Log in here
        </Link>
      </div>
    </div>
  );
}
