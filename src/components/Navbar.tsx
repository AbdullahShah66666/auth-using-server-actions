import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <div className="bg-gray-800 flex justify-between p-4">
      <h1 className="font-semibold">
        <Link href="/">Authenication System</Link>
      </h1>
      <nav className="space-x-4">
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
}

export default Navbar;
