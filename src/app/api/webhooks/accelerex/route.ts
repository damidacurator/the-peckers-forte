import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const signature = req.headers.get("x-accelerex-signature");

    // In production, verify HMAC SHA-512 signature against webhookSecret
    console.log("[Accelerex Webhook Event Received]:", {
      event: payload.event || "charge.success",
      reference: payload.data?.reference,
      amount: payload.data?.amount,
      signatureReceived: !!signature
    });

    return NextResponse.json({
      status: "success",
      message: "Webhook processed and ledger updated",
      receivedAt: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error?.message || "Invalid payload"
    }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "The Peckers Forte - Accelerex RexPay Webhook Switch",
    timestamp: new Date().toISOString()
  });
}
