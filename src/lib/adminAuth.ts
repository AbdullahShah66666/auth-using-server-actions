import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Session from "@/models/Session";

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

type DecodedToken = {
  userID: string;
  sessionID: string;
};

type AdminAuthResult =
  | { ok: true; userID: string }
  | { ok: false; status: number; message: string };

export async function requireAdmin(): Promise<AdminAuthResult> {
  await dbConnect();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      ok: false,
      status: 401,
      message: "Unauthorized",
    };
  }

  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY) as DecodedToken;
    const session = await Session.findById(decoded.sessionID);

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return {
        ok: false,
        status: 401,
        message: "Session expired or invalid",
      };
    }

    const currentUser = await User.findById(decoded.userID).select("role");

    if (!currentUser) {
      return {
        ok: false,
        status: 404,
        message: "User not found",
      };
    }

    if ((currentUser.role ?? "user") !== "admin") {
      return {
        ok: false,
        status: 403,
        message: "Forbidden",
      };
    }

    return {
      ok: true,
      userID: decoded.userID,
    };
  } catch {
    return {
      ok: false,
      status: 401,
      message: "Invalid or expired token",
    };
  }
}
