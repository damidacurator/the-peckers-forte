// Member Account & Contribution Management Utility

export interface MemberAccount {
  id: string;
  email: string;
  password?: string;
  first_name: string;
  surname: string;
  full_name: string;
  phone: string;
  wing: string;
  category?: string;
  membership_number: string;
  roles: string[];
  total_contributions: number;
  contribution_count: number;
  created_at: string;
  status: "active" | "pending" | "suspended";
}

export interface AuditLogEntry {
  id: string;
  date: string;
  action: string;
  user: string;
  user_email: string;
  details: string;
  ip: string;
  type: "account_creation" | "payment" | "payout" | "security" | "system";
}

export const USERS_STORAGE_KEY = "tpf_registered_users";
export const AUDIT_LOGS_KEY = "tpf_system_audit_logs";

export const DEFAULT_MEMBERS: MemberAccount[] = [
  {
    id: "admin-core-001",
    email: "admin@thepeckerfortelp.com",
    first_name: "Akinola",
    surname: "Idowu",
    full_name: "Akinola Idowu (Core Admin)",
    phone: "+2348037221344",
    wing: "BOTH",
    category: "gold",
    membership_number: "TPF-ADM-001",
    roles: ["Super Admin", "ADMIN", "Treasurer", "Secretary", "Executive"],
    total_contributions: 250000,
    contribution_count: 5,
    created_at: "2026-01-01T08:00:00Z",
    status: "active"
  },
  {
    id: "mem-002",
    email: "oyindamola.idowu@thepeckersfortelp.com",
    first_name: "Oyindamola",
    surname: "Idowu",
    full_name: "Oyindamola Idowu",
    phone: "+2348023456789",
    wing: "INVESTMENT",
    category: "gold",
    membership_number: "TPF-2026-0002",
    roles: ["Ordinary Member", "Lead Developer"],
    total_contributions: 150000,
    contribution_count: 3,
    created_at: "2026-01-15T10:30:00Z",
    status: "active"
  },
  {
    id: "mem-003",
    email: "oluwadamilare.idowu@thepeckersfortelp.com",
    first_name: "Oluwadamilare",
    surname: "Idowu",
    full_name: "Oluwadamilare Idowu",
    phone: "+2348037221344",
    wing: "BOTH",
    category: "premium",
    membership_number: "TPF-2026-0003",
    roles: ["Ordinary Member", "Lead Developer"],
    total_contributions: 120000,
    contribution_count: 2,
    created_at: "2026-02-01T14:15:00Z",
    status: "active"
  }
];

export const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log_1",
    date: new Date(Date.now() - 3600000 * 24).toISOString(),
    action: "New Member Account Registered",
    user: "Akinola Idowu (Core Admin)",
    user_email: "admin@thepeckerfortelp.com",
    details: "Core Administrative account provisioned with Super Admin privileges.",
    ip: "102.89.44.12",
    type: "account_creation"
  },
  {
    id: "log_2",
    date: new Date(Date.now() - 3600000 * 12).toISOString(),
    action: "Payment Contribution Received",
    user: "Akinola Idowu (Core Admin)",
    user_email: "admin@thepeckerfortelp.com",
    details: "Successfully contributed ₦50,000 for Monthly Contribution via Accelerex RexPay.",
    ip: "102.89.44.12",
    type: "payment"
  },
  {
    id: "log_3",
    date: new Date(Date.now() - 3600000 * 4).toISOString(),
    action: "Payment Contribution Received",
    user: "Oyindamola Idowu",
    user_email: "oyindamola.idowu@thepeckersfortelp.com",
    details: "Successfully contributed ₦50,000 for Investment Capital via RexPay Virtual Transfer.",
    ip: "105.112.38.99",
    type: "payment"
  }
];

export function getAllRegisteredMembers(): MemberAccount[] {
  if (typeof window === "undefined") return DEFAULT_MEMBERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed: MemberAccount[] = JSON.parse(raw);
      // Ensure default core members are always included
      const map = new Map<string, MemberAccount>();
      DEFAULT_MEMBERS.forEach(m => map.set(m.email.toLowerCase(), m));
      parsed.forEach(m => {
        const existing = map.get(m.email.toLowerCase());
        if (existing) {
          map.set(m.email.toLowerCase(), {
            ...existing,
            ...m,
            total_contributions: Math.max(existing.total_contributions, m.total_contributions || 0)
          });
        } else {
          map.set(m.email.toLowerCase(), {
            ...m,
            total_contributions: m.total_contributions || 0,
            contribution_count: m.contribution_count || 0
          });
        }
      });
      return Array.from(map.values());
    }
  } catch (e) {
    console.error("Failed to load members:", e);
  }
  return DEFAULT_MEMBERS;
}

export function saveRegisteredMembers(members: MemberAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.error("Failed to save members:", e);
  }
}

export function getMemberByEmail(email: string): MemberAccount | undefined {
  const members = getAllRegisteredMembers();
  return members.find(m => m.email.toLowerCase() === email.trim().toLowerCase());
}

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return DEFAULT_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return DEFAULT_AUDIT_LOGS;
}

export function logAuditEvent(
  action: string,
  user: string,
  user_email: string,
  details: string,
  type: "account_creation" | "payment" | "payout" | "security" | "system" = "system"
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getAuditLogs();
    const entry: AuditLogEntry = {
      id: "log_" + Date.now(),
      date: new Date().toISOString(),
      action,
      user,
      user_email,
      details,
      ip: "102.89." + Math.floor(10 + Math.random() * 80) + "." + Math.floor(10 + Math.random() * 80),
      type
    };
    const updated = [entry, ...current.slice(0, 99)]; // Keep latest 100 entries
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {}
}

export function recordMemberContribution(
  email: string,
  amount: number,
  txDetails: { reference: string; type: string; customerName: string }
): void {
  if (typeof window === "undefined") return;

  const members = getAllRegisteredMembers();
  const cleanEmail = email.trim().toLowerCase();
  let found = false;

  const updatedMembers = members.map(m => {
    if (m.email.toLowerCase() === cleanEmail) {
      found = true;
      const newTotal = (m.total_contributions || 0) + Number(amount);
      const newCount = (m.contribution_count || 0) + 1;
      return {
        ...m,
        total_contributions: newTotal,
        contribution_count: newCount
      };
    }
    return m;
  });

  if (!found) {
    // If not found in members list, provision user record with contribution
    const newMember: MemberAccount = {
      id: "mem_" + Date.now(),
      email: cleanEmail,
      first_name: txDetails.customerName.split(" ")[0] || "Member",
      surname: txDetails.customerName.split(" ")[1] || "",
      full_name: txDetails.customerName,
      phone: "+2348000000000",
      wing: "BOTH",
      membership_number: `TPF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      roles: ["Ordinary Member"],
      total_contributions: Number(amount),
      contribution_count: 1,
      created_at: new Date().toISOString(),
      status: "active"
    };
    updatedMembers.push(newMember);
  }

  saveRegisteredMembers(updatedMembers);

  // Update active session if currently logged in user
  try {
    const activeSessionRaw = localStorage.getItem("tpf_active_session");
    if (activeSessionRaw) {
      const activeSession = JSON.parse(activeSessionRaw);
      if (activeSession.user?.email.toLowerCase() === cleanEmail) {
        activeSession.member = {
          ...activeSession.member,
          total_contributions: (activeSession.member?.total_contributions || 0) + Number(amount)
        };
        localStorage.setItem("tpf_active_session", JSON.stringify(activeSession));
      }
    }
  } catch (e) {}

  // Log to Audit Trail
  logAuditEvent(
    "Payment Contribution Received",
    txDetails.customerName,
    cleanEmail,
    `Successfully contributed ₦${amount.toLocaleString()} for ${txDetails.type} via Accelerex (Ref: ${txDetails.reference})`,
    "payment"
  );
}
