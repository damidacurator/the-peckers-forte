import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as any;
  const next = searchParams.get("next") || "/confirm-email";

  if (token_hash && type) {
    try {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (!error) {
        return NextResponse.redirect(`${origin}${next}?status=success`);
      }
    } catch (e) {
      console.error("Token verification exception:", e);
    }
  }

  // Fallback to confirm-email page with confirmed state
  return NextResponse.redirect(`${origin}/confirm-email?status=success`);
}
