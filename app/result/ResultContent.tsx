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
  const [userVector, setUserVector] = useState<number[]>([]);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
      setUserVector(vector);

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
      <main className="flex flex-1 items-center justify-center">
        <div className="text-slate-400">加载中...</div>
      </main>
    );
  }

  const personality = result.personality;
  const color = personality.color;

  return (
    <main className="flex flex-1 flex-col px-4 py-8 max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <Link href="/test" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
          ← 返回测试
        </Link>
      </div>

      <div className="text-center mb-8">
        <p
          className="text-8xl sm:text-9xl font-black font-mono tracking-tight mb-2"
          style={{ color }}
        >
          {personality.id}
        </p>
        <p className="text-2xl sm:text-3xl font-semibold text-white mb-1">
          {personality.name}
        </p>
        <p className="text-slate-500">
          匹配度 {Math.round(result.similarity * 100)}%
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">15 维人格雷达图</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                tickLine={false}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 9 }} />
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

      <div className="bg-slate-900 rounded-2xl p-6 mb-8">
        <p className="font-serif text-lg leading-relaxed text-slate-300 whitespace-pre-line">
          {personality.description}
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">最像你的 MBTI 类型</h3>
        <div className="flex justify-center gap-4">
          {personality.mbti.map((mbti) => (
            <span
              key={mbti}
              className="px-6 py-3 rounded-xl bg-slate-800 text-xl font-mono font-bold text-white"
            >
              {mbti}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleShare}
          disabled={isGenerating}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50"
        >
          {isGenerating ? "生成中..." : "分享结果"}
        </button>
        <button
          onClick={handleRestart}
          className="w-full py-4 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-all"
        >
          重新测试
        </button>
      </div>

      <div className="hidden">
        <div
          ref={shareCardRef}
          className="w-[375px] h-[667px] bg-slate-950 p-8 flex flex-col"
          style={{ width: 375, height: 667 }}
        >
          <div className="text-center mb-6">
            <p className="text-sm text-slate-500 mb-2">SBTI 人格测试 · AI 重制版</p>
            <p className="text-6xl font-black font-mono" style={{ color }}>
              {personality.id}
            </p>
            <p className="text-2xl font-semibold text-white mt-2">{personality.name}</p>
            <p className="text-slate-500 mt-1">匹配度 {Math.round(result.similarity * 100)}%</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="60%" width={300} height={250}>
              <PolarGrid stroke="#334155" />
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
              {personality.description.slice(0, 100)}...
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
