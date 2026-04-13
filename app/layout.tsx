import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SBTI 人格测试 · AI 重制版",
  description: "全网爆火的趣味人格测试，31道题测出你的SBTI人格。灵感来自B站@蛆肉儿串儿，纯前端静态应用，数据本地计算。",
  openGraph: {
    title: "SBTI 人格测试 · AI 重制版",
    description: "全网爆火的趣味人格测试，31道题测出你的SBTI人格",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#1A1A2E] antialiased">
        {children}
        <footer className="py-6 text-center text-[#9CA3AF] text-sm bg-[#F7F5F0]">
          本测试为AI重制版，灵感来自B站@蛆肉儿串儿的SBTI测试。仅供娱乐，请勿当真。Powered by MonkeyCode × MiniMax-M2.7
        </footer>
      </body>
    </html>
  );
}
