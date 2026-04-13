import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
          SBTI 人格测试
        </h1>
        <p className="text-xl sm:text-2xl text-emerald-400 font-semibold mb-6">
          AI 重制版
        </p>
        <p className="text-slate-400 text-base mb-2">
          灵感来自 B站 @蛆肉儿串儿
        </p>
        <p className="text-slate-500 text-sm mb-12">
          31道题 · 15个维度 · 27种人格
        </p>
        
        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/test"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25"
          >
            开始测试
          </Link>
          <Link
            href="/types"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all"
          >
            浏览全部人格
          </Link>
        </div>
      </div>
    </main>
  );
}
