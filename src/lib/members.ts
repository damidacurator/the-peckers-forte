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

// Strictly empty defaults - NO falsified or mock accounts!
export const DEFAULT_MEMBERS: MemberAccount[] = [];
export const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [];

// Clean out legacy mock data if present in user's browser
function sanitizeStoredUsers(users: any[]): MemberAccount[] {
  // Discard any previous mock user IDs like mem-002 or mem-003
  return users
    .filter((u) => u && u.email && u.id !== "mem-002" && u.id !== "mem-003")
    .map((u) => {
      const rawFirst = (u.first_name || u.firstName || "").toString();
      const rawLast = (u.surname || u.lastName || "").toString();
      const cleanFirst = rawFirst.toLowerCase().includes("undefined") ? "" : rawFirst.trim();
      const cleanLast = rawLast.toLowerCase().includes("undefined") ? "" : rawLast.trim();
      const rawFull = (u.full_name || "").toString();
      const cleanFull = (!rawFull || rawFull.toLowerCase().includes("undefined"))
        ? `${cleanFirst} ${cleanLast}`.trim() || u.email.split("@")[0]
        : rawFull.trim();

      return {
        id: u.id || "usr_" + Date.now(),
        email: u.email,
        password: u.password,
        first_name: cleanFirst,
        surname: cleanLast,
        full_name: cleanFull,
        phone: u.phone || "",
        wing: u.wing || "BOTH",
        category: u.category || "standard",
        membership_number: u.membership_number || "TPF-2026-0001",
        roles: u.roles || ["Ordinary Member"],
        total_contributions: Number(u.total_contributions) || 0,
        contribution_count: Number(u.contribution_count) || 0,
        created_at: u.created_at || new Date().toISOString(),
        status: u.status || "active",
      };
    });
}

function sanitizeStoredLogs(logs: any[]): AuditLogEntry[] {
  // Discard any previous hardcoded mock logs
  return logs.filter((l) => l && l.id !== "log_1" && l.id !== "log_2" && l.id !== "log_3");
}

export function getAllRegisteredMembers(): MemberAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const sanitized = sanitizeStoredUsers(parsed);
        // Save cleaned data back
        if (sanitized.length !== parsed.length) {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(sanitized));
        }
        return sanitized;
      }
    }
  } catch (e) {
    console.error("Failed to load members:", e);
  }
  return [];
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
  return members.find((m) => m.email.toLowerCase() === email.trim().toLowerCase());
}

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const sanitized = sanitizeStoredLogs(parsed);
        if (sanitized.length !== parsed.length) {
          localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(sanitized));
        }
        return sanitized;
      }
    }
  } catch (e) {}
  return [];
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
      ip: "127.0.0.1 (Direct Session)",
      type,
    };
    const updated = [entry, ...current.slice(0, 99)];
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

  const updatedMembers = members.map((m) => {
    if (m.email.toLowerCase() === cleanEmail) {
      found = true;
      const newTotal = (Number(m.total_contributions) || 0) + Number(amount);
      const newCount = (Number(m.contribution_count) || 0) + 1;
      return {
        ...m,
        total_contributions: newTotal,
        contribution_count: newCount,
      };
    }
    return m;
  });

  if (!found) {
    const newMember: MemberAccount = {
      id: "usr_" + Date.now(),
      email: cleanEmail,
      first_name: txDetails.customerName.split(" ")[0] || "Member",
      surname: txDetails.customerName.split(" ")[1] || "",
      full_name: txDetails.customerName,
      phone: "",
      wing: "BOTH",
      membership_number: `TPF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      roles: ["Ordinary Member"],
      total_contributions: Number(amount),
      contribution_count: 1,
      created_at: new Date().toISOString(),
      status: "active",
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
          total_contributions:
            (Number(activeSession.member?.total_contributions) || 0) + Number(amount),
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
