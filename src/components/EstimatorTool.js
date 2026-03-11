"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { siteConfig } from "@/lib/site";
import { currencyOptions, formatCurrency } from "@/lib/currency";

function createDefaultInputs(defaultCurrency = "USD") {
  return {
    role: "",
    city: "",
    yearsExperience: "",
    currency: defaultCurrency,
    currentSalary: "",
    targetSalary: "",
    email: "",
  };
}

function toOptionalPositiveNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildDownloadText(report, premiumCtaHref) {
  const quick = report.quickEstimate || {};
  const premium = report.premiumReport || {};
  const roles = report.growthRoles || [];

  return [
    "AI Salary Calculator Snapshot",
    "",
    `Headline: ${quick.headline || "Quick market worth estimate"}`,
    `Salary range: ${formatCurrency(
      quick.salaryRange?.min,
      quick.salaryRange?.currency || quick.currency
    )} to ${formatCurrency(
      quick.salaryRange?.max,
      quick.salaryRange?.currency || quick.currency
    )}`,
    `Confidence: ${quick.confidenceLabel || "Estimated"}`,
    `Market position: ${quick.marketPosition || "Review needed"}`,
    "",
    `Summary: ${quick.summary || "No summary available."}`,
    "",
    "Top growth roles:",
    ...roles.map(
      (role, index) =>
        `${index + 1}. ${role.title}: ${role.salaryRange} - ${role.reason}`
    ),
    "",
    `Underpaid score preview: ${
      toOptionalPositiveNumber(premium.underpaidScore) ?? "Not available"
    }`,
    `Estimated upside: ${formatCurrency(
      premium.moneyLeftOnTable?.amount,
      premium.moneyLeftOnTable?.currency || quick.salaryRange?.currency
    )}`,
    `Negotiation opener: ${premium.negotiationPitch || "Preview unavailable."}`,
    "",
    `Learn more: ${premiumCtaHref}`,
  ].join("\n");
}

export default function EstimatorTool({ page, pricing }) {
  const [inputs, setInputs] = useState(() => createDefaultInputs(pricing.currency));
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [sources, setSources] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [thoughts, setThoughts] = useState("");

  const premiumCtaHref = useMemo(() => {
    if (siteConfig.premiumReportUrl.startsWith("http")) {
      return siteConfig.premiumReportUrl;
    }

    return `${siteConfig.premiumReportUrl}#premium-offer`;
  }, []);

  const shareMessage =
    report?.shareCard?.message ||
    "I just used this AI salary calculator to benchmark my market worth.";
  const premiumUnderpaidScore = toOptionalPositiveNumber(
    report?.premiumReport?.underpaidScore
  );
  const premiumUpsideAmount = toOptionalPositiveNumber(
    report?.premiumReport?.moneyLeftOnTable?.amount
  );
  const premiumCurrency =
    report?.premiumReport?.moneyLeftOnTable?.currency ||
    report?.quickEstimate?.salaryRange?.currency ||
    inputs.currency ||
    pricing.currency;
  const premiumHighlights =
    report?.premiumReport?.premiumHighlights || page.reportBullets;
  const premiumNegotiationPitch =
    report?.premiumReport?.negotiationPitch ||
    "The premium report turns this estimate into a stronger ask with a clearer position, evidence-backed talking points, and a more persuasive compensation narrative.";
  const premiumEmailSnippet =
    report?.premiumReport?.emailSnippet ||
    "Unlock the full report to get a ready-to-send negotiation email draft tailored to your role, market, and experience.";
  const premiumHeadline =
    premiumUnderpaidScore || premiumUpsideAmount
      ? "See the salary gap and negotiation strategy behind your next move"
      : "Turn this estimate into a raise or offer strategy";
  const premiumIntro = inputs.role?.trim()
    ? `Go beyond the free estimate with company benchmarks, pay-gap analysis, and a negotiation plan tailored to ${inputs.role.trim()} roles in ${inputs.city.trim() || "your market"}.`
    : "Go beyond the free estimate with company benchmarks, pay-gap analysis, and a negotiation plan tailored to your role and market.";

  function updateField(event) {
    const { name, value } = event.target;
    setInputs((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    if (!inputs.city.trim()) {
      setError("Enter a city to benchmark the salary range.");
      return;
    }

    if (!inputs.role.trim() && !file) {
      setError("Add a role or upload a resume so the estimate has enough context.");
      return;
    }

    setLoading(true);
    setThoughts("");
    setReport(null);
    setSources([]);

    const formData = new FormData();
    if (file) {
      formData.append("resume", file);
    }
    Object.entries(inputs).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to generate the estimate right now.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (data.type === "status") {
                setStatusMessage(data.message);
              } else if (data.type === "thought") {
                setThoughts((t) => t + data.text);
              } else if (data.type === "result") {
                setReport(data.report);
                setSources(data.sources || []);
                setStatusMessage(data.message || "Your market worth estimate is ready.");
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch (err) {
              console.error("Error parsing chunk:", line, err);
            }
          }
        }
      }
    } catch (requestError) {
      setError(requestError.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyShare() {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setStatusMessage("Share text copied.");
    } catch (copyError) {
      setStatusMessage("Copy failed. You can highlight the text and share it manually.");
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) {
      setStatusMessage("Native sharing is not available on this device.");
      return;
    }

    try {
      await navigator.share({
        title: report?.shareCard?.title || page.heroTitle,
        text: shareMessage,
        url: window.location.href,
      });
    } catch (shareError) {
      setStatusMessage("Share was cancelled.");
    }
  }

  function handleDownload() {
    if (!report) {
      return;
    }

    const blob = new Blob([buildDownloadText(report, premiumCtaHref)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "salary-estimate-preview.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatusMessage("Salary snapshot downloaded.");
  }

  return (
    <div>
      {/* Hero text */}
      <div className="mb-12 max-w-2xl animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-50 px-4 py-1.5 text-sm font-medium text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {page.eyebrow}
        </div>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-goog-gray-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
          {page.heroTitle}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-goog-gray-600">
          {page.intro}
        </p>
      </div>

      {/* Form + Results layout */}
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-card-solid animate-slide-up p-7 sm:p-8"
        >
          <h2 className="font-display text-xl font-semibold text-goog-gray-900">
            Enter your details
          </h2>
          <p className="mt-1.5 text-sm text-goog-gray-500">
            The AI researches live salary data from the web for your specific role and location.
          </p>

          <div className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-goog-gray-700" htmlFor="role">
                Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                value={inputs.role}
                onChange={updateField}
                placeholder="e.g. Software Engineer, Data Analyst"
                className="input-premium"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-goog-gray-700" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={inputs.city}
                  onChange={updateField}
                  placeholder="e.g. San Francisco, London"
                  className="input-premium"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-goog-gray-700" htmlFor="yearsExperience">
                  Years of experience
                </label>
                <input
                  id="yearsExperience"
                  name="yearsExperience"
                  type="number"
                  min="0"
                  step="1"
                  value={inputs.yearsExperience}
                  onChange={updateField}
                  placeholder="e.g. 5"
                  className="input-premium"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-goog-gray-700" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={inputs.currency}
                  onChange={updateField}
                  className="input-premium"
                >
                  {currencyOptions.map((currencyCode) => (
                    <option key={currencyCode} value={currencyCode}>
                      {currencyCode}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-goog-gray-700" htmlFor="currentSalary">
                  Current salary
                </label>
                <input
                  id="currentSalary"
                  name="currentSalary"
                  type="number"
                  min="0"
                  step="1000"
                  value={inputs.currentSalary}
                  onChange={updateField}
                  placeholder="Optional"
                  className="input-premium"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-goog-gray-700" htmlFor="targetSalary">
                  Target salary
                </label>
                <input
                  id="targetSalary"
                  name="targetSalary"
                  type="number"
                  min="0"
                  step="1000"
                  value={inputs.targetSalary}
                  onChange={updateField}
                  placeholder="Optional"
                  className="input-premium"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-goog-gray-700" htmlFor="file-upload">
                Resume
              </label>
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-goog-gray-300 bg-goog-gray-50/50 px-4 py-5 text-center text-sm text-goog-gray-500 transition-all duration-200 hover:border-accent hover:bg-accent-50/50 hover:text-accent"
              >
                <CloudArrowUpIcon className="h-5 w-5" />
                {file ? file.name : "Upload PDF, TXT, DOC, or DOCX (optional)"}
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Researching market data...
                </span>
              ) : (
                "Get salary estimate"
              )}
            </button>
          </div>

          {error ? (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          ) : null}
          {statusMessage ? (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              {statusMessage}
            </div>
          ) : null}
        </form>

        {/* Results panel */}
        <div className="space-y-8">
          {/* Free estimate results */}
          <div className="glass-card-solid animate-slide-up p-7 sm:p-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-accent">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-semibold text-goog-gray-900">
                Your estimate
              </h2>
            </div>

            {(loading || thoughts) && !report ? (
              <div className="mt-6 overflow-hidden rounded-2xl bg-goog-gray-900 shadow-xl">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-goog-gray-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    {statusMessage || "Initializing..."}
                  </div>
                </div>
                <div className="flex h-[380px] flex-col p-5">
                  <div className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed text-goog-gray-300">
                    {thoughts}
                  </div>
                </div>
              </div>
            ) : report ? (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-gradient-to-br from-accent-50 to-purple-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent/70">Salary range</p>
                    <p className="mt-2 text-lg font-bold text-goog-gray-900">
                      {formatCurrency(
                        report.quickEstimate?.salaryRange?.min,
                        report.quickEstimate?.salaryRange?.currency
                      )}{" "}
                      &ndash;{" "}
                      {formatCurrency(
                        report.quickEstimate?.salaryRange?.max,
                        report.quickEstimate?.salaryRange?.currency
                      )}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600/70">Market position</p>
                    <p className="mt-2 text-lg font-bold text-goog-gray-900">
                      {report.quickEstimate?.marketPosition || "Needs review"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-600/70">Confidence</p>
                    <p className="mt-2 text-lg font-bold text-goog-gray-900">
                      {report.quickEstimate?.confidenceLabel || "Estimated"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-goog-gray-200/80 p-5">
                  <h3 className="text-sm font-semibold text-goog-gray-900">Summary</h3>
                  <p className="mt-2 text-sm leading-relaxed text-goog-gray-600">
                    {report.quickEstimate?.summary}
                  </p>
                </div>

                {(report.factors || []).length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-goog-gray-900">Key factors</h3>
                    <div className="space-y-2">
                      {report.factors.map((factor) => (
                        <div
                          key={factor}
                          className="flex items-start gap-2.5 rounded-xl bg-goog-gray-50 px-4 py-3 text-sm text-goog-gray-700"
                        >
                          <span className="mt-0.5 text-accent">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                          </span>
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(report.growthRoles || []).length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-goog-gray-900">
                      Higher-paying roles to consider
                    </h3>
                    <div className="space-y-3">
                      {report.growthRoles.map((role) => (
                        <div
                          key={`${role.title}-${role.salaryRange}`}
                          className="rounded-2xl border border-goog-gray-200/80 p-4 transition-all duration-200 hover:border-accent/20 hover:shadow-sm"
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-sm font-semibold text-goog-gray-900">{role.title}</p>
                            <p className="text-sm font-bold text-accent">{role.salaryRange}</p>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-goog-gray-500">{role.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {report.methodology && (
                  <div className="rounded-2xl bg-gradient-to-br from-accent-50/80 to-purple-50/80 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">How this was researched</p>
                    <p className="mt-2 text-sm leading-relaxed text-goog-gray-700">
                      {report.methodology}
                    </p>
                  </div>
                )}

                {sources.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-goog-gray-900">Data sources</h3>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-full border border-goog-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-goog-gray-600 shadow-sm transition-all duration-200 hover:border-accent/30 hover:text-accent hover:shadow-md"
                        >
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2.5 border-t border-goog-gray-200/80 pt-5">
                  <button
                    type="button"
                    onClick={handleCopyShare}
                    className="btn-secondary text-xs"
                  >
                    Copy share text
                  </button>
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="btn-secondary text-xs"
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="btn-secondary text-xs"
                  >
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center rounded-2xl border-2 border-dashed border-goog-gray-200 px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-goog-gray-100 text-goog-gray-400">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <p className="mt-4 text-sm font-medium text-goog-gray-500">
                  Your salary estimate will appear here
                </p>
                <p className="mt-1.5 max-w-xs text-xs text-goog-gray-400">
                  Fill in the form and click &ldquo;Get salary estimate.&rdquo; The AI
                  will research current salary data from the web.
                </p>
              </div>
            )}
          </div>

          {/* Premium upsell */}
          <div
            id="premium-offer"
            className="shimmer-border relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-50 via-white to-purple-50 p-7 shadow-glow sm:p-8"
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-400/5 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-purple-600 px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                  </svg>
                  Premium report
                </span>
                <span className="rounded-full border border-goog-gray-200 bg-white px-3 py-1 text-xs font-medium text-goog-gray-600">
                  One-time payment
                </span>
              </div>

              <h2 className="mt-5 font-display text-2xl font-semibold text-goog-gray-900">
                {premiumHeadline}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-goog-gray-600">
                {premiumIntro}
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-goog-gray-200/80 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-goog-gray-500">Pay-gap analysis</p>
                  {premiumUnderpaidScore ? (
                    <p className="mt-2 text-3xl font-bold text-goog-gray-900">
                      {premiumUnderpaidScore}
                      <span className="text-base font-normal text-goog-gray-400">/100</span>
                    </p>
                  ) : (
                    <p className="mt-2 text-xl font-bold text-goog-gray-900">
                      Personalized breakdown
                    </p>
                  )}
                  <p className="mt-3 text-xs leading-relaxed text-goog-gray-500">
                    See whether you are under market and what is pulling your compensation up or down.
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-goog-gray-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-accent to-purple-500 transition-all duration-700"
                      style={{
                        width: premiumUnderpaidScore ? `${premiumUnderpaidScore}%` : "68%",
                        opacity: premiumUnderpaidScore ? 1 : 0.45,
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-goog-gray-200/80 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-goog-gray-500">Negotiation upside</p>
                  <p className="mt-2 text-3xl font-bold text-goog-gray-900">
                    {premiumUpsideAmount
                      ? formatCurrency(premiumUpsideAmount, premiumCurrency)
                      : "Best salary ask"}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-goog-gray-500">
                    {premiumUpsideAmount
                      ? "Estimated additional earnings backed by market data."
                      : "Get the salary band, compensation levers, and ask strategy to use in your next conversation."}
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <h3 className="text-sm font-semibold text-goog-gray-900">What you unlock</h3>
                <div className="mt-3 space-y-2.5">
                  {premiumHighlights.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm text-goog-gray-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs text-white">&#10003;</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-goog-gray-200/80 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-goog-gray-900">Negotiation preview</h3>
                  <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent">
                    Includes full script + email draft
                  </span>
                </div>
                <div className="relative mt-3">
                  <p className="max-h-24 overflow-hidden text-sm leading-relaxed text-goog-gray-600">
                    {premiumNegotiationPitch}
                  </p>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent">
                  {premiumEmailSnippet}
                </div>
              </div>

              <div className="mt-7 overflow-hidden rounded-2xl premium-gradient p-6 text-white">
                <p className="text-sm font-medium text-white/80">
                  Best used before a raise review, offer call, or negotiation loop.
                </p>
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-3xl font-bold">{pricing.premiumReportPrice}</p>
                    <p className="mt-0.5 text-xs text-white/50">One-time payment. No subscription.</p>
                  </div>
                  <Link
                    href={premiumCtaHref}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-goog-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 sm:w-auto"
                  >
                    Unlock premium report
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
