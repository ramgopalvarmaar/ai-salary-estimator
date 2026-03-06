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

const inputClass =
  "w-full rounded-lg border border-goog-gray-300 bg-white px-3.5 py-2.5 text-sm text-goog-gray-900 outline-none transition placeholder:text-goog-gray-400 focus:border-accent focus:ring-1 focus:ring-accent";

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
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-accent">{page.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-goog-gray-900 sm:text-4xl">
          {page.heroTitle}
        </h1>
        <p className="mt-3 text-base leading-7 text-goog-gray-700">
          {page.intro}
        </p>
      </div>

      {/* Form + Results layout */}
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-goog-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-medium text-goog-gray-900">
            Enter your details
          </h2>
          <p className="mt-1 text-sm text-goog-gray-700">
            The AI researches live salary data from the web for your specific role and location.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-goog-gray-800" htmlFor="role">
                Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                value={inputs.role}
                onChange={updateField}
                placeholder="e.g. Software Engineer, Data Analyst"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-goog-gray-800" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={inputs.city}
                  onChange={updateField}
                  placeholder="e.g. San Francisco, London"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-goog-gray-800" htmlFor="yearsExperience">
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
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-goog-gray-800" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={inputs.currency}
                  onChange={updateField}
                  className={inputClass}
                >
                  {currencyOptions.map((currencyCode) => (
                    <option key={currencyCode} value={currencyCode}>
                      {currencyCode}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-goog-gray-800" htmlFor="currentSalary">
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
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-goog-gray-800" htmlFor="targetSalary">
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
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-goog-gray-800" htmlFor="file-upload">
                Resume
              </label>
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-goog-gray-300 bg-goog-gray-50 px-4 py-4 text-center text-sm text-goog-gray-700 transition-colors hover:border-accent hover:bg-accent-50"
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
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-goog-gray-300 disabled:text-goog-gray-500"
            >
              {loading ? "Researching market data..." : "Get salary estimate"}
            </button>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          {statusMessage ? (
            <p className="mt-4 rounded-lg bg-accent-light px-3 py-2 text-sm text-accent">{statusMessage}</p>
          ) : null}
        </form>

        {/* Results panel */}
        <div className="space-y-6">
          {/* Free estimate results */}
          <div className="rounded-xl border border-goog-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-goog-gray-900">
              Your estimate
            </h2>

            {(loading || thoughts) && !report ? (
              <div className="mt-5 rounded-lg bg-goog-gray-900 p-4 font-mono text-xs text-goog-gray-300 shadow-inner flex flex-col h-[400px]">
                <div className="flex items-center gap-2 mb-3 border-b border-goog-gray-700 pb-2 text-accent-light">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                  <span>{statusMessage || "Initializing..."}</span>
                </div>
                <div className="flex-1 overflow-y-auto whitespace-pre-wrap break-words">
                  {thoughts}
                </div>
              </div>
            ) : report ? (
              <div className="mt-5 space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-goog-gray-50 p-4">
                    <p className="text-xs font-medium text-goog-gray-700">Salary range</p>
                    <p className="mt-1 text-lg font-semibold text-goog-gray-900">
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
                  <div className="rounded-lg bg-goog-gray-50 p-4">
                    <p className="text-xs font-medium text-goog-gray-700">Market position</p>
                    <p className="mt-1 text-lg font-semibold text-goog-gray-900">
                      {report.quickEstimate?.marketPosition || "Needs review"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-goog-gray-50 p-4">
                    <p className="text-xs font-medium text-goog-gray-700">Confidence</p>
                    <p className="mt-1 text-lg font-semibold text-goog-gray-900">
                      {report.quickEstimate?.confidenceLabel || "Estimated"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-goog-gray-900">Summary</h3>
                  <p className="mt-1 text-sm leading-6 text-goog-gray-800">
                    {report.quickEstimate?.summary}
                  </p>
                </div>

                {(report.factors || []).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-goog-gray-900">Key factors</h3>
                    <ul className="mt-2 space-y-1.5">
                      {report.factors.map((factor) => (
                        <li
                          key={factor}
                          className="rounded-lg bg-goog-gray-50 px-3 py-2 text-sm text-goog-gray-800"
                        >
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(report.growthRoles || []).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-goog-gray-900">
                      Higher-paying roles to consider
                    </h3>
                    <div className="mt-2 space-y-2">
                      {report.growthRoles.map((role) => (
                        <div
                          key={`${role.title}-${role.salaryRange}`}
                          className="rounded-lg border border-goog-gray-200 p-3"
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-sm font-medium text-goog-gray-900">{role.title}</p>
                            <p className="text-sm font-medium text-accent">{role.salaryRange}</p>
                          </div>
                          <p className="mt-1 text-xs text-goog-gray-700">{role.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {report.methodology && (
                  <div className="rounded-lg bg-accent-50 px-4 py-3">
                    <p className="text-xs font-medium text-accent">How this was researched</p>
                    <p className="mt-1 text-sm leading-6 text-goog-gray-800">
                      {report.methodology}
                    </p>
                  </div>
                )}

                {sources.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-goog-gray-900">Data sources</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {sources.map((source) => (
                        <li key={source.url}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-md border border-goog-gray-200 bg-goog-gray-50 px-2.5 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent-50"
                          >
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 border-t border-goog-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={handleCopyShare}
                    className="rounded-lg border border-goog-gray-300 px-3 py-1.5 text-sm font-medium text-goog-gray-800 transition-colors hover:bg-goog-gray-50"
                  >
                    Copy share text
                  </button>
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="rounded-lg border border-goog-gray-300 px-3 py-1.5 text-sm font-medium text-goog-gray-800 transition-colors hover:bg-goog-gray-50"
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="rounded-lg border border-goog-gray-300 px-3 py-1.5 text-sm font-medium text-goog-gray-800 transition-colors hover:bg-goog-gray-50"
                  >
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-goog-gray-700">
                Fill in the form and click &ldquo;Get salary estimate.&rdquo; The AI
                will research current salary data from the web before generating
                your personalized report.
              </p>
            )}
          </div>

          {/* Premium upsell */}
          <div
            id="premium-offer"
            className="rounded-xl border-2 border-accent bg-accent-50 p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-accent">
                Premium report
              </p>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-goog-gray-800">
                One-time payment
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-goog-gray-800">
                Tailored to your profile
              </span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-goog-gray-900">
              {premiumHeadline}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-goog-gray-800">
              {premiumIntro}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-medium text-goog-gray-700">Pay-gap analysis</p>
                {premiumUnderpaidScore ? (
                  <p className="mt-1 text-2xl font-semibold text-goog-gray-900">
                    {premiumUnderpaidScore}
                    <span className="text-sm font-normal text-goog-gray-700">/100</span>
                  </p>
                ) : (
                  <p className="mt-1 text-xl font-semibold text-goog-gray-900">
                    Personalized breakdown
                  </p>
                )}
                <p className="mt-2 text-xs leading-5 text-goog-gray-700">
                  See whether you are under market and what is pulling your compensation up or down.
                </p>
                <div className="mt-3 h-1.5 rounded-full bg-goog-gray-200">
                  <div
                    className="h-1.5 rounded-full bg-accent"
                    style={{
                      width: premiumUnderpaidScore ? `${premiumUnderpaidScore}%` : "68%",
                      opacity: premiumUnderpaidScore ? 1 : 0.45,
                    }}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-medium text-goog-gray-700">Negotiation upside</p>
                <p className="mt-1 text-2xl font-semibold text-goog-gray-900">
                  {premiumUpsideAmount
                    ? formatCurrency(premiumUpsideAmount, premiumCurrency)
                    : "Best salary ask"}
                </p>
                <p className="mt-2 text-xs leading-5 text-goog-gray-700">
                  {premiumUpsideAmount
                    ? "Estimated additional earnings backed by market data."
                    : "Get the salary band, compensation levers, and ask strategy to use in your next conversation."}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-medium text-goog-gray-900">What you unlock</h3>
              <ul className="mt-2 space-y-2 text-sm text-goog-gray-800">
                {premiumHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-accent">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-lg bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-goog-gray-900">Negotiation preview</h3>
                <span className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-medium text-accent">
                  Includes full script + email draft
                </span>
              </div>
              <div className="relative mt-2">
                <p className="max-h-24 overflow-hidden text-sm leading-6 text-goog-gray-800">
                  {premiumNegotiationPitch}
                </p>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
              </div>
              <p className="mt-3 rounded-lg bg-accent-light px-3 py-2 text-sm text-accent">
                {premiumEmailSnippet}
              </p>
            </div>

            <div className="mt-5 rounded-xl bg-goog-gray-900 p-4 text-white">
              <p className="text-sm font-medium">
                Best used before a raise review, offer call, or negotiation loop.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-2xl font-semibold">{pricing.premiumReportPrice}</p>
                  <p className="text-xs text-goog-gray-300">One-time payment. No subscription.</p>
                </div>
                <Link
                  href={premiumCtaHref}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:w-auto"
                >
                  Unlock premium report
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
