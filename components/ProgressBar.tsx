"use client";

import { QUESTIONS } from "@/data/questions";

interface ProgressBarProps {
  currentIdx: number; // 0-based 현재 문항 인덱스
  answeredCount: number; // 응답 완료 개수
}

export default function ProgressBar({
  currentIdx,
  answeredCount,
}: ProgressBarProps) {
  const total = QUESTIONS.length;
  const pct = Math.round((answeredCount / total) * 100);

  return (
    <div className="sticky top-0 z-10 bg-cream/90 px-4 py-3 backdrop-blur-md md:px-6">
      <div className="mx-auto flex max-w-2xl items-center gap-4">
        <div className="font-accent text-sm text-slate-soft">
          <span className="text-coral text-lg">{currentIdx + 1}</span>
          <span className="mx-1 text-slate-mute">/</span>
          <span>{total}</span>
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/60">
          <div
            className="h-full rounded-full bg-coral transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="font-accent text-sm text-slate-soft">{pct}%</div>
      </div>
    </div>
  );
}
