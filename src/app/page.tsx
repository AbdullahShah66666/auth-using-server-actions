import Link from "next/link";

export default function Home() {
  return (
    <main className="app-surface">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center gap-6">
            <p className="w-fit rounded-full border border-cyan-300/40 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
              Authentication Portal
            </p>
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Secure access for users and administrators.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                Register an account, sign in securely, and manage your session
                from a focused dashboard built for clarity and control.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="neon-primary-btn px-5 py-3 text-sm font-semibold"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="neon-ghost-btn px-5 py-3 text-sm font-semibold"
              >
                Create account
              </Link>
            </div>
          </section>

          <section className="glass-panel rounded-3xl p-8">
            <div className="grid gap-4">
              <div className="glass-card rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Access flow
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Authentication, refresh handling, and dashboard access are
                  managed through the server.
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Admin tools
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Authorized administrators can review users and manage
                  accounts from the dashboard.
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Session safety
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Sessions are stored and validated on the server to keep access
                  controlled and consistent.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
