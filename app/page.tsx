import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial" />
      
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-float stagger-2" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl animate-float stagger-3" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
            灵感来自 B站 @蛆肉儿串儿
          </span>
        </div>

        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6 animate-fade-in-up stagger-1">
          <span className="text-white">SBTI </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
            人格测试
          </span>
        </h1>

        <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-emerald-400 mb-4 animate-fade-in-up stagger-2 font-heading">
          AI 重制版
        </p>

        <div className="flex items-center justify-center gap-2 text-slate-400 mb-12 animate-fade-in-up stagger-3">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-slate-500" />
          <span className="text-sm sm:text-base">31道题 · 15个维度 · 27种人格</span>
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-slate-500" />
        </div>

        <div className="flex flex-col gap-5 items-center animate-fade-in-up stagger-4">
          <Link
            href="/test"
            className="btn-primary group inline-flex items-center gap-3 px-10 py-5 text-lg font-bold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/30 glow-gold"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            开始测试
            <svg className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="/types"
            className="group inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-full border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            浏览全部人格图鉴
          </Link>
        </div>

        <div className="mt-16 animate-fade-in-up stagger-5">
          <p className="text-xs text-slate-600">
            纯前端应用 · 数据本地计算 · 无需登录
          </p>
        </div>
      </div>
    </main>
  );
}
