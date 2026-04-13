import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 bg-gradient-warm pointer-events-none" />
      
      {/* 漂浮装饰圆圈 */}
      <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-coral/10 to-amber/10 animate-float" />
      <div className="fixed top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-mint/10 to-lavender/10 animate-float delay-200" />
      <div className="fixed bottom-40 left-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-amber/10 to-coral/10 animate-float delay-400" />
      <div className="fixed bottom-20 right-1/3 w-16 h-16 rounded-full bg-gradient-to-br from-lavender/10 to-mint/10 animate-float delay-300" />

      {/* 主要内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* 顶部标签 */}
        <div className="mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-coral/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-coral animate-pulse-soft" />
            <span className="text-sm font-medium text-coral">灵感来自 B站 @蛆肉儿串儿</span>
          </span>
        </div>

        {/* 大标题 */}
        <div className="text-center mb-6">
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight mb-4 animate-fade-in-up">
            <span className="text-gradient-coral-amber">SBTI</span>
          </h1>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary tracking-tight animate-fade-in-up delay-100">
            人格测试
          </h2>
        </div>

        {/* 副标题 */}
        <p className="text-lg sm:text-xl text-text-secondary mb-4 font-body animate-fade-in-up delay-200">
          AI 重制版
        </p>

        {/* 统计数据 */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in-up delay-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-border">
            <span className="text-2xl font-display font-bold text-coral">31</span>
            <span className="text-sm text-text-secondary">道题</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-border">
            <span className="text-2xl font-display font-bold text-mint">15</span>
            <span className="text-sm text-text-secondary">个维度</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-border">
            <span className="text-2xl font-display font-bold text-lavender">27</span>
            <span className="text-sm text-text-secondary">种人格</span>
          </div>
        </div>

        {/* 按钮组 */}
        <div className="flex flex-col gap-4 items-center animate-fade-in-up delay-400">
          <Link
            href="/test"
            className="btn-primary group text-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            开始测试
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="/types"
            className="btn-secondary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            浏览人格图鉴
          </Link>
        </div>

        {/* 底部提示 */}
        <div className="mt-16 text-center animate-fade-in delay-500">
          <p className="text-sm text-text-muted">
            纯前端应用 · 数据本地计算 · 无需登录
          </p>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </main>
  );
}
