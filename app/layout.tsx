import type { Metadata } from "next";
import {
  Black_Han_Sans,
  Gowun_Dodum,
  Do_Hyeon,
  Gowun_Batang,
} from "next/font/google";
import "./globals.css";

const gowunDodum = Gowun_Dodum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-gowun-dodum",
  display: "swap",
});

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-black-han-sans",
  display: "swap",
});

const doHyeon = Do_Hyeon({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-do-hyeon",
  display: "swap",
});

const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-gowun-batang",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DBTI Lab — 나는 어떤 운전자일까?",
  description:
    "35문항으로 알아보는 운전 성향 테스트. 5축 분석 + 32 동물 캐릭터 + 보험·ADAS 추천.",
  keywords: [
    "DBTI",
    "운전 성향",
    "운전 테스트",
    "MBTI",
    "ADAS",
    "자동차보험",
  ],
  openGraph: {
    title: "DBTI Lab — 나는 어떤 운전자일까?",
    description: "35문항으로 알아보는 나의 운전 성향, 32 동물 중 한 마리로!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${gowunDodum.variable} ${blackHanSans.variable} ${doHyeon.variable} ${gowunBatang.variable}`}
    >
      <body className="min-h-screen bg-cream text-slate-ink antialiased">
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-line bg-cream py-6 text-center">
          <p className="text-xs text-slate-mute">
            © DBTI Lab · 재미용 테스트 · 의학적·법적 진단이 아닙니다
          </p>
        </footer>
      </body>
    </html>
  );
}
