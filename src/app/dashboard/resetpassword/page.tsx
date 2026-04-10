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
        progressClassName="neon-toast-progress"
      />
      <div className="app-surface">
        <div className="pointer-events-none absolute -top-20 left-10 h-56 w-56 rounded-full bg-cyan-400/30 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 right-8 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[150px]" />
        <div className="pointer-events-none absolute right-1/3 top-16 h-48 w-48 rounded-full bg-indigo-400/25 blur-[120px]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-16">
          <div className="glass-panel grid w-full max-w-3xl gap-8 rounded-3xl p-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-4">
              <p className="w-fit rounded-full border border-cyan-300/40 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
                Password security
              </p>
              <h1 className="text-3xl font-semibold md:text-4xl">
                Update your password.
              </h1>
              <p className="max-w-md text-sm text-slate-300">
                Choose a strong password that you do not use elsewhere.
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
                  placeholder="Enter a new password"
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
                className="neon-primary-btn mt-2 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
              >
                Save password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
