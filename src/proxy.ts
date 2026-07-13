import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // The sandboxed website preview route is auth-sensitive (draft
    // visibility depends on a fresh session) and can serve .svg assets,
    // which the extension exclusion above would otherwise skip.
    "/marketplace/:id/preview/:path*",
  ],
};
