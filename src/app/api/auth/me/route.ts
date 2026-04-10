import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAccessSession } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const accessResult = await verifyAccessSession(accessToken);

    if (!accessResult.isAuthenticated) {
      return NextResponse.json({
        success: false,
        message: accessResult.error,
      });
    }

    const user = await User.findById(accessResult.decodedToken.userID).select(
      "username role"
    );

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({
      success: true,
      username: user.username,
      role: user.role ?? "user",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
