"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { uberRide } from "./uber-link";
import {
  convertCurrency,
  defaultExchangeRate,
  exchangeRateStorageKey,
  parseExchangeRate,
  readStoredExchangeRate,
  type CurrencyDirection,
} from "./currency-calculator";
import {
  checklistGroups,
  checklistStorageKey,
  readChecklistSelection,
} from "./travel-checklist";
import {
  detectNaverMapDevice,
  naverMapLinks,
  type NaverMapCoordinates,
  type NaverMapLinks,
} from "./naver-map";

type MapPlace = { label?: string; google: string; naver: NaverMapLinks; uber?: string };
type TripPhoto = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  source: string;
};
type Stop = {
  time: string;
  tag: string;
  title: string;
  summary: string;
  detail: string;
  note?: string;
  place?: MapPlace;
  alternate?: MapPlace;
  photos?: TripPhoto[];
};
type Day = {
  number: string;
  short: string;
  date: string;
  weekday: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  photos: TripPhoto[];
  stops: Stop[];
};
type RainyDayOption = {
  kicker: string;
  title: string;
  summary: string;
  detail: string;
  note?: string;
  thumbnail: { src: string; alt: string; position: string };
  place: MapPlace;
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const googleMap = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

type Coordinates = NaverMapCoordinates;

const uberCoordinates: Record<string, Coordinates> = {
  "부산 해운대구 달맞이길 30 엘시티 레지던스": [35.1598316, 129.1697374],
  "클럽디 오아시스 부산 해운대구 달맞이길 30 엘시티": [35.1600514, 129.1684719],
  "타오위안 국제공항 제2터미널": [25.0775532, 121.2329991],
  김해국제공항: [35.1800774, 128.9364014],
  "스카이라인루지 부산": [35.1941296, 129.2191333],
  "롯데몰 동부산점": [35.192307, 129.2125516],
  해동용궁사: [35.1884335, 129.2229764],
  "해운대 해변열차 미포정거장": [35.1581707, 129.1728278],
  "오반장 부산": [35.1615634, 129.1593189],
  해운대암소갈비집: [35.162933, 129.1662923],
  해운대해수욕장: [35.1592859, 129.1586091],
  "해운대블루라인파크 미포정거장": [35.1581707, 129.1728278],
  "해운대블루라인파크 청사포정거장": [35.1612404, 129.1913814],
  "올바릇식당 청사포점": [35.1615193, 129.1893975],
  광안리해양레포츠센터: [35.1461934, 129.1153247],
  광안리해수욕장: [35.1508879, 129.1167806],
  술고당: [35.1000576, 129.0293113],
  감천문화마을: [35.0963371, 129.0087897],
  "DUF COFFEE 부산": [35.0962827, 129.0092705],
  "송도해상케이블카 송도베이스테이션": [35.0763321, 129.0235399],
  흰여울문화마을: [35.0773961, 129.0456513],
  자갈치시장: [35.095744, 129.0251226],
  "부산엑스더스카이 부산 해운대구 달맞이길 30": [35.1613825711, 129.168043276],
  "신세계백화점 센텀시티점 부산 해운대구 센텀남대로 35": [35.1687608, 129.1296435],
  "스누피플레이스 부산 해운대구 해운대해변로 197": [35.1584016, 129.1527892],
};
type PlannerView = "itinerary" | "checklist" | "currency";

const twdFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 2,
});
const krwFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const place = (google: string, naver: string, label?: string): MapPlace => {
  const coordinates = uberCoordinates[naver];

  return {
    google: googleMap(google),
    naver: naverMapLinks(naver, coordinates),
    uber: coordinates
      ? uberRide(label ?? google, naver, coordinates[0], coordinates[1])
      : undefined,
    label,
  };
};

const hotelPlace = place(
  "LCT Residence Y collection Busan",
  "부산 해운대구 달맞이길 30 엘시티 레지던스",
  "LCT Residence Y collection",
);

const photos = {
  airport: { src: "/places/airport.jpg", alt: "釜山金海國際機場外觀", caption: "金海國際機場", credit: "螺钉 · CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Gimhae_International_Airport.jpg" },
  hotel: { src: "/places/hotel-lct.jpg", alt: "夜晚從海雲台海灘望向 LCT 建築群", caption: "我們在海雲台的落腳處", credit: "308 Bees · CC0", source: "https://commons.wikimedia.org/wiki/File:HaeundaeLCT_atNight.jpg" },
  temple: { src: "/places/temple.jpg", alt: "臨海岩岸上的海東龍宮寺", caption: "海東龍宮寺", credit: "Christian Bolz · CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Haedong_Yonggungsa_Temple_near_Busan.jpg" },
  haeundae: { src: "/places/haeundae.jpg", alt: "陽光下的海雲台海灘與城市天際線", caption: "海雲台的夏日海岸", credit: "StephNurnberg · CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Haeundae_Beach_in_Busan.jpg" },
  bbq: { src: "/places/korean-bbq.jpg", alt: "炭火烤盤上的韓式烤肉", caption: "用韓牛開啟第三天", credit: "eommina · CC0", source: "https://commons.wikimedia.org/wiki/File:Korean_BBQ.jpg" },
  capsule: { src: "/places/capsule.jpg", alt: "海雲台藍線公園高架軌道上的黃色天空膠囊", caption: "尾浦到青沙浦的天空膠囊", credit: "VN.NguyenDucDuy · CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Sky_Capsule_train_at_Haeundae_Blueline_Park,_Busan.jpg" },
  gwangan: { src: "/places/gwangan.jpg", alt: "夜色中的廣安大橋與城市燈光", caption: "從海上看廣安大橋夜景", credit: "Jeena Paradies · CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Gwangan_Bridge_seen_Marine_City_at_Night_01.jpg" },
  gamcheon: { src: "/places/gamcheon.jpg", alt: "甘川洞文化村的彩色山城住宅", caption: "甘川洞的彩色山城", credit: "Bernard Gagnon · CC0", source: "https://commons.wikimedia.org/wiki/File:Gamcheon_Culture_Village.jpg" },
  huinnyeoul: { src: "/places/huinnyeoul.jpg", alt: "白淺灘文化村沿海坡道與城市海景", caption: "白淺灘文化村的海岸散步", credit: "Choi2451 · CC0", source: "https://commons.wikimedia.org/wiki/File:Huinnyeoul_culture_village,_Busan_on_October_25th,_2019.jpg" },
  jagalchi: { src: "/places/jagalchi.jpg", alt: "札嘎其市場內販售新鮮海產的攤位", caption: "札嘎其市場的熱鬧海味", credit: "Bernard Gagnon · CC0", source: "https://commons.wikimedia.org/wiki/File:Jagalchi_Market_01.jpg" },
  porkSoup: { src: "/places/pork-soup.jpg", alt: "一碗釜山豬肉湯飯與白飯、泡菜小菜", caption: "深夜暖胃的釜山豬肉湯飯", credit: "CYAN · CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Dwaeji_Gukbap_a0.jpg" },
  pajeon: { src: "/places/pajeon.jpg", alt: "放在黃色餐盤上的韓式海鮮煎餅", caption: "青沙浦的海鮮煎餅", credit: "Adonis Chen · CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Korean_pancake-Haemul_pajeon-01.jpg" },
  songdo: { src: "/places/songdo.jpg", alt: "晴天下的釜山松島海灘與城市天際線", caption: "從纜車俯瞰的松島海岸", credit: "Michiel1972 · CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Busan_-_Songdo_beach.jpg" },
  koreanHomeMeal: { src: "/places/korean-home-meal.jpg", alt: "韓式家常套餐與多樣小菜", caption: "述古堂的韓式家常料理氛圍", credit: "Ina Woo · CC BY-SA 4.0 · 示意照片", source: "https://commons.wikimedia.org/wiki/File:Rotary_Korean_Traditional_Set_Menu.jpg" },
  skylineLuge: { src: "/places/skyline-luge.jpg", alt: "從高處俯瞰釜山 Skyline Luge 的蜿蜒滑車軌道", caption: "Skyline Luge Busan 全景", credit: "韓國觀光公社 · VISITKOREA", source: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=351&vcontsId=187019" },
  lotteDongbusan: { src: "/places/lotte-dongbusan.jpg", alt: "藍天下的樂天東釜山購物中心正門", caption: "樂天東釜山購物中心", credit: "韓國觀光公社 · VISITKOREA", source: "https://data.visitkorea.or.kr/resource/1993017" },
  beachTrain: { src: "/places/beach-train.jpg", alt: "藍色海岸列車沿海雲台綠色鐵道迎面駛來", caption: "海雲台海岸列車", credit: "海雲台區 · 韓國觀光公社", source: "https://data.visitkorea.or.kr/resource/2672393" },
  mipoStation: { src: "/places/mipo-station.jpg", alt: "旅客沿著尾浦舊鐵道與海岸路線步行", caption: "尾浦站周邊的海岸鐵道路線", credit: "韓國觀光公社 · VISITKOREA", source: "https://data.visitkorea.or.kr/page/2789488" },
  hanwoo: { src: "/places/hanwoo-beef.jpg", alt: "炭火烤網上油花細緻的韓式牛肉", caption: "海雲台韓牛午餐", credit: "Jo Hanshin · CC0", source: "https://commons.wikimedia.org/wiki/File:Korean_Barbecue,_Beef.jpg" },
  gwangalliBeach: { src: "/places/gwangalli-beach.jpg", alt: "白天的廣安里沙灘、海面與城市天際線", caption: "廣安里海邊集合", credit: "Chelsea Hicks · CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Gwangalli_Beach.jpg" },
  yachtBridge: { src: "/places/yacht-gwangan-bridge.jpg", alt: "從遊船近距離仰望夜晚點燈的廣安大橋橋塔", caption: "從遊艇仰望廣安大橋", credit: "Spike · Public domain", source: "https://commons.wikimedia.org/wiki/File:Busan_Gwangan_Bridge_pylon_at_night_01.jpg" },
  gwangalliNight: { src: "/places/gwangalli-night.jpg", alt: "廣安里沙灘對岸明亮的夜間街景", caption: "廣安里夜晚散步", credit: "Carey Ciuro · CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Busan_Gwangalli_Night.jpg" },
} satisfies Record<string, TripPhoto>;

const photoCredits = Object.values(photos);

const days: Day[] = [
  {
    number: "01",
    short: "DAY 1",
    date: "8/27",
    weekday: "THURSDAY",
    tabLabel: "抵達釜山",
    title: "抵達釜山・深夜美食",
    subtitle: "把步調放慢，從一碗熱湯開始認識這座海港城市。",
    photos: [photos.hotel, photos.airport],
    stops: [
      {
        time: "16:40",
        tag: "FLIGHT",
        title: "桃園國際機場 TPE T2",
        summary: "辦理登機，搭乘釜山航空 BX792。",
        detail: "建議提早抵達完成報到、托運與出境手續；也可趁候機時間完成換匯、網卡與交通卡準備。",
        note: "班機 BX792 · 19:55 抵達",
        place: place("Taoyuan International Airport Terminal 2", "타오위안 국제공항 제2터미널"),
      },
      {
        time: "19:55",
        tag: "ARRIVAL",
        title: "抵達釜山金海機場 PUS",
        summary: "入境、領行李，正式踏上釜山。",
        detail: "金海機場距離市區不遠，領取行李後可先準備少量韓元，方便搭車或便利商店消費。",
        photos: [photos.airport],
        place: place("Gimhae International Airport", "김해국제공항"),
      },
      {
        time: "20:00 — 21:00",
        tag: "PREP",
        title: "出關・儲值交通卡",
        summary: "完成入境手續，整理接下來幾天的移動工具。",
        detail: "交通卡可用於地鐵、公車與部分便利商店；建議在機場先完成儲值，後續移動更順暢。",
      },
      {
        time: "21:00 — 21:30",
        tag: "CHECK-IN",
        title: "LCT Residence Y collection",
        summary: "前往海雲台飯店，辦理入住、稍作整理。",
        detail: "住宿位於 LCT Residence，地址為 30 Dalmaji-gil, Haeundae-gu, Busan。第一晚不排滿，先熟悉周邊與隔天集合方式。",
        photos: [photos.hotel],
        note: "訂房頁標示：B4, LCT Residence",
        place: hotelPlace,
      },
      {
        time: "22:00 —",
        tag: "LATE BITE",
        title: "晚餐與宵夜自理",
        summary: "豬肉湯飯、韓式炸雞，或便利商店小巡禮。",
        detail: "釜山豬肉湯飯是當地代表美食。深夜選飯店附近、步行可達的餐廳最輕鬆，也替第二天保留精神。",
        photos: [photos.porkSoup],
        place: place("pork soup Busan", "부산 돼지국밥", "附近豬肉湯飯"),
      },
    ],
  },
  {
    number: "02",
    short: "DAY 2",
    date: "8/28",
    weekday: "FRIDAY",
    tabLabel: "海岸冒險",
    title: "滑車・購物・海岸列車",
    subtitle: "從速度感到寺廟海景，傍晚沿著海岸線慢慢回到城市。",
    photos: [photos.skylineLuge, photos.temple, photos.beachTrain],
    stops: [
      {
        time: "10:00 — 12:00",
        tag: "ADVENTURE",
        title: "Skyline Luge Busan",
        summary: "自己控制滑車速度，享受海景與山景。",
        detail: "刺激度親切、適合朋友與親子同樂。戶外行程建議穿著方便活動的鞋，並做好防曬。",
        photos: [photos.skylineLuge],
        place: place("Skyline Luge Busan", "스카이라인루지 부산"),
      },
      {
        time: "12:00 — 14:00",
        tag: "SHOP & EAT",
        title: "樂天百貨・午餐與逛街",
        summary: "美食街、品牌商店、咖啡與伴手禮一次完成。",
        detail: "安排兩小時用餐與休息，也能補齊韓國保養品、服飾及旅程所需用品。",
        photos: [photos.lotteDongbusan],
        place: place("Lotte Mall Dongbusan", "롯데몰 동부산점"),
      },
      {
        time: "14:30 — 15:45",
        tag: "TEMPLE",
        title: "海東龍宮寺",
        summary: "海浪、岩岸與寺廟交織的釜山代表風景。",
        detail: "建築沿海邊岩石展開，與常見的山中寺廟截然不同。階梯較多，預留拍照與慢走時間。",
        photos: [photos.temple],
        note: "建議從市區搭計程車前往",
        place: place("Haedong Yonggungsa Temple", "해동용궁사"),
      },
      {
        time: "16:30 — 18:45",
        tag: "COAST TRAIN",
        title: "海雲台海岸列車",
        summary: "沿海岸線前進，在傍晚收藏海景與小站。",
        detail: "海岸列車節奏比天空膠囊快，沿途可看見岩岸、海面與特色小站；搭乘方向依實際票券為準。",
        photos: [photos.beachTrain],
        place: place("Haeundae Beach Train Mipo Station", "해운대 해변열차 미포정거장"),
      },
      {
        time: "19:00 — 20:30",
        tag: "DINNER",
        title: "伍班長烤肉 或 83Haechi",
        summary: "依當晚距離與候位情況，彈性選擇多人聚餐。",
        detail: "伍班長氣氛熱鬧，適合想大口吃韓式烤肉的晚上；83Haechi 位於西面站 8 號出口附近，主打韓式烤肉。",
        photos: [photos.bbq],
        place: place("Obanjang Busan", "오반장 부산", "伍班長烤肉"),
        alternate: place("83Haechi Busan Bujeon-dong 142-8", "83해치 부산진구 부전동 142-8", "83Haechi"),
      },
    ],
  },
  {
    number: "03",
    short: "DAY 3",
    date: "8/29",
    weekday: "SATURDAY",
    tabLabel: "海雲台夜色",
    title: "韓牛・天空膠囊・遊艇夜景",
    subtitle: "白天貼著海岸移動，夜裡從船上仰望發光的廣安大橋。",
    photos: [photos.hanwoo, photos.capsule, photos.yachtBridge],
    stops: [
      {
        time: "11:00 — 12:30",
        tag: "HANWOO",
        title: "海雲台母韓牛",
        summary: "細緻油花與香氣，是這趟旅程的美食重點。",
        detail: "午餐吃韓牛，下午銜接海雲台與青沙浦最順。熱門時段建議提早訂位。",
        photos: [photos.hanwoo],
        place: place("Haeundae Amso Galbijip", "해운대암소갈비집"),
      },
      {
        time: "14:00 — 15:30",
        tag: "FREE TIME",
        title: "海雲台自由活動",
        summary: "海灘散步、咖啡、逛街或補貨，留一段自己的時間。",
        detail: "海雲台周邊有海灘步道、商店、咖啡廳與高樓海景。晴天請在 15:40 前抵達尾浦站；遇雨則改走下方 Club D Oasis 備案。",
        photos: [photos.haeundae],
        place: place("Haeundae Beach", "해운대해수욕장"),
      },
      {
        time: "15:40",
        tag: "RAIN PLAN",
        title: "Club D Oasis｜雨天備案",
        summary: "雨勢明顯時，改到 LCT 館內享受水療、汗蒸幕與室內水上設施。",
        detail: "晴天仍照原行程前往尾浦站搭天空膠囊；遇雨時則改到 LCT MALL 3–6 樓的 Club D Oasis，依館內橘色指示線前往入口。",
        note: "雨天方案｜出發前請確認當日營業與票券資訊",
        place: place(
          "Club D Oasis, 30 Dalmaji-gil, Haeundae-gu, Busan",
          "클럽디 오아시스 부산 해운대구 달맞이길 30 엘시티",
          "Club D Oasis",
        ),
      },
      {
        time: "16:00 — 16:30",
        tag: "SKY CAPSULE",
        title: "天空膠囊｜尾浦 → 青沙浦",
        summary: "小巧彩色車廂沿高架軌道慢行，從高處看海。",
        detail: "車速不快，很適合拍照與錄影。靠海側視野佳，進站前可先整理好相機與手機。",
        photos: [photos.capsule],
        place: place("Mipo Station Haeundae Blue Line Park", "해운대블루라인파크 미포정거장"),
      },
      {
        time: "17:00 — 18:20",
        tag: "SEAFOOD",
        title: "海鮮煎餅・올바릇식당",
        summary: "外酥內香的海鮮煎餅，搭配青沙浦海景。",
        detail: "地址：부산 해운대구 청사포로58번길 83 1층｜電話：0507-1416-2566",
        photos: [photos.pajeon],
        note: "可直接用 Naver Map 搜尋韓文店名",
        place: place("Olbareut Restaurant Cheongsapo", "올바릇식당 청사포점"),
      },
      {
        time: "19:00",
        tag: "MEET UP",
        title: "廣安里遊艇集合",
        summary: "以韓文搜尋集合點，讓司機更容易定位。",
        detail: "從青沙浦前往廣安里建議搭計程車，避免多次轉乘。19:00 集合，預留找碼頭與報到時間。",
        photos: [photos.gwangalliBeach],
        note: "搜尋：광안리해양레포츠센터",
        place: place("Gwangalli Marine Leisure Sports Center", "광안리해양레포츠센터"),
      },
      {
        time: "19:30 — 20:30",
        tag: "YACHT NIGHT",
        title: "廣安里遊艇趴",
        summary: "海風、城市高樓與廣安大橋燈光的夜間高潮。",
        detail: "從海面看廣安大橋比岸上更有包圍感。海上風大，可帶薄外套並固定好帽子與隨身物品。",
        photos: [photos.yachtBridge],
        place: place("Gwangalli Beach", "광안리해수욕장"),
      },
      {
        time: "20:30 —",
        tag: "NIGHT WALK",
        title: "廣安里散步＋消夜",
        summary: "沿沙灘散步，再用炸雞、海鮮或咖啡替夜晚收尾。",
        detail: "表演結束後自由續攤。岸邊夜景視野開闊，也適合拍團體照。",
        photos: [photos.gwangalliNight],
        place: place("Gwangalli Beach restaurants", "광안리 맛집"),
      },
    ],
  },
  {
    number: "04",
    short: "DAY 4",
    date: "8/30",
    weekday: "SUNDAY",
    tabLabel: "南釜山散策",
    title: "山城・纜車夕陽・海鮮市場",
    subtitle: "一路向南，在彩色山城、藍白聚落與市場人聲之間感受老釜山。",
    photos: [photos.gamcheon, photos.huinnyeoul, photos.jagalchi],
    stops: [
      {
        time: "10:00",
        tag: "START",
        title: "從飯店出發",
        summary: "今日集中在南浦洞、甘川洞、松島與札嘎其一帶。",
        detail: "景點較多，穿好走的鞋並帶上防曬。行李留在飯店，輕裝移動最舒服。",
      },
      {
        time: "11:00 — 12:45",
        tag: "LUNCH",
        title: "述古堂 술고당・午餐",
        summary: "韓式家常料理，另有素食友善選擇。",
        detail: "地址：부산 중구 중구로24번길 11-1 2층｜營業時間：10:00–20:00（15:00–16:00 休息，19:30 最後點餐）。",
        photos: [photos.koreanHomeMeal],
        note: "韓文店名：술고당",
        place: place("Sulgodang Busan", "술고당"),
      },
      {
        time: "13:00 — 15:00",
        tag: "CHOOSE ONE",
        title: "甘川洞 或 DUF Coffee",
        summary: "依體力與天氣，在彩色山城散步或咖啡廳休息。",
        detail: "甘川洞以彩色房子、階梯巷弄與小王子拍照點聞名；若天氣炎熱，改到 DUF Coffee 看景放空更輕鬆。",
        photos: [photos.gamcheon],
        place: place("Gamcheon Culture Village", "감천문화마을", "甘川洞文化村"),
        alternate: place("DUF Coffee Busan", "DUF COFFEE 부산", "DUF Coffee"),
      },
      {
        time: "15:30",
        tag: "CABLE CAR",
        title: "松島海上纜車",
        summary: "從高空俯瞰海岸、海面與城市輪廓。",
        detail: "若選水晶車廂，透明腳下視角更刺激。傍晚可能排隊，票券與回程方向請先確認。",
        photos: [photos.songdo],
        place: place("Songdo Bay Station Busan Air Cruise", "송도해상케이블카 송도베이스테이션"),
      },
      {
        time: "17:30",
        tag: "SUNSET",
        title: "白淺灘文化村",
        summary: "藍白聚落貼著峭壁與海岸線，傍晚最有電影感。",
        detail: "光線柔和時很適合拍夕陽與海景。巷弄有坡度與階梯，請保留散步時間。",
        photos: [photos.huinnyeoul],
        place: place("Huinnyeoul Culture Village", "흰여울문화마을"),
      },
      {
        time: "19:00",
        tag: "MARKET DINNER",
        title: "札嘎其市場",
        summary: "螃蟹、貝類、生魚片與海鮮鍋，最後一晚大口吃海味。",
        detail: "市場氣氛熱鬧，適合先看食材再決定餐廳。點餐前可確認價格、份量與料理方式。",
        photos: [photos.jagalchi],
        place: place("Jagalchi Market", "자갈치시장"),
      },
    ],
  },
  {
    number: "05",
    short: "DAY 5",
    date: "8/31",
    weekday: "MONDAY",
    tabLabel: "準備返台",
    title: "早午餐補貨・返台",
    subtitle: "不慌不忙地收好行李，也把最後一點釜山日常裝進記憶。",
    photos: [photos.hotel, photos.airport],
    stops: [
      {
        time: "10:00 — 11:15",
        tag: "CHECK-OUT",
        title: "退房・附近早午餐",
        summary: "簡單吃、最後補貨，避免帶著行李跑太遠。",
        detail: "確認護照、行李與免稅提貨單。把握附近散步時間，11:15 前準時集合出發。",
      },
      {
        time: "11:15 — 12:00",
        tag: "TRANSFER",
        title: "前往釜山金海機場",
        summary: "保留交通緩衝，避免塞車或臨時狀況。",
        detail: "團體移動請確認車輛與行李數量，抵達機場後先找釜山航空櫃檯。",
        place: place("Gimhae International Airport", "김해국제공항"),
      },
      {
        time: "12:15",
        tag: "AIRPORT",
        title: "Check-in・退稅・免稅提領",
        summary: "完成登機、退稅與免稅品領取。",
        detail: "有退稅或預購免稅品的團員請優先辦理，完成後再自由逛免稅店。",
      },
      {
        time: "14:15",
        tag: "FLIGHT",
        title: "釜山航空 BX791 起飛",
        summary: "告別釜山，返回台灣。",
        detail: "預計 15:50 抵達桃園國際機場 T2。",
        note: "PUS → TPE · BX791",
        place: place("Gimhae International Airport", "김해국제공항"),
      },
      {
        time: "15:50",
        tag: "HOME",
        title: "抵達桃園國際機場 TPE T2",
        summary: "五天四夜，旅程圓滿結束。",
        detail: "下午抵台，回家後還有時間整理行李與好好休息。",
        place: place("Taoyuan International Airport Terminal 2", "타오위안 국제공항 제2터미널"),
      },
    ],
  },
];

const rainyDayOptions: RainyDayOption[] = [
  {
    kicker: "最近｜幾乎不用淋雨",
    title: "LCT・釜山 X the SKY",
    summary: "住處同棟就能安排餐廳、商店與高樓觀景，移動最輕鬆。",
    detail: "觀景台位於 LCT Landmark Tower 98–100 樓，室內還有媒體展示與咖啡空間。",
    note: "雲層低或雨勢過大時，高樓景觀可能受影響。",
    thumbnail: { src: "/places/rainy-lct.jpg", alt: "釜山 X the SKY 室內觀景空間", position: "center bottom" },
    place: place(
      "BUSAN X the SKY, 30 Dalmaji-gil, Haeundae-gu, Busan",
      "부산엑스더스카이 부산 해운대구 달맞이길 30",
      "釜山 X the SKY",
    ),
  },
  {
    kicker: "首選｜適合一路逛到晚上",
    title: "新世界 Centum City",
    summary: "百貨、餐廳與 SPA LAND 集中在同一區，整天雨勢不斷時最實用。",
    detail: "從 LCT 搭車約 10–15 分鐘；想放鬆時可銜接館內 SPA LAND 汗蒸幕與溫泉。",
    note: "百貨與 SPA LAND 的營業時間不同，出發前請再確認當日資訊。",
    thumbnail: { src: "/places/rainy-centum-city.jpg", alt: "新世界 Centum City 百貨室內空間", position: "center bottom" },
    place: place(
      "Shinsegae Department Store Centum City, 35 Centumnam-daero, Busan",
      "신세계백화점 센텀시티점 부산 해운대구 센텀남대로 35",
      "新世界 Centum City",
    ),
  },
  {
    kicker: "輕鬆｜咖啡・拍照・休息",
    title: "Snoopy Place Busan",
    summary: "海雲台附近的室內主題咖啡館，可以喝咖啡、拍照與逛周邊商品。",
    detail: "適合安排 60–90 分鐘，作為雨天行程中的輕鬆休息站。",
    thumbnail: { src: "/places/rainy-snoopy-place.jpg", alt: "Snoopy Place Busan 推薦資訊", position: "center top" },
    place: place(
      "Snoopy Place Busan, 197 Haeundaehaebyeon-ro, Busan",
      "스누피플레이스 부산 해운대구 해운대해변로 197",
      "Snoopy Place Busan",
    ),
  },
];

const foodTags = new Set([
  "DINNER",
  "HANWOO",
  "LATE BITE",
  "LUNCH",
  "MARKET DINNER",
  "SEAFOOD",
  "SHOP & EAT",
]);

function MapButtons({ item }: { item: MapPlace }) {
  const openNaverMap = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const device = detectNaverMapDevice(
      window.navigator.userAgent,
      window.navigator.platform,
      window.navigator.maxTouchPoints,
    );
    if (device === "web") return;

    event.preventDefault();
    if (device === "android") {
      window.location.href = item.naver.android;
      return;
    }

    const cleanup = () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", stopFallback);
      window.removeEventListener("pagehide", cleanup);
    };
    const stopFallback = () => {
      if (document.visibilityState === "hidden") cleanup();
    };

    const fallbackTimer = window.setTimeout(() => {
      cleanup();
      window.location.href = item.naver.web;
    }, 1500);
    document.addEventListener("visibilitychange", stopFallback);
    window.addEventListener("pagehide", cleanup, { once: true });
    window.location.href = item.naver.app;
  };

  return (
    <div className="map-group" aria-label={`${item.label ?? "地點"}導航`}>
      {item.label && <span className="map-label">{item.label}</span>}
      <div className="map-native-pair">
        <a className="map-btn google" href={item.google} target="_blank" rel="noreferrer" aria-label="使用 Google Maps 開啟">
          <span className="map-icon"><img src="/icons/google-maps.svg" alt="" /></span>
          <span>Google Maps</span>
          <img className="external-icon" src="/icons/arrow-square-out.svg" alt="" />
        </a>
        <a
          className="map-btn naver"
          href={item.naver.web}
          target="_blank"
          rel="noreferrer"
          aria-label="優先使用 Naver Map App 開啟"
          onClick={openNaverMap}
        >
          <span className="map-icon"><img src="/icons/naver.svg" alt="" /></span>
          <span>Naver Map</span>
          <img className="external-icon" src="/icons/arrow-square-out.svg" alt="" />
        </a>
      </div>
      {item.uber && (
        <a className="map-btn uber" href={item.uber} target="_blank" rel="noreferrer" aria-label="使用 Uber 開啟叫車並設定目的地">
          <span className="map-icon" aria-hidden="true"><span className="uber-wordmark">Uber</span></span>
          <span>Uber 叫車</span>
          <img className="external-icon" src="/icons/arrow-square-out.svg" alt="" />
        </a>
      )}
    </div>
  );
}

export default function Home() {
  const [plannerView, setPlannerView] = useState<PlannerView>("itinerary");
  const [activeDay, setActiveDay] = useState(0);
  const [expanded, setExpanded] = useState<string>("0-0");
  const [rainyDayOpen, setRainyDayOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [checklistReady, setChecklistReady] = useState(false);
  const [currencyDirection, setCurrencyDirection] = useState<CurrencyDirection>("krw-to-twd");
  const [currencyAmount, setCurrencyAmount] = useState("1000");
  const [exchangeRate, setExchangeRate] = useState(defaultExchangeRate);
  const [exchangeRateInput, setExchangeRateInput] = useState(String(defaultExchangeRate));
  const [exchangeRateReady, setExchangeRateReady] = useState(false);
  const [shareStatus, setShareStatus] = useState("分享行程");
  const [selectedPhoto, setSelectedPhoto] = useState<TripPhoto | null>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const photoTriggerRef = useRef<HTMLButtonElement | null>(null);
  const day = days[activeDay];
  const routeCover = activeDay === 2 ? photos.hotel : day.photos[0];
  const checklistTotal = checklistGroups.reduce((total, group) => total + group.items.length, 0);
  const checklistProgress = Math.round((checkedItems.length / checklistTotal) * 100);
  const numericCurrencyAmount = Number(currencyAmount);
  const hasCurrencyAmount = currencyAmount.trim() !== ""
    && Number.isFinite(numericCurrencyAmount)
    && numericCurrencyAmount >= 0;
  const convertedCurrencyAmount = hasCurrencyAmount
    ? convertCurrency(numericCurrencyAmount, currencyDirection, exchangeRate)
    : null;
  const sourceCurrency = currencyDirection === "twd-to-krw" ? "TWD" : "KRW";
  const targetCurrency = currencyDirection === "twd-to-krw" ? "KRW" : "TWD";
  const hasValidExchangeRateInput = parseExchangeRate(exchangeRateInput) !== null;
  const formattedCurrencyResult = convertedCurrencyAmount === null
    ? "—"
    : targetCurrency === "KRW"
      ? krwFormatter.format(convertedCurrencyAmount)
      : twdFormatter.format(convertedCurrencyAmount);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setCheckedItems(readChecklistSelection(window.localStorage.getItem(checklistStorageKey)));
      } catch {
        setCheckedItems([]);
      }
      setChecklistReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!checklistReady) return;
    try {
      window.localStorage.setItem(checklistStorageKey, JSON.stringify(checkedItems));
    } catch {
      // The checklist still works for this visit when device storage is unavailable.
    }
  }, [checkedItems, checklistReady]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      let storedRate = defaultExchangeRate;
      try {
        storedRate = readStoredExchangeRate(window.localStorage.getItem(exchangeRateStorageKey));
      } catch {
        // Use the requested default when device storage is unavailable.
      }
      setExchangeRate(storedRate);
      setExchangeRateInput(String(storedRate));
      setExchangeRateReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!exchangeRateReady) return;
    try {
      window.localStorage.setItem(exchangeRateStorageKey, String(exchangeRate));
    } catch {
      // The calculator still works for this visit when device storage is unavailable.
    }
  }, [exchangeRate, exchangeRateReady]);

  useEffect(() => {
    if (!selectedPhoto) return;
    const priorOverflow = document.body.style.overflow;
    const closeOrTrap = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>(".lightbox");
      const focusable = dialog?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    lightboxCloseRef.current?.focus();
    window.addEventListener("keydown", closeOrTrap);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener("keydown", closeOrTrap);
      photoTriggerRef.current?.focus();
    };
  }, [selectedPhoto]);

  useEffect(() => {
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const clearInstallPrompt = () => setInstallPrompt(null);

    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", clearInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", clearInstallPrompt);
    };
  }, []);

  const openPhoto = (photo: TripPhoto, event: ReactMouseEvent<HTMLButtonElement>) => {
    photoTriggerRef.current = event.currentTarget;
    setSelectedPhoto(photo);
  };

  const selectDay = (index: number, scroll = true) => {
    setActiveDay(index);
    setExpanded(`${index}-0`);
    setRainyDayOpen(false);
    setSelectedPhoto(null);
    if (scroll) {
      window.requestAnimationFrame(() => {
        document.querySelector("#day-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const showPlannerView = (view: PlannerView) => {
    setPlannerView(view);
    window.requestAnimationFrame(() => {
      document.querySelector("#itinerary")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const updateExchangeRate = (value: string) => {
    setExchangeRateInput(value);
    const nextRate = parseExchangeRate(value);
    if (nextRate !== null) setExchangeRate(nextRate);
  };

  const normalizeExchangeRate = () => {
    const nextRate = parseExchangeRate(exchangeRateInput);
    setExchangeRateInput(String(nextRate ?? exchangeRate));
  };

  const swapCurrencyDirection = () => {
    if (convertedCurrencyAmount !== null) {
      setCurrencyAmount(
        currencyDirection === "twd-to-krw"
          ? convertedCurrencyAmount.toFixed(0)
          : convertedCurrencyAmount.toFixed(2),
      );
    }
    setCurrencyDirection((current) => (
      current === "twd-to-krw" ? "krw-to-twd" : "twd-to-krw"
    ));
  };

  const resetExchangeRate = () => {
    setExchangeRate(defaultExchangeRate);
    setExchangeRateInput(String(defaultExchangeRate));
  };

  const handleDayKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = days.length - 1;
    let next = index;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    selectDay(next, false);
    window.requestAnimationFrame(() => document.getElementById(`day-tab-${next}`)?.focus());
  };

  const shareTrip = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "南屯團隊｜釜山 5天4夜", text: "一起查看釜山旅遊行程", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("連結已複製");
        window.setTimeout(() => setShareStatus("分享行程"), 1800);
      }
    } catch {
      setShareStatus("分享行程");
    }
  };

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <main>
      <header className="site-header" id="top">
        <nav className="topbar shell" aria-label="主要導覽">
          <a className="brand" href="#top" aria-label="回到頁首">
            <span className="brand-word">BUSAN</span>
            <span className="brand-korean">釜山 2026</span>
          </a>
          <div className="nav-actions">
            {installPrompt && (
              <button className="install-button" onClick={installApp}>
                <img src="/icons/download-simple.svg" alt="" />
                <span>安裝 App</span>
              </button>
            )}
            <button className="share-button" onClick={shareTrip} aria-label={shareStatus}>
              <img src="/icons/share-network.svg" alt="" />
              <span aria-live="polite">{shareStatus}</span>
            </button>
            <button
              className={plannerView === "checklist" ? "nav-pill checklist-nav active" : "nav-pill checklist-nav"}
              type="button"
              aria-label="出發前檢查事項"
              aria-pressed={plannerView === "checklist"}
              aria-controls="checklist-view"
              onClick={() => showPlannerView("checklist")}
            >
              <span className="nav-label-full">出發前檢查事項</span>
              <span className="nav-label-short">行前</span>
            </button>
            <button
              className={plannerView === "itinerary" ? "nav-pill itinerary-nav active" : "nav-pill itinerary-nav"}
              type="button"
              aria-label="查看行程"
              aria-pressed={plannerView === "itinerary"}
              aria-controls="itinerary-view"
              onClick={() => showPlannerView("itinerary")}
            >
              <span className="nav-label-full">查看行程</span>
              <span className="nav-label-short">行程</span>
              <img src="/icons/arrow-down.svg" alt="" />
            </button>
            <button
              className={plannerView === "currency" ? "nav-pill currency-nav active" : "nav-pill currency-nav"}
              type="button"
              aria-label="開啟台幣韓幣匯率計算機"
              aria-pressed={plannerView === "currency"}
              aria-controls="currency-view"
              onClick={() => showPlannerView("currency")}
            >
              <span className="nav-label-full">匯率計算</span>
              <span className="nav-label-short">匯率</span>
            </button>
          </div>
        </nav>
      </header>

      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-media">
          <img src={photos.hotel.src} alt={photos.hotel.alt} />
          <div className="hero-media-meta">
            <span>2026.08.27 — 08.31</span>
            <span>BUSAN · KOREA</span>
          </div>
          <div className="hero-intro">
            <div className="hero-heading">
              <p className="eyebrow">SUMMER POCKET GUIDE</p>
              <h1 id="hero-title">釜山，<em>五日。</em></h1>
            </div>
            <div className="hero-summary">
              <p>海岸、城市與夏日的美味記憶，整理成一份隨身好讀的旅遊手冊。</p>
              <a href="#itinerary" onClick={() => setPlannerView("itinerary")}>開始閱讀 <img src="/icons/arrow-down.svg" alt="" /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-view shell" aria-label="旅程摘要">
        <div><span>01</span><p>去程航班</p><b>BX792</b><small>TPE 16:40 → PUS 19:55</small></div>
        <div><span>02</span><p>旅行日期</p><b>8.27 — 8.31</b><small>THU — MON</small></div>
        <div><span>03</span><p>回程航班</p><b>BX791</b><small>PUS 14:15 → TPE 15:50</small></div>
      </section>

      <section className="stay-card shell" aria-labelledby="stay-title">
        <button className="stay-visual" onClick={(event) => openPhoto(photos.hotel, event)} aria-label="放大住宿照片">
          <img src={photos.hotel.src} alt={photos.hotel.alt} />
          <span><b>04</b> NIGHTS · HAEUNDAE</span>
        </button>
        <div className="stay-copy">
          <div className="stay-badges">
            <p className="eyebrow">OUR STAY</p>
            <span>HAEUNDAE · BUSAN</span>
          </div>
          <h2 id="stay-title">
            <span className="stay-name-badge">LCT Residence</span>
            <em>Y collection</em>
          </h2>
          <p>我們在海雲台的落腳處。入住後可先熟悉周邊，Day 2、Day 3 的海岸行程也更好銜接。</p>
          <address>30 Dalmaji-gil, Haeundae-gu, Busan</address>
          <MapButtons item={hotelPlace} />
        </div>
      </section>

      <section
        className={`itinerary-shell ${plannerView === "itinerary" ? "" : `${plannerView}-mode`}`}
        id="itinerary"
        aria-labelledby={
          plannerView === "itinerary"
            ? "itinerary-title"
            : plannerView === "checklist"
              ? "checklist-title"
              : "currency-title"
        }
      >
        {plannerView === "itinerary" ? (
        <div id="itinerary-view">
        <div className="itinerary-cover shell">
          <img src={routeCover.src} alt={routeCover.alt} />
          <span>{day.weekday} · {day.date}</span>
        </div>
        <header className="itinerary-heading shell">
          <p className="eyebrow dark">TODAY&apos;S ROUTE</p>
          <h2 id="itinerary-title">DAY {Number(day.number)} <span>· {day.date}</span></h2>
          <div className="route-title-row">
            <h3>{day.title}</h3>
            <p>{day.subtitle}</p>
          </div>
        </header>

        <div className={activeDay === 2 ? "day-tabs shell has-rainy-day" : "day-tabs shell"} role="tablist" aria-label="選擇行程日期">
          {days.map((tab, index) => (
            <button
              className={index === activeDay ? "day-tab active" : "day-tab"}
              key={tab.short}
              id={`day-tab-${index}`}
              role="tab"
              aria-selected={index === activeDay}
              aria-controls={`day-panel-${index}`}
              tabIndex={index === activeDay ? 0 : -1}
              onClick={() => selectDay(index)}
              onKeyDown={(event) => handleDayKeyDown(event, index)}
            >
              <b>{tab.short}</b><span>{tab.date}</span><small>{tab.tabLabel}</small>
            </button>
          ))}
        </div>

        {activeDay === 2 && (
          <div className="rainy-day shell">
            <button
              className="rainy-day-toggle"
              type="button"
              aria-expanded={rainyDayOpen}
              aria-controls="rainy-day-options"
              onClick={() => setRainyDayOpen((current) => !current)}
            >
              <span className="rainy-day-icon" aria-hidden="true">☂</span>
              <span className="rainy-day-toggle-copy">
                <small>DAY 3 · ALTERNATE PLAN</small>
                <strong>雨天備案</strong>
              </span>
              <span className="rainy-day-toggle-action">
                {rainyDayOpen ? "收合備案" : "查看 3 個室內景點"}
                <span className="rainy-day-chevron" aria-hidden="true" />
              </span>
            </button>

            {rainyDayOpen && (
              <section className="rainy-day-panel" id="rainy-day-options" aria-labelledby="rainy-day-title">
                <header className="rainy-day-heading">
                  <div>
                    <p className="eyebrow dark">WHEN IT RAINS</p>
                    <h3 id="rainy-day-title">下雨也能好好逛釜山</h3>
                  </div>
                  <p>依雨勢與想走的步調，從最近、最完整或最輕鬆的室內去處中挑一個。</p>
                </header>

                <div className="rainy-day-grid">
                  {rainyDayOptions.map((option, index) => (
                    <article className="rainy-day-card" key={option.title}>
                      <div
                        className="rainy-day-thumbnail"
                        role="img"
                        aria-label={option.thumbnail.alt}
                        style={{
                          backgroundImage: `url(${option.thumbnail.src})`,
                          backgroundPosition: option.thumbnail.position,
                        }}
                      />
                      <div className="rainy-day-card-meta">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <small>{option.kicker}</small>
                      </div>
                      <h4>{option.title}</h4>
                      <p>{option.summary}</p>
                      <p className="rainy-day-detail">{option.detail}</p>
                      {option.note && <p className="rainy-day-note">{option.note}</p>}
                      <MapButtons item={option.place} />
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <article
          className="day-detail shell"
          id="day-detail"
          key={day.number}
          role="tabpanel"
          aria-labelledby={`day-tab-${activeDay}`}
        >
          <div className="timeline">
            {day.stops.map((stop, index) => {
              const key = `${activeDay}-${index}`;
              const isExpanded = expanded === key;
              const panelId = `event-${activeDay}-${index}`;
              return (
                <div className={`timeline-item ${isExpanded ? "is-open" : ""}`} key={`${stop.time}-${stop.title}`}>
                  <div className="event-card">
                    <button
                      className="event-main"
                      onClick={() => setExpanded(isExpanded ? "" : key)}
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                    >
                      <span className="event-copy">
                        <span className="event-meta">
                          <time>{stop.time}</time>
                          <span className={foodTags.has(stop.tag) ? "tag food-tag" : "tag"}>{stop.tag}</span>
                        </span>
                        <strong>{stop.title}</strong>
                        <span>{stop.summary}</span>
                      </span>
                      <span className="expand-icon" aria-hidden="true">
                        <img src={isExpanded ? "/icons/caret-up.svg" : "/icons/caret-down.svg"} alt="" />
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="event-extra" id={panelId}>
                        <p>{stop.detail}</p>
                        {stop.photos && (
                          <div className={`stop-photos count-${stop.photos.length}`} aria-label={`${stop.title}相關照片`}>
                            {stop.photos.map((photo) => (
                              <button className="stop-photo" key={photo.src} onClick={(event) => openPhoto(photo, event)} aria-label={`放大照片：${photo.caption}`}>
                                <img src={photo.src} alt={photo.alt} loading="lazy" />
                                <span>{photo.caption}<img src="/icons/arrow-square-out.svg" alt="" /></span>
                              </button>
                            ))}
                          </div>
                        )}
                        {stop.note && <p className="note"><span>NOTE</span>{stop.note}</p>}
                        {(stop.place || stop.alternate) && (
                          <div className="map-actions">
                            {stop.place && <MapButtons item={stop.place} />}
                            {stop.alternate && <MapButtons item={stop.alternate} />}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <section className="day-gallery-wrap" aria-labelledby="gallery-title">
            <div className="gallery-heading">
              <p className="eyebrow dark">DAY {activeDay + 1} / {days.length}</p>
              <h3 id="gallery-title">今日剪影</h3>
            </div>
            <div className={`day-gallery count-${day.photos.length}`} aria-label={`${day.short} 景點照片`}>
              {day.photos.map((photo, index) => (
                <button className={`gallery-card photo-${index + 1}`} key={photo.src} onClick={(event) => openPhoto(photo, event)} aria-label={`放大照片：${photo.caption}`}>
                  <img src={photo.src} alt={photo.alt} loading={activeDay === 0 ? "eager" : "lazy"} />
                  <span className="gallery-shade" />
                  <span className="gallery-caption">
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <span>{photo.caption}</span>
                    <img src="/icons/arrow-square-out.svg" alt="" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </article>

        <div className="day-switcher shell">
          <button disabled={activeDay === 0} onClick={() => selectDay(activeDay - 1)}>
            <img src="/icons/arrow-left.svg" alt="" /> 前一天
          </button>
          <span>{day.short} · {day.tabLabel}</span>
          <button disabled={activeDay === days.length - 1} onClick={() => selectDay(activeDay + 1)}>
            後一天 <img src="/icons/arrow-right.svg" alt="" />
          </button>
        </div>
        </div>
        ) : plannerView === "checklist" ? (
          <div className="checklist-view shell" id="checklist-view">
            <header className="checklist-header">
              <div>
                <p className="eyebrow dark">BEFORE YOU GO</p>
                <h2 id="checklist-title">旅行檢查清單</h2>
                <p>依照 2026 釜山五天四夜行程整理。勾選紀錄只會儲存在目前這台裝置。</p>
              </div>
              <div className="checklist-progress" aria-live="polite">
                <span><strong>{checkedItems.length}</strong> / {checklistTotal} 已準備</span>
                <div
                  className="checklist-progress-track"
                  role="progressbar"
                  aria-label="行前準備進度"
                  aria-valuemin={0}
                  aria-valuemax={checklistTotal}
                  aria-valuenow={checkedItems.length}
                >
                  <span style={{ width: `${checklistProgress}%` }} />
                </div>
              </div>
            </header>

            <div className="checklist-groups">
              {checklistGroups.map((group, groupIndex) => (
                <section className="checklist-group" key={group.title} aria-labelledby={`checklist-group-${groupIndex}`}>
                  <header>
                    <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 id={`checklist-group-${groupIndex}`}>{group.title}</h3>
                      <p>{group.subtitle}</p>
                    </div>
                  </header>
                  <ul>
                    {group.items.map((item) => {
                      const isChecked = checkedItems.includes(item.id);
                      return (
                        <li className={isChecked ? "is-checked" : ""} key={item.id}>
                          <label htmlFor={`checklist-${item.id}`}>
                            <input
                              id={`checklist-${item.id}`}
                              type="checkbox"
                              checked={isChecked}
                              aria-label={`${item.title}，準備好了`}
                              onChange={() => toggleChecklistItem(item.id)}
                            />
                            <span className="checklist-copy">
                              <strong>{item.title}</strong>
                              <span>{item.detail}</span>
                            </span>
                          </label>
                          {item.href && (
                            <a href={item.href} target="_blank" rel="noreferrer">
                              {item.linkLabel}<img src="/icons/arrow-square-out.svg" alt="" />
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        ) : (
          <div className="currency-view shell" id="currency-view">
            <header className="currency-header">
              <div>
                <p className="eyebrow dark">TRAVEL MONEY</p>
                <h2 id="currency-title">台幣・韓幣換算</h2>
                <p>出發前先抓好旅費尺度。自訂匯率只會儲存在目前這台裝置。</p>
              </div>
              <div className="currency-rate-summary" aria-live="polite">
                <span>目前使用匯率</span>
                <strong>{exchangeRate.toFixed(5)}</strong>
                <small>1 KRW = {exchangeRate.toFixed(5)} TWD</small>
              </div>
            </header>

            <div className="currency-grid">
              <section className="currency-calculator" aria-label="台幣韓幣換算">
                <p className="currency-card-label">QUICK CONVERT</p>
                <div className="currency-amount-field">
                  <label htmlFor="currency-amount">輸入金額</label>
                  <div>
                    <span aria-hidden="true">{sourceCurrency}</span>
                    <input
                      id="currency-amount"
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={currencyAmount}
                      onChange={(event) => setCurrencyAmount(event.target.value)}
                    />
                  </div>
                  <small>{sourceCurrency === "TWD" ? "新台幣" : "韓元"}</small>
                </div>

                <button
                  className="currency-swap"
                  type="button"
                  aria-label={`切換為${targetCurrency === "TWD" ? "新台幣換韓元" : "韓元換新台幣"}`}
                  onClick={swapCurrencyDirection}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" />
                  </svg>
                  交換幣別
                </button>

                <div className="currency-result" aria-live="polite">
                  <span>換算結果</span>
                  <output htmlFor="currency-amount">{formattedCurrencyResult}</output>
                  <small>{targetCurrency === "TWD" ? "新台幣 TWD" : "韓元 KRW"}</small>
                </div>
              </section>

              <aside className="currency-settings" aria-labelledby="exchange-rate-title">
                <p className="eyebrow dark">YOUR RATE</p>
                <h3 id="exchange-rate-title">自訂換算匯率</h3>
                <p>預設以 1 韓元兌換 0.02514 新台幣估算，可依當下刷卡或換匯匯率調整。</p>
                <label htmlFor="exchange-rate">每 1 韓元可兌換</label>
                <div className={`exchange-rate-field ${hasValidExchangeRateInput ? "" : "is-invalid"}`}>
                  <span>1 KRW =</span>
                  <input
                    id="exchange-rate"
                    type="number"
                    min="0"
                    step="0.00001"
                    inputMode="decimal"
                    value={exchangeRateInput}
                    aria-invalid={!hasValidExchangeRateInput}
                    aria-describedby="exchange-rate-help"
                    onChange={(event) => updateExchangeRate(event.target.value)}
                    onBlur={normalizeExchangeRate}
                  />
                  <span>TWD</span>
                </div>
                <p className="exchange-rate-help" id="exchange-rate-help">
                  {hasValidExchangeRateInput ? "已自動儲存在此裝置" : "請輸入大於 0 的匯率"}
                </p>
                <button className="exchange-rate-reset" type="button" onClick={resetExchangeRate}>
                  恢復預設匯率
                </button>
              </aside>
            </div>
          </div>
        )}
      </section>

      <section className="travel-notes">
        <div className="shell notes-shell">
          <div className="notes-title">
            <p className="eyebrow">GOOD TO KNOW</p>
            <h2>出發前，<br /><em>記得這三件事。</em></h2>
          </div>
          <div className="note-grid">
            <article><span>01</span><h3>地圖雙準備</h3><p>Google Maps 方便收藏與查看，韓國當地導航建議優先使用 Naver Map。</p></article>
            <article><span>02</span><h3>票券先確認</h3><p>天空膠囊、海岸列車、遊艇與纜車請留意預約時間、集合點及搭乘方向。</p></article>
            <article><span>03</span><h3>保留移動緩衝</h3><p>週末熱門景點容易候位。跨區移動預留 15–30 分鐘，旅程會更從容。</p></article>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell">
          <div className="footer-mark">BUSAN <em>釜山</em></div>
          <div className="footer-meta">
            <p>南屯團隊 · 2026 SUMMER JOURNEY</p>
            <button onClick={shareTrip}>{shareStatus}<img src="/icons/share-network.svg" alt="" /></button>
          </div>
          <p className="disclaimer">行程與交通時間可能因天候、現場營運與路況調整；出發前請再次確認票券及店家資訊。</p>
          <details className="photo-credits">
            <summary>照片來源與授權</summary>
            <div>
              {photoCredits.map((photo) => <a href={photo.source} target="_blank" rel="noreferrer" key={photo.src}>{photo.caption} — {photo.credit}</a>)}
            </div>
          </details>
        </div>
      </footer>
      {selectedPhoto && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={selectedPhoto.caption}>
          <button ref={lightboxCloseRef} className="lightbox-close" onClick={() => setSelectedPhoto(null)} aria-label="關閉照片">
            <img src="/icons/x.svg" alt="" />
          </button>
          <figure>
            <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
            <figcaption>
              <span>{selectedPhoto.caption}</span>
              <a href={selectedPhoto.source} target="_blank" rel="noreferrer">{selectedPhoto.credit}<img src="/icons/arrow-square-out.svg" alt="" /></a>
            </figcaption>
          </figure>
        </div>
      )}
      <a className="back-top" href="#top" aria-label="回到頁首"><img src="/icons/arrow-up.svg" alt="" /></a>
    </main>
  );
}
