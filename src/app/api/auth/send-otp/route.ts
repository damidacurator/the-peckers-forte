import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, code, fullName } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and OTP code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const recipientName = fullName || cleanEmail.split("@")[0];

    let emailSent = false;
    let providerUsed = "";
    let errorDetails = "";

    // 1. Check if RESEND API KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || "The Peckers Forte <onboarding@resend.dev>";
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [cleanEmail],
            subject: `🔐 Your Security Verification Code: ${code} - The Peckers Forte`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">THE PECKERS FORTE</h2>
                  <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Cooperative Multipurpose Society</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: #ffffff; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Two-Step Verification</p>
                  <p style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: 8px; font-family: monospace; color: #ffffff;">${code}</p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;">Expires in 10 minutes</p>
                </div>

                <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                  Hello <strong>${recipientName}</strong>,<br/>
                  A sign-in attempt was initiated for your account. Please enter the 6-digit security code above into the verification screen to complete your authentication.
                </p>

                <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                  <p style="margin: 0; font-size: 12px; color: #475569;">
                    <strong>Security Notice:</strong> If you did not request this code, please secure your account immediately.
                  </p>
                </div>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
                  &copy; 2026 The Peckers Forte Multipurpose Cooperative Society Limited.<br/>
                  This is an automated system notification.
                </div>
              </div>
            `,
          }),
        });

        const resData = await res.json();
        if (res.ok && resData.id) {
          emailSent = true;
          providerUsed = "Resend";
        } else {
          errorDetails = `Resend Error: ${JSON.stringify(resData)}`;
        }
      } catch (rErr: any) {
        errorDetails = `Resend Exception: ${rErr?.message || rErr}`;
      }
    }

    // 2. Check if SMTP (Gmail / Custom) is configured
    if (!emailSent) {
      const smtpUser = process.env.SMTP_EMAIL || process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

      if (smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE || "gmail",
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 465,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: `"The Peckers Forte" <${smtpUser}>`,
            to: cleanEmail,
            subject: `🔐 Your Security Verification Code: ${code} - The Peckers Forte`,
            text: `Your Two-Step Verification code is: ${code}\nThis code expires in 10 minutes.\n\nThe Peckers Forte Cooperative`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800;">THE PECKERS FORTE</h2>
                  <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Cooperative Multipurpose Society</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: #ffffff; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; font-weight: 600;">Security Code</p>
                  <p style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: 8px; font-family: monospace;">${code}</p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;">Expires in 10 minutes</p>
                </div>

                <p style="color: #334155; font-size: 14px; line-height: 1.6;">
                  Hello <strong>${recipientName}</strong>,<br/>
                  Enter this 6-digit verification code to complete your login.
                </p>

                <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
                  If you did not request this login attempt, please notify support immediately at admin@thepeckerfortelp.com.
                </p>
              </div>
            `,
          });

          emailSent = true;
          providerUsed = "Gmail SMTP";
        } catch (smtpErr: any) {
          errorDetails += ` | SMTP Error: ${smtpErr?.message || smtpErr}`;
        }
      }
    }

    // 3. Forward audit notification to Formspree
    const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/moeqgrqd";
    try {
      fetch(formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          recipient: cleanEmail,
          subject: `🔐 2FA OTP Requested for ${cleanEmail}`,
          message: `Two-Step verification code ${code} generated for ${cleanEmail} (${recipientName}).`,
        }),
      }).catch(() => {});
    } catch {}

    if (emailSent) {
      return NextResponse.json({
        success: true,
        provider: providerUsed,
        message: `Verification code successfully sent to ${cleanEmail}`,
      });
    }

    return NextResponse.json({
      success: false,
      needsConfiguration: true,
      errorDetails,
      message:
        "No outgoing email provider (Resend or Gmail SMTP) is configured on the server yet. Please add RESEND_API_KEY or SMTP_EMAIL / SMTP_PASSWORD in Vercel / environment variables.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
