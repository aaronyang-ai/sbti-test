"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import questionsData from "../../data/questions.json";
import { Question, UserAnswers } from "../../lib/types";

const questions = questionsData.questions as unknown as Question[];
const TOTAL_QUESTIONS = 31;

export default function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const progress = searchParams.get("progress");
    if (progress) {
      try {
        const decoded = JSON.parse(atob(progress));
        if (decoded.q !== undefined) setCurrentQuestion(decoded.q);
        if (decoded.a) setAnswers(decoded.a);
      } catch {
        // ignore
      }
    }
  }, [searchParams]);

  const saveToLocalStorage = useCallback((q: number, a: UserAnswers) => {
    localStorage.setItem("sbti-answers", JSON.stringify({ q, a }));
  }, []);

  const getProgressParam = useCallback((q: number, a: UserAnswers) => {
    const encoded = btoa(JSON.stringify({ q, a }));
    return `?progress=${encoded}`;
  }, []);

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: optionIndex };
    setAnswers(newAnswers);
    saveToLocalStorage(currentQuestion, newAnswers);

    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestion < TOTAL_QUESTIONS - 1) {
        setCurrentQuestion(currentQuestion + 1);
        router.replace(`/test${getProgressParam(currentQuestion + 1, newAnswers)}`);
      } else {
        const encoded = btoa(JSON.stringify({ q: currentQuestion, a: newAnswers }));
        router.push(`/result?answers=${encoded}`);
      }
      setIsTransitioning(false);
    }, 200);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        router.replace(`/test${getProgressParam(currentQuestion - 1, answers)}`);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleNext = () => {
    if (answers[questions[currentQuestion].id] === undefined) return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestion < TOTAL_QUESTIONS - 1) {
        setCurrentQuestion(currentQuestion + 1);
        router.replace(`/test${getProgressParam(currentQuestion + 1, answers)}`);
      } else {
        const encoded = btoa(JSON.stringify({ q: currentQuestion, a: answers }));
        router.push(`/result?answers=${encoded}`);
      }
      setIsTransitioning(false);
    }, 200);
  };

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question.id];
  const progress = ((currentQuestion + (selectedAnswer !== undefined ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  return (
    <main className="flex flex-1 flex-col px-4 py-6 max-w-xl mx-auto w-full relative">
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500">进度</span>
            <span className="text-lg font-bold font-heading text-amber-400">
              {currentQuestion + 1}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-500">{TOTAL_QUESTIONS}</span>
          </div>
          
          <div className="w-10" />
        </div>
        
        <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg shadow-emerald-500/50" />
          </div>
        </div>
      </div>

      <div className={`relative z-10 flex-1 flex flex-col justify-center ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"} transition-all duration-200`}>
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800/50 card-hover">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">问题</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-8 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`group w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedAnswer === index
                    ? "border-emerald-500 bg-emerald-500/10 text-white scale-[1.01] shadow-lg shadow-emerald-500/10"
                    : "border-slate-700/80 bg-slate-800/30 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    selectedAnswer === index
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-700/50 text-slate-500 group-hover:bg-slate-700"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-base sm:text-lg">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedAnswer !== undefined && currentQuestion < TOTAL_QUESTIONS - 1 && (
          <div className="mt-6 flex justify-center animate-fade-in">
            <button
              onClick={handleNext}
              className="group flex items-center gap-2 px-6 py-3 text-amber-400 font-medium hover:text-amber-300 transition-all duration-200 cursor-pointer"
            >
              下一题
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-8 text-center">
        <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
          ← 返回首页
        </Link>
      </div>
    </main>
  );
}
