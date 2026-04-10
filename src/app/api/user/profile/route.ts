import { NextResponse } from "next/server";
import User from "@/models/User";
import Session from "@/models/Session";
import { requireUser } from "@/lib/requireUser";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export async function GET() {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const [user, latestSession] = await Promise.all([
      User.findById(auth.userID).select("username email role createdAt").lean(),
      Session.findOne({ userID: auth.userID }).sort({ createdAt: -1 }).lean(),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        username: user.username,
        email: user.email,
        role: user.role ?? "user",
        createdAt: formatDate(user.createdAt),
        lastLogin: formatDate(latestSession?.createdAt),
      },
    });
  } catch (error) {
    console.error("Failed to load user profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const username = String(body?.username ?? "").trim();
    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    if (!username || !email) {
      return NextResponse.json(
        { success: false, message: "Username and email are required" },
        { status: 400 }
      );
    }

    const conflictingUser = await User.findOne({
      email,
      _id: { $ne: auth.userID },
    })
      .select("_id")
      .lean();

    if (conflictingUser) {
      return NextResponse.json(
        { success: false, message: "Email is already in use" },
        { status: 409 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      auth.userID,
      { $set: { username, email } },
      { new: true, runValidators: true }
    )
      .select("username email role createdAt")
      .lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role ?? "user",
        createdAt: formatDate(updatedUser.createdAt),
      },
    });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
