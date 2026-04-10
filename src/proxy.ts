import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE_OPTIONS,
  mintAccessToken,
  verifyAccessSession,
  verifyRefreshSession,
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
    const accessRes = await verifyAccessSession(accessToken);

    if (accessRes.isAuthenticated) {
      return NextResponse.next();
    }
  }

  // 3️⃣ Access missing OR invalid → try refresh token
  if (refreshToken) {
    const refreshRes = await verifyRefreshSession(refreshToken);

    if (refreshRes.isAuthenticated) {
      const response = NextResponse.next();
      const newAccessToken = mintAccessToken(
        refreshRes.decodedToken.userID,
        refreshRes.decodedToken.sessionID
      );

      response.cookies.set("accessToken", newAccessToken, ACCESS_COOKIE_OPTIONS);
      return response;
    }
  }

  // 4️⃣ Everything failed → goodbye
  return NextResponse.redirect(loginUrl);
}
