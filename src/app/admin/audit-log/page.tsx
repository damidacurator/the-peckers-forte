"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  UserPlus,
  CreditCard,
  Send,
  ShieldAlert,
  Clock,
  RefreshCw,
  Filter
} from "lucide-react";
import { getAuditLogs, AuditLogEntry } from "@/lib/members";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const handleRefresh = () => {
    setLogs(getAuditLogs());
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q) ||
      log.user_email?.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.ip.includes(q);

    const matchesFilter = filterType === "all" || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System & User Audit Logs</h1>
          <p className="text-sm text-muted-foreground">
            Immutable live audit trail tracking new account registrations, financial contributions, and gateway events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs"
          >
            <RefreshCw size={13} /> Refresh Activity Logs
          </Button>
          <Badge variant="outline" className="font-mono text-xs">
            {logs.length} Total Events
          </Badge>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: "all", label: "All Logs" },
            { id: "account_creation", label: "Account Registrations" },
            { id: "payment", label: "Contribution Payments" },
            { id: "system", label: "System Events" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                filterType === tab.id
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activity logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs bg-white"
          />
        </div>
      </div>

      {/* Logs Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b text-gray-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Event / Action</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Activity Description</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-32 text-center text-muted-foreground">
                      No matching audit log records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Action & Type Icon */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              log.type === "account_creation"
                                ? "bg-purple-100 text-purple-700"
                                : log.type === "payment"
                                ? "bg-emerald-100 text-emerald-700"
                                : log.type === "payout"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-brand-blue"
                            }`}
                          >
                            {log.type === "account_creation" && <UserPlus size={14} />}
                            {log.type === "payment" && <CreditCard size={14} />}
                            {log.type === "payout" && <Send size={14} />}
                            {log.type === "system" && <FileText size={14} />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-xs">{log.action}</p>
                            <span
                              className={`text-[10px] uppercase font-mono font-semibold ${
                                log.type === "account_creation"
                                  ? "text-purple-700"
                                  : log.type === "payment"
                                  ? "text-emerald-700"
                                  : "text-slate-500"
                              }`}
                            >
                              {log.type.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-900">{log.user}</p>
                        {log.user_email && (
                          <p className="text-[10px] text-gray-400 font-mono">{log.user_email}</p>
                        )}
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-gray-700 leading-relaxed">{log.details}</p>
                      </td>

                      {/* IP */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                        {log.ip}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-right text-gray-500 text-[11px]">
                        <span className="font-medium text-gray-800">
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                        <br />
                        <span className="text-[10px]">{new Date(log.date).toLocaleTimeString()}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
