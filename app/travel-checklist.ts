export type ChecklistItem = {
  id: string;
  title: string;
  detail: string;
  href?: string;
  linkLabel?: string;
};

export type ChecklistGroup = {
  title: string;
  subtitle: string;
  items: ChecklistItem[];
};

export const checklistStorageKey = "nantun-busan-2026-checklist-v1";

export const checklistGroups: ChecklistGroup[] = [
  {
    title: "證件與入境",
    subtitle: "先確認能順利出境、入境與入住",
    items: [
      { id: "passport", title: "護照", detail: "確認效期、姓名與機票一致，並放在隨身行李。" },
      {
        id: "arrival-card",
        title: "韓國電子入境申報",
        detail: "未持有效 K-ETA 者，可在抵達韓國前 3 天內免費填寫 e-Arrival Card。",
        href: "https://www.e-arrivalcard.go.kr/portal/main/index.do?locale=E",
        linkLabel: "官方申報網站",
      },
      {
        id: "k-eta",
        title: "確認 K-ETA 狀態",
        detail: "2026 年臺灣護照暫時免申請；若已持有效 K-ETA，可免填入境卡。",
        href: "https://overseas.mofa.go.kr/tw-zh/brd/m_20387/view.do?page=1&seq=61",
        linkLabel: "官方最新公告",
      },
      { id: "booking-copies", title: "機票與住宿資料", detail: "下載離線版訂位紀錄，保存飯店英文與韓文地址。" },
      { id: "insurance", title: "旅遊保險與緊急聯絡", detail: "保留保單、理賠方式與團員緊急聯絡資訊。" },
    ],
  },
  {
    title: "付款與連線",
    subtitle: "抵達機場後就能立即使用",
    items: [
      { id: "credit-card", title: "信用卡已開啟海外交易", detail: "確認額度、海外交易通知與實體卡密碼。" },
      { id: "backup-payment", title: "備用卡與少量韓元", detail: "主要卡片失效時仍能支付交通與小額消費。" },
      { id: "mobile-data", title: "eSIM、SIM 卡或漫遊", detail: "先安裝並保存啟用步驟，抵達金海機場即可連線。" },
      { id: "travel-apps", title: "Naver Map 與叫車 App", detail: "登入完成，收藏 LCT Residence 與行程集合點。" },
      { id: "transit-card", title: "交通卡與儲值現金", detail: "帶現有交通卡，或預留抵達後購買、儲值的韓元。" },
    ],
  },
  {
    title: "本次預約",
    subtitle: "依照五天行程逐項確認票券",
    items: [
      { id: "flight", title: "釜山航空 BX792／BX791", detail: "確認報到時間、托運額度與同行者英文姓名。" },
      { id: "blue-line", title: "天空膠囊與海岸列車", detail: "下載 QR Code，核對日期、方向、尾浦站集合時間。" },
      { id: "yacht", title: "廣安里遊艇", detail: "確認 8/29 的 19:00 集合點、聯絡方式與雨天方案。" },
      { id: "attraction-tickets", title: "滑車、纜車與熱門景點", detail: "確認是否需預約，票券截圖集中放在手機同一資料夾。" },
      { id: "restaurant", title: "熱門餐廳與備案", detail: "確認韓牛、烤肉等訂位，並保存韓文店名方便導航。" },
    ],
  },
  {
    title: "夏季隨身物品",
    subtitle: "海岸、午後雨勢與冷氣都照顧到",
    items: [
      { id: "rain-gear", title: "摺疊傘或輕便雨衣", detail: "戶外行程多，出門前也再查看釜山即時天氣。" },
      { id: "sun-protection", title: "防曬、帽子與太陽眼鏡", detail: "海邊曝曬時間長，建議準備可隨身補擦的防曬。" },
      { id: "walking-shoes", title: "好走且止滑的鞋", detail: "海東龍宮寺、甘川洞與白淺灘都有階梯或坡道。" },
      { id: "light-jacket", title: "薄外套", detail: "遊艇海風、晚間海岸與室內冷氣時可使用。" },
      { id: "medicine", title: "個人藥品與簡易備品", detail: "處方藥、暈船藥、腸胃藥與防蚊用品依需求準備。" },
      { id: "charging", title: "充電器、轉接頭與行動電源", detail: "行動電源放隨身行李，出發前確認航空公司規定。" },
    ],
  },
];

const checklistItemIds = new Set(
  checklistGroups.flatMap((group) => group.items.map((item) => item.id)),
);

export function readChecklistSelection(value: string | null): string[] {
  if (!value) return [];

  try {
    const stored = JSON.parse(value);
    if (!Array.isArray(stored)) return [];
    return [...new Set(stored.filter((id): id is string => typeof id === "string" && checklistItemIds.has(id)))];
  } catch {
    return [];
  }
}
