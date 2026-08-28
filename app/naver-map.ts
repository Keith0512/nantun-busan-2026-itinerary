export type NaverMapCoordinates = readonly [latitude: number, longitude: number];
export type NaverMapDevice = "android" | "ios" | "web";

export type NaverMapLinks = {
  app: string;
  android: string;
  web: string;
};

const appName = "https://nantun-busan-2026.mars0512.chatgpt.site";

function supportsNaverPlace(coordinates: NaverMapCoordinates | undefined) {
  if (!coordinates) return false;
  const [latitude, longitude] = coordinates;
  return latitude >= 31.43 && latitude <= 44.35
    && longitude >= 122.37 && longitude <= 132;
}

export function naverMapLinks(
  query: string,
  coordinates?: NaverMapCoordinates,
): NaverMapLinks {
  const web = `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
  const params = new URLSearchParams();
  let action = "search";

  if (coordinates && supportsNaverPlace(coordinates)) {
    action = "place";
    params.set("lat", String(coordinates[0]));
    params.set("lng", String(coordinates[1]));
    params.set("name", query);
  } else {
    params.set("query", query);
  }
  params.set("appname", appName);

  const actionWithParams = `${action}?${params}`;
  const app = `nmap://${actionWithParams}`;
  const android = `intent://${actionWithParams}#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;S.browser_fallback_url=${encodeURIComponent(web)};end`;

  return { app, android, web };
}

export function detectNaverMapDevice(
  userAgent: string,
  platform = "",
  maxTouchPoints = 0,
): NaverMapDevice {
  if (/Android/i.test(userAgent)) return "android";
  if (/(iPhone|iPad|iPod)/i.test(userAgent)) return "ios";
  if (platform === "MacIntel" && maxTouchPoints > 1) return "ios";
  return "web";
}
