"use client";

import React, { useState } from "react";
import Link from "next/link";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative border-b border-white/10 bg-[#05060d]/95">
      <div className="pointer-events-none absolute -top-20 left-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-[120px]" />
      <div className="pointer-events-none absolute -top-16 right-4 h-60 w-60 rounded-full bg-fuchsia-500/20 blur-[130px]" />

      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-white">
        <h1 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
          <Link href="/" className="neon-link neon-link-glow">
            Authentication System
          </Link>
        </h1>
        <nav className="hidden items-center gap-3 text-sm font-medium md:flex">
          <Link
            href="/register"
            className="neon-link neon-link-glow rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100 transition hover:border-cyan-300/60 hover:text-cyan-200"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="neon-link neon-link-glow rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100 transition hover:border-fuchsia-300/60 hover:text-fuchsia-200"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="neon-link neon-link-glow rounded-full border border-cyan-200/60 bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 px-4 py-2 font-semibold text-[#05060d] shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(56,189,248,0.45)]"
          >
            Dashboard
          </Link>
        </nav>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:border-cyan-300/60 md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 bg-white transition ${
                menuOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-6 bg-white transition ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-6 bg-white transition ${
                menuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`absolute left-0 right-0 top-0 z-30 text-white transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="border-b border-white/10 bg-[#05060d]/95 px-6 pb-6 pt-20 shadow-[0_25px_60px_rgba(5,6,13,0.65)] backdrop-blur">
          <div className="flex flex-col gap-3">
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="neon-link neon-link-glow rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-300/60 hover:text-cyan-200"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="neon-link neon-link-glow rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-fuchsia-300/60 hover:text-fuchsia-200"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="neon-link neon-link-glow rounded-xl border border-cyan-200/60 bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 px-4 py-3 text-sm font-semibold text-[#05060d] shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(56,189,248,0.45)]"
          >
            Dashboard
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
