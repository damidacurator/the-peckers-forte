"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function PostChargesPage() {
  const [target, setTarget] = useState("");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post Charges</h1>
        <p className="text-muted-foreground">Debit members' ledgers for levies, fees, or contributions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Charge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Select 
              label="Charge Type" 
              options={[
                { value: "", label: "Select Type" },
                { value: "monthly", label: "Monthly Contribution (Automated)" },
                { value: "levy", label: "Special Levy" },
                { value: "fine", label: "Late Payment Fine" },
                { value: "registration", label: "Registration Fee" }
              ]}
            />
            
            <Input label="Amount (₦)" type="number" placeholder="0.00" />
          </div>

          <Select 
            label="Target Audience" 
            options={[
              { value: "", label: "Select Target" },
              { value: "all", label: "All Members" },
              { value: "wing_c", label: "Contribution Wing Members Only" },
              { value: "wing_i", label: "Investment Wing Members Only" },
              { value: "individual", label: "Specific Member(s)" }
            ]}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />

          {target === "individual" && (
            <Input label="Member IDs (comma separated)" placeholder="e.g. M001, M045" />
          )}

          <Textarea label="Description / Narration" placeholder="Enter reason for this charge" />

          <div className="pt-4 border-t flex justify-end">
            <Button size="lg" className="w-full md:w-auto">Post Charge to Ledgers</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
