import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "이상형 이미지 생성기 | AI로 나만의 이상형 만들기",
  description: "AI 기술로 당신의 이상형을 그려드립니다. 성별, 나이, 체형, 스타일, 성격, 얼굴형을 선택하면 Stable Diffusion AI가 맞춤형 이미지를 생성합니다. 무료로 이상형 이미지를 만들어보세요!",
  keywords: ["이상형", "AI 이미지 생성", "이상형 월드컵", "AI 그림", "얼굴 생성", "Stable Diffusion", "인물 생성", "테토", "에겐"],
  authors: [{ name: "Ideal Type Generator" }],
  openGraph: {
    title: "이상형 이미지 생성기 | AI로 나만의 이상형 만들기",
    description: "AI 기술로 당신의 이상형을 그려드립니다. 성별, 체형, 스타일, 성격을 선택하고 무료로 이미지를 생성해보세요!",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "이상형 이미지 생성기",
    description: "AI로 나만의 이상형 이미지 만들기",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
