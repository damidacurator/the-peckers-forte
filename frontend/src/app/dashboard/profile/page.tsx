"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function ProfilePage() {
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
              <Avatar fallback="JD" size="lg" className="h-24 w-24 mb-4 text-2xl" />
              <h3 className="font-bold text-lg">John Doe</h3>
              <p className="text-sm text-gray-500 mb-4">PMCS-0102</p>
              <Button variant="outline" size="sm" className="w-full">Change Photo</Button>
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
                <Input label="First Name" defaultValue="John" />
                <Input label="Last Name" defaultValue="Doe" />
              </div>
              <Input label="Email Address" defaultValue="john.doe@example.com" disabled />
              <Input label="Phone Number" defaultValue="+234 800 123 4567" />
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next of Kin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Full Name" defaultValue="Jane Doe" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone" defaultValue="+234 800 987 6543" />
                <Input label="Relationship" defaultValue="Spouse" />
              </div>
              <Button>Update Next of Kin</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
