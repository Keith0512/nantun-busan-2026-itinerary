import assert from "node:assert/strict";
import test from "node:test";

import {
  convertCurrency,
  defaultExchangeRate,
  exchangeRateStorageKey,
  readStoredExchangeRate,
} from "../app/currency-calculator.ts";

test("uses the requested default KRW to TWD exchange rate", () => {
  assert.equal(defaultExchangeRate, 0.02514);
  assert.match(exchangeRateStorageKey, /busan-2026/);
});

test("restores only a valid positive device exchange rate", () => {
  assert.equal(readStoredExchangeRate("0.026"), 0.026);
  assert.equal(readStoredExchangeRate("0"), defaultExchangeRate);
  assert.equal(readStoredExchangeRate("not-a-rate"), defaultExchangeRate);
  assert.equal(readStoredExchangeRate(null), defaultExchangeRate);
});

test("converts both Taiwan dollars and Korean won", () => {
  assert.equal(convertCurrency(10_000, "krw-to-twd", defaultExchangeRate), 251.4);
  assert.ok(
    Math.abs(convertCurrency(1_000, "twd-to-krw", defaultExchangeRate) - 39_777.2474) < 0.0001,
  );
});
