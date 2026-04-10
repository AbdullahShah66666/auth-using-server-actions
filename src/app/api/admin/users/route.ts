import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import User from "@/models/User";
import { hashingPassword } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminAuth";

function normalizeRole(role: unknown) {
  return role === "admin" ? "admin" : "user";
}

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const users = await User.find({ role: { $ne: "admin" } })
      .select("_id username email role")
      .sort({ username: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const username = String(body?.username ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    const role = normalizeRole(body?.role);

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "username, email, and password are required",
        },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashingPassword(password);
    const userID = uuidv4();

    const createdUser = await User.create({
      _id: userID,
      username,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({
      success: true,
      message: "User created",
      user: {
        _id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role ?? "user",
      },
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
