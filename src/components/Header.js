"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-goog-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-[22px] font-medium tracking-tight text-goog-gray-900"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {siteConfig.navLinks
            .filter((l) => l.href !== "/")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm text-goog-gray-800 transition-colors hover:bg-goog-gray-100"
              >
                {link.label}
              </Link>
            ))}
        </nav>
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="inline-flex items-center justify-center rounded-lg p-2 text-goog-gray-700 transition-colors hover:bg-goog-gray-100 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-goog-gray-200 bg-white md:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-3 sm:px-6">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-goog-gray-800 transition-colors hover:bg-goog-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
