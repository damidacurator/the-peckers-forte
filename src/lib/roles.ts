// Role & Permission Management Utility for The Peckers Forte
import { getAllRegisteredMembers, saveRegisteredMembers, logAuditEvent, USERS_STORAGE_KEY } from "./members";

export interface PermissionDefinition {
  id: string;
  name: string;
  description: string;
  category: "Administration" | "Financial" | "Secretariat" | "System";
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  {
    id: "manage_users",
    name: "Manage User Accounts",
    description: "View, audit, activate, and suspend member accounts.",
    category: "Administration",
  },
  {
    id: "manage_roles",
    name: "Manage Roles & Permissions",
    description: "Assign executive roles (Treasurer, Secretary, Executive) and edit permission matrices.",
    category: "Administration",
  },
  {
    id: "view_finances",
    name: "View Financial Ledgers & Collections",
    description: "Inspect total member contributions, revenue balances, and financial summaries.",
    category: "Financial",
  },
  {
    id: "post_charges",
    name: "Post Charges & Dues",
    description: "Levy cooperative dues, fines, loan repayments, and special development fees.",
    category: "Financial",
  },
  {
    id: "payout_transfers",
    name: "Authorize Disbursements / Payouts",
    description: "Initiate and approve outward transfers to Nigerian bank accounts via payment switch.",
    category: "Financial",
  },
  {
    id: "manage_gateway",
    name: "Manage Payment Switch Gateway",
    description: "Configure Accelerex PGS credentials, test sandbox transactions, and switch modes.",
    category: "System",
  },
  {
    id: "member_approvals",
    name: "Approve Member Registrations",
    description: "Screen, verify, and approve pending cooperative membership applications.",
    category: "Secretariat",
  },
  {
    id: "broadcast_announcements",
    name: "Publish Announcements",
    description: "Broadcast system announcements, general meeting notices, and updates.",
    category: "Secretariat",
  },
  {
    id: "view_audit_logs",
    name: "View Live System Audit Logs",
    description: "Audit security events, administrative logins, and critical transaction activities.",
    category: "System",
  },
];

export interface SystemRole {
  key: string;
  name: string;
  description: string;
  badgeColor: string;
  isExecutive: boolean;
  defaultPermissions: string[];
}

export const SYSTEM_ROLES: SystemRole[] = [
  {
    key: "Super Admin",
    name: "Super Administrator / ADMIN",
    description: "Full, unrestricted system governance, security controls, gateway settings, and user permissions.",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    isExecutive: true,
    defaultPermissions: ALL_PERMISSIONS.map((p) => p.id),
  },
  {
    key: "Treasurer",
    name: "Treasurer",
    description: "Oversees financial disbursements, collection ledgers, dues, outstanding charges, and monetary reports.",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    isExecutive: true,
    defaultPermissions: [
      "view_finances",
      "post_charges",
      "payout_transfers",
      "view_audit_logs",
      "broadcast_announcements",
    ],
  },
  {
    key: "Secretary",
    name: "Secretary",
    description: "Manages cooperative communications, member directory, registration approvals, and official announcements.",
    badgeColor: "bg-blue-100 text-brand-blue border-blue-200",
    isExecutive: true,
    defaultPermissions: [
      "manage_users",
      "member_approvals",
      "broadcast_announcements",
      "view_audit_logs",
    ],
  },
  {
    key: "Executive",
    name: "Executive / Board Member",
    description: "Executive oversight, strategic reviews, member directory auditing, and high-level financial tracking.",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    isExecutive: true,
    defaultPermissions: [
      "view_finances",
      "manage_users",
      "broadcast_announcements",
      "view_audit_logs",
    ],
  },
  {
    key: "Ordinary Member",
    name: "Ordinary Member",
    description: "Standard cooperative member with access to personal dashboard, payments, contribution ledger, and profile.",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    isExecutive: false,
    defaultPermissions: [],
  },
];

const PERMISSIONS_STORAGE_KEY = "tpf_role_permissions";

export function getRolePermissions(roleKey: string): string[] {
  if (typeof window === "undefined") {
    const found = SYSTEM_ROLES.find((r) => r.key.toLowerCase() === roleKey.toLowerCase());
    return found ? found.defaultPermissions : [];
  }
  try {
    const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (stored[roleKey] && Array.isArray(stored[roleKey])) {
        return stored[roleKey];
      }
    }
  } catch (e) {}

  const found = SYSTEM_ROLES.find((r) => r.key.toLowerCase() === roleKey.toLowerCase());
  return found ? found.defaultPermissions : [];
}

export function saveRolePermissions(roleKey: string, permissions: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    existing[roleKey] = permissions;
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(existing));

    logAuditEvent(
      "Role Permissions Updated",
      "System Administrator",
      "admin@thepeckerfortelp.com",
      `Permissions updated for role "${roleKey}": [${permissions.join(", ")}]`,
      "security"
    );
  } catch (e) {
    console.error("Failed to save role permissions:", e);
  }
}

export function assignUserRole(
  userEmail: string,
  newRole: string,
  assignedBy: { name: string; email: string } = {
    name: "System Administrator",
    email: "admin@thepeckerfortelp.com",
  }
): { success: boolean; message: string } {
  if (typeof window === "undefined") return { success: false, message: "Client only" };

  const members = getAllRegisteredMembers();
  const cleanEmail = userEmail.trim().toLowerCase();

  let targetMember = members.find((m) => m.email.toLowerCase() === cleanEmail);
  if (!targetMember) {
    return { success: false, message: `Member with email ${userEmail} not found.` };
  }

  // Preserve Super Admin if assigned, otherwise assign new role
  const updatedRoles = newRole === "Super Admin" ? ["Super Admin", "ADMIN"] : [newRole];

  const updatedMembers = members.map((m) => {
    if (m.email.toLowerCase() === cleanEmail) {
      return {
        ...m,
        roles: updatedRoles,
      };
    }
    return m;
  });

  saveRegisteredMembers(updatedMembers);

  // If this user is currently active in the session, update active session
  try {
    const activeSessionRaw = localStorage.getItem("tpf_active_session");
    if (activeSessionRaw) {
      const activeSession = JSON.parse(activeSessionRaw);
      if (activeSession.user?.email.toLowerCase() === cleanEmail) {
        activeSession.user.roles = updatedRoles;
        localStorage.setItem("tpf_active_session", JSON.stringify(activeSession));
      }
    }
  } catch (e) {}

  logAuditEvent(
    "User Role Changed",
    assignedBy.name,
    assignedBy.email,
    `Designated ${targetMember.full_name} (${cleanEmail}) as "${newRole}".`,
    "security"
  );

  return {
    success: true,
    message: `Successfully assigned ${targetMember.full_name} to "${newRole}".`,
  };
}
