import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Session from "@/models/Session";

type DecodedToken = {
  userID: string;
  sessionID: string;
  exp: number;
};

type AuthResult =
  | { isAuthenticated: true; decodedToken: DecodedToken }
  | { isAuthenticated: false; error: string };

type SessionAuthResult =
  | { sessionAuthenticated: true; message: string }
  | { sessionAuthenticated: false; error: string };

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export function createToken(userID: string, _id: any) {
  const accessToken = jwt.sign({ userID }, SECRET_KEY, {
    expiresIn: "15m",
  });
  return accessToken;
}

export function createTokens(userID: string, sessionID: string) {
  const accessToken = jwt.sign({ userID, sessionID }, SECRET_KEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ sessionID }, SECRET_KEY, {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
}

export function verifyAccessToken(token: string): AuthResult {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    return {
      isAuthenticated: true,
      decodedToken: decoded,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error: "JWT Verification Failed.",
    };
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<AuthResult> {
  try {
    await dbConnect();

    // 1️⃣ Verify JWT signature
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

    const { sessionID } = decoded;

    if (!sessionID) {
      return {
        isAuthenticated: false,
        error: "Invalid refresh token payload",
      };
    }

    // 2️⃣ Find session
    const session = await Session.findById(sessionID);

    if (!session) {
      return {
        isAuthenticated: false,
        error: "Session not found",
      };
    }

    // 3️⃣ Validate session
    if (!session.isActive) {
      return {
        isAuthenticated: false,
        error: "Session inactive",
      };
    }

    if (session.expiresAt < new Date()) {
      return {
        isAuthenticated: false,
        error: "Session expired",
      };
    }

    // ✅ Refresh token is valid
    return {
      isAuthenticated: true,
      decodedToken: {
        sessionID: session._id,
        userID: session.userID, // IMPORTANT
      },
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error: "Refresh token verification failed",
    };
  }
}

export async function hashingPassword(weakPassword: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(weakPassword, 10);

  return hashedPassword;
}

export async function verifySession(token: string): Promise<SessionAuthResult> {
  try {
    await dbConnect();

    const decoded = jwt.verify(token) as DecodedToken;

    const { userID, sessionID } = decoded;

    const sessionexists = await Session.findById(sessionID);

    console.log("sessionexists: ", sessionexists);

    if (!sessionexists) {
      return {
        sessionAuthenticated: false,
        error: "Session not does not exist",
      };
    }

    if (sessionexists.userID !== userID) {
      return {
        sessionAuthenticated: false,
        error: "Session not verified",
      };
    }

    if (!sessionexists.isActive) {
      return {
        sessionAuthenticated: false,
        error: "Session is InActive",
      };
    }

    if (sessionexists.expiresAt < Date.now()) {
      return {
        sessionAuthenticated: false,
        error: "Session is Expired",
      };
    }

    return {
      sessionAuthenticated: true,
      message: "Session authenticated successfully",
    };
  } catch (error) {
    return {
      sessionAuthenticated: false,
      error: "Session Authentication Failed",
    };
  }
}

/* 
export async function welcomeUser() {
  try {
    await dbConnect();

    


  } catch {

  }
}
 */
