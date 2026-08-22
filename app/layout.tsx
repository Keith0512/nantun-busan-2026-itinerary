import type { Metadata } from "next";
import { Geist, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  weight: ["400", "500", "600"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nantun-busan-2026.mars0512.chatgpt.site"),
  title: "南屯團隊｜釜山 5天4夜",
  description: "2026 釜山 5天4夜互動旅遊行程，景點、美食與導航一次整理。",
  openGraph: {
    title: "南屯團隊｜BUSAN 2026",
    description: "5 DAYS · 4 NIGHTS｜釜山互動旅遊行程",
    type: "website",
    locale: "zh_TW",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "南屯團隊 BUSAN 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "南屯團隊｜BUSAN 2026",
    description: "5 DAYS · 4 NIGHTS｜釜山互動旅遊行程",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${notoSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
