"use client";

import { Suspense } from "react";
import ResultContent from "./ResultContent";

function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-slate-400">加载中...</div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultContent />
    </Suspense>
  );
}
