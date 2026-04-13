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
    <main className="flex flex-1 flex-col px-4 py-8 max-w-4xl mx-auto w-full relative">
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />
      
      <div className="relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              人格图鉴
            </span>
          </h1>
          <p className="text-slate-400 text-base">
            点击卡片查看详情 · 27种人格等你探索
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8">
          {standardAndFallback.map((p, index) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="group relative flex flex-col items-center p-4 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <span 
                className="font-mono font-bold text-xl mb-1 transition-all duration-300 group-hover:scale-110"
                style={{ color: p.color }}
              >
                {p.id}
              </span>
              <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                {p.name}
              </span>
              {p.type === "fallback" && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500/80 flex items-center justify-center">
                  <span className="text-[8px] text-slate-950 font-bold">!</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {hidden && (
          <div className="text-center animate-fade-in" style={{ animationDelay: "500ms" }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900/60 backdrop-blur-sm border border-slate-800/50">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <p className="text-sm text-slate-500">
                <span className="font-mono font-bold" style={{ color: hidden.color }}>{hidden.id}</span>
                <span className="mx-2">·</span>
                <span>{hidden.name}</span>
                <span className="mx-2">·</span>
                <span className="text-slate-600">完成测试解锁隐藏人格</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300 ${isModalClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={handleClose}
        >
          <div
            className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-slate-800/50 shadow-2xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: isModalClosing ? 'scale(0.95)' : 'scale(1)' }}
          >
            <div className="text-center mb-6">
              <div className="relative inline-block mb-3">
                <p
                  className="text-5xl sm:text-6xl font-black font-heading tracking-tight"
                  style={{ color: selected.color }}
                >
                  {selected.id}
                </p>
                <div 
                  className="absolute -inset-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 blur-xl -z-10"
                  style={{ color: selected.color }}
                />
              </div>
              <p className="text-2xl font-bold text-white mb-2">{selected.name}</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-sm text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  MBTI: {selected.mbti.join(" / ")}
                </span>
                {selected.type === "fallback" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-sm text-amber-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    兜底型人格
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: selected.color }} />
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">人格解读</h3>
              </div>
              <p className="font-serif text-base sm:text-lg leading-relaxed text-slate-300 whitespace-pre-line">
                {selected.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/50">
              <button
                onClick={handleClose}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                关闭
              </button>
              <Link
                href="/test"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 cursor-pointer"
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

      <div className="relative z-10 mt-auto pt-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>
      </div>
    </main>
  );
}
