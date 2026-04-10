import type { DashboardUser } from "@/components/dashboard/types";

type AdminUsersPanelProps = {
  usersLoading: boolean;
  usersError: string | null;
  users: DashboardUser[];
  onViewUser: (user: DashboardUser) => void;
  onEditUser: (user: DashboardUser) => void;
  onDeleteUser: (user: DashboardUser) => void;
};

export default function AdminUsersPanel({
  usersLoading,
  usersError,
  users,
  onViewUser,
  onEditUser,
  onDeleteUser,
}: AdminUsersPanelProps) {
  return (
    <div className="mt-4 grid gap-4">
      {usersLoading ? (
        <div className="rounded-xl border border-white/10 bg-[#0a1020]/70 px-4 py-6 text-sm text-slate-300">
          Loading user records...
        </div>
      ) : usersError ? (
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-6 text-sm text-rose-200">
          {usersError}
        </div>
      ) : users.length > 0 ? (
        users.map((user) => (
          <div
            key={user._id}
            className="rounded-xl border border-white/10 bg-[#0a1020]/70 px-4 py-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold text-white">
                  {user.username}
                </p>
                <p className="break-all text-sm text-slate-400">{user.email}</p>
              </div>

              <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.25em] ${
                    user.role === "admin"
                      ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
                      : "border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  {user.role}
                </span>
                <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
                  <button
                    onClick={() => onViewUser(user)}
                    className="cursor-pointer w-full rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/10 sm:w-auto"
                    type="button"
                  >
                    View details
                  </button>
                  <button
                    onClick={() => onEditUser(user)}
                    className="cursor-pointer w-full rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-fuchsia-300/60 hover:bg-white/10 sm:w-auto"
                    type="button"
                  >
                    Edit record
                  </button>
                  <button
                    onClick={() => onDeleteUser(user)}
                    className="cursor-pointer w-full rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20 sm:w-auto"
                    type="button"
                  >
                    Delete record
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0a1020]/70 px-4 py-6 text-sm text-slate-300">
          No user records were returned.
        </div>
      )}
    </div>
  );
}
