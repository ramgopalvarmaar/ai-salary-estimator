const premiumValueProps = [
  "Detailed skill premium analysis based on your resume and target role.",
  "Underpaid score with an estimate of earnings you may be leaving behind.",
  "Ready-to-use negotiation script and email draft tailored to your situation.",
];

const premiumPricePlaceholder = "{{premiumReportPrice}}";

const coreFaqs = [
  {
    question: "How does the AI salary calculator work?",
    answer:
      "When you submit your details, the AI first searches the web for current salary data for your specific role and city -- pulling from sources like Glassdoor, Levels.fyi, LinkedIn, Payscale, and others. It then uses that research to generate a salary range, confidence level, and personalized analysis. The sources are cited so you can verify the data.",
  },
  {
    question: "Is this based on real data or AI guesses?",
    answer:
      "Real data. The AI performs live web research before generating each estimate. You'll see the data sources it consulted listed alongside your results. This is fundamentally different from calculators that only use static datasets or AI training data.",
  },
  {
    question: "Do I need to upload a resume?",
    answer:
      "No. Resume upload is optional. Including one helps the AI factor in your specific skills and certifications for a more precise estimate, but role and location alone are enough to trigger the web research and get a solid baseline.",
  },
  {
    question: "What does the premium report include?",
    answer:
      `For ${premiumPricePlaceholder}, the premium report builds on the same web research with a detailed underpaid score, personalized negotiation scripts, a ready-to-send email draft, and a breakdown of where your compensation stands relative to the market data found.`,
  },
];

export const landingPages = {
  home: {
    key: "home",
    path: "/",
    title: "AI Salary Calculator | Estimate Your Market Worth",
    heroTitle: "Know what you're worth",
    description:
      "Estimate what you should be paid with an AI salary calculator that researches real salary data from the web for your role, location, and experience.",
    eyebrow: "AI Salary Calculator",
    intro:
      "Get a salary estimate backed by real-time web research. The AI searches current salary data from Glassdoor, Levels.fyi, LinkedIn, and other sources to build your personalized market analysis.",
    primaryKeyword: "AI salary calculator",
    secondaryKeywords: [
      "salary calculator ai",
      "know your worth salary calculator",
      "AI compensation calculator",
    ],
    benefits: [
      {
        title: "Real-time web research",
        description:
          "The AI searches live salary data from job market sources -- not just static training data.",
      },
      {
        title: "Source-backed numbers",
        description:
          "Every estimate cites the data sources it found, so you can verify the numbers yourself.",
      },
      {
        title: "Resume-aware analysis",
        description:
          "Upload your resume to factor in your specific skills and experience for a more precise estimate.",
      },
    ],
    reportBullets: premiumValueProps,
    faq: coreFaqs,
    internalLinks: [
      { href: "/ai-salary-calculator", label: "Salary Calculator" },
      { href: "/ai-compensation-calculator", label: "Compensation Calculator" },
      { href: "/salary-negotiation", label: "Negotiation Tool" },
      { href: "/market-worth-report", label: "Premium Report" },
    ],
  },
  calculator: {
    key: "calculator",
    path: "/ai-salary-calculator",
    title: "AI Salary Calculator | Free Salary Range Estimate",
    heroTitle: "Free AI Salary Calculator",
    description:
      "Use an AI salary calculator that researches live web data to estimate your pay range by role, city, and experience.",
    eyebrow: "Salary Calculator",
    intro:
      "The AI researches current salary data from Glassdoor, Levels.fyi, and other market sources before generating your estimate. Useful for job search prep, interview planning, or evaluating an offer.",
    primaryKeyword: "AI salary calculator",
    secondaryKeywords: [
      "salary calculator ai",
      "free ai salary calculator",
      "salary predictor",
    ],
    benefits: [
      {
        title: "Quick pay estimate",
        description:
          "Useful for job search prep, interview planning, and sanity-checking an offer.",
      },
      {
        title: "Location-adjusted",
        description:
          "Compensation varies significantly by city. Your estimate accounts for local market conditions.",
      },
      {
        title: "Upgrade when ready",
        description:
          "Start with the free estimate, then unlock a deeper report if you see real upside.",
      },
    ],
    reportBullets: premiumValueProps,
    faq: coreFaqs,
    internalLinks: [
      { href: "/", label: "Home" },
      { href: "/ai-compensation-calculator", label: "Compensation Calculator" },
      { href: "/market-worth-report", label: "Premium Report" },
    ],
  },
  compensation: {
    key: "compensation",
    path: "/ai-compensation-calculator",
    title: "AI Compensation Calculator | Benchmark Total Pay",
    heroTitle: "Benchmark your total compensation",
    description:
      "Estimate salary and compensation with AI that researches real market data, then see where your current pay may lag.",
    eyebrow: "Compensation Calculator",
    intro:
      "The AI searches current compensation data from the web to show how your total pay compares. Enter your details for an estimate grounded in real market numbers.",
    primaryKeyword: "AI compensation calculator",
    secondaryKeywords: [
      "AI salary estimator",
      "compensation benchmark",
      "know your worth salary report",
    ],
    benefits: [
      {
        title: "Total compensation view",
        description:
          "See how salary, current pay, and upside work together instead of a single generic number.",
      },
      {
        title: "Underpaid signal",
        description:
          "Get a quick indicator of whether your current compensation is below market rate.",
      },
      {
        title: "Negotiation angles",
        description:
          "Add your resume for role-specific talking points you can bring to interviews and reviews.",
      },
    ],
    reportBullets: premiumValueProps,
    faq: coreFaqs,
    internalLinks: [
      { href: "/", label: "Home" },
      { href: "/ai-salary-calculator", label: "Salary Calculator" },
      { href: "/salary-negotiation", label: "Negotiation Tool" },
    ],
  },
  negotiation: {
    key: "negotiation",
    path: "/salary-negotiation",
    title: "Salary Negotiation Tool | AI Market Worth and Scripts",
    heroTitle: "Negotiate with confidence",
    description:
      "Benchmark your market worth using AI-researched salary data, then get negotiation-ready talking points.",
    eyebrow: "Salary Negotiation",
    intro:
      "The AI researches what your role actually pays in your city right now, then generates negotiation scripts backed by real market data. No guesswork.",
    primaryKeyword: "salary negotiation tool",
    secondaryKeywords: [
      "AI salary negotiation",
      "counter offer salary tool",
      "know your worth negotiation",
    ],
    benefits: [
      {
        title: "Should you push for more?",
        description:
          "The free estimate tells you where you stand before you invest time in a full negotiation plan.",
      },
      {
        title: "Ready-made scripts",
        description:
          "The premium report includes negotiation openers and email drafts you can use right away.",
      },
      {
        title: "Career-stage aware",
        description:
          "Whether you're applying, interviewing, or reviewing an offer, the insights adapt to your situation.",
      },
    ],
    reportBullets: premiumValueProps,
    faq: coreFaqs,
    internalLinks: [
      { href: "/", label: "Home" },
      { href: "/ai-compensation-calculator", label: "Compensation Calculator" },
      { href: "/market-worth-report", label: "Premium Report" },
    ],
  },
  report: {
    key: "report",
    path: "/market-worth-report",
    title: "AI Salary Report | Know Your Worth Before You Negotiate",
    heroTitle: "Your personalized salary report",
    description:
      "Get a detailed AI salary report backed by real-time web research, with market positioning and negotiation-ready guidance.",
    eyebrow: "Premium Report",
    intro:
      "Go beyond the free estimate. The premium report uses real-time salary research to deliver a complete market positioning analysis, underpaid score, and negotiation scripts with cited sources.",
    primaryKeyword: "know your worth salary report",
    secondaryKeywords: [
      "AI salary report",
      "market worth report",
      "salary benchmark report",
    ],
    benefits: [
      {
        title: "Earnings-focused",
        description:
          "The report is built around how much more you could be earning, not just data for its own sake.",
      },
      {
        title: "Personalized to you",
        description:
          "Your role, location, experience, current pay, and resume all shape the analysis.",
      },
      {
        title: "Ready to act on",
        description:
          "Includes negotiation scripts, target roles, and a concise summary you can reference in conversations.",
      },
    ],
    reportBullets: [
      ...premiumValueProps,
      "One-time purchase with no subscription required.",
    ],
    faq: coreFaqs,
    internalLinks: [
      { href: "/", label: "Try the free estimate" },
      { href: "/salary-negotiation", label: "Negotiation Tool" },
      { href: "/ai-salary-calculator", label: "Salary Calculator" },
    ],
  },
};

export function hydrateLandingPage(page, pricing) {
  return {
    ...page,
    faq: page.faq.map((item) => ({
      ...item,
      answer: item.answer.replaceAll(
        premiumPricePlaceholder,
        pricing.premiumReportPrice
      ),
    })),
  };
}
