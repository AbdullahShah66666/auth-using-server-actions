import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(accessToken, SECRET_KEY) as {
      userID: string;
    };

    const user = await User.findById(decoded.userID).select("username");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({
      success: true,
      username: user.username,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
