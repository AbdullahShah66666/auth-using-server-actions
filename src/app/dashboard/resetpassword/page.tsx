"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/actions/authActions";

const passwordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
});

type passwordData = z.infer<typeof passwordSchema>;

function ResetPassword() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<passwordData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: passwordData) => {
    try {
      const res = await resetPassword(data);

      if (res?.success) {
        console.log(res.message);
        toast.success(res?.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "dark",
          className: "cursor-pointer",
        });
        reset();

        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        console.log(res?.error);
      }
    } catch (error) {
      console.log("Submission Failed: ", error);
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
      <div className="relative min-h-screen overflow-hidden bg-[#05060d] text-white">
        <div className="pointer-events-none absolute -top-20 left-10 h-56 w-56 rounded-full bg-cyan-400/30 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 right-8 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[150px]" />
        <div className="pointer-events-none absolute right-1/3 top-16 h-48 w-48 rounded-full bg-indigo-400/25 blur-[120px]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-16">
          <div className="grid w-full max-w-3xl gap-8 rounded-3xl border border-white/10 bg-[#0b1020]/80 p-10 shadow-[0_30px_90px_rgba(5,6,13,0.7)] backdrop-blur lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-4">
              <p className="w-fit rounded-full border border-cyan-300/40 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
                Reset access
              </p>
              <h1 className="text-3xl font-semibold md:text-4xl">
                Set a fresh password.
              </h1>
              <p className="max-w-md text-sm text-slate-300">
                Keep it strong and memorable. You are almost back in.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="neon-field">
                <label className="neon-label mb-2 block tracking-[0.3em] text-slate-200">
                  New password
                </label>
                <input
                  className="neon-input w-full rounded-xl border border-cyan-400/30 bg-[#0a1020] px-4 py-3 text-sm text-white shadow-[0_0_20px_rgba(34,211,238,0.1)] outline-none focus:ring-2 focus:ring-cyan-300/30"
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword")}
                />
              </div>
              {errors.newPassword && (
                <span className="text-rose-300 text-xs">
                  {errors.newPassword.message}
                </span>
              )}
              <button
                type="submit"
                className="group relative mt-2 inline-flex items-center justify-center overflow-hidden rounded-full border border-cyan-200/50 bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-[#05060d] shadow-[0_15px_35px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(56,189,248,0.45)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/30 blur-xl transition duration-700 group-hover:translate-x-full" />
                <span className="relative">Update password</span>
              </button>
            </form>
          </div>
        </div>
      </div>
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

export default ResetPassword;
