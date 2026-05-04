"use client";

import type { Question } from "@/types";
import { getAxisLabel } from "@/data/axes";
import FollowDistancePreview from "@/components/FollowDistancePreview";

interface QuestionCardProps {
  question: Question;
  idx: number; // 0-based
  total: number;
  selected: number | null; // 선택된 score
  onSelect: (score: number) => void;
}

/**
 * 질문 카드 — PRD §3.4
 * - 카테고리 / 미디어 placeholder / 본문 / 보조 설명 / 4지선다
 */
export default function QuestionCard({
  question,
  idx,
  total,
  selected,
  onSelect,
}: QuestionCardProps) {
  const axis = getAxisLabel(question.axis);
  const axisColor = "bg-brand/10 text-brand-dark";

  return (
    <article className="mx-auto w-full max-w-2xl animate-fade-in px-4 py-6 md:px-6 md:py-10">
      {/* 헤더: 축 / 카테고리 */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${axisColor}`}
        >
          {axis ? `${axis.leftKor} ⇄ ${axis.rightKor}` : question.axis}
        </span>
        <span className="rounded-full bg-line/50 px-3 py-1 text-xs text-slate-soft">
          {question.category}
        </span>
        <span className="ml-auto font-accent text-xs text-slate-mute">
          Q{idx + 1} / {total}
        </span>
      </div>

      {/* 인터랙티브 미디어 (옵션 선택과 그림이 연동) */}
      {question.interactive && (
        <FollowDistancePreview
          selected={selected}
          kind={question.interactive}
        />
      )}

      {/* 정적 미디어 placeholder (interactive가 우선) */}
      {!question.interactive && question.media === "photo" && (
        <div className="mb-6 flex h-40 items-center justify-center rounded-2xl border border-dashed border-line bg-white/50 text-slate-mute md:h-56">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">📷</span>
            <span className="text-xs">상황 사진 (예시 이미지)</span>
          </div>
        </div>
      )}
      {!question.interactive && question.media === "sim" && (
        <div className="mb-6 flex h-40 items-center justify-center rounded-2xl border border-dashed border-line bg-white/50 text-slate-mute md:h-56">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">🎬</span>
            <span className="text-xs">시뮬레이션 영상 (예시)</span>
          </div>
        </div>
      )}

      {/* 본문 */}
      <h2 className="font-accent text-2xl leading-snug text-slate-ink md:text-3xl">
        {question.text}
      </h2>
      {question.help && (
        <p className="mt-3 text-sm leading-relaxed text-slate-soft md:text-base">
          {question.help}
        </p>
      )}

      {/* 옵션 */}
      <div className="mt-7 flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isActive = selected === opt.score;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(opt.score)}
              className={`group flex items-start gap-3 rounded-2xl border-2 px-4 py-4 text-left transition active:scale-[0.99] md:px-5 md:py-5 ${
                isActive
                  ? "border-coral bg-coral/5 shadow-coral"
                  : "border-line bg-white hover:border-coral/40 hover:bg-coral/5"
              }`}
            >
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-accent text-sm transition ${
                  isActive
                    ? "bg-coral text-white"
                    : "bg-line/60 text-slate-soft group-hover:bg-coral/20 group-hover:text-coral-dark"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`flex-1 text-base leading-relaxed md:text-lg ${
                  isActive ? "text-slate-ink" : "text-slate-soft"
                }`}
              >
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
