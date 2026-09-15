"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function RolesPage() {
  const roles = [
    { name: "ADMIN", desc: "Full system access", count: 2 },
    { name: "SECRETARY", desc: "Member and approval management", count: 2 },
    { name: "TREASURER", desc: "Financial operations and ledgers", count: 2 },
    { name: "MEMBER", desc: "Standard cooperative member", count: 524 },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-muted-foreground">Define access control policies</p>
        </div>
        <Button>Create Role</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((role, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center gap-2"><Shield size={18} /> {role.name}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">{role.count} users</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-sm text-gray-600">{role.desc}</p>
              <Button variant="outline" size="sm" className="w-full">Manage Permissions</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
