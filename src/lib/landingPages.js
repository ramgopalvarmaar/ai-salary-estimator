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

const homeFaqs = [
  ...coreFaqs,
  {
    question: "What roles and locations are supported?",
    answer:
      "Any role and any city worldwide. The AI searches current web data for your specific combination, so it works for software engineers in San Francisco, marketing managers in London, data analysts in Bangalore, and everything in between.",
  },
  {
    question: "How accurate is the salary estimate?",
    answer:
      "Accuracy depends on how much public salary data exists for your role and location. Popular roles in major markets tend to have high-confidence estimates with multiple sources. Niche roles or smaller cities may show wider ranges. The confidence level displayed with each estimate reflects this.",
  },
  {
    question: "Is my data kept private?",
    answer:
      "Yes. Your inputs are used only to generate the estimate and are not stored after the session. Resume files are processed in memory and discarded. See the privacy policy for full details.",
  },
];

const calculatorFaqs = [
  coreFaqs[0],
  coreFaqs[1],
  {
    question: "Can I use this for job interview preparation?",
    answer:
      "Absolutely. Knowing the market rate before an interview gives you a data-backed anchor for salary discussions. Enter the role and city for the position you are interviewing for, and use the estimate to set your expectations and negotiation range.",
  },
  {
    question: "How is this different from Glassdoor or Levels.fyi?",
    answer:
      "Instead of browsing multiple sites yourself, the AI searches across Glassdoor, Levels.fyi, LinkedIn, Payscale, and others simultaneously, then synthesizes the data into a single personalized estimate with cited sources. It saves research time and accounts for your specific experience level.",
  },
  coreFaqs[2],
  {
    question: "How often is the salary data updated?",
    answer:
      "Every estimate triggers a fresh web search, so the data is as current as what is publicly available online at the time you run the calculator. There is no stale database -- each query pulls live results.",
  },
];

const compensationFaqs = [
  {
    question: "What is total compensation benchmarking?",
    answer:
      "Total compensation benchmarking compares your entire pay package -- base salary, bonuses, equity, and benefits -- against market data for similar roles. This gives a fuller picture than base salary alone, especially for roles where stock grants or performance bonuses make up a significant portion of pay.",
  },
  coreFaqs[1],
  {
    question: "Can I compare compensation across different cities?",
    answer:
      "Yes. Run separate estimates for different cities to see how compensation varies by location. This is useful if you are considering relocation or evaluating remote roles that adjust pay by geography.",
  },
  {
    question: "What is the underpaid signal in the free estimate?",
    answer:
      "The free estimate includes a quick market position indicator that tells you whether your current salary falls below, at, or above the median for your role and location. The premium report expands this into a detailed underpaid score with the estimated dollar gap.",
  },
  coreFaqs[3],
  {
    question: "Does experience level affect the compensation estimate?",
    answer:
      "Yes, significantly. A senior engineer and a junior engineer in the same city will see different ranges. The AI factors in your years of experience and, if you upload a resume, your specific skill set to adjust the estimate accordingly.",
  },
];

const negotiationFaqs = [
  {
    question: "When should I use a salary negotiation tool?",
    answer:
      "Before any compensation conversation -- whether it is a new job offer, annual review, promotion discussion, or counter-offer situation. Having market data and a prepared script turns a stressful conversation into a structured, evidence-based discussion.",
  },
  {
    question: "What negotiation materials does the premium report provide?",
    answer:
      `For ${premiumPricePlaceholder}, you get a ready-to-use negotiation script with specific talking points based on your market data, a professional email draft you can send to HR or your manager, and an underpaid score that quantifies the gap between your current pay and market rate.`,
  },
  coreFaqs[1],
  {
    question: "Can I negotiate salary even if I am already employed?",
    answer:
      "Yes. The tool is designed for both job seekers and current employees. If you are preparing for a performance review or considering asking for a raise, the market data and negotiation scripts are just as relevant as they are for evaluating a new offer.",
  },
  {
    question: "How do I use the negotiation script effectively?",
    answer:
      "The premium report script is designed to be conversational, not confrontational. It frames your ask around market data rather than personal needs. You can use it word-for-word or adapt the key data points and phrasing to your own communication style.",
  },
  coreFaqs[2],
];

const reportFaqs = [
  {
    question: "What makes the premium report different from the free estimate?",
    answer:
      `The free estimate gives you a salary range and market position. The premium report (${premiumPricePlaceholder}) adds a detailed underpaid score, estimated earnings gap, personalized negotiation scripts, a ready-to-send email draft, and a full breakdown of how your specific skills and experience affect your market value.`,
  },
  {
    question: "Is this a one-time purchase or a subscription?",
    answer:
      `It is a single one-time payment of ${premiumPricePlaceholder}. There are no recurring charges, no subscriptions, and no hidden fees. You get the full report immediately after purchase.`,
  },
  coreFaqs[1],
  {
    question: "Can I use the report for multiple negotiations?",
    answer:
      "Yes. The report is yours to keep and reference as many times as you need. The market data, negotiation scripts, and email drafts remain useful across multiple conversations -- whether with your current employer or prospective ones.",
  },
  {
    question: "How quickly do I receive the report?",
    answer:
      "The report is generated instantly after purchase. The AI runs a fresh web research cycle and produces your personalized report within a few minutes. No waiting for a human analyst.",
  },
  {
    question: "What if the report does not match my expectations?",
    answer:
      "The report is based on the same live web research as the free estimate, so you can preview the quality and data sources before purchasing. The free estimate gives you a reliable preview of what the full analysis will contain.",
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
      "salary estimator",
      "market worth calculator",
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
    seoContent: {
      heading: "How the AI salary calculator estimates your market worth",
      paragraphs: [
        "Most salary calculators rely on static datasets that can be months or years out of date. This AI salary calculator takes a different approach: it performs live web research every time you run an estimate. When you enter your role, city, and experience level, the AI searches across Glassdoor, Levels.fyi, LinkedIn Salary, Payscale, and dozens of other compensation sources to find the most current data available for your specific situation.",
        "The result is a salary range grounded in real numbers, not generic averages. You get a confidence score that reflects how much public data was found, a market position indicator showing where you stand, and cited sources you can verify yourself. Whether you are a software engineer benchmarking an offer in San Francisco, a data analyst exploring pay in London, or a product manager preparing for a review in New York, the estimate adapts to your specifics.",
        "For deeper analysis, the premium report expands on the same research with an underpaid score, personalized negotiation scripts, and a ready-to-send email draft. Start with the free estimate to see where you stand, then upgrade when you need actionable guidance for a specific conversation.",
      ],
    },
    howItWorks: [
      { step: "Enter your details", description: "Provide your job title, city, and years of experience. Optionally upload a resume for skill-level precision." },
      { step: "AI researches live data", description: "The AI searches Glassdoor, Levels.fyi, LinkedIn, Payscale, and other sources for current salary data matching your profile." },
      { step: "Get your estimate", description: "Receive a personalized salary range, confidence score, market position, and cited data sources you can verify." },
    ],
    reportBullets: premiumValueProps,
    faq: homeFaqs,
    internalLinks: [
      { href: "/ai-salary-calculator", label: "Free AI Salary Calculator" },
      { href: "/ai-compensation-calculator", label: "AI Compensation Calculator" },
      { href: "/salary-negotiation", label: "Salary Negotiation Tool" },
      { href: "/market-worth-report", label: "Premium Salary Report" },
    ],
  },
  calculator: {
    key: "calculator",
    path: "/ai-salary-calculator",
    title: "Free AI Salary Calculator | Estimate Your Pay Range",
    heroTitle: "Free AI Salary Calculator",
    description:
      "Use a free AI salary calculator that researches live web data from Glassdoor, Levels.fyi, and more to estimate your pay range by role, city, and experience.",
    eyebrow: "Salary Calculator",
    intro:
      "The AI researches current salary data from Glassdoor, Levels.fyi, and other market sources before generating your estimate. Useful for job search prep, interview planning, or evaluating an offer.",
    primaryKeyword: "AI salary calculator",
    secondaryKeywords: [
      "salary calculator ai",
      "free ai salary calculator",
      "salary predictor",
      "salary range calculator",
      "pay estimator",
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
    seoContent: {
      heading: "Why use an AI-powered salary calculator instead of static tools",
      paragraphs: [
        "Traditional salary calculators pull from fixed databases that may not reflect recent market shifts, new roles, or emerging tech hubs. An AI salary calculator solves this by performing live web research at the moment you request an estimate. The data is as current as the most recent salary reports published online.",
        "This matters because compensation changes rapidly. A role that paid $120,000 in 2023 may command $140,000 today due to demand shifts. By searching Glassdoor, Levels.fyi, LinkedIn Salary, and other live sources, the AI gives you a salary range that reflects today's market rather than last year's snapshot.",
        "The free salary calculator is designed for quick, reliable estimates. Enter your role and location to see a salary range, confidence score, and market position. No account required, no paywall for the core estimate. When you need a deeper analysis with negotiation scripts and a full compensation breakdown, the premium report is available as a one-time upgrade.",
      ],
    },
    howItWorks: [
      { step: "Enter your role and city", description: "Type any job title and location. The AI handles the rest -- no dropdown menus or limited role lists." },
      { step: "AI searches salary data", description: "Live web research pulls current compensation data from Glassdoor, Levels.fyi, LinkedIn, and more." },
      { step: "Review your salary range", description: "See your estimated pay range, confidence level, market position, and the sources used." },
    ],
    reportBullets: premiumValueProps,
    faq: calculatorFaqs,
    internalLinks: [
      { href: "/", label: "Home" },
      { href: "/ai-compensation-calculator", label: "AI Compensation Calculator" },
      { href: "/salary-negotiation", label: "Salary Negotiation Tool" },
      { href: "/market-worth-report", label: "Premium Salary Report" },
    ],
  },
  compensation: {
    key: "compensation",
    path: "/ai-compensation-calculator",
    title: "AI Compensation Calculator | Benchmark Your Total Pay",
    heroTitle: "Benchmark your total compensation",
    description:
      "Estimate salary and total compensation with AI that researches real-time market data from Glassdoor, Levels.fyi, and more. See where your current pay may lag.",
    eyebrow: "Compensation Calculator",
    intro:
      "The AI searches current compensation data from the web to show how your total pay compares. Enter your details for an estimate grounded in real market numbers.",
    primaryKeyword: "AI compensation calculator",
    secondaryKeywords: [
      "AI salary estimator",
      "compensation benchmark",
      "know your worth salary report",
      "total compensation calculator",
      "pay benchmark tool",
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
    seoContent: {
      heading: "Understanding total compensation benchmarking with AI",
      paragraphs: [
        "Base salary is only part of the picture. For many roles -- especially in tech, finance, and management -- bonuses, equity, signing bonuses, and benefits can represent 20-50% of total compensation. A compensation calculator that only looks at base salary gives you an incomplete view of your market worth.",
        "This AI compensation calculator researches the full picture. By searching across salary databases, job postings, and compensation surveys in real time, it builds an estimate that reflects how your total package compares to what others in similar roles are earning. If you enter your current salary, it can flag whether you may be below market.",
        "The free estimate provides a quick benchmark with a market position indicator. The premium report goes deeper with a numerical underpaid score, estimated earnings gap, and specific recommendations for how to close the compensation difference in your next review or job change.",
      ],
    },
    howItWorks: [
      { step: "Enter your compensation details", description: "Provide your role, location, experience, and optionally your current salary for a gap analysis." },
      { step: "AI benchmarks your pay", description: "Live research compares your compensation against current market data from multiple authoritative sources." },
      { step: "See where you stand", description: "Get a market position indicator, potential upside estimate, and cited data sources." },
    ],
    reportBullets: premiumValueProps,
    faq: compensationFaqs,
    internalLinks: [
      { href: "/", label: "Home" },
      { href: "/ai-salary-calculator", label: "Free AI Salary Calculator" },
      { href: "/salary-negotiation", label: "Salary Negotiation Tool" },
      { href: "/market-worth-report", label: "Premium Salary Report" },
    ],
  },
  negotiation: {
    key: "negotiation",
    path: "/salary-negotiation",
    title: "AI Salary Negotiation Tool | Market Data and Scripts",
    heroTitle: "Negotiate with confidence",
    description:
      "Benchmark your market worth using AI-researched salary data from Glassdoor and Levels.fyi, then get negotiation-ready talking points and scripts.",
    eyebrow: "Salary Negotiation",
    intro:
      "The AI researches what your role actually pays in your city right now, then generates negotiation scripts backed by real market data. No guesswork.",
    primaryKeyword: "salary negotiation tool",
    secondaryKeywords: [
      "AI salary negotiation",
      "counter offer salary tool",
      "know your worth negotiation",
      "salary negotiation script",
      "negotiation tips salary",
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
    seoContent: {
      heading: "How to negotiate salary with AI-backed market data",
      paragraphs: [
        "The biggest challenge in salary negotiation is not asking -- it is knowing what to ask for. Without solid market data, you risk anchoring too low and leaving money on the table, or asking too high and losing credibility. An AI-powered negotiation tool solves this by giving you real numbers from current market sources before you walk into the conversation.",
        "This tool starts with the same live web research used by the salary calculator -- pulling data from Glassdoor, Levels.fyi, LinkedIn, and other compensation databases. But it goes further by framing the data in terms of negotiation: where does your current or offered salary sit relative to the market? What is the realistic upside? What talking points are most likely to resonate?",
        "The premium report adds practical tools: a negotiation script tailored to your situation, a professional email draft ready to send, and an underpaid score that quantifies your position. Whether you are negotiating a new offer, requesting a raise, or preparing for a promotion conversation, you get the evidence and language to make a stronger case.",
      ],
    },
    howItWorks: [
      { step: "Enter your negotiation context", description: "Provide your role, city, experience, current salary, and target salary for a tailored analysis." },
      { step: "AI finds your market position", description: "Live research reveals where your pay sits relative to current market rates for your profile." },
      { step: "Get negotiation-ready guidance", description: "Receive talking points, market position data, and sources to back up your ask." },
    ],
    reportBullets: premiumValueProps,
    faq: negotiationFaqs,
    internalLinks: [
      { href: "/", label: "Home" },
      { href: "/ai-compensation-calculator", label: "AI Compensation Calculator" },
      { href: "/ai-salary-calculator", label: "Free AI Salary Calculator" },
      { href: "/market-worth-report", label: "Premium Salary Report" },
    ],
  },
  report: {
    key: "report",
    path: "/market-worth-report",
    title: "AI Salary Report | Know Your Worth Before You Negotiate",
    heroTitle: "Your personalized salary report",
    description:
      "Get a detailed AI salary report backed by real-time web research from Glassdoor and Levels.fyi, with market positioning and negotiation-ready scripts.",
    eyebrow: "Premium Report",
    intro:
      "Go beyond the free estimate. The premium report uses real-time salary research to deliver a complete market positioning analysis, underpaid score, and negotiation scripts with cited sources.",
    primaryKeyword: "know your worth salary report",
    secondaryKeywords: [
      "AI salary report",
      "market worth report",
      "salary benchmark report",
      "personalized salary analysis",
      "compensation report",
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
    seoContent: {
      heading: "What the premium AI salary report includes",
      paragraphs: [
        "The free estimate gives you a solid starting point: a salary range, confidence level, and market position based on live web research. The premium report builds on the same data foundation and adds the depth you need when real money is on the line.",
        "You get a numerical underpaid score that tells you exactly how your compensation compares to the market median for your role and location. The report calculates an estimated earnings gap -- the dollar amount you may be leaving on the table annually. It identifies the specific factors pulling your compensation up or down, including skill premiums, experience level, and location adjustments.",
        "The most actionable part of the report is the negotiation toolkit: a customized script with talking points framed around the market data found, a professional email draft you can send directly to a hiring manager or HR, and a summary you can reference during live conversations. All of this is generated from the same real-time web research, so the numbers and recommendations reflect what is actually happening in the market right now.",
      ],
    },
    howItWorks: [
      { step: "Run the free estimate first", description: "Enter your details and preview the salary range, confidence score, and data sources before purchasing." },
      { step: "Unlock the premium report", description: "One-time payment unlocks a full market positioning analysis with underpaid score and earnings gap." },
      { step: "Use the negotiation toolkit", description: "Get a custom negotiation script, email draft, and talking points backed by your market data." },
    ],
    reportBullets: [
      ...premiumValueProps,
      "One-time purchase with no subscription required.",
    ],
    faq: reportFaqs,
    internalLinks: [
      { href: "/", label: "Try the Free Estimate" },
      { href: "/salary-negotiation", label: "Salary Negotiation Tool" },
      { href: "/ai-salary-calculator", label: "Free AI Salary Calculator" },
      { href: "/ai-compensation-calculator", label: "AI Compensation Calculator" },
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
