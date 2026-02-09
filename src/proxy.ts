import { NextRequest, NextResponse } from "next/server";
import {
  verifyAccessToken,
  verifyRefreshToken,
  verifySession,
} from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set(
    "message",
    "Please log in to access the dashboard"
  );

  // 1️⃣ No tokens at all → dead
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  // 2️⃣ Access token present → try to fully authenticate
  if (accessToken) {
    const accessRes = verifyAccessToken(accessToken);

    if (accessRes.isAuthenticated) {
      const sessionRes = await verifySession(accessToken);

      if (sessionRes.sessionAuthenticated) {
        // ✅ Access token + valid session
        return NextResponse.next();
      }
    }
    // ❌ Access invalid or session invalid
    // Fall through to refresh logic
  }

  // 3️⃣ Access missing OR invalid → try refresh token
  if (refreshToken) {
    const refreshRes = await verifyRefreshToken(refreshToken);

    if (refreshRes.isAuthenticated) {
      const sessionRes = await verifySession(refreshToken);

      if (sessionRes.sessionAuthenticated) {
        // ✅ Session still alive
        // Access token will be re-minted by refresh route
        return NextResponse.next();
      }
    }
  }

  // 4️⃣ Everything failed → goodbye
  return NextResponse.next();
}
