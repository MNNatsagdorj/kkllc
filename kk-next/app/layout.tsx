import type { Metadata } from "next";
import { Russo_One, Golos_Text, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 07-design-system.md — 전부 키릴 지원 폰트
const disp = Russo_One({
  variable: "--font-disp", weight: "400", subsets: ["latin", "cyrillic"],
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
      className={`${disp.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
