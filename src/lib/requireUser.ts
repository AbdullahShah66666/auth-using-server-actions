import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { verifyAccessSession } from "@/lib/auth";

type RequireUserResult =
  | { ok: true; userID: string; sessionID: string }
  | { ok: false; status: number; message: string };

export async function requireUser(): Promise<RequireUserResult> {
  await dbConnect();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  const accessResult = await verifyAccessSession(accessToken);

  if (!accessResult.isAuthenticated) {
    return {
      ok: false,
      status: 401,
      message: accessResult.error,
    };
  }

  return {
    ok: true,
    userID: accessResult.decodedToken.userID,
    sessionID: accessResult.decodedToken.sessionID,
  };
}
