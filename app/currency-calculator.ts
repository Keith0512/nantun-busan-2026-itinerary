export type CurrencyDirection = "twd-to-krw" | "krw-to-twd";

export const defaultExchangeRate = 0.02514;
export const exchangeRateStorageKey = "nantun-busan-2026-exchange-rate-v1";

export function parseExchangeRate(value: string): number | null {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

export function readStoredExchangeRate(value: string | null): number {
  if (!value) return defaultExchangeRate;
  return parseExchangeRate(value) ?? defaultExchangeRate;
}

export function convertCurrency(
  amount: number,
  direction: CurrencyDirection,
  exchangeRate: number,
): number {
  return direction === "twd-to-krw" ? amount / exchangeRate : amount * exchangeRate;
}
