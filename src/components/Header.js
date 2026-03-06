import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Header() {
  return (
    <header className="border-b border-goog-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-[22px] font-medium tracking-tight text-goog-gray-900"
        >
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
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
      </div>
    </header>
  );
}
