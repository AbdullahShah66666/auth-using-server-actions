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
      <ToastContainer />
      <div className="bg-gray-600">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Enter New Password: </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <span className="text-red-600 text-sm">
              {errors.newPassword.message}
            </span>
          )}
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
