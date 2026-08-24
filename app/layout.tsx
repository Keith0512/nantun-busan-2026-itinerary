import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import PwaRegister from "./pwa-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSans = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const editorialSerif = Cormorant_Garamond({
  variable: "--font-editorial-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nantun-busan-2026.mars0512.chatgpt.site"),
  applicationName: "BUSAN 2026",
  title: "南屯團隊｜釜山 5天4夜",
  description: "2026 釜山 5天4夜互動旅遊行程，景點、美食與導航一次整理。",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BUSAN 2026",
  },
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
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/pwa/icon-192.png",
    apple: [{ url: "/pwa/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#082F49",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${notoSans.variable} ${editorialSerif.variable} antialiased`}
      >
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
