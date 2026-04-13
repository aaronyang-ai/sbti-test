"use client";

import { Suspense } from "react";
import TestContent from "./TestContent";

function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="text-slate-400">加载中...</div>
    </main>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TestContent />
    </Suspense>
  );
}
