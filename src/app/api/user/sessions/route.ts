import { NextResponse } from "next/server";
//import { Types } from "mongoose";
import Session from "@/models/Session";
import { requireUser } from "@/lib/requireUser";

export async function GET() {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const sessions = await Session.find({ userID: auth.userID })
      .sort({ createdAt: -1 })
      .select("_id isActive createdAt expiresAt")
      .lean();

    console.log(sessions);

    return NextResponse.json({
      success: true,
      sessions: sessions.map((session) => ({
        id: String(session._id),
        isActive: session.isActive,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        isCurrent: String(session._id) === String(auth.sessionID),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const result = await Session.updateMany(
      { 
        userID: auth.userID,
        isActive: true,
        // _id: { $ne: new Types.ObjectId(auth.sessionID) },
      },
      { $set: { isActive: false } }
    );

    const response = NextResponse.json({
      success: true,
      message: "Logged out from all devices",
      updatedCount: result.modifiedCount,
    });

    response.cookies.set("accessToken", "", {
      path: "/",
      expires: new Date(0),
    });

    response.cookies.set("refreshToken", "", {
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Failed to terminate sessions:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
