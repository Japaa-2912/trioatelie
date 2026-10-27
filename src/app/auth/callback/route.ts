import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNextPath(url.searchParams.get("next"), "/admin");
  const redirectUrl = new URL(next, url.origin);

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/admin/login?config=1", url.origin),
    );
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.redirect(
      new URL("/admin/login?config=1", url.origin),
    );
  }

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const errorDescription =
    url.searchParams.get("error_description") ??
    url.searchParams.get("error");

  if (errorDescription) {
    return NextResponse.redirect(
      new URL("/admin/login?erro=link", url.origin),
    );
  }

  let authenticated = false;
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authenticated = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    authenticated = !error;
  }

  if (!authenticated) {
    return NextResponse.redirect(
      new URL("/admin/login?erro=link", url.origin),
    );
  }

  return NextResponse.redirect(redirectUrl);
}
