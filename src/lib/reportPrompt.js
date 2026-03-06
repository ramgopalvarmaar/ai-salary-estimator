function salaryContextLine(label, value) {
  return value ? `- ${label}: ${value}` : null;
}

export function buildResearchPrompt({
  role,
  city,
  yearsExperience,
  currency,
}) {
  return `
You are a compensation research analyst. Research current, real-world salary data for this profile:

- Role: ${role || "general professional role"}
- City/Location: ${city}
- Experience level: ${yearsExperience ? `${yearsExperience} years` : "mid-level (assumed)"}
- Currency: ${currency || "USD"}

Search for and compile the following from job market sources:

1. BASE SALARY RANGE: The current annual base salary range (low, median, high) for this role in this city. Use specific numbers, not vague ranges.

2. EXPERIENCE ADJUSTMENT: How ${yearsExperience || "mid-level"} years of experience shifts the range compared to entry-level and senior levels.

3. DEMAND & TRENDS: Current hiring demand, recent salary trends (increasing, flat, decreasing), and any notable market shifts for this role in this area.

4. TOP-PAYING COMPANIES: Which companies or types of companies pay the most for this role in this location?

5. PREMIUM SKILLS: Which specific skills, certifications, or technologies command a salary premium for this role?

6. COMPARABLE HIGHER-PAYING ROLES: 3 specific roles that someone in this position could realistically transition to for higher pay. Include salary ranges for each.

7. TOTAL COMPENSATION: Typical non-base components (bonus, equity, benefits) for this role at this level.

Be precise. Use real numbers from real sources. If exact city data is unavailable, use the closest major metro area and note the adjustment. Do not make up numbers—if data is limited, say so.
`.trim();
}

export function buildSalaryReportPrompt({
  role,
  city,
  yearsExperience,
  currentSalary,
  targetSalary,
  currency,
  hasResume,
  researchData,
}) {
  const contextLines = [
    salaryContextLine("Role", role),
    salaryContextLine("City", city),
    salaryContextLine("Years of experience", yearsExperience),
    salaryContextLine("Current salary", currentSalary),
    salaryContextLine("Target salary", targetSalary),
    salaryContextLine("Preferred currency", currency),
    `- Resume included: ${hasResume ? "yes" : "no"}`,
  ]
    .filter(Boolean)
    .join("\n");

  const researchBlock = researchData
    ? `
REAL-TIME MARKET RESEARCH (use this data as the primary basis for all numbers):
---
${researchData}
---
Your salary figures MUST be consistent with this research. Do not invent numbers that contradict the research above.
`
    : `
No real-time research data is available. Use your best knowledge of current salary markets, but set confidenceLabel to "Low" and note this limitation in the summary.
`;

  return `
You are generating a salary report grounded in real market data.
${researchBlock}
User profile:
${contextLines}

Using the research data and user profile, produce a salary report.

Rules:
- ALL salary numbers must come from or be consistent with the research data above.
- If the user provided a current salary, calculate underpaidScore by comparing it to the researched market median—do not guess.
- If the user did not provide a current salary, do not use 0 as a placeholder for underpaidScore or moneyLeftOnTable. Use null when the metric cannot be computed directly, and focus the premium copy on compensation levers, likely upside, and negotiation strategy.
- The summary should reference specific data points from the research (e.g. "Glassdoor reports a median of..." or "Market data shows...").
- Be direct and specific. No filler phrases like "based on various factors."
- Use annual salary figures in ${currency || "USD"}.
- Set underpaidScore on 0-100: 0 means well above market, 100 means severely underpaid.
- Return exactly 3 growthRoles with real salary ranges from the research.
- Return exactly 4 premiumHighlights.
- methodology should be 1-2 sentences explaining what data sources informed this estimate.
- Do not wrap the JSON in markdown fences.
${hasResume ? "- Factor in the resume's skills and experience to adjust the estimate." : ""}

Return valid JSON with this exact shape:
{
  "quickEstimate": {
    "headline": "short phrase summarizing the finding",
    "summary": "3-5 sentences referencing specific data points from the research",
    "confidenceLabel": "Low or Medium or High",
    "marketPosition": "Below market or Near market or Above market",
    "salaryRange": {
      "min": 0,
      "max": 0,
      "currency": "${currency || "USD"}"
    }
  },
  "factors": [
    "3-5 specific bullets about what drives this estimate, citing data where possible"
  ],
  "growthRoles": [
    {
      "title": "Real role title",
      "salaryRange": "formatted range string with currency",
      "reason": "why this role pays more, with a data reference if available"
    }
  ],
  "premiumReport": {
    "underpaidScore": null,
    "moneyLeftOnTable": {
      "amount": null,
      "currency": "${currency || "USD"}"
    },
    "negotiationPitch": "2-3 sentence opener referencing real market data",
    "emailSnippet": "a short email draft the user could adapt",
    "premiumHighlights": [
      "4 bullets describing what the paid report adds"
    ]
  },
  "shareCard": {
    "title": "short shareable title",
    "message": "one sentence a user could share"
  },
  "methodology": "1-2 sentences on what data sources informed this estimate"
}
`.trim();
}
