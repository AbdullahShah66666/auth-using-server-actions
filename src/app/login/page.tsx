"use client";

import { useEffect } from "react";
import { loginUser } from "@/actions/authActions.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username or Email must be entered"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

type ToastType = "success" | "error" | "info" | "warning";

function Login() {
  const searchParams = useSearchParams();
  const dashboardMessage = searchParams.get("message");
  const pathname = usePathname();
  
  const dbMsg = "dashboard-message";
  const loginToastID = "login-toast-id";

  const errorloginToastID = "error-login-toast-id";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!dashboardMessage) return;

    toast.warn(dashboardMessage, {
      toastId: dbMsg,
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      pauseOnHover: true,
      theme: "dark",
      className: "cursor-pointer",
    });

    router.replace(pathname, { scroll: false });
  }, [dashboardMessage, router, pathname]);

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await loginUser(data);

      const toastType = res?.toastType;

      console.log(res);

      if (res?.status === 200) {
        toast.success(res?.message, {
          toastId: loginToastID,
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "dark",
          className: "cursor-pointer",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
        reset();
      } else {
        const errormsg = res?.error;
        /*         const toastMethod =
          typeof toastType === "string" && toastType in toast
            ? (toast as any)[toastType]
            : toast.info; */

        const toastMethod = toast[toastType as ToastType] ?? toast.info;

        toastMethod(errormsg, {
          toastId: errorloginToastID,
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "dark",
          className: "cursor-pointer",
        });
      }
    } catch (error) {
      console.error("Submission Failed: ", error);
    }
  };

  return (
    <>
      <ToastContainer className={"font-semibold"}/>
      <div className="text-black flex min-h-screen flex-col items-center justify-center bg-gray-400">
        <h1 className="mb-6 text-3xl font-bold">Login</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-80 space-y-4 bg-gray-500 p-6"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Username OR Email
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("identifier")}
              />
              {errors.identifier && (
                <span className="text-red-700 text-sm">
                  {errors.identifier.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-700 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
