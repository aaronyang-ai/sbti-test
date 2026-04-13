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
        backgroundColor: "#FDFBF7",
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
      <main className="min-h-screen relative flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-warm" />
        <div className="relative z-10 text-center">
          <div className="flex items-center gap-3 text-text-secondary">
            <div className="w-3 h-3 rounded-full bg-coral animate-pulse-soft" />
            <span className="font-medium">正在分析你的性格...</span>
          </div>
        </div>
      </main>
    );
  }

  const personality = result.personality;
  const color = personality.color;

  return (
    <main className="min-h-screen relative pb-12">
      <div className="fixed inset-0 bg-gradient-warm" />
      
      {/* 装饰元素 */}
      <div className="fixed top-20 right-10 w-32 h-32 rounded-full opacity-30" 
        style={{ background: `radial-gradient(circle, ${color}20, transparent 70%)` }} 
      />
      <div className="fixed bottom-40 left-10 w-24 h-24 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, ${color}30, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-8">
        {/* 返回链接 */}
        <div className="text-center mb-6">
          <Link 
            href="/test" 
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-coral transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回测试
          </Link>
        </div>

        {/* 人格结果卡片 */}
        <div className={`text-center mb-8 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-block mb-6">
            <div 
              className="text-8xl sm:text-9xl md:text-[10rem] font-display font-bold tracking-tight"
              style={{ color }}
            >
              {personality.id}
            </div>
            <div 
              className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl -z-10"
              style={{ background: `linear-gradient(135deg, ${color}40, transparent)` }}
            />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-3">
            {personality.name}
          </h1>
          
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-border shadow-sm">
            <div className="w-2 h-2 rounded-full bg-mint animate-pulse-soft" />
            <span className="text-sm text-text-secondary">
              匹配度 <span className="font-display font-bold text-coral" style={{ color }}>{Math.round(result.similarity * 100)}%</span>
            </span>
          </div>
        </div>

        {/* 雷达图卡片 */}
        <div className={`card p-6 mb-6 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-5 h-5 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-lg font-display font-semibold text-text-primary">15 维人格雷达图</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#E8E5E0" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: "#6B7280", fontSize: 10 }}
                  tickLine={false}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 8 }} />
                <Radar
                  name="你的性格"
                  dataKey="value"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 人格描述卡片 */}
        <div className={`card p-6 mb-6 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full" style={{ backgroundColor: color }} />
            <h2 className="text-lg font-display font-semibold text-text-primary">人格解读</h2>
          </div>
          <p className="font-body text-text-secondary leading-relaxed whitespace-pre-line">
            {personality.description}
          </p>
        </div>

        {/* MBTI 匹配卡片 */}
        <div className={`card p-6 mb-8 transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-5 h-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-lg font-display font-semibold text-text-primary">最像你的 MBTI 类型</h2>
          </div>
          <div className="flex justify-center gap-4">
            {personality.mbti.map((mbti) => (
              <span
                key={mbti}
                className="px-6 py-3 rounded-2xl bg-gradient-to-br from-lavender/10 to-mint/10 border border-lavender/20 font-mono font-bold text-lg text-text-primary shadow-sm"
              >
                {mbti}
              </span>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={`flex flex-col gap-3 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="btn-primary text-lg"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            className="btn-secondary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新测试
          </button>
        </div>
      </div>

      {/* 隐藏的分享卡片 */}
      <div className="hidden">
        <div
          ref={shareCardRef}
          style={{ width: 375, height: 667, background: '#FDFBF7' }}
          className="p-8 flex flex-col"
        >
          <div className="text-center mb-6">
            <p className="text-sm text-text-muted mb-3">SBTI 人格测试 · AI 重制版</p>
            <p className="text-5xl font-display font-bold" style={{ color }}>
              {personality.id}
            </p>
            <p className="text-xl font-display font-bold text-text-primary mt-2">{personality.name}</p>
            <p className="text-text-secondary mt-1">匹配度 {Math.round(result.similarity * 100)}%</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="55%" width={320} height={280}>
              <PolarGrid stroke="#E8E5E0" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: "#6B7280", fontSize: 8 }} tickLine={false} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 8 }} />
              <Radar
                name="你的性格"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </div>

          <div className="text-center">
            <p className="text-sm text-text-secondary leading-relaxed">
              {personality.description.slice(0, 100)}...
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-xs text-text-muted">powered by MonkeyCode × MiniMax-M2.7</p>
          </div>
        </div>
      </div>
    </main>
  );
}
