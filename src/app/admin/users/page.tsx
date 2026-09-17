"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  Search,
  TrendingUp,
  Receipt,
  UserCheck,
  ShieldCheck,
  Calendar,
  Sparkles,
  ExternalLink,
  Wallet
} from "lucide-react";
import { getAllRegisteredMembers, MemberAccount } from "@/lib/members";
import { getStoredTransactions, GatewayTransaction } from "@/lib/accelerex";

export default function AdminUsersPage() {
  const [members, setMembers] = useState<MemberAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberAccount | null>(null);
  const [memberTransactions, setMemberTransactions] = useState<GatewayTransaction[]>([]);

  useEffect(() => {
    setMembers(getAllRegisteredMembers());
  }, []);

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.full_name?.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.membership_number?.toLowerCase().includes(q)
    );
  });

  const totalCollectedAcrossAll = members.reduce(
    (sum, m) => sum + (Number(m.total_contributions) || 0),
    0
  );

  const handleOpenMemberLedger = (m: MemberAccount) => {
    setSelectedMember(m);
    const allTxs = getStoredTransactions();
    const userTxs = allTxs.filter(
      (tx) =>
        tx.customerEmail.toLowerCase() === m.email.toLowerCase() ||
        tx.customerName.toLowerCase() === m.full_name.toLowerCase()
    );
    setMemberTransactions(userTxs);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Accounts & Contributions</h1>
          <p className="text-sm text-muted-foreground">
            Audit all registered cooperative accounts and monitor their cumulative financial contributions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 font-mono text-xs">
            {members.length} Registered Accounts
          </Badge>
        </div>
      </div>

      {/* Aggregate Financial Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-t-4 border-t-brand-blue shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue">
              <Users size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Total Registered Accounts</p>
              <h3 className="text-2xl font-bold text-gray-900">{members.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-emerald-500 shadow-sm bg-emerald-50/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Total Contributions Collected</p>
              <h3 className="text-2xl font-black text-emerald-800">{formatCurrency(totalCollectedAcrossAll)}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-brand-gold shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 bg-brand-gold/10 rounded-xl text-brand-darkBlue">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Avg Contribution / Member</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(members.length > 0 ? totalCollectedAcrossAll / members.length : 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Members Table with Contributions Next to Name */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div>
            <CardTitle className="text-base">Cooperative Member Roster</CardTitle>
            <CardDescription className="text-xs">
              Every registered user with their live cumulative contribution balance.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs bg-slate-50"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b text-gray-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-3">Member Details</th>
                  <th className="py-3 px-3">Total Contribution Paid</th>
                  <th className="py-3 px-3">Membership ID</th>
                  <th className="py-3 px-3">Wing</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Registered</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-32 text-center text-muted-foreground">
                      No matching member accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs">
                            {m.first_name?.[0]?.toUpperCase() || m.email[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-xs leading-none">
                              {m.full_name}
                            </p>
                            <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                              {m.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* TOTAL CONTRIBUTION PAID (PROMINENTLY HIGHLIGHTED NEXT TO NAME) */}
                      <td className="py-3 px-3">
                        {(m.total_contributions || 0) > 0 ? (
                          <div className="inline-block bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 text-emerald-900">
                            <p className="font-black text-xs text-emerald-800">
                              {formatCurrency(m.total_contributions)}
                            </p>
                            <p className="text-[10px] text-emerald-700 font-medium">
                              {m.contribution_count || 1} deposit{m.contribution_count === 1 ? "" : "s"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs font-mono">
                            ₦0.00 (No contributions)
                          </span>
                        )}
                      </td>

                      {/* Membership ID */}
                      <td className="py-3 px-3 font-mono font-bold text-brand-blue">
                        {m.membership_number}
                      </td>

                      {/* Wing */}
                      <td className="py-3 px-3 uppercase font-semibold text-gray-700 text-[11px]">
                        {m.wing}
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.roles?.includes("Super Admin") || m.roles?.includes("ADMIN")
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-brand-blue"
                          }`}
                        >
                          {m.roles?.[0] || "Member"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase">
                          {m.status || "active"}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3 px-3 text-gray-500 text-[11px]">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleOpenMemberLedger(m)}
                          className="text-xs font-semibold text-brand-blue hover:text-brand-darkBlue hover:underline flex items-center gap-1 ml-auto"
                        >
                          <Receipt size={13} /> View Ledger
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MEMBER CONTRIBUTIONS AUDIT MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">{selectedMember.full_name}</h3>
                <p className="text-xs text-gray-500 font-mono">{selectedMember.membership_number} • {selectedMember.email}</p>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Total Balance Hero */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-200 uppercase font-semibold">Total Verified Contributions</p>
                <h2 className="text-2xl font-black text-white">{formatCurrency(selectedMember.total_contributions || 0)}</h2>
              </div>
              <div className="p-2.5 bg-white/10 rounded-lg">
                <TrendingUp size={24} className="text-emerald-300" />
              </div>
            </div>

            {/* Past Payment Entries */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                Transaction History ({memberTransactions.length})
              </h4>
              {memberTransactions.length === 0 ? (
                <div className="p-6 border border-dashed rounded-xl text-center text-xs text-gray-400">
                  No individual payment transactions logged for this member yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {memberTransactions.map((tx) => (
                    <div key={tx.id} className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-900">{tx.type}</span>
                        <span className="text-emerald-700">+{formatCurrency(tx.amount)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span className="font-mono">{tx.reference} • {tx.channel}</span>
                        <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => setSelectedMember(null)}
              className="w-full bg-brand-blue hover:bg-brand-darkBlue text-white"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
