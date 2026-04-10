import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import Session from "@/models/Session";

type DecodedToken = {
  userID: string;
  sessionID: string;
  exp: number;
};

type AuthResult =
  | { isAuthenticated: true; decodedToken: DecodedToken }
  | { isAuthenticated: false; error: string };

type TokenKind = "access" | "refresh";

type AuthCookieStore = {
  set: (
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      sameSite: "lax";
      secure: boolean;
      path: string;
      maxAge: number;
    }
  ) => void;
};

type DecodableSessionToken = {
  sessionID: string;
};

const SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const ACCESS_TOKEN_MAX_AGE = 60 * 60;
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;
export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ACCESS_TOKEN_MAX_AGE,
};

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: REFRESH_TOKEN_MAX_AGE,
};

export function mintAccessToken(userID: string, sessionID: string) {
  return jwt.sign({ userID, sessionID }, SECRET_KEY, {
    expiresIn: `${ACCESS_TOKEN_MAX_AGE}s`,
  });
}

export async function deactivateSessionFromToken(token: string) {
  try {
    await dbConnect();

    const decoded = jwt.verify(token, SECRET_KEY) as DecodableSessionToken;
    const sessionID = decoded.sessionID;

    if (!sessionID) {
      return {
        success: false,
        error: "Invalid session token payload",
      };
    }

    const session = await Session.findById(sessionID);

    if (!session) {
      return {
        success: false,
        error: "Session not found",
      };
    }

    session.isActive = false;
    await session.save();

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Session deactivation failed",
    };
  }
}

async function validateSessionToken(
  token: string,
  kind: TokenKind
): Promise<AuthResult> {
  try {
    await dbConnect();

    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    const { userID, sessionID } = decoded;

    if (!sessionID || (kind === "access" && !userID)) {
      return {
        isAuthenticated: false,
        error:
          kind === "access"
            ? "Invalid access token payload"
            : "Invalid refresh token payload",
      };
    }

    const session = await Session.findById(sessionID);

    if (!session) {
      return {
        isAuthenticated: false,
        error: "Session not found",
      };
    }

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

    if (kind === "access" && userID !== session.userID) {
      return {
        isAuthenticated: false,
        error: "Session user mismatch",
      };
    }

    return {
      isAuthenticated: true,
      decodedToken: {
        userID: session.userID,
        sessionID: session._id,
        exp: decoded.exp,
      },
    };
  } catch {
    return {
      isAuthenticated: false,
      error:
        kind === "access"
          ? "Access session verification failed"
          : "Refresh session verification failed",
    };
  }
}

export async function verifyAccessSession(token: string): Promise<AuthResult> {
  return validateSessionToken(token, "access");
}

export async function verifyRefreshSession(token: string): Promise<AuthResult> {
  return validateSessionToken(token, "refresh");
}

export async function hashingPassword(weakPassword: string): Promise<string> {
  return bcrypt.hash(weakPassword, 10);
}

export async function createAndStoreAuthSession(
  cookieStore: AuthCookieStore,
  userID: string
) {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  const session = await Session.create({
    userID,
    isActive: true,
    expiresAt,
  });

  const { _id: sessionID } = session;
  const accessToken = jwt.sign({ userID, sessionID }, SECRET_KEY, {
    expiresIn: `${ACCESS_TOKEN_MAX_AGE}s`,
  });
  const refreshToken = jwt.sign({ sessionID }, SECRET_KEY, {
    expiresIn: `${REFRESH_TOKEN_MAX_AGE}s`,
  });

  cookieStore.set("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
  cookieStore.set("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  return { sessionID, accessToken, refreshToken };
}
