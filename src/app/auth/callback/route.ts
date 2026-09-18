import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/confirm-email";

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}?status=success`);
      }
    } catch (e) {
      console.error("Auth callback exception:", e);
    }
  }

  return NextResponse.redirect(`${origin}/confirm-email?status=success`);
}
