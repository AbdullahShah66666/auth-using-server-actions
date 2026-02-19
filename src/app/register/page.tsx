"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bounce, ToastContainer, Zoom, toast } from "react-toastify";
import { registerUser } from "@/actions/authActions.js";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registrationSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type formData = z.infer<typeof registrationSchema>;

function Register() {
  const router = useRouter();
  const regToastID = "reg-toast-id";
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<formData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: formData) => {
    try {
      //      console.log("Form Data:", data);
      const res = await registerUser(data);

      console.log(res);

      if (res?.status === 200) {
        if (!toast.isActive(regToastID))
          toast.success(res?.message || "Successfully Registered...", {
            toastId: regToastID,
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            theme: "dark",
            transition: Zoom,
          });
        reset();
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        if (!toast.isActive(regToastID)) {
          toast.error(res?.error || "User Already Exists.l..", {
            toastId: regToastID,
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            theme: "dark",
            transition: Bounce,
          });
        }
      }
    } catch (error) {
      console.error("Submission Failed: ", error);
    }
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
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/40 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-8 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-[140px]" />
        <div className="pointer-events-none absolute right-10 top-12 h-52 w-52 rounded-full bg-indigo-400/30 blur-[110px]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-16">
          <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[1.05fr_1fr]">
            <div className="flex flex-col justify-center gap-6">
              <p className="w-fit rounded-full border border-cyan-300/40 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
                Neon onboarding
              </p>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Register and step into the{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                    electric flow
                  </span>
                  .
                </h1>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 shadow-[0_0_40px_rgba(14,165,233,0.15)]" />
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#0b1020]/80 p-8 shadow-[0_25px_80px_rgba(5,6,13,0.7)] backdrop-blur"
              >
                <div>
                  <h2 className="text-2xl font-semibold">Create your account</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="neon-field">
                    <label className="neon-label mb-2 block tracking-[0.3em] text-slate-300">
                      Username
                    </label>
                    <input
                      type="text"
                      className="neon-input w-full rounded-xl border border-cyan-400/30 bg-[#0a1020] px-4 py-3 text-sm text-white shadow-[0_0_20px_rgba(34,211,238,0.1)] outline-none focus:ring-2 focus:ring-cyan-300/30"
                      placeholder="neon.handle"
                      {...register("username")}
                    />
                    {errors.username && (
                      <span className="mt-1 block text-xs text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                        {errors.username.message}
                      </span>
                    )}
                  </div>
                  <div className="neon-field">
                    <label className="neon-label mb-2 block tracking-[0.3em] text-slate-300">
                      Email
                    </label>
                    <input
                      type="email"
                      className="neon-input w-full rounded-xl border border-indigo-400/30 bg-[#0a1020] px-4 py-3 text-sm text-white shadow-[0_0_20px_rgba(129,140,248,0.1)] outline-none focus:ring-2 focus:ring-indigo-300/30"
                      placeholder="you@neonlabs.io"
                      {...register("email")}
                    />
                    {errors.email && (
                      <span className="mt-1 block text-xs text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="neon-field">
                    <label className="neon-label mb-2 block tracking-[0.3em] text-slate-300">
                      Password
                    </label>
                    <input
                      type="password"
                      className="neon-input w-full rounded-xl border border-fuchsia-400/30 bg-[#0a1020] px-4 py-3 text-sm text-white shadow-[0_0_20px_rgba(232,121,249,0.12)] outline-none focus:ring-2 focus:ring-fuchsia-300/30"
                      placeholder="••••••••"
                      {...register("password")}
                    />
                    {errors.password && (
                      <span className="mt-1 block text-xs text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="group relative mt-2 inline-flex items-center justify-center overflow-hidden rounded-full border border-cyan-200/50 bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-[#05060d] shadow-[0_15px_35px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(56,189,248,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/30 blur-xl transition duration-700 group-hover:translate-x-full" />
                  <span className="relative">
                    {isSubmitting ? "Registering..." : "Register"}
                  </span>
                </button>
              </form>
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
              320px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
              rgba(56, 189, 248, 0.25),
              transparent 60%
            ),
            radial-gradient(
              180px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
              rgba(236, 72, 153, 0.2),
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

export default Register;
