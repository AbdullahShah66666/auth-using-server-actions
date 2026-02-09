import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken, verifyRefreshToken } from "@/lib/auth";
import Session from "@/models/Session";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // If access token already exists, no need to refresh
    if (accessToken) {
      return NextResponse.json({
        success: true,
        message: "Access token already exists",
      });
    }

    // No refresh token = no session re-entry
    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    const result = await verifyRefreshToken(refreshToken);

    if (!result.isAuthenticated) {
      return NextResponse.json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const { sessionID } = result.decodedToken;

    const session = await Session.findById(sessionID);

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return NextResponse.json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    const userID = session.userID;

    const newAccessToken = createToken(userID, session._id);

    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 15,
    });

    return NextResponse.json({
      success: true,
      message: "New access token issued",
    });
  } catch (error) {
    console.error("Access token refresh failed:", error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
