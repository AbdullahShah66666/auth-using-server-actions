"use client";

import { logout } from "@/actions/authActions.js";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";

const metrics = [
  { label: "Session Health", value: "Stable", tone: "text-cyan-200" },
  { label: "Latency", value: "32ms", tone: "text-fuchsia-200" },
  { label: "Deploys", value: "3 today", tone: "text-indigo-200" },
];

const activity = [
  "New login detected",
  "Password policy verified",
  "Workspace synced",
];

export default function Dashboard() {
  //  const router = useRouter();
  const [message, setMessage] = useState("");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);
  const welcomeShownRef = useRef(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const refreshRes = await axios.get("/api/auth/refresh");
        if (!refreshRes.data?.success) {
          setMessage(refreshRes.data?.message);
          await new Promise((r) => setTimeout(r, 2500));
          return logout();
        }

        const userRes = await axios.get("/api/auth/me");

        if (userRes.data?.success && !welcomeShownRef.current) {
          welcomeShownRef.current = true;
          toast.success(`Welcome back, ${userRes.data.username} `, {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadUser();
  }, []);

  /*   useEffect(() => {
    axios
      .get("/api/auth/refresh")
      .then(async (response) => {
        const res = response.data;
        console.log(res.message);
        console.log(res);

        const delay = (ms: number | undefined) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        if (!res?.success) {
          setMessage(res?.message);
          await delay(2500);
          return logout(); // actually awaiting in the backend also.
        }
      })
      .catch((error) => {
        console.error("request failed: ", error);
      });
  }, [router]);
 */
  useEffect(() => {
    if (!message) return;
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      theme: "dark",
      className: "cursor-pointer",
    });
  }, [message]);

  const handleLogout = async () => {
    const res = await logout();
    console.log(res);
  };

  return (
    <>
      <ToastContainer
        className="neon-toast-container font-semibold"
        toastClassName="neon-toast"
        bodyClassName="neon-toast-body"
        progressClassName="neon-toast-progress"
      />
      <div
        className="cursor-react relative min-h-screen overflow-hidden bg-[#05060d] text-white"
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
          } as React.CSSProperties
        }
      >
        <div
          className={`cursor-glow ${cursorActive ? "cursor-glow-active" : ""}`}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -top-16 right-10 h-72 w-72 rounded-full bg-cyan-400/30 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[140px]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-16">
          <div className="grid w-full gap-6 rounded-3xl border border-white/10 bg-[#0b1020]/80 p-10 shadow-[0_30px_90px_rgba(5,6,13,0.7)] backdrop-blur lg:grid-cols-[1.25fr_1fr]">
            <div className="flex flex-col gap-4">
              <p className="w-fit rounded-full border border-cyan-300/40 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
                Dashboard
              </p>
              <h1 className="text-3xl font-semibold md:text-4xl">
                Neon control, clean focus.
              </h1>
              <p className="max-w-md text-sm text-slate-300">
                Quick access to essentials with a high-voltage finish.
              </p>

              <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Live status
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-white/10 bg-[#0a1020] px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                        {metric.label}
                      </p>
                      <p className={`mt-2 text-lg font-semibold ${metric.tone}`}>
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Recent activity
                </p>
                <div className="mt-3 grid gap-2 text-sm text-slate-300">
                  {activity.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0a1020]/70 px-3 py-2"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Quick actions
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <button className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/10">
                    View system health
                  </button>
                  <button className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/60 hover:bg-white/10">
                    Review sessions
                  </button>
                </div>
              </div>

              <button
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-cyan-200/50 bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-[#05060d] shadow-[0_15px_35px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(56,189,248,0.45)]"
                onClick={handleLogout}
              >
                <span className="absolute inset-0 -translate-x-full bg-white/30 blur-xl transition duration-700 group-hover:translate-x-full" />
                <span className="relative">Logout</span>
              </button>
              <Link href="/dashboard/resetpassword" className="block">
                <button className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(15,23,42,0.5)] transition hover:border-cyan-300/60 hover:bg-white/10">
                  Reset Password
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .cursor-react {
          position: relative;
        }

        .cursor-glow {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: radial-gradient(
              300px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
              rgba(56, 189, 248, 0.2),
              transparent 60%
            ),
            radial-gradient(
              160px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
              rgba(99, 102, 241, 0.2),
              transparent 65%
            );
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 200ms ease, transform 260ms ease, background 120ms ease;
        }

        .cursor-glow-active {
          opacity: 0.9;
          transform: scale(1);
        }
      `}</style>
      <style jsx global>{`
        .neon-toast-container {
          width: min(360px, 92vw);
        }

        .neon-toast {
          background: rgba(7, 11, 20, 0.95);
          border: 1px solid rgba(56, 189, 248, 0.5);
          color: #e2e8f0;
          box-shadow: 0 18px 45px rgba(14, 165, 233, 0.2);
          backdrop-filter: blur(12px);
        }

        .neon-toast-body {
          font-size: 0.9rem;
          letter-spacing: 0.01em;
        }

        .neon-toast-progress {
          background: linear-gradient(90deg, #22d3ee, #818cf8, #f472b6);
        }

        .neon-toast .Toastify__toast-icon {
          filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.6));
        }

        .neon-toast .Toastify__close-button {
          color: #e2e8f0;
          opacity: 0.7;
        }
      `}</style>
    </>
  );
}
