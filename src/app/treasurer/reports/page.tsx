"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-muted-foreground">Generate and export financial statements</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Select 
              label="Report Type" 
              options={[
                { value: "", label: "Select Report Type" },
                { value: "income", label: "Income Statement" },
                { value: "balance", label: "Balance Sheet" },
                { value: "collections", label: "Collections Report" },
                { value: "defaulters", label: "Defaulters List" }
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            />
            
            <Select 
              label="Wing / Department" 
              options={[
                { value: "all", label: "All Wings (Consolidated)" },
                { value: "contribution", label: "Contribution Wing (PMCS)" },
                { value: "investment", label: "Investment Wing (PAP)" }
              ]}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Start Date" type="date" />
            <Input label="End Date" type="date" />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button className="flex items-center gap-2">
              Generate PDF <Download size={16} />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              Export to Excel <Download size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
