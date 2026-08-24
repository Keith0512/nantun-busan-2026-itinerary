import assert from "node:assert/strict";
import test from "node:test";

import {
  checklistGroups,
  checklistStorageKey,
  readChecklistSelection,
} from "../app/travel-checklist.ts";

test("includes the trip-specific essentials requested for the Busan trip", () => {
  const titles = checklistGroups.flatMap((group) => group.items.map((item) => item.title));

  assert.ok(titles.some((title) => title.includes("護照")));
  assert.ok(titles.some((title) => title.includes("信用卡")));
  assert.ok(titles.some((title) => title.includes("雨")));
  assert.ok(titles.some((title) => title.includes("入境")));
  assert.ok(titles.some((title) => title.includes("天空膠囊")));
  assert.match(checklistStorageKey, /busan-2026/);
});

test("restores only unique checklist item ids from device storage", () => {
  assert.deepEqual(readChecklistSelection('["passport","passport","credit-card","unknown"]'), [
    "passport",
    "credit-card",
  ]);
  assert.deepEqual(readChecklistSelection("not-json"), []);
  assert.deepEqual(readChecklistSelection('{"passport":true}'), []);
  assert.deepEqual(readChecklistSelection(null), []);
});
