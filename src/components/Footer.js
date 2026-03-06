import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-goog-gray-200 bg-goog-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-goog-gray-900">
              {siteConfig.name}
            </p>
            <p className="mt-2 text-sm leading-6 text-goog-gray-600">
              AI-powered salary estimator that researches real-time web data to
              help you understand your market worth.
            </p>
          </div>

          <nav aria-label="Salary tools">
            <p className="text-sm font-semibold text-goog-gray-900">Tools</p>
            <ul className="mt-2 space-y-2 text-sm">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-goog-gray-600 transition-colors hover:text-goog-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal and company">
            <p className="text-sm font-semibold text-goog-gray-900">Company</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-goog-gray-600 transition-colors hover:text-goog-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-goog-gray-600 transition-colors hover:text-goog-gray-900"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-goog-gray-200 pt-6 text-sm text-goog-gray-500">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
