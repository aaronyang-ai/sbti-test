"use client";

import { useState } from "react";
import Link from "next/link";
import personalitiesData from "../../data/personalities.json";
import { Personality } from "../../lib/types";

const personalities = personalitiesData.personalities as unknown as Personality[];

export default function TypesPage() {
  const [selected, setSelected] = useState<Personality | null>(null);

  const standardAndFallback = personalities.filter(p => p.type !== "hidden");
  const hidden = personalities.find(p => p.type === "hidden");

  return (
    <main className="flex flex-1 flex-col px-4 py-8 max-w-4xl mx-auto w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">人格图鉴</h1>
        <p className="text-slate-400">27种人格，点击卡片查看详情</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8">
        {standardAndFallback.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="flex flex-col items-center p-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 border-2 hover:border-slate-600"
            style={{ borderColor: selected?.id === p.id ? p.color : "transparent" }}
          >
            <span className="font-mono font-bold text-lg" style={{ color: p.color }}>
              {p.id}
            </span>
            <span className="text-xs text-slate-400 mt-1">{p.name}</span>
          </button>
        ))}
      </div>

      {hidden && (
        <div className="text-center">
          <p className="text-slate-600 text-sm">
            还有 <span className="font-mono" style={{ color: hidden.color }}>{hidden.id}</span> {hidden.name} 隐藏人格，完成测试才能解锁
          </p>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <p
                className="text-5xl sm:text-6xl font-black font-mono tracking-tight"
                style={{ color: selected.color }}
              >
                {selected.id}
              </p>
              <p className="text-xl font-semibold text-white mt-2">{selected.name}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">
                  MBTI: {selected.mbti.join(" / ")}
                </span>
                {selected.type === "fallback" && (
                  <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">
                    兜底型
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="font-serif text-slate-300 whitespace-pre-line leading-relaxed">
                {selected.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                关闭
              </button>
              <Link
                href="/test"
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
              >
                我要测试
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto pt-8 text-center">
        <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
          ← 返回首页
        </Link>
      </div>
    </main>
  );
}
