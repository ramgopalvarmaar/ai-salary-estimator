import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function LegalPage({ title, description, children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-accent">Legal</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-goog-gray-900">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-goog-gray-700">
          {description}
        </p>
        <div className="prose mt-8 max-w-none prose-headings:font-medium prose-headings:text-goog-gray-900 prose-p:text-goog-gray-700 prose-li:text-goog-gray-700">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
