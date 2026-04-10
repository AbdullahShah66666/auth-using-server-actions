import UserSectionNav from "@/components/dashboard/UserSectionNav";
import type {
  UserProfile,
  UserSectionKey,
  UserSession,
} from "@/components/dashboard/types";
import type { Dispatch, SetStateAction } from "react";

type UserSection = {
  key: UserSectionKey;
  label: string;
};

type UserWorkspacePanelProps = {
  username: string | null;
  role: "user" | "admin" | null;
  profile: UserProfile | null;
  sessions: UserSession[];
  activeSessionsCount: number;
  notifications: string[];
  activeUserSection: UserSectionKey;
  setActiveUserSection: Dispatch<SetStateAction<UserSectionKey>>;
  sectionMenuOpen: boolean;
  setSectionMenuOpen: Dispatch<SetStateAction<boolean>>;
  userMenuSections: UserSection[];
  currentSectionLabel: string;
  profileForm: { username: string; email: string };
  setProfileForm: Dispatch<SetStateAction<{ username: string; email: string }>>;
  passwordForm: { currentPassword: string; newPassword: string };
  setPasswordForm: Dispatch<
    SetStateAction<{ currentPassword: string; newPassword: string }>
  >;
  savingProfile: boolean;
  savingPassword: boolean;
  endingSessions: boolean;
  onProfileUpdate: () => Promise<void>;
  onPasswordUpdate: () => Promise<void>;
  onLogoutAllDevices: () => Promise<void>;
  onLogout: () => Promise<void>;
  formatDate: (dateValue: string | null | undefined) => string;
};

export default function UserWorkspacePanel({
  username,
  role,
  profile,
  sessions,
  activeSessionsCount,
  notifications,
  activeUserSection,
  setActiveUserSection,
  sectionMenuOpen,
  setSectionMenuOpen,
  userMenuSections,
  currentSectionLabel,
  profileForm,
  setProfileForm,
  passwordForm,
  setPasswordForm,
  savingProfile,
  savingPassword,
  endingSessions,
  onProfileUpdate,
  onPasswordUpdate,
  onLogoutAllDevices,
  onLogout,
  formatDate,
}: UserWorkspacePanelProps) {
  const renderContent = () => {
    switch (activeUserSection) {
      case "overview":
        return (
          <div className="grid gap-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Profile Details
                </p>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <p>Username: {profile?.username ?? username ?? "N/A"}</p>
                  <p>Email: {profile?.email ?? "N/A"}</p>
                  <p>Role: {(profile?.role ?? role ?? "user").toUpperCase()}</p>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Account Details
                </p>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <p>Last login: {formatDate(profile?.lastLogin)}</p>
                  <p>Active sessions: {activeSessionsCount}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Quick Actions
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setActiveUserSection("profile")}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUserSection("security")}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Change password
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="grid gap-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Profile Details
                </p>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <p>Username: {profile?.username ?? username ?? "N/A"}</p>
                  <p>Email: {profile?.email ?? "N/A"}</p>
                  <p>Role: {(profile?.role ?? role ?? "user").toUpperCase()}</p>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Edit Profile
                </p>
                <div className="mt-3 grid gap-3">
                  <input
                    value={profileForm.username}
                    onChange={(event) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        username: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-[#0b1020] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/60"
                    placeholder="Username"
                  />
                  <input
                    value={profileForm.email}
                    onChange={(event) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-[#0b1020] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/60"
                    placeholder="Email"
                  />
                  <button
                    type="button"
                    onClick={onProfileUpdate}
                    disabled={savingProfile}
                    className="cursor-pointer rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:opacity-60"
                  >
                    {savingProfile ? "Saving profile..." : "Save profile"}
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Quick Actions
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setActiveUserSection("profile")}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUserSection("security")}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Change password
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="grid gap-4">
            <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Change Password
              </p>
              <div className="mt-3 grid gap-3">
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-white/10 bg-[#0b1020] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/60"
                  placeholder="Current password"
                />
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-white/10 bg-[#0b1020] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/60"
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={onPasswordUpdate}
                  disabled={savingPassword}
                  className="cursor-pointer rounded-lg border border-fuchsia-300/40 bg-fuchsia-300/10 px-3 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-300/20 disabled:opacity-60"
                >
                  {savingPassword ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Quick Actions
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setActiveUserSection("profile")}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUserSection("security")}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Change password
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogoutAllDevices}
              disabled={endingSessions}
              className="cursor-pointer mt-3 rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-60"
            >
              {endingSessions
                ? "Ending sessions..."
                : "Logout From All Devices"}
            </button>
          </div>
        );
      case "notifications":
        return (
          <div className="grid gap-4">
            <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Notifications
              </p>
              <div className="mt-3 grid gap-2 text-sm text-slate-200">
                {notifications.map((notice) => (
                  <p key={notice} className="rounded-lg bg-white/5 px-2.5 py-2">
                    {notice}
                  </p>
                ))}
              </div>
            </div>{" "}
            <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                All Your Sessions
              </p>
              <div className="mt-3 grid gap-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-lg border border-white/10 bg-[#0b1020] px-3 py-2 text-sm text-slate-200"
                  >
                    <p>
                      {session.isCurrent
                        ? "Current session"
                        : "Previous session"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Started: {formatDate(session.createdAt)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Expires: {formatDate(session.expiresAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Quick Actions
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setActiveUserSection("profile")}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUserSection("security")}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Change password
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr]">
      <UserSectionNav
        sections={userMenuSections}
        activeSection={activeUserSection}
        currentSectionLabel={currentSectionLabel}
        sectionMenuOpen={sectionMenuOpen}
        setSectionMenuOpen={setSectionMenuOpen}
        setActiveSection={setActiveUserSection}
      />
      <div>{renderContent()}</div>
    </div>
  );
}
