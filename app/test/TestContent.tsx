"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    }, 150);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        router.replace(`/test${getProgressParam(currentQuestion - 1, answers)}`);
        setIsTransitioning(false);
      }, 150);
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
    }, 150);
  };

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question.id];
  const progress = ((currentQuestion + (selectedAnswer !== undefined ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  return (
    <main className="flex flex-1 flex-col px-4 py-6 max-w-xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-slate-400 text-sm font-medium">
            {currentQuestion + 1} / {TOTAL_QUESTIONS}
          </span>
          <div className="w-6" />
        </div>
        
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-slate-600 to-emerald-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={`flex-1 flex flex-col justify-center ${isTransitioning ? "opacity-0" : "opacity-100"} transition-opacity duration-150`}>
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-8 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? "border-emerald-500 bg-emerald-500/10 text-white scale-[1.02]"
                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                }`}
              >
                <span className="text-lg">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedAnswer !== undefined && currentQuestion < TOTAL_QUESTIONS - 1 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleNext}
              className="px-6 py-3 text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
            >
              下一题
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
