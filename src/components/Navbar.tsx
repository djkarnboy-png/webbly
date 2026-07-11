"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "./Button";
import { RequestButton } from "./RequestButton";

const navItems = [
  { href: "/templates", label: "Browse templates" },
  { href: "/#categories", label: "Categories" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/creators", label: "For Creators" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Webbly home"
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="h-7 w-10 shrink-0"
            viewBox="0 0 64 44"
            role="img"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="webbly-mark-gradient" x1="4" y1="6" x2="60" y2="38">
                <stop stopColor="#2563eb" />
                <stop offset="0.55" stopColor="#1d4ed8" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <path
              d="M8 8 L20 36 L32 13 L44 36 L56 8"
              fill="none"
              stroke="url(#webbly-mark-gradient)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="12"
            />
          </svg>
          <span className="text-[26px] font-semibold leading-none text-slate-950">
            webbly
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive =
              item.href !== "/" &&
              item.href.startsWith("/") &&
              pathname === item.href.split("#")[0];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <RequestButton size="sm" variant="outline" requestType="general">
            Request website
          </RequestButton>
          <ButtonLink href="/creators" size="sm">
            List a template
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-5 bg-current transition ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-4 h-0.5 w-5 bg-current transition ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <RequestButton
                className="w-full"
                variant="outline"
                requestType="general"
                onClick={() => setIsOpen(false)}
              >
                Request website
              </RequestButton>
              <ButtonLink href="/creators" className="w-full" onClick={() => setIsOpen(false)}>
                List a template
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
