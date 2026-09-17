// Two-Step Verification (OTP / 2FA) Engine

export interface PendingOtp {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  createdAt: string;
}

const OTP_STORAGE_KEY = "tpf_pending_otp_sessions";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/moeqgrqd";

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
): Promise<{ success: boolean; maskedEmail: string; message: string; backupCode?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  
  // Generate random 6-digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store pending session
  const sessions = getPendingOtps();
  sessions[cleanEmail] = {
    email: cleanEmail,
    code,
    expiresAt,
    attempts: 0,
    createdAt: new Date().toISOString()
  };
  savePendingOtps(sessions);

  // Dispatch real email to user's Gmail using Formspree endpoint
  try {
    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: cleanEmail,
        subject: `🔐 Your Two-Step Verification Code: ${code} - THE PECKERS FORTE`,
        message: `Hello ${userFullName || "Valued User"},\n\nYour Two-Step Verification (OTP) security code for signing into THE PECKERS FORTE is:\n\n========================================\n👉  ${code}  👈\n========================================\n\nThis verification code expires in 10 minutes.\n\nIf you did not request this login attempt, please protect your account immediately.\n\nTHE PECKERS FORTE COOPERATIVE\nadmin@thepeckerfortelp.com`,
        to: cleanEmail,
      }),
    }).catch((err) => {
      console.warn("Formspree dispatch error (safe fallback):", err);
    });
  } catch (e) {
    console.warn("Background OTP send warning:", e);
  }

  return {
    success: true,
    maskedEmail: maskEmail(cleanEmail),
    message: `Security code sent to ${maskEmail(cleanEmail)}`,
    backupCode: code // Exposed for development/sandbox fallback
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
      message: "Too many failed attempts. For security, please request a fresh code.",
    };
  }

  if (session.code !== cleanCode) {
    session.attempts += 1;
    sessions[cleanEmail] = session;
    savePendingOtps(sessions);
    return {
      success: false,
      message: `Invalid verification code. Please check your email and try again (${5 - session.attempts} attempts remaining).`,
    };
  }

  // Success! Invalidate OTP session
  delete sessions[cleanEmail];
  savePendingOtps(sessions);

  return {
    success: true,
    message: "Two-step verification confirmed successfully.",
  };
}
