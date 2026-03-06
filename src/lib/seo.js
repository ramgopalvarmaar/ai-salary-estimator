import { siteConfig } from "./site";

function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, siteConfig.url).toString();
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
}) {
  const pageTitle = title || siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const url = absoluteUrl(path);

  return {
    title: title ? { absolute: pageTitle } : pageTitle,
    description: pageDescription,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      type,
      images: [
        {
          url: absoluteUrl(siteConfig.ogImage),
          width: 1200,
          height: 630,
          alt: `${pageTitle} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [absoluteUrl(siteConfig.ogImage)],
    },
  };
}

export function buildFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildWebApplicationSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: page.heroTitle,
    description: page.description,
    url: absoluteUrl(page.path),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "AI salary calculator",
      "Salary range benchmark",
      "Compensation confidence score",
      "Negotiation report preview",
      "Shareable market worth summary",
    ],
  };
}

export function buildBreadcrumbSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.heroTitle,
        item: absoluteUrl(page.path),
      },
    ],
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}
