"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bounce, Slide, ToastContainer, Zoom, toast } from "react-toastify";
import { registerUser } from "@/actions/authActions.js";
import { useRouter } from "next/navigation";

const registrationSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type formData = z.infer<typeof registrationSchema>;

function Register() {
  const router = useRouter();
  const regToastID = "reg-toast-id";

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
      <ToastContainer />
      <div className="text-black flex min-h-screen flex-col items-center justify-center bg-gray-400">
        <h1 className="mb-6 text-3xl font-bold">Register</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-80 space-y-4 bg-gray-500 p-6"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline focus:ring-2 focus:ring-blue-500"
                {...register("username")}
              />
              {errors.username && (
                <span className="text-red-700 text-sm">
                  {errors.username.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-700 text-sm">
                  {errors.email.message}
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
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
