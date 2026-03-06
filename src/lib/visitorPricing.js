import "server-only";

import { headers } from "next/headers";
import { formatCurrency, getCurrencyLocale } from "@/lib/currency";
import { siteConfig } from "@/lib/site";

const countryCurrencyMap = {
  AE: "AED",
  AT: "EUR",
  AU: "AUD",
  BE: "EUR",
  CA: "CAD",
  CY: "EUR",
  DE: "EUR",
  EE: "EUR",
  ES: "EUR",
  FI: "EUR",
  FR: "EUR",
  GB: "GBP",
  GR: "EUR",
  IE: "EUR",
  IN: "INR",
  IT: "EUR",
  JP: "JPY",
  LT: "EUR",
  LU: "EUR",
  LV: "EUR",
  MT: "EUR",
  NL: "EUR",
  PT: "EUR",
  SG: "SGD",
  SI: "EUR",
  SK: "EUR",
  US: "USD",
};

const usdExchangeRates = {
  AED: 3.67,
  AUD: 1.53,
  CAD: 1.36,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83,
  JPY: 149,
  SGD: 1.35,
  USD: 1,
};

function getCountryFromAcceptLanguage(acceptLanguage = "") {
  const languageTags = acceptLanguage.split(",");

  for (const tag of languageTags) {
    const match = tag.trim().match(/-([A-Za-z]{2})(?:;|$)/);
    if (match) {
      return match[1].toUpperCase();
    }
  }

  return null;
}

function getVisitorCountry(headerStore) {
  const candidates = [
    headerStore.get("x-vercel-ip-country"),
    headerStore.get("cf-ipcountry"),
    headerStore.get("x-country-code"),
    getCountryFromAcceptLanguage(headerStore.get("accept-language") || ""),
  ];

  for (const candidate of candidates) {
    if (candidate && /^[A-Za-z]{2}$/.test(candidate)) {
      return candidate.toUpperCase();
    }
  }

  return "US";
}

function getCurrencyForCountry(country) {
  return countryCurrencyMap[country] || "USD";
}

function convertUsdPrice(baseUsdAmount, currency) {
  const exchangeRate = usdExchangeRates[currency] || 1;
  return Math.max(1, Math.round(baseUsdAmount * exchangeRate));
}

export async function getVisitorPricing() {
  const headerStore = await headers();
  const country = getVisitorCountry(headerStore);
  const currency = getCurrencyForCountry(country);
  const premiumReportAmount = convertUsdPrice(
    siteConfig.premiumReportBasePriceUsd,
    currency
  );

  return {
    country,
    currency,
    locale: getCurrencyLocale(currency),
    premiumReportAmount,
    premiumReportPrice: formatCurrency(premiumReportAmount, currency, {
      currencyDisplay: "code",
    }),
  };
}
