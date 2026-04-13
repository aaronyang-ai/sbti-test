"use client";

import { useState } from "react";
import Link from "next/link";
import personalitiesData from "../../data/personalities.json";
import { Personality } from "../../lib/types";

const personalities = personalitiesData.personalities as unknown as Personality[];

export default function TypesPage() {
  const [selected, setSelected] = useState<Personality | null>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const standardAndFallback = personalities.filter(p => p.type !== "hidden");
  const hidden = personalities.find(p => p.type === "hidden");

  const handleClose = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelected(null);
      setIsModalClosing(false);
    }, 200);
  };

  return (
    <main className="min-h-screen relative pb-12">
      <div className="fixed inset-0 bg-gradient-warm" />
      
      {/* 装饰 */}
      <div className="fixed top-20 left-10 w-40 h-40 rounded-full bg-coral/5 animate-float" />
      <div className="fixed top-40 right-20 w-24 h-24 rounded-full bg-mint/5 animate-float delay-200" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8">
        {/* 标题 */}
        <div className={`text-center mb-10 transition-all duration-700 ${selected ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-3">
            <span className="text-gradient-coral-amber">人格图鉴</span>
          </h1>
          <p className="text-text-secondary">
            点击卡片查看详情 · {standardAndFallback.length}种人格等你探索
          </p>
        </div>

        {/* 人格网格 */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8">
          {standardAndFallback.map((p, index) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="group relative flex flex-col items-center p-4 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md hover:border-transparent transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <span 
                className="font-display font-bold text-xl mb-1 transition-transform duration-300 group-hover:scale-110"
                style={{ color: p.color }}
              >
                {p.id}
              </span>
              <span className="text-xs text-text-muted group-hover:text-text-secondary transition-colors">
                {p.name}
              </span>
              {p.type === "fallback" && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-coral to-amber flex items-center justify-center shadow-sm">
                  <span className="text-[10px] text-white font-bold">!</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 隐藏人格提示 */}
        {hidden && (
          <div className="text-center animate-fade-in" style={{ animationDelay: "500ms" }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-lavender/20 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-lavender animate-pulse-soft" />
              <p className="text-sm text-text-secondary">
                <span className="font-display font-bold" style={{ color: hidden.color }}>{hidden.id}</span>
                <span className="mx-2">·</span>
                <span>{hidden.name}</span>
                <span className="mx-2">·</span>
                <span className="text-text-muted">完成测试解锁隐藏人格</span>
              </p>
            </div>
          </div>
        )}

        {/* 返回链接 */}
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-text-secondary hover:text-coral transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>

      {/* 详情弹窗 */}
      {selected && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isModalClosing ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: 'rgba(26, 26, 46, 0.4)', backdropFilter: 'blur(8px)' }}
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl transition-transform duration-300"
            style={{ transform: isModalClosing ? 'scale(0.95)' : 'scale(1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <p
                  className="text-5xl sm:text-6xl font-display font-bold tracking-tight"
                  style={{ color: selected.color }}
                >
                  {selected.id}
                </p>
                <div 
                  className="absolute -inset-4 rounded-2xl opacity-20 blur-xl -z-10"
                  style={{ background: `linear-gradient(135deg, ${selected.color}40, transparent)` }}
                />
              </div>
              <h2 className="text-2xl font-display font-bold text-text-primary mb-3">{selected.name}</h2>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-secondary border border-border text-sm text-text-secondary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  MBTI: {selected.mbti.join(" / ")}
                </span>
                {selected.type === "fallback" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral/10 border border-coral/20 text-sm text-coral">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    兜底型人格
                  </span>
                )}
              </div>
            </div>

            {/* 描述 */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-1 rounded-full" style={{ backgroundColor: selected.color }} />
                <h3 className="text-sm font-display font-semibold text-text-muted uppercase tracking-wider">人格解读</h3>
              </div>
              <p className="font-body text-text-secondary leading-relaxed whitespace-pre-line">
                {selected.description}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
              <button
                onClick={handleClose}
                className="btn-ghost"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                关闭
              </button>
              <Link
                href="/test"
                className="btn-primary"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                开始测试
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
