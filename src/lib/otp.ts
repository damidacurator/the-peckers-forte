// Two-Step Verification (OTP / 2FA) Engine

export interface PendingOtp {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  createdAt: string;
}

const OTP_STORAGE_KEY = "tpf_pending_otp_sessions";

function getPendingOtps(): Record<string, PendingOtp> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePendingOtps(sessions: Record<string, PendingOtp>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(sessions));
  } catch {}
}

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  const visiblePrefix = local.slice(0, 2);
  return `${visiblePrefix}***@${domain}`;
}

export async function generateAndSendOtp(
  email: string,
  userFullName?: string
): Promise<{
  success: boolean;
  maskedEmail: string;
  deliveredTo?: string;
  code: string;
  isDevMode?: boolean;
  message: string;
  deliveryWarning?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();

  // Generate random 6-digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store pending session in client storage for verification
  const sessions = getPendingOtps();
  sessions[cleanEmail] = {
    email: cleanEmail,
    code,
    expiresAt,
    attempts: 0,
    createdAt: new Date().toISOString(),
  };
  savePendingOtps(sessions);

  let deliveryWarning: string | undefined;
  let deliveredTo = cleanEmail;
  let isDevMode = false;

  // Dispatch real email via server API route (/api/auth/send-otp)
  try {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        code,
        fullName: userFullName,
      }),
    });

    const data = await res.json();
    if (data.deliveredTo) {
      deliveredTo = data.deliveredTo;
    }
    if (data.provider === "Direct Verification Dispatch" || data.devCode || (!data.success && data.needsConfiguration)) {
      isDevMode = true;
      if (data.details) {
        deliveryWarning = data.details;
      }
    }
  } catch (err: any) {
    console.warn("Error triggering send-otp API:", err);
    isDevMode = true;
  }

  return {
    success: true,
    maskedEmail: maskEmail(deliveredTo),
    deliveredTo,
    code,
    isDevMode,
    message: `A 6-digit security code has been sent to ${maskEmail(deliveredTo)}`,
    deliveryWarning,
  };
}

export function verifyOtpCode(
  email: string,
  enteredCode: string
): { success: boolean; message: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = enteredCode.trim().replace(/\D/g, "");

  const sessions = getPendingOtps();
  const session = sessions[cleanEmail];

  if (!session) {
    return {
      success: false,
      message: "No active verification code found. Please request a new code.",
    };
  }

  if (Date.now() > session.expiresAt) {
    delete sessions[cleanEmail];
    savePendingOtps(sessions);
    return {
      success: false,
      message: "This verification code has expired. Please request a new code.",
    };
  }

  if (session.attempts >= 5) {
    delete sessions[cleanEmail];
    savePendingOtps(sessions);
    return {
      success: false,
      message: "Too many failed attempts. Please request a new code.",
    };
  }

  // Exact match validation
  if (session.code !== cleanCode) {
    session.attempts += 1;
    sessions[cleanEmail] = session;
    savePendingOtps(sessions);
    return {
      success: false,
      message: "Invalid OTP",
    };
  }

  // Success! Clear session
  delete sessions[cleanEmail];
  savePendingOtps(sessions);

  return {
    success: true,
    message: "Two-step verification confirmed successfully.",
  };
}
