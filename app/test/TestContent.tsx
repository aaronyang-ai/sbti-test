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
    }, 250);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        router.replace(`/test${getProgressParam(currentQuestion - 1, answers)}`);
        setIsTransitioning(false);
      }, 250);
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
    }, 250);
  };

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question.id];
  const progress = ((currentQuestion + (selectedAnswer !== undefined ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  return (
    <main className="min-h-screen relative">
      {/* 背景 */}
      <div className="fixed inset-0 bg-gradient-warm pointer-events-none" />
      
      {/* 顶部进度区域 */}
      <div className="relative z-10 px-4 pt-8 pb-6">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm border border-border hover:border-coral hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-5 h-5 text-text-secondary group-hover:text-coral transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">问题</span>
            <span className="px-3 py-1 rounded-full bg-coral/10 text-coral font-display font-bold">
              {currentQuestion + 1}
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-text-muted">{TOTAL_QUESTIONS}</span>
          </div>
          
          <Link 
            href="/"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm border border-border hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </div>

        {/* 进度条 */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 问题卡片区域 */}
      <div className={`relative z-10 px-4 pb-8 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-xl mx-auto">
          <div className="card p-6 sm:p-8">
            {/* 问题标题 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral/20 to-amber/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-text-muted">选择最符合你的答案</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-text-primary leading-relaxed mb-8">
              {question.question}
            </h2>

            {/* 选项列表 */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`option-btn group relative ${
                    selectedAnswer === index ? 'selected' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex items-center justify-center w-10 h-10 rounded-xl font-display font-bold text-sm transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'bg-gradient-to-br from-coral to-amber text-white shadow-md'
                        : 'bg-bg-secondary text-text-muted group-hover:bg-coral/10 group-hover:text-coral'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-base sm:text-lg flex-1 text-left">{option.text}</span>
                    {selectedAnswer === index && (
                      <svg className="w-6 h-6 text-coral animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 下一题按钮 */}
          {selectedAnswer !== undefined && currentQuestion < TOTAL_QUESTIONS - 1 && (
            <div className="mt-6 flex justify-center animate-fade-in">
              <button
                onClick={handleNext}
                className="btn-ghost group"
              >
                下一题
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </main>
  );
}
