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
      <div className="min-h-screen bg-[#fafbff]">
        <Header />

        <main id="main-content">
          {/* Hero + Estimator */}
          <section
            aria-label="Salary estimator tool"
            className="relative overflow-hidden"
          >
            <div className="hero-gradient absolute inset-0" />
            <div className="absolute inset-0 bg-hero-mesh" />
            <div className="relative section-padding pb-20 pt-16">
              <EstimatorTool page={resolvedPage} pricing={pricing} />
            </div>
          </section>

          {/* Benefits */}
          <section
            aria-label="Key benefits"
            className="relative border-t border-goog-gray-200/60 bg-white"
          >
            <div className="section-padding py-20">
              <div className="mb-12 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                  Why professionals trust us
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-goog-gray-900 sm:text-4xl">
                  Built for career-defining decisions
                </h2>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {resolvedPage.benefits.map((benefit, i) => (
                  <div
                    key={benefit.title}
                    className="group rounded-2xl border border-goog-gray-200/80 bg-gradient-to-b from-white to-goog-gray-50/50 p-8 transition-all duration-300 hover:border-accent/20 hover:shadow-elegant"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                      {i === 0 && (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                        </svg>
                      )}
                      {i === 1 && (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                      )}
                      {i === 2 && (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      )}
                      {i > 2 && (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-goog-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-goog-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          {resolvedPage.howItWorks && (
            <section
              aria-label="How it works"
              className="border-t border-goog-gray-200/60 bg-gradient-to-b from-goog-gray-50/80 to-white"
            >
              <div className="section-padding py-20">
                <div className="mb-14 text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                    Simple process
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-goog-gray-900 sm:text-4xl">
                    How it works
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-base text-goog-gray-600">
                    Three steps to a data-backed salary estimate.
                  </p>
                </div>
                <ol className="grid gap-8 sm:grid-cols-3">
                  {resolvedPage.howItWorks.map((item, index) => (
                    <li key={item.step} className="group relative text-center">
                      {index < resolvedPage.howItWorks.length - 1 && (
                        <div className="absolute left-1/2 top-7 hidden h-px w-full bg-gradient-to-r from-accent/30 to-transparent sm:block" />
                      )}
                      <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-purple-600 text-lg font-bold text-white shadow-glow transition-shadow duration-300 group-hover:shadow-glow-lg">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-goog-gray-900">
                        {item.step}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-goog-gray-600">
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
              className="border-t border-goog-gray-200/60 bg-white"
            >
              <div className="section-padding py-20">
                <article className="prose prose-sm mx-auto max-w-3xl text-goog-gray-700">
                  <h2 className="!mb-6 font-display !text-3xl font-semibold tracking-tight text-goog-gray-900">
                    {resolvedPage.seoContent.heading}
                  </h2>
                  {resolvedPage.seoContent.paragraphs.map((paragraph, i) => (
                    <p key={i} className="leading-relaxed">
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
            className="border-t border-goog-gray-200/60 bg-gradient-to-b from-goog-gray-50/80 to-white"
          >
            <div className="section-padding py-20">
              <div className="mb-14 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                  Choose your plan
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-goog-gray-900 sm:text-4xl">
                  Free estimate vs. premium report
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base text-goog-gray-600">
                  Start with a free salary range. Upgrade to the premium report when
                  you need negotiation-ready guidance.
                </p>
              </div>
              <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
                <div className="rounded-2xl border border-goog-gray-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-elegant">
                  <p className="text-xs font-semibold uppercase tracking-widest text-goog-gray-500">
                    Free
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-goog-gray-900">
                    Quick estimate
                  </h3>
                  <div className="mt-6 space-y-4 text-sm text-goog-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-50 text-xs text-accent" aria-hidden="true">&#10003;</span>
                      Salary range with confidence level
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-50 text-xs text-accent" aria-hidden="true">&#10003;</span>
                      Market position summary
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-50 text-xs text-accent" aria-hidden="true">&#10003;</span>
                      Higher-paying role suggestions
                    </div>
                  </div>
                </div>
                <div className="shimmer-border relative rounded-2xl bg-gradient-to-br from-accent-50 via-white to-purple-50 p-8 shadow-glow">
                  <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-accent to-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    Recommended
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    Premium
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-goog-gray-900">
                    AI Salary Report
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-accent">
                    {pricing.premiumReportPrice} one-time
                  </p>
                  <div className="mt-6 space-y-4 text-sm text-goog-gray-700">
                    {resolvedPage.reportBullets.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs text-white" aria-hidden="true">&#10003;</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related pages */}
          <section
            aria-label="Related tools"
            className="border-t border-goog-gray-200/60 bg-white"
          >
            <div className="section-padding py-20">
              <div className="mb-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                  More tools
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-goog-gray-900 sm:text-4xl">
                  Explore more tools
                </h2>
              </div>
              <nav aria-label="Related salary tools" className="flex flex-wrap justify-center gap-3">
                {resolvedPage.internalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="btn-secondary rounded-full"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </section>

          {/* FAQ */}
          <section aria-label="Frequently asked questions" className="border-t border-goog-gray-200/60 bg-gradient-to-b from-goog-gray-50/80 to-white">
            <div className="section-padding py-20">
              <div className="mb-14 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                  FAQ
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-goog-gray-900 sm:text-4xl">
                  Frequently asked questions
                </h2>
              </div>
              <dl className="mx-auto max-w-3xl divide-y divide-goog-gray-200/80">
                {resolvedPage.faq.map((item) => (
                  <div key={item.question} className="py-7">
                    <dt className="text-base font-semibold text-goog-gray-900">
                      {item.question}
                    </dt>
                    <dd className="mt-3 text-sm leading-relaxed text-goog-gray-600">
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
