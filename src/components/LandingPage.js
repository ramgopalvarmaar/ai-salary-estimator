import Link from "next/link";
import EstimatorTool from "@/components/EstimatorTool";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StructuredData from "@/components/StructuredData";
import { hydrateLandingPage } from "@/lib/landingPages";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
  buildOrganizationSchema,
  buildWebApplicationSchema,
} from "@/lib/seo";
import { getVisitorPricing } from "@/lib/visitorPricing";

export default async function LandingPage({ page }) {
  const pricing = await getVisitorPricing();
  const resolvedPage = hydrateLandingPage(page, pricing);
  const schemas = [
    buildOrganizationSchema(),
    buildWebApplicationSchema(resolvedPage),
    buildFaqSchema(resolvedPage.faq),
    buildBreadcrumbSchema(resolvedPage),
    ...(resolvedPage.howItWorks ? [buildHowToSchema(resolvedPage)] : []),
  ];

  return (
    <>
      <StructuredData data={schemas} />
      <div className="min-h-screen bg-white">
        <Header />

        <main id="main-content">
          {/* Hero + Estimator */}
          <section
            aria-label="Salary estimator tool"
            className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8"
          >
            <EstimatorTool page={resolvedPage} pricing={pricing} />
          </section>

          {/* Benefits */}
          <section
            aria-label="Key benefits"
            className="border-t border-goog-gray-200 bg-goog-gray-50"
          >
            <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
              {resolvedPage.benefits.map((benefit) => (
                <div key={benefit.title}>
                  <h2 className="text-base font-semibold text-goog-gray-900">
                    {benefit.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-goog-gray-700">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          {resolvedPage.howItWorks && (
            <section
              aria-label="How it works"
              className="border-t border-goog-gray-200"
            >
              <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-medium text-goog-gray-900">
                  How it works
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-goog-gray-700">
                  Three steps to a data-backed salary estimate.
                </p>
                <ol className="mt-10 grid gap-8 sm:grid-cols-3">
                  {resolvedPage.howItWorks.map((item, index) => (
                    <li key={item.step} className="relative">
                      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <h3 className="text-base font-semibold text-goog-gray-900">
                        {item.step}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-goog-gray-700">
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* SEO content */}
          {resolvedPage.seoContent && (
            <section
              aria-label={resolvedPage.seoContent.heading}
              className="border-t border-goog-gray-200 bg-goog-gray-50"
            >
              <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <article className="prose prose-sm max-w-3xl text-goog-gray-800">
                  <h2 className="text-2xl font-medium text-goog-gray-900">
                    {resolvedPage.seoContent.heading}
                  </h2>
                  {resolvedPage.seoContent.paragraphs.map((paragraph, i) => (
                    <p key={i} className="mt-4 leading-7">
                      {paragraph}
                    </p>
                  ))}
                </article>
              </div>
            </section>
          )}

          {/* Free vs Premium comparison */}
          <section
            aria-label="Plan comparison"
            className="border-t border-goog-gray-200"
          >
            <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-medium text-goog-gray-900">
                Free estimate vs. premium report
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-goog-gray-700">
                Start with a free salary range. Upgrade to the premium report when
                you need negotiation-ready guidance.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-goog-gray-200 bg-white p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-goog-gray-700">
                    Free
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-goog-gray-900">
                    Quick estimate
                  </h3>
                  <ul className="mt-5 space-y-3 text-sm text-goog-gray-800">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-accent" aria-hidden="true">&#10003;</span>
                      Salary range with confidence level
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-accent" aria-hidden="true">&#10003;</span>
                      Market position summary
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-accent" aria-hidden="true">&#10003;</span>
                      Higher-paying role suggestions
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border-2 border-accent bg-accent-50 p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-accent">
                    Premium
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-goog-gray-900">
                    AI Salary Report
                  </h3>
                  <p className="mt-2 text-sm font-medium text-accent">
                    {pricing.premiumReportPrice} one-time
                  </p>
                  <ul className="mt-5 space-y-3 text-sm text-goog-gray-800">
                    {resolvedPage.reportBullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-0.5 text-accent" aria-hidden="true">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Related pages */}
          <section
            aria-label="Related tools"
            className="border-t border-goog-gray-200 bg-goog-gray-50"
          >
            <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-medium text-goog-gray-900">
                Explore more tools
              </h2>
              <nav aria-label="Related salary tools" className="mt-6 flex flex-wrap gap-3">
                {resolvedPage.internalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-goog-gray-300 bg-white px-4 py-2 text-sm font-medium text-goog-gray-800 transition-colors hover:border-accent hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </section>

          {/* FAQ */}
          <section aria-label="Frequently asked questions" className="border-t border-goog-gray-200">
            <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-medium text-goog-gray-900">
                Frequently asked questions
              </h2>
              <dl className="mt-8 max-w-3xl divide-y divide-goog-gray-200">
                {resolvedPage.faq.map((item) => (
                  <div key={item.question} className="py-6">
                    <dt className="text-base font-medium text-goog-gray-900">
                      {item.question}
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-goog-gray-700">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
