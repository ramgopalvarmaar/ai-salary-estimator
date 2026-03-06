export const currencyOptions = [
  "USD",
  "INR",
  "GBP",
  "EUR",
  "CAD",
  "AUD",
  "SGD",
  "AED",
  "JPY",
];

const currencyLocales = {
  USD: "en-US",
  INR: "en-IN",
  GBP: "en-GB",
  EUR: "de-DE",
  CAD: "en-CA",
  AUD: "en-AU",
  SGD: "en-SG",
  AED: "en-AE",
  JPY: "ja-JP",
};

export function getCurrencyLocale(currency = "USD") {
  return currencyLocales[currency] || "en-US";
}

export function formatCurrency(amount, currency = "USD", options = {}) {
  if (!Number.isFinite(amount)) {
    return "Not available";
  }

  const locale = options.locale || getCurrencyLocale(currency);

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: options.currencyDisplay || "symbol",
      maximumFractionDigits: options.maximumFractionDigits ?? 0,
    }).format(amount);
  } catch (error) {
    return `${currency} ${Math.round(amount).toLocaleString(locale)}`;
  }
}

export function formatCurrencyRange(min, max, currency = "USD", options = {}) {
  const formattedMin = formatCurrency(min, currency, options);
  const formattedMax = formatCurrency(max, currency, options);
  return `${formattedMin} - ${formattedMax}`;
}
