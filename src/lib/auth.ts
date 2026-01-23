import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Session from "@/models/Session";

type DecodedToken = {
  userID: string;
  exp: number;
};

type AuthResult =
  | { isAuthenticated: true; decodedToken: DecodedToken }
  | { isAuthenticated: false; error: string };

type SessionAuthResult =
  | { sessionAuthenticated: true; message: string }
  | { sessionAuthenticated: false; error: string };

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export function createToken(userID: string) {
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

export async function verifyRefreshToken(token: string): Promise<AuthResult> {
  try {
    await dbConnect();

    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

    const user = await User.findById(decoded.userID).select("refreshToken");

    if (!user || !user.refreshToken) {
      return {
        isAuthenticated: false,
        error: "Refresh token not found in database.",
      };
    }

    // 3. Compare token with stored hash
    const isValid = await bcrypt.compare(token, user.refreshTokenHash);

    if (!isValid) {
      return {
        isAuthenticated: false,
        error: "Refresh token mismatch.",
      };
    }

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

export async function hashingPassword(weakPassword: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(weakPassword, 10);

  return hashedPassword;
}

export async function verifySession(
  token: string,
  userID: string
): Promise<SessionAuthResult> {
  try {
    await dbConnect();
    const sessionexists = await Session.findById(userID);

    if (!sessionexists) {
      return {
        sessionAuthenticated: false,
        error: "Session not found",
      };
    }
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
