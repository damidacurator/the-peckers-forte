"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
  const { user, member } = useAuth();

  const initials = (member?.first_name?.[0] || "U") + (member?.surname?.[0] || "");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal and contact information</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-brand-gold text-white flex items-center justify-center font-bold text-3xl mb-4 shadow-md">
                {initials}
              </div>
              <h3 className="font-bold text-lg text-gray-900">
                {member?.full_name || user?.email || "Member"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {member?.membership_number || "TPF-0000"}
              </p>
              <div className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full uppercase">
                {member?.status || "ACTIVE"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" defaultValue={member?.first_name || ""} />
                <Input label="Surname" defaultValue={member?.surname || ""} />
              </div>
              <Input label="Email Address" defaultValue={user?.email || ""} disabled />
              <Input label="Membership Number" defaultValue={member?.membership_number || ""} disabled />
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
