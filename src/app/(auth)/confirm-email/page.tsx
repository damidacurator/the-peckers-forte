"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function ConfirmEmailContent() {
  return (
    <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
        <CheckCircle2 size={36} />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Email Verified Successfully!</h3>
        <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
          Your Gmail address has been officially confirmed. Your cooperative account and ledger are now fully active.
        </p>
      </div>

      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1.5 text-left max-w-sm mx-auto">
        <div className="flex items-center gap-1.5 font-bold text-emerald-950">
          <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
          <span>Account Verification Confirmed</span>
        </div>
        <p className="text-[11px] text-emerald-800">
          You may now sign in using your verified email address and password with two-step security.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/login">
          <Button className="w-full py-5 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold shadow-md text-sm flex items-center justify-center gap-2">
            Proceed to Sign In <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
