import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-goog-gray-200 bg-goog-gray-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-goog-gray-700 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="transition-colors hover:text-goog-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-goog-gray-900">
            Terms
          </Link>
          <Link href="/market-worth-report" className="transition-colors hover:text-goog-gray-900">
            Premium Report
          </Link>
        </div>
      </div>
    </footer>
  );
}
