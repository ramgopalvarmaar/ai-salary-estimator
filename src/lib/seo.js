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
      locale: "en_US",
      type,
      images: [
        {
          url: absoluteUrl(siteConfig.ogImage),
          width: 1200,
          height: 630,
          alt: `${pageTitle} – ${siteConfig.name}`,
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
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "AI salary calculator",
      "Real-time web salary research",
      "Salary range benchmark",
      "Compensation confidence score",
      "Resume-aware analysis",
      "Negotiation report preview",
      "Shareable market worth summary",
      "Data source citations",
    ],
    creator: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function buildBreadcrumbSchema(page) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl("/"),
    },
  ];

  if (page.path !== "/") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: page.heroTitle,
      item: absoluteUrl(page.path),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/favicon.svg"),
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: absoluteUrl("/"),
      availableLanguage: "English",
    },
  };
}

export function buildHowToSchema(page) {
  if (!page.howItWorks) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${page.heroTitle}`,
    description: page.description,
    totalTime: "PT2M",
    step: page.howItWorks.map((item, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: item.step,
      text: item.description,
    })),
  };
}
