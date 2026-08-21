"use client";

import { useState } from "react";

type MapPlace = { label?: string; google: string; naver: string };
type Stop = {
  time: string;
  tag: string;
  title: string;
  summary: string;
  detail: string;
  note?: string;
  place?: MapPlace;
  alternate?: MapPlace;
};
type Day = {
  number: string;
  short: string;
  date: string;
  weekday: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  stops: Stop[];
};

const googleMap = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const naverMap = (query: string) =>
  `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
const place = (google: string, naver: string, label?: string): MapPlace => ({
  google: googleMap(google),
  naver: naverMap(naver),
  label,
});

const days: Day[] = [
  {
    number: "01",
    short: "DAY 1",
    date: "8/27",
    weekday: "THURSDAY",
    tabLabel: "抵達釜山",
    title: "抵達釜山・深夜美食",
    subtitle: "把步調放慢，從一碗熱湯開始認識這座海港城市。",
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
        title: "前往市區飯店",
        summary: "辦理入住、稍作整理，第一晚保留體力。",
        detail: "不安排緊湊景點，先熟悉飯店周邊與隔天集合方式。飯店確定後，可再把導航連結補進這張卡片。",
      },
      {
        time: "22:00 —",
        tag: "LATE BITE",
        title: "晚餐與宵夜自理",
        summary: "豬肉湯飯、韓式炸雞，或便利商店小巡禮。",
        detail: "釜山豬肉湯飯是當地代表美食。深夜選飯店附近、步行可達的餐廳最輕鬆，也替第二天保留精神。",
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
    stops: [
      {
        time: "10:00 — 12:00",
        tag: "ADVENTURE",
        title: "Skyline Luge Busan",
        summary: "自己控制滑車速度，享受海景與山景。",
        detail: "刺激度親切、適合朋友與親子同樂。戶外行程建議穿著方便活動的鞋，並做好防曬。",
        place: place("Skyline Luge Busan", "스카이라인루지 부산"),
      },
      {
        time: "12:00 — 14:00",
        tag: "SHOP & EAT",
        title: "樂天百貨・午餐與逛街",
        summary: "美食街、品牌商店、咖啡與伴手禮一次完成。",
        detail: "安排兩小時用餐與休息，也能補齊韓國保養品、服飾及旅程所需用品。",
        place: place("Lotte Mall Dongbusan", "롯데몰 동부산점"),
      },
      {
        time: "14:30 — 15:45",
        tag: "TEMPLE",
        title: "海東龍宮寺",
        summary: "海浪、岩岸與寺廟交織的釜山代表風景。",
        detail: "建築沿海邊岩石展開，與常見的山中寺廟截然不同。階梯較多，預留拍照與慢走時間。",
        note: "建議從市區搭計程車前往",
        place: place("Haedong Yonggungsa Temple", "해동용궁사"),
      },
      {
        time: "16:30 — 18:45",
        tag: "COAST TRAIN",
        title: "海雲台海岸列車",
        summary: "沿海岸線前進，在傍晚收藏海景與小站。",
        detail: "海岸列車節奏比天空膠囊快，沿途可看見岩岸、海面與特色小站；搭乘方向依實際票券為準。",
        place: place("Haeundae Beach Train Mipo Station", "해운대 해변열차 미포정거장"),
      },
      {
        time: "19:00 — 20:30",
        tag: "DINNER",
        title: "伍班長烤肉 或 83獬",
        summary: "依當晚距離與候位情況，彈性選擇多人聚餐。",
        detail: "伍班長氣氛熱鬧，適合想大口吃韓式烤肉的晚上；83獬則作為另一個彈性選項。",
        place: place("Obanjang Busan", "오반장 부산", "伍班長烤肉"),
        alternate: place("83 Hae Busan", "83해치 부산", "83獬"),
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
    stops: [
      {
        time: "11:00 — 12:30",
        tag: "HANWOO",
        title: "海雲台母韓牛",
        summary: "細緻油花與香氣，是這趟旅程的美食重點。",
        detail: "午餐吃韓牛，下午銜接海雲台與青沙浦最順。熱門時段建議提早訂位。",
        place: place("Haeundae Amso Galbijip", "해운대암소갈비집"),
      },
      {
        time: "14:00 — 15:30",
        tag: "FREE TIME",
        title: "海雲台自由活動",
        summary: "海灘散步、咖啡、逛街或補貨，留一段自己的時間。",
        detail: "海雲台周邊有海灘步道、商店、咖啡廳與高樓海景。請記得在 15:40 前抵達尾浦站。",
        place: place("Haeundae Beach", "해운대해수욕장"),
      },
      {
        time: "15:40",
        tag: "MEET UP",
        title: "抵達尾浦站",
        summary: "提早集合，預留拍照、排隊與確認票券時間。",
        detail: "尾浦站是天空膠囊熱門起點。確認搭乘人數與 QR Code，別把時間卡得太剛好。",
        place: place("Mipo Station Haeundae Blue Line Park", "해운대블루라인파크 미포정거장"),
      },
      {
        time: "16:00 — 16:30",
        tag: "SKY CAPSULE",
        title: "天空膠囊｜尾浦 → 青沙浦",
        summary: "小巧彩色車廂沿高架軌道慢行，從高處看海。",
        detail: "車速不快，很適合拍照與錄影。靠海側視野佳，進站前可先整理好相機與手機。",
        place: place("Cheongsapo Station Haeundae Blue Line Park", "해운대블루라인파크 청사포정거장"),
      },
      {
        time: "17:00 — 18:20",
        tag: "SEAFOOD",
        title: "海鮮煎餅・올바릇식당",
        summary: "外酥內香的海鮮煎餅，搭配青沙浦海景。",
        detail: "地址：부산 해운대구 청사포로58번길 83 1층｜電話：0507-1416-2566",
        note: "可直接用 Naver Map 搜尋韓文店名",
        place: place("Olbareut Restaurant Cheongsapo", "올바릇식당 청사포점"),
      },
      {
        time: "19:00",
        tag: "MEET UP",
        title: "廣安里遊艇集合",
        summary: "以韓文搜尋集合點，讓司機更容易定位。",
        detail: "從青沙浦前往廣安里建議搭計程車，避免多次轉乘。19:00 集合，預留找碼頭與報到時間。",
        note: "搜尋：광안리해양레포츠센터",
        place: place("Gwangalli Marine Leisure Sports Center", "광안리해양레포츠센터"),
      },
      {
        time: "19:30 — 20:30",
        tag: "YACHT NIGHT",
        title: "廣安里遊艇趴",
        summary: "海風、城市高樓與廣安大橋燈光的夜間高潮。",
        detail: "從海面看廣安大橋比岸上更有包圍感。海上風大，可帶薄外套並固定好帽子與隨身物品。",
        place: place("Gwangalli Beach", "광안리해수욕장"),
      },
      {
        time: "20:30 —",
        tag: "NIGHT WALK",
        title: "廣安里散步＋消夜",
        summary: "沿沙灘散步，再用炸雞、海鮮或咖啡替夜晚收尾。",
        detail: "表演結束後自由續攤。岸邊夜景視野開闊，也適合拍團體照。",
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
        title: "述古堂中餐",
        summary: "用中式料理調整口味，吃飽再開始午後景點。",
        detail: "適合長輩或想暫時換口味的團員。店家名稱可能有譯名差異，出發前建議再次確認定位。",
        place: place("述古堂 Busan", "述古堂 부산"),
      },
      {
        time: "13:00 — 15:00",
        tag: "CHOOSE ONE",
        title: "甘川洞 或 DUF Coffee",
        summary: "依體力與天氣，在彩色山城散步或咖啡廳休息。",
        detail: "甘川洞以彩色房子、階梯巷弄與小王子拍照點聞名；若天氣炎熱，改到 DUF Coffee 看景放空更輕鬆。",
        place: place("Gamcheon Culture Village", "감천문화마을", "甘川洞文化村"),
        alternate: place("DUF Coffee Busan", "DUF COFFEE 부산", "DUF Coffee"),
      },
      {
        time: "15:30",
        tag: "CABLE CAR",
        title: "松島海上纜車",
        summary: "從高空俯瞰海岸、海面與城市輪廓。",
        detail: "若選水晶車廂，透明腳下視角更刺激。傍晚可能排隊，票券與回程方向請先確認。",
        place: place("Songdo Bay Station Busan Air Cruise", "송도해상케이블카 송도베이스테이션"),
      },
      {
        time: "17:30",
        tag: "SUNSET",
        title: "白淺灘文化村",
        summary: "藍白聚落貼著峭壁與海岸線，傍晚最有電影感。",
        detail: "光線柔和時很適合拍夕陽與海景。巷弄有坡度與階梯，請保留散步時間。",
        place: place("Huinnyeoul Culture Village", "흰여울문화마을"),
      },
      {
        time: "19:00",
        tag: "MARKET DINNER",
        title: "札嘎其市場",
        summary: "螃蟹、貝類、生魚片與海鮮鍋，最後一晚大口吃海味。",
        detail: "市場氣氛熱鬧，適合先看食材再決定餐廳。點餐前可確認價格、份量與料理方式。",
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

function MapButtons({ item }: { item: MapPlace }) {
  return (
    <div className="map-group" aria-label={`${item.label ?? "地點"}導航`}>
      {item.label && <span className="map-label">{item.label}</span>}
      <a className="map-btn google" href={item.google} target="_blank" rel="noreferrer" aria-label="使用 Google Maps 開啟">
        <span className="map-icon">G</span><span>Google Maps</span><b>↗</b>
      </a>
      <a className="map-btn naver" href={item.naver} target="_blank" rel="noreferrer" aria-label="使用 Naver Map 開啟">
        <span className="map-icon">N</span><span>Naver Map</span><b>↗</b>
      </a>
    </div>
  );
}

export default function Home() {
  const [activeDay, setActiveDay] = useState(0);
  const [expanded, setExpanded] = useState<string>("0-0");
  const [shareStatus, setShareStatus] = useState("分享行程");
  const day = days[activeDay];

  const selectDay = (index: number) => {
    setActiveDay(index);
    setExpanded(`${index}-0`);
    document.querySelector("#day-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  return (
    <main>
      <section className="hero" id="top">
        <nav className="topbar" aria-label="主要導覽">
          <a className="brand" href="#top" aria-label="回到頁首">
            <span className="brand-mark">NT</span>
            <span>南屯團隊<br /><small>BUSAN 2026</small></span>
          </a>
          <div className="nav-actions">
            <button className="nav-link" onClick={shareTrip}>{shareStatus}</button>
            <a className="nav-pill" href="#itinerary">查看行程 <span>↓</span></a>
          </div>
        </nav>

        <div className="hero-inner">
          <p className="eyebrow"><span /> 2026.08.27 — 08.31</p>
          <h1>BUSAN<br /><em>釜山</em></h1>
          <div className="hero-meta">
            <p>5 DAYS · 4 NIGHTS</p>
            <p>海岸、城市與<br />夏日的美味記憶</p>
          </div>
        </div>

        <div className="hero-badge" aria-hidden="true"><b>5</b><span>DAYS<br />TOGETHER</span></div>
        <div className="hero-caption">35.1796° N · 129.0756° E <i /></div>
      </section>

      <section className="quick-view" aria-label="旅程摘要">
        <div><span>01</span><p>去程航班</p><b>BX792</b><small>TPE 16:40 → PUS 19:55</small></div>
        <div><span>02</span><p>旅行日期</p><b>8.27 — 8.31</b><small>THU — MON</small></div>
        <div><span>03</span><p>回程航班</p><b>BX791</b><small>PUS 14:15 → TPE 15:50</small></div>
      </section>

      <section className="itinerary-shell" id="itinerary">
        <header className="section-heading reveal">
          <div>
            <p className="eyebrow dark"><span /> OUR JOURNEY</p>
            <h2>旅程，一天一天展開。</h2>
          </div>
          <p className="section-intro">點選日期切換每日行程，展開卡片看完整提醒；<br />有地點的行程可直接開啟導航。</p>
        </header>

        <div className="day-tabs" role="tablist" aria-label="選擇行程日期">
          {days.map((tab, index) => (
            <button
              className={index === activeDay ? "day-tab active" : "day-tab"}
              key={tab.short}
              role="tab"
              aria-selected={index === activeDay}
              aria-controls="day-detail"
              onClick={() => selectDay(index)}
            >
              <b>{tab.short}</b><span>{tab.date}</span><small>{tab.tabLabel}</small>
            </button>
          ))}
        </div>

        <article className="day-detail" id="day-detail" key={day.number}>
          <aside className="day-sidebar">
            <div className="day-heading">
              <span>{day.number}</span>
              <div><p>{day.weekday} · {day.date}</p><h3>{day.title}</h3></div>
            </div>
            <p className="day-subtitle">{day.subtitle}</p>
            <div className="day-progress" aria-label={`第 ${Number(day.number)} 天，共 5 天`}>
              <span style={{ width: `${((activeDay + 1) / days.length) * 100}%` }} />
            </div>
            <p className="day-count">DAY {activeDay + 1} / {days.length}</p>
          </aside>

          <div className="timeline">
            {day.stops.map((stop, index) => {
              const key = `${activeDay}-${index}`;
              const isExpanded = expanded === key;
              return (
                <div className={`timeline-item ${isExpanded ? "is-open" : ""}`} key={`${stop.time}-${stop.title}`}>
                  <time>{stop.time}</time>
                  <span className="dot" aria-hidden="true" />
                  <div className="event-card">
                    <button className="event-main" onClick={() => setExpanded(isExpanded ? "" : key)} aria-expanded={isExpanded}>
                      <span className="event-copy">
                        <span className="tag">{stop.tag}</span>
                        <strong>{stop.title}</strong>
                        <span>{stop.summary}</span>
                      </span>
                      <span className="expand-icon" aria-hidden="true">{isExpanded ? "−" : "+"}</span>
                    </button>
                    <div className="event-extra" aria-hidden={!isExpanded}>
                      <p>{stop.detail}</p>
                      {stop.note && <p className="note"><span>NOTE</span>{stop.note}</p>}
                      {(stop.place || stop.alternate) && (
                        <div className="map-actions">
                          {stop.place && <MapButtons item={stop.place} />}
                          {stop.alternate && <MapButtons item={stop.alternate} />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <div className="day-switcher">
          <button disabled={activeDay === 0} onClick={() => selectDay(activeDay - 1)}>← 前一天</button>
          <span>{day.short} · {day.tabLabel}</span>
          <button disabled={activeDay === days.length - 1} onClick={() => selectDay(activeDay + 1)}>後一天 →</button>
        </div>
      </section>

      <section className="travel-notes">
        <div className="notes-title">
          <p className="eyebrow"><span /> GOOD TO KNOW</p>
          <h2>出發前，<br /><em>記得這三件事。</em></h2>
        </div>
        <div className="note-grid">
          <article><span>01</span><h3>地圖雙準備</h3><p>Google Maps 方便收藏與查看，韓國當地導航建議優先使用 Naver Map。</p></article>
          <article><span>02</span><h3>票券先確認</h3><p>天空膠囊、海岸列車、遊艇與纜車請留意預約時間、集合點及搭乘方向。</p></article>
          <article><span>03</span><h3>保留移動緩衝</h3><p>週末熱門景點容易候位。跨區移動預留 15–30 分鐘，旅程會更從容。</p></article>
        </div>
      </section>

      <footer>
        <div className="footer-mark">BUSAN <em>釜山</em></div>
        <div className="footer-meta"><p>南屯團隊 · 2026 SUMMER JOURNEY</p><button onClick={shareTrip}>{shareStatus} ↗</button></div>
        <p className="disclaimer">行程與交通時間可能因天候、現場營運與路況調整；出發前請再次確認票券及店家資訊。</p>
      </footer>
      <a className="back-top" href="#top" aria-label="回到頁首">↑</a>
    </main>
  );
}
