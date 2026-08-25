import assert from "node:assert/strict";
import test from "node:test";

import { uberRide } from "../app/uber-link.ts";

test("builds an Uber universal link with a coordinate-backed destination", () => {
  const url = uberRide(
    "甘川洞文化村",
    "감천문화마을 · Gamcheon Culture Village",
    35.0963371,
    129.0087897,
  );
  const link = new URL(url);

  assert.equal(link.origin, "https://m.uber.com");
  assert.equal(link.pathname, "/looking");

  const destination = JSON.parse(link.searchParams.get("drop[0]"));
  assert.deepEqual(destination, {
    latitude: 35.0963371,
    longitude: 129.0087897,
    addressLine1: "甘川洞文化村",
    addressLine2: "감천문화마을 · Gamcheon Culture Village",
  });
  assert.match(url, /drop%5B0%5D=/);
});
