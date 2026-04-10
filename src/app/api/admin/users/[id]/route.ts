import { NextResponse } from "next/server";
import { hashingPassword } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminAuth";
import User from "@/models/User";
import Session from "@/models/Session";
import dbConnect from "@/lib/dbConnect";

function normalizeRole(role: unknown) {
  return role === "admin" ? "admin" : "user";
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const { id } = await context.params;
    await dbConnect();

    const user = await User.findById(id).select("_id username email role").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    await dbConnect();

    const updates: Record<string, unknown> = {};

    if (typeof body?.username === "string" && body.username.trim()) {
      updates.username = body.username.trim();
    }

    if (typeof body?.email === "string" && body.email.trim()) {
      updates.email = body.email.trim().toLowerCase();
    }

    if (typeof body?.role !== "undefined") {
      updates.role = normalizeRole(body.role);
    }

    if (typeof body?.password === "string" && body.password.trim()) {
      updates.password = await hashingPassword(body.password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("_id username email role");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const { id } = await context.params;
    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    await Session.deleteMany({ userID: id });

    return NextResponse.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
