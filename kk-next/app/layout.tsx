import type { Metadata } from "next";
import { Russo_One, Golos_Text, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";

// 07-design-system.md — 전부 키릴 지원 폰트
const disp = Russo_One({
  variable: "--font-disp", weight: "400", subsets: ["latin", "cyrillic"],
});
// 공개 사이트(Нүүр — C 시안) 전용 디스플레이 폰트 — .site-c 스코프에서만 사용
const oswald = Oswald({
  variable: "--font-oswald", weight: ["400", "500", "600", "700"], subsets: ["latin", "cyrillic"],
});
const body = Golos_Text({
  variable: "--font-body", weight: ["400", "500", "600", "700", "800"], subsets: ["latin", "cyrillic"],
});
const mono = JetBrains_Mono({
  variable: "--font-mono", weight: ["400", "600", "700"], subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "KK LLC",
  description: "Барилгын материал — захиалга · хүргэлт (Kokorozashi Kibou LLC)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="mn"
      className={`${disp.variable} ${body.variable} ${mono.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
