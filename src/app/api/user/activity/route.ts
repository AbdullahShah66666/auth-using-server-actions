import { NextResponse } from "next/server";
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

    const recentSessions = await Session.find({ userID: auth.userID })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id createdAt isActive")
      .lean();

    const activity = recentSessions.map((session) => ({
      id: String(session._id),
      type: "login",
      label: session.isActive ? "Active session started" : "Previous login session",
      timestamp: session.createdAt,
    }));

    return NextResponse.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
