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
            Secure Access Portal
          </Link>
        </h1>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="cursor-pointer nav-toggle inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:border-cyan-300/60"
        >
          <span className={`px-1 hamburger ${menuOpen ? "is-open" : ""}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
      <div
        className={`nav-panel absolute left-0 right-0 top-0 z-30 text-white ${
          menuOpen ? "is-open" : "is-closed"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="border-b border-white/10 bg-[#05060d]/95 px-6 pb-6 pt-20 shadow-[0_25px_60px_rgba(5,6,13,0.65)] backdrop-blur">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="btn btn-one neon-nav-btn w-full justify-center"
            >
              <span>Sign up</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="btn btn-one neon-nav-btn w-full justify-center"
            >
              <span>Sign in</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="btn btn-one neon-nav-btn w-full justify-center"
            >
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
