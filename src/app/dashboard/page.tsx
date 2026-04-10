"use client";

import AdminUsersPanel from "@/components/dashboard/AdminUsersPanel";
import UserWorkspacePanel from "@/components/dashboard/UserWorkspacePanel";
import useDashboardData from "@/components/dashboard/useDashboardData";
import { useState } from "react";
import type { CSSProperties } from "react";
import { ToastContainer } from "react-toastify";

type Cursor = {
  x: number;
  y: number;
};

export default function Dashboard() {
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);
  const {
    username,
    role,
    users,
    usersLoading,
    usersError,
    profile,
    sessions,
    profileForm,
    setProfileForm,
    passwordForm,
    setPasswordForm,
    savingProfile,
    savingPassword,
    endingSessions,
    activeUserSection,
    setActiveUserSection,
    sectionMenuOpen,
    setSectionMenuOpen,
    loadAdminUsers,
    handleCreateUser,
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    handleProfileUpdate,
    handlePasswordUpdate,
    handleLogoutAllDevices,
    handleLogout,
    formatDate,
    activeSessionsCount,
    notifications,
    userMenuSections,
    currentSectionLabel,
  } = useDashboardData();

  return (
    <>
      <ToastContainer
        className="neon-toast-container font-semibold"
        toastClassName="neon-toast"
        progressClassName="neon-toast-progress"
      />

      <div
        className="app-surface cursor-react"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setCursor({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }}
        onMouseEnter={() => setCursorActive(true)}
        onMouseLeave={() => setCursorActive(false)}
        style={
          {
            "--cursor-x": `${cursor.x}px`,
            "--cursor-y": `${cursor.y}px`,
          } as CSSProperties
        }
      >
        <div
          className={`cursor-glow ${cursorActive ? "cursor-glow-active" : ""}`}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -top-16 right-10 h-72 w-72 rounded-full bg-cyan-400/30 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[140px]" />

        <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-0 lg:py-0">
          <div className="glass-panel grid w-full max-w-none gap-8 rounded-2xl p-5 lg:min-h-screen lg:rounded-none lg:border-x-0 lg:border-y-0 lg:p-10 xl:p-12">
            <div className="flex flex-col gap-6 sm:gap-4">
              <p className="w-fit rounded-full border border-cyan-300/40 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
                Dashboard
              </p>

              <div className="flex justify-between">
                <h1 className="text-3xl font-semibold md:text-4xl">
                  User management dashboard
                </h1>
              </div>

              <div className="glass-card rounded-xl p-4 sm:rounded-2xl sm:p-5">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Session status
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {username
                        ? `Signed in as ${username}`
                        : "Loading session details"}
                    </p>
                  </div>
                  <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {role ? role.toUpperCase() : "SESSION ACTIVE"}
                  </span>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 sm:rounded-2xl sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Manage Your Account
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      {role === "admin"
                        ? "Database user records are available for administrative review."
                        : "Use your workspace menu to access personal tools and account sections."}
                    </p>
                  </div>
                  {role === "admin" && (
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        onClick={loadAdminUsers}
                        className="cursor-pointer w-full rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/10 sm:w-auto"
                      >
                        Refresh list
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateUser}
                        className="cursor-pointer w-full rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/20 sm:w-auto"
                      >
                        Add user
                      </button>
                    </div>
                  )}
                </div>
                <AdminUsersPanel
                  users={users}
                  usersLoading={usersLoading}
                  usersError={usersError}
                  onViewUser={handleViewUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />
              </div>

              <UserWorkspacePanel
                username={username}
                role={role}
                profile={profile}
                sessions={sessions}
                activeSessionsCount={activeSessionsCount}
                notifications={notifications}
                activeUserSection={activeUserSection}
                setActiveUserSection={setActiveUserSection}
                sectionMenuOpen={sectionMenuOpen}
                setSectionMenuOpen={setSectionMenuOpen}
                userMenuSections={userMenuSections}
                currentSectionLabel={currentSectionLabel}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                savingProfile={savingProfile}
                savingPassword={savingPassword}
                endingSessions={endingSessions}
                onProfileUpdate={handleProfileUpdate}
                onPasswordUpdate={handlePasswordUpdate}
                onLogoutAllDevices={handleLogoutAllDevices}
                onLogout={handleLogout}
                formatDate={formatDate}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
