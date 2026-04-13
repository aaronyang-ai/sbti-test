"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { toPng } from "html-to-image";
import questionsData from "../../data/questions.json";
import personalitiesData from "../../data/personalities.json";
import dimensionsData from "../../data/dimensions.json";
import { Question, Personality, Dimension, UserAnswers } from "../../lib/types";
import { calculateDimensionScores, mapToLevels, matchPersonality, getDimensionIds } from "../../lib/algorithm";

const questions = questionsData.questions as unknown as Question[];
const personalities = personalitiesData.personalities as unknown as Personality[];
const dimensions = dimensionsData.dimensions as unknown as Dimension[];

export default function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<{ personality: Personality; similarity: number } | null>(null);
  const [radarData, setRadarData] = useState<{ dimension: string; value: number; fullMark: number }[]>([]);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const answersParam = searchParams.get("answers");
    if (!answersParam) {
      router.replace("/test");
      return;
    }

    try {
      const decoded = JSON.parse(atob(answersParam)) as { a: UserAnswers };
      const answers = decoded.a;

      const scores = calculateDimensionScores(answers, questions);
      const levels = mapToLevels(scores);
      const dimensionIds = getDimensionIds();

      const vector = dimensionIds.map(dim => levels[dim]);

      const lastAnswer = answers[31];
      const hiddenTriggered = lastAnswer === 3 || lastAnswer === 4;

      const matchResult = matchPersonality(vector, personalities, hiddenTriggered);
      setResult(matchResult);

      const radarDataResult = dimensionIds.map((dimId, index) => {
        const dim = dimensions.find(d => d.id === dimId);
        return {
          dimension: dim?.name || dimId,
          value: (2 - vector[index]) * 50,
          fullMark: 100,
        };
      });
      setRadarData(radarDataResult);
      
      setTimeout(() => setShowContent(true), 100);
    } catch {
      router.replace("/test");
    }
  }, [searchParams, router]);

  const handleShare = async () => {
    if (!shareCardRef.current || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        width: 375,
        height: 667,
        pixelRatio: 2,
        backgroundColor: "#020617",
      });
      
      const link = document.createElement("a");
      link.download = `SBTI-${result?.personality.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    localStorage.removeItem("sbti-answers");
    router.push("/test");
  };

  if (!result) {
    return (
      <main className="flex flex-1 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="relative z-10 text-center">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <span>正在分析你的性格...</span>
          </div>
        </div>
      </main>
    );
  }

  const personality = result.personality;
  const color = personality.color;

  return (
    <main className="flex flex-1 flex-col px-4 py-8 max-w-2xl mx-auto w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <Link href="/test" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回测试
          </Link>
        </div>

        <div className={`text-center mb-8 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-block mb-4">
            <div 
              className="text-7xl sm:text-8xl md:text-9xl font-black font-heading tracking-tight"
              style={{ color }}
            >
              {personality.id}
            </div>
            <div 
              className="absolute -inset-4 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 blur-xl"
              style={{ color }}
            />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {personality.name}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-slate-400">
              匹配度 <span className="text-amber-400 font-semibold">{Math.round(result.similarity * 100)}%</span>
            </span>
          </div>
        </div>

        <div className={`bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-slate-800/50 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">15 维人格雷达图</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: "#94a3b8", fontSize: 9 }}
                  tickLine={false}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 8 }} />
                <Radar
                  name="你的性格"
                  dataKey="value"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-slate-800/50 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">人格解读</h3>
          </div>
          <p className="font-serif text-base sm:text-lg leading-relaxed text-slate-300 whitespace-pre-line">
            {personality.description}
          </p>
        </div>

        <div className={`bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-slate-800/50 transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">最像你的 MBTI 类型</h3>
          </div>
          <div className="flex justify-center gap-4">
            {personality.mbti.map((mbti) => (
              <span
                key={mbti}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 text-xl font-bold font-mono text-white shadow-lg"
              >
                {mbti}
              </span>
            ))}
          </div>
        </div>

        <div className={`flex flex-col gap-3 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="btn-primary group flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/30 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                生成分享卡片
              </>
            )}
          </button>
          
          <button
            onClick={handleRestart}
            className="group flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-slate-700 text-slate-400 font-medium hover:text-white hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新测试
          </button>
        </div>
      </div>

      <div className="hidden">
        <div
          ref={shareCardRef}
          className="w-[375px] h-[667px] bg-gradient-to-br from-slate-900 to-slate-950 p-8 flex flex-col"
        >
          <div className="text-center mb-6">
            <p className="text-sm text-slate-500 mb-3">SBTI 人格测试 · AI 重制版</p>
            <p className="text-5xl font-black font-heading" style={{ color }}>
              {personality.id}
            </p>
            <p className="text-xl font-bold text-white mt-2">{personality.name}</p>
            <p className="text-slate-500 mt-1">匹配度 {Math.round(result.similarity * 100)}%</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="55%" width={320} height={280}>
              <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: "#94a3b8", fontSize: 8 }} tickLine={false} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 8 }} />
              <Radar
                name="你的性格"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-400 font-serif leading-relaxed">
              {personality.description.slice(0, 120)}...
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-600">powered by MonkeyCode × MiniMax-M2.7</p>
          </div>
        </div>
      </div>
    </main>
  );
}
