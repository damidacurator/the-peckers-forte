"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, CORE_ADMIN_EMAILS } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Eye, EyeOff, Loader2, KeyRound, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLoginSubmit = async (loginEmail: string, loginPass: string) => {
    setError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPass);
      if (CORE_ADMIN_EMAILS.includes(loginEmail.trim().toLowerCase())) {
        router.push("/admin/gateway");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "Invalid email or password. Please check your credentials.";
      setError(msg);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginSubmit(email, password);
  };

  const handleQuickAdminLogin = (adminEmail: string) => {
    setEmail(adminEmail);
    setPassword("Admin@2026!");
    handleLoginSubmit(adminEmail, "Admin@2026!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Sign in to your account</h3>
        <p className="mt-1 text-sm text-gray-600">
          Or{" "}
          <Link href="/register" className="font-bold text-brand-blue hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      {/* Core Administrator 1-Click Login Helper */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-brand-darkBlue via-[#0F172A] to-brand-blue text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider">
            <Sparkles size={15} /> Core Administrator Quick Access
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
            Super Admin
          </span>
        </div>
        <p className="text-xs text-slate-300">
          Sign into the master administrative account to view payment gateway controls, test keys, and dispatch payouts.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickAdminLogin("admin@thepeckersforte.com")}
            disabled={loading}
            className="flex-1 py-2 px-3 bg-brand-gold text-brand-darkBlue rounded-lg text-xs font-bold hover:bg-yellow-400 transition flex items-center justify-center gap-1.5 shadow"
          >
            <KeyRound size={14} /> Log in as admin@thepeckersforte.com
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-medium animate-in fade-in">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email address"
          type="email"
          required
          placeholder="e.g. member@thepeckersfortelp.com"
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
              defaultChecked
              className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-gray-700">
              Remember me
            </label>
          </div>

          <Link href="/forgot-password" className="font-semibold text-brand-blue hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full py-5 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Authenticating...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  );
}
