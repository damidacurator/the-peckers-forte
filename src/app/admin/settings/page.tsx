"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-muted-foreground">Configure global platform parameters</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Platform Name" defaultValue="THE PECKERS FORTE" />
          <Input label="Contact Email" defaultValue="admin@thepeckerfortelp.com" />
          <Input label="WhatsApp / Phone Number" defaultValue="+2348037221344" />
          <Input label="Registration Fee (₦)" type="number" defaultValue="5000" />
          <div className="pt-4">
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
