import assert from "node:assert/strict";
import test from "node:test";

import { detectNaverMapDevice, naverMapLinks } from "../app/naver-map.ts";

test("builds a coordinate-backed NAVER Map app link with a web fallback", () => {
  const links = naverMapLinks("감천문화마을", [35.0963371, 129.0087897]);
  const appLink = new URL(links.app);

  assert.equal(appLink.protocol, "nmap:");
  assert.equal(appLink.hostname, "place");
  assert.equal(appLink.searchParams.get("lat"), "35.0963371");
  assert.equal(appLink.searchParams.get("lng"), "129.0087897");
  assert.equal(appLink.searchParams.get("name"), "감천문화마을");
  assert.equal(
    appLink.searchParams.get("appname"),
    "https://nantun-busan-2026.mars0512.chatgpt.site",
  );
  assert.equal(links.web, "https://map.naver.com/p/search/%EA%B0%90%EC%B2%9C%EB%AC%B8%ED%99%94%EB%A7%88%EC%9D%84");
  assert.match(links.android, /^intent:\/\/place\?/);
  assert.match(links.android, /package=com\.nhn\.android\.nmap/);
  assert.match(links.android, new RegExp(`S\\.browser_fallback_url=${encodeURIComponent(links.web)}`));
});

test("falls back to an in-app search when verified coordinates are unavailable", () => {
  const links = naverMapLinks("부산 맛집");
  const appLink = new URL(links.app);

  assert.equal(appLink.hostname, "search");
  assert.equal(appLink.searchParams.get("query"), "부산 맛집");
  assert.match(links.android, /^intent:\/\/search\?/);
});

test("uses search instead of an unsupported non-Korean coordinate", () => {
  const links = naverMapLinks("타오위안 국제공항 제2터미널", [25.0775532, 121.2329991]);
  const appLink = new URL(links.app);

  assert.equal(appLink.hostname, "search");
  assert.equal(appLink.searchParams.get("query"), "타오위안 국제공항 제2터미널");
});

test("detects Android, iPhone, iPadOS and desktop launch modes", () => {
  assert.equal(detectNaverMapDevice("Mozilla/5.0 (Linux; Android 15)"), "android");
  assert.equal(detectNaverMapDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)"), "ios");
  assert.equal(detectNaverMapDevice("Mozilla/5.0 (Macintosh)", "MacIntel", 5), "ios");
  assert.equal(detectNaverMapDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), "web");
});
