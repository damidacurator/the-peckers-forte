"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  Check,
  CheckCircle2,
  X,
  UserPlus,
  Lock,
  Sliders,
  Sparkles,
  AlertCircle,
  Search,
  Wallet,
  FileText,
  Building
} from "lucide-react";
import {
  SYSTEM_ROLES,
  ALL_PERMISSIONS,
  SystemRole,
  PermissionDefinition,
  getRolePermissions,
  saveRolePermissions,
  assignUserRole
} from "@/lib/roles";
import { getAllRegisteredMembers, MemberAccount } from "@/lib/members";
import { useAuth } from "@/lib/auth";

export default function RolesPage() {
  const { user: currentAdmin } = useAuth();
  const [members, setMembers] = useState<MemberAccount[]>([]);
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [editPermissionsRole, setEditPermissionsRole] = useState<SystemRole | null>(null);
  const [rolePermsState, setRolePermsState] = useState<{ [roleKey: string]: string[] }>({});
  const [assignModalRole, setAssignModalRole] = useState<SystemRole | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load registered members and role permissions
  const loadData = () => {
    const mems = getAllRegisteredMembers();
    setMembers(mems);

    const initialPerms: { [roleKey: string]: string[] } = {};
    SYSTEM_ROLES.forEach((r) => {
      initialPerms[r.key] = getRolePermissions(r.key);
    });
    setRolePermsState(initialPerms);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Helper to filter members assigned to a specific role
  const getMembersInRole = (roleKey: string) => {
    return members.filter((m) => {
      if (roleKey === "Super Admin") {
        return m.roles?.includes("Super Admin") || m.roles?.includes("ADMIN");
      }
      return m.roles?.includes(roleKey);
    });
  };

  // Toggle permission in modal
  const handleTogglePermission = (permId: string) => {
    if (!editPermissionsRole) return;
    const currentList = rolePermsState[editPermissionsRole.key] || [];
    const exists = currentList.includes(permId);
    const updated = exists
      ? currentList.filter((id) => id !== permId)
      : [...currentList, permId];

    setRolePermsState((prev) => ({
      ...prev,
      [editPermissionsRole.key]: updated,
    }));
  };

  // Save permission configuration
  const handleSavePermissions = () => {
    if (!editPermissionsRole) return;
    const permsToSave = rolePermsState[editPermissionsRole.key] || [];
    saveRolePermissions(editPermissionsRole.key, permsToSave);
    showNotification(`Permissions saved for role: ${editPermissionsRole.name}`);
    setEditPermissionsRole(null);
  };

  // Assign user to a role
  const handleAssignUser = (userEmail: string, roleKey: string) => {
    const res = assignUserRole(userEmail, roleKey, {
      name: currentAdmin?.email || "Executive Administrator",
      email: currentAdmin?.email || "admin@thepeckerfortelp.com",
    });

    if (res.success) {
      loadData();
      showNotification(res.message, "success");
      setAssignModalRole(null);
    } else {
      showNotification(res.message, "error");
    }
  };

  // Revoke user role (revert to Ordinary Member)
  const handleRevokeRole = (userEmail: string, roleName: string) => {
    if (confirm(`Are you sure you want to remove this account from the ${roleName} role?`)) {
      const res = assignUserRole(userEmail, "Ordinary Member", {
        name: currentAdmin?.email || "Executive Administrator",
        email: currentAdmin?.email || "admin@thepeckerfortelp.com",
      });
      if (res.success) {
        loadData();
        showNotification(`Revoked ${roleName} status. Account reverted to Ordinary Member.`);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role & Permission Management</h1>
          <p className="text-sm text-muted-foreground">
            Configure access controls and designate accounts as Treasurer, Secretary, Executive, or Admin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 font-mono text-xs">
            {SYSTEM_ROLES.length} System Roles
          </Badge>
          <Badge variant="outline" className="px-3 py-1 font-mono text-xs bg-blue-50 text-brand-blue border-blue-200">
            {ALL_PERMISSIONS.length} Permissions
          </Badge>
        </div>
      </div>

      {/* Notification toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 shadow-sm animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Roles Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SYSTEM_ROLES.map((role) => {
          const membersInRole = getMembersInRole(role.key);
          const activePerms = rolePermsState[role.key] || role.defaultPermissions;

          return (
            <Card key={role.key} className="shadow-sm border flex flex-col justify-between hover:shadow-md transition">
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-white border shadow-xs text-brand-blue">
                      {role.key === "Treasurer" ? (
                        <Wallet size={18} className="text-emerald-700" />
                      ) : role.key === "Secretary" ? (
                        <FileText size={18} className="text-blue-700" />
                      ) : role.key === "Executive" ? (
                        <Building size={18} className="text-purple-700" />
                      ) : (
                        <Shield size={18} />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-gray-900">{role.name}</CardTitle>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${role.badgeColor}`}>
                        {role.isExecutive ? "Executive Role" : "General Membership"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-white border px-2.5 py-1 rounded-full font-bold text-gray-700 font-mono shadow-2xs">
                    {membersInRole.length} account{membersInRole.length === 1 ? "" : "s"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{role.description}</p>

                  {/* Active Permissions Summary */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border text-xs space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
                      <span>Permissions Granted</span>
                      <span className="font-mono text-brand-blue">{activePerms.length} / {ALL_PERMISSIONS.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {activePerms.slice(0, 3).map((pId) => {
                        const def = ALL_PERMISSIONS.find((p) => p.id === pId);
                        return (
                          <span key={pId} className="text-[9px] bg-white border px-1.5 py-0.5 rounded text-gray-600">
                            {def?.name || pId}
                          </span>
                        );
                      })}
                      {activePerms.length > 3 && (
                        <span className="text-[9px] text-gray-400 self-center">
                          +{activePerms.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Assigned Accounts Roster */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                      <span>Assigned Accounts ({membersInRole.length})</span>
                      {role.key !== "Ordinary Member" && (
                        <button
                          type="button"
                          onClick={() => setAssignModalRole(role)}
                          className="text-brand-blue hover:text-brand-darkBlue hover:underline flex items-center gap-1 normal-case font-semibold text-xs"
                        >
                          <UserPlus size={12} /> Assign Account
                        </button>
                      )}
                    </div>

                    {membersInRole.length === 0 ? (
                      <div className="p-2.5 rounded-lg border border-dashed text-center text-[11px] text-muted-foreground bg-slate-50">
                        No accounts currently assigned as {role.name}.
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                        {membersInRole.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border text-xs shadow-2xs hover:bg-slate-50 transition"
                          >
                            <div className="truncate pr-2">
                              <p className="font-bold text-gray-900 leading-tight truncate">{m.full_name}</p>
                              <p className="text-[10px] text-gray-500 font-mono truncate">{m.email}</p>
                            </div>
                            {role.key !== "Super Admin" && (
                              <button
                                type="button"
                                onClick={() => handleRevokeRole(m.email, role.name)}
                                title="Remove from role"
                                className="text-gray-400 hover:text-red-600 p-1 rounded transition shrink-0"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Role Actions */}
                <div className="pt-3 border-t mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditPermissionsRole(role)}
                    className="flex-1 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Sliders size={13} /> Manage Permissions
                  </Button>
                  {role.key !== "Ordinary Member" && (
                    <Button
                      size="sm"
                      onClick={() => setAssignModalRole(role)}
                      className="bg-brand-blue hover:bg-brand-darkBlue text-white text-xs font-bold flex items-center justify-center gap-1 px-3"
                    >
                      <UserPlus size={13} /> Assign
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MANAGE PERMISSIONS MODAL */}
      {editPermissionsRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue">
                  <Sliders size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">
                    Permissions: {editPermissionsRole.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Toggle capabilities and authorization rights for this role.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditPermissionsRole(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Permissions List */}
            <div className="overflow-y-auto flex-1 space-y-3 pr-1 py-2">
              {["Administration", "Financial", "Secretariat", "System"].map((category) => {
                const permsInCat = ALL_PERMISSIONS.filter((p) => p.category === category);
                if (permsInCat.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b pb-1">
                      {category} Capabilities
                    </h4>
                    <div className="grid gap-2">
                      {permsInCat.map((perm) => {
                        const isGranted = (
                          rolePermsState[editPermissionsRole.key] || []
                        ).includes(perm.id);

                        return (
                          <label
                            key={perm.id}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                              isGranted
                                ? "bg-blue-50/60 border-brand-blue/40"
                                : "bg-white border-gray-200 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isGranted}
                              onChange={() => handleTogglePermission(perm.id)}
                              className="mt-0.5 h-4 w-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                {perm.name}
                              </p>
                              <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                                {perm.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="border-t pt-3 flex justify-between items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditPermissionsRole(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSavePermissions}
                className="bg-brand-blue hover:bg-brand-darkBlue text-white font-bold"
              >
                Save Permissions
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN USER MODAL (Choose account as Treasurer, Secretary, Executive, etc.) */}
      {assignModalRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3 shrink-0">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Assign Account to: {assignModalRole.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select an account from the registered member directory to grant executive privileges.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalRole(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search member by name, email, or ID..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {/* Member Directory List */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {members
                .filter((m) => {
                  const q = memberSearch.toLowerCase();
                  return (
                    m.full_name?.toLowerCase().includes(q) ||
                    m.email?.toLowerCase().includes(q) ||
                    m.membership_number?.toLowerCase().includes(q)
                  );
                })
                .map((m) => {
                  const isCurrentlyInRole = (m.roles || []).includes(assignModalRole.key);

                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border bg-white flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                    >
                      <div className="truncate">
                        <p className="font-bold text-xs text-gray-900 truncate">{m.full_name}</p>
                        <p className="text-[11px] text-gray-500 font-mono truncate">{m.email}</p>
                        <span className="text-[10px] text-brand-blue font-semibold">
                          ID: {m.membership_number} • Current Role: {m.roles?.[0] || "Ordinary Member"}
                        </span>
                      </div>

                      {isCurrentlyInRole ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                          <Check size={12} /> Assigned
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAssignUser(m.email, assignModalRole.key)}
                          className="bg-brand-blue hover:bg-brand-darkBlue text-white text-xs font-bold shrink-0"
                        >
                          Choose as {assignModalRole.key}
                        </Button>
                      )}
                    </div>
                  );
                })}

              {members.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No member accounts available.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t pt-3 flex justify-end shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssignModalRole(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
