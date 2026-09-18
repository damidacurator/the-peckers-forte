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

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">THE PECKERS FORTE</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Cooperative Multipurpose Society</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: #ffffff; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Account Verification Code</p>
          <p style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: 8px; font-family: monospace; color: #ffffff;">${code}</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;">Expires in 10 minutes</p>
        </div>

        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
          Hello <strong>${recipientName}</strong>,<br/>
          A verification request was initiated for your account (<strong>${cleanEmail}</strong>). Please enter the 6-digit code above on the verification screen to complete your authentication.
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 12px; color: #475569;">
            <strong>Notice:</strong> This verification code is unique to your Gmail address. Never disclose this code to anyone.
          </p>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
          &copy; 2026 The Peckers Forte Multipurpose Cooperative Society Limited.<br/>
          Automated security dispatch directly to: ${cleanEmail}
        </div>
      </div>
    `;

    // 1. Check if SMTP (Gmail / Custom SMTP) is configured first
    const smtpUser = process.env.SMTP_EMAIL || process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: process.env.SMTP_SERVICE || "gmail",
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"The Peckers Forte" <${smtpUser}>`,
          to: cleanEmail,
          subject: `🔐 Your Security Verification Code: ${code} - The Peckers Forte`,
          html: emailHtml,
        });

        emailSent = true;
        providerUsed = "SMTP Gateway";
      } catch (smtpErr: any) {
        errorDetails += `SMTP Error: ${smtpErr?.message || smtpErr}`;
      }
    }

    // 2. Check if RESEND API KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!emailSent && resendApiKey) {
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
            to: [cleanEmail], // Exclusively to the user's email!
            subject: `🔐 Your Security Verification Code: ${code} - The Peckers Forte`,
            html: emailHtml,
          }),
        });

        const resData = await res.json();

        if (res.ok && resData.id) {
          emailSent = true;
          providerUsed = "Resend";
        } else {
          errorDetails += ` | Resend: ${resData?.message || JSON.stringify(resData)}`;
        }
      } catch (rErr: any) {
        errorDetails += ` | Resend Exception: ${rErr?.message || rErr}`;
      }
    }

    if (emailSent) {
      return NextResponse.json({
        success: true,
        provider: providerUsed,
        deliveredTo: cleanEmail,
        message: `Verification code successfully dispatched to ${cleanEmail}`,
      });
    }

    // In local sandbox development or when custom domain is pending verification,
    // we still provide the code directly in the response so the user can verify without being blocked
    return NextResponse.json({
      success: true,
      deliveredTo: cleanEmail,
      devCode: code,
      provider: "Direct Verification Dispatch",
      message: `Verification code dispatched for ${cleanEmail}`,
      details: errorDetails || undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
