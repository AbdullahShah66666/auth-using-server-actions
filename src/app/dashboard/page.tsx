"use client";

import { logout } from "@/actions/authActions.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
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
      <ToastContainer />
      <div className="flex flex-col gap-3 items-center">
        <h1>I am a Dashboard</h1>
        <div className="flex justify-between gap-2">
          <button
            className="cursor-pointer py-2 px-3 rounded-3xl bg-blue-600 focus:ring-2 focus:ring-blue-400"
            onClick={handleLogout}
            //          disabled
          >
            Logout
          </button>
          <Link href="/dashboard/resetpassword">
            <button className="cursor-pointer py-2 px-3 rounded-3xl bg-blue-600 focus:ring-2 focus:ring-blue-400">
              Reset Password
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
