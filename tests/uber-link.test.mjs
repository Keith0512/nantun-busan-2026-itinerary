import assert from "node:assert/strict";
import test from "node:test";

import { uberRide } from "../app/uber-link.ts";

test("builds an Uber universal link with current pickup and destination", () => {
  const link = new URL(uberRide("甘川洞文化村", "감천문화마을 · Gamcheon Culture Village"));

  assert.equal(link.origin, "https://m.uber.com");
  assert.equal(link.pathname, "/ul/");
  assert.equal(link.searchParams.get("action"), "setPickup");
  assert.equal(link.searchParams.get("pickup"), "my_location");
  assert.equal(link.searchParams.get("dropoff[nickname]"), "甘川洞文化村");
  assert.equal(
    link.searchParams.get("dropoff[formatted_address]"),
    "감천문화마을 · Gamcheon Culture Village",
  );
});
