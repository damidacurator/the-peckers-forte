import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Reset your password</h3>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-6">
        <Input label="Email address" type="email" required />
        <Button className="w-full">Send Reset Link</Button>
      </form>
      
      <div className="text-center text-sm">
        <Link href="/login" className="text-brand-blue font-medium hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
