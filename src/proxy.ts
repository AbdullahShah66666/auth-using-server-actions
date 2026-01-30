import {
  verifyAccessToken,
  verifyRefreshToken,
  verifySession,
} from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

async function proxy(request: NextRequest) {
  const accessToken =
    request.cookies.get("accessToken")?.value || "sample token";
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const refreshTokenRes = refreshToken
    ? await verifyRefreshToken(refreshToken)
    : null;

  const { isAuthenticated: refreshTokenAuthenticated } = refreshTokenRes || {};
  //console.log(refreshTokenAuthenticated);

  const { pathname } = request.nextUrl;

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("message", "Please log in to access the dashboard");

  if (pathname.startsWith("/dashboard")) {
    if (accessToken || verifyAccessToken(accessToken).isAuthenticated) {
      const sessionRes = await verifySession(accessToken);
      const { sessionAuthenticated } = sessionRes || {};

      if (!sessionAuthenticated) {
        NextResponse.redirect(url);
      }
    }
    if (refreshToken || refreshTokenAuthenticated) {
      const sessionRes = await verifySession(refreshToken);
      const { sessionAuthenticated } = sessionRes || {};
      if (!sessionAuthenticated) {
        NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export default proxy;
