"use client";

import React, { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Activity,
  Shield,
  CreditCard,
  TrendingUp,
  ArrowRight,
  UserPlus,
  Zap,
  Send
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { getAllRegisteredMembers, getAuditLogs, MemberAccount, AuditLogEntry } from "@/lib/members";

export default function AdminDashboard() {
  const [members, setMembers] = useState<MemberAccount[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setMembers(getAllRegisteredMembers());
    setLogs(getAuditLogs());
  }, []);

  const totalContributions = members.reduce(
    (sum, m) => sum + (Number(m.total_contributions) || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Administrative Console</h1>
          <p className="text-sm text-muted-foreground">
            Central command for user accounts, cumulative member contributions, and payment gateway infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button className="bg-brand-blue hover:bg-brand-darkBlue text-white text-xs font-bold flex items-center gap-1.5">
              <Users size={14} /> View All Members ({members.length})
            </Button>
          </Link>
          <Link href="/admin/gateway">
            <Button variant="outline" className="border-brand-blue/30 text-brand-blue text-xs font-bold flex items-center gap-1.5">
              <Zap size={14} /> Gateway Console
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registered Accounts"
          value={String(members.length)}
          icon={<Users className="h-6 w-6 text-brand-blue" />}
          trend="up"
          changeText="Registered cooperative members"
        />
        <StatCard
          title="Total Contributions Collected"
          value={formatCurrency(totalContributions)}
          icon={<TrendingUp className="h-6 w-6 text-emerald-600" />}
          trend="up"
          changeText="All verified member deposits"
        />
        <StatCard
          title="Payment Switch Engine"
          value="Accelerex"
          icon={<CreditCard className="h-6 w-6 text-indigo-600" />}
          trend="neutral"
          changeText="RexPay PGS Gateway Active"
        />
        <StatCard
          title="Recent System Events"
          value={String(logs.length)}
          icon={<Activity className="h-6 w-6 text-amber-600" />}
          trend="neutral"
          changeText="Live audit log entries"
        />
      </div>

      {/* Quick Access Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/admin/users" className="block group">
          <Card className="hover:border-brand-blue/50 hover:shadow-md transition cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Member Accounts</h4>
                  <p className="text-xs text-gray-500">Inspect individual contributions</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-brand-blue group-hover:translate-x-0.5 transition" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/transfers" className="block group">
          <Card className="hover:border-emerald-500/50 hover:shadow-md transition cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Send size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Outward Disbursements</h4>
                  <p className="text-xs text-gray-500">Pay into Nigerian bank accounts</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/gateway" className="block group">
          <Card className="hover:border-amber-500/50 hover:shadow-md transition cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">API Key Test Console</h4>
                  <p className="text-xs text-gray-500">Sandbox testing & credentials</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Split Tables: Recent Members & Recent Activity Logs */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Recent Member Accounts & Contributions */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Registered Members & Contributions</CardTitle>
                <CardDescription className="text-xs">
                  Real-time member accounts with cumulative savings
                </CardDescription>
              </div>
              <Link href="/admin/users" className="text-xs font-bold text-brand-blue hover:underline">
                View All →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b text-gray-600 uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Member</th>
                      <th className="py-2.5 px-3">Contribution Paid</th>
                      <th className="py-2.5 px-3">Membership ID</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {members.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="h-28 text-center text-muted-foreground text-xs">
                          No member accounts registered yet.
                        </td>
                      </tr>
                    ) : (
                      members.slice(0, 5).map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-gray-900 leading-none">{m.full_name}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{m.email}</p>
                          </td>
                          <td className="py-2.5 px-3 font-black text-emerald-800">
                            {formatCurrency(m.total_contributions || 0)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-brand-blue">
                            {m.membership_number}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase">
                              {m.status}
                            </span>
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

        {/* Recent Audit Logs */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Live Activity Log</CardTitle>
                <CardDescription className="text-xs">
                  Account registrations and transaction events
                </CardDescription>
              </div>
              <Link href="/admin/audit-log" className="text-xs font-bold text-brand-blue hover:underline">
                Full Log →
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {logs.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No activity logs recorded yet.
                </div>
              ) : (
                logs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        {log.type === "account_creation" && <UserPlus size={12} className="text-purple-600" />}
                        {log.type === "payment" && <CreditCard size={12} className="text-emerald-600" />}
                        {log.action}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">{log.details}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
