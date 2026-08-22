# 南屯團隊｜釜山 5 天 4 夜互動行程

釜山五天四夜的行動版旅遊行程網站，以每日時間軸整理景點、美食、住宿與交通資訊，並提供 Google Maps 與 Naver Map 導航連結。

網站：[nantun-busan-2026.mars0512.chatgpt.site](https://nantun-busan-2026.mars0512.chatgpt.site)

## 主要功能

- 五天行程分頁與前後日切換
- 景點卡片、實景照片與點擊放大檢視
- Google Maps、Naver Map 一鍵搜尋與導航
- 飯店、航班、集合時間及行前提醒
- 適合手機、平板與桌面瀏覽的響應式版面
- 分享行程與回到頁首等互動功能

## 本機執行

需要 Node.js 22.13.0 或更新版本。

```bash
npm install
npm run dev
```

正式建置：

```bash
npm run build
```

## 技術

- React 19
- TypeScript
- Vite / vinext
- Cloudflare Workers 相容輸出
- OpenAI Sites 部署

## 照片來源

網站使用的實景照片來自 Wikimedia Commons、韓國觀光公社與相關公開旅遊資料；作者及授權來源可在網站頁尾的「照片來源與授權」查看。照片權利仍屬各原作者或來源機構，公開此原始碼不代表授權照片作其他用途。
