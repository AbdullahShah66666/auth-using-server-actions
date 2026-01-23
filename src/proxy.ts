import { verifyAccessToken, verifyRefreshToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
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
    if (!accessToken || !verifyAccessToken(accessToken).isAuthenticated) {
      if (!refreshToken || !refreshTokenAuthenticated) {
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export default proxy;
