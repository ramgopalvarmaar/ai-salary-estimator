export const siteConfig = {
  name: "AI Salary Calculator",
  shortName: "Salary Estimator",
  description:
    "AI salary calculator that researches real-time web data from Glassdoor, Levels.fyi, and other sources to estimate your market worth for any role and location.",
  url: "https://ai-powered-salary-estimator.vercel.app",
  creator: "AI Salary Calculator",
  ogImage: "/opengraph-image",
  premiumReportBasePriceUsd: 1,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
  premiumReportUrl:
    process.env.NEXT_PUBLIC_REPORT_CHECKOUT_URL || "/market-worth-report",
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/ai-salary-calculator", label: "AI Salary Calculator" },
    { href: "/ai-compensation-calculator", label: "Compensation Calculator" },
    { href: "/salary-negotiation", label: "Salary Negotiation" },
    { href: "/market-worth-report", label: "Market Worth Report" },
  ],
};
