import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/contexts/ModalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 에이전트 허브",
  description: "다양한 업무 지원 AI 에이전트를 통합한 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ModalProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}
