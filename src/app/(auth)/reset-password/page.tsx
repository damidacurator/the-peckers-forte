import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Set new password</h3>
        <p className="mt-2 text-sm text-gray-600">
          Please enter your new password below.
        </p>
      </div>

      <form className="space-y-6">
        <Input label="New Password" type="password" required />
        <Input label="Confirm New Password" type="password" required />
        <Button className="w-full">Update Password</Button>
      </form>
      
      <div className="text-center text-sm">
        <Link href="/login" className="text-brand-blue font-medium hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
