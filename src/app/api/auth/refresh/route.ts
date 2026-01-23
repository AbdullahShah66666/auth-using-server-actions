import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken } from "@/lib/auth";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const refreshTokenFromCookie = cookieStore.get("refreshToken")?.value;
    const accessTokenFromCookie = cookieStore.get("accessToken")?.value;

    if (!refreshTokenFromCookie) {
      return NextResponse.json({
        success: false,
        message: "Your session has expired, so Login AGAIN!...",
      });
    }
    console.log("refreshTokenFromCookie: ", refreshTokenFromCookie);

    if (accessTokenFromCookie) {
      return NextResponse.json({
        success: true,
        message: "Doesn't need to ReAssign Access Token",
      });
    }

    const user = await User.findOne({
      refreshTokenID: refreshTokenFromCookie,
    });
    if (!user) return false;
    const { _id: userID } = user;

    const refreshedAccessToken = createToken(userID);

    console.log("refreshedAccessToken: ", refreshedAccessToken);

    cookieStore.set("accessToken", refreshedAccessToken, {
      maxAge: 60 * 15,
    });

    return NextResponse.json({
      success: true,
      message: "Access Token Created",
    });
  } catch (error) {
    console.error("Process Failed: ", error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
