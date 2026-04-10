export type DashboardUser = {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin" | string;
};

export type UserProfile = {
  username: string;
  email: string;
  role: string;
  createdAt: string | null;
  lastLogin: string | null;
};

export type UserSession = {
  id: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
};

export type UserActivity = {
  id: string;
  type: string;
  label: string;
  timestamp: string;
};


export type UserSectionKey =
  | "overview"
  | "profile"
  | "security"
  | "notifications";
