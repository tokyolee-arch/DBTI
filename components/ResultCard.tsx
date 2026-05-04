"use client";

import type { BaseAnimal, Mode } from "@/types";

interface ResultCardProps {
  code: string; // 5글자
  animal: BaseAnimal;
  mode: Mode;
}

/**
 * 결과 캐릭터 카드 — PRD §5.1, §5.2
 * - 코드 / 이모지 / 닉네임 / 태그 / 모드 prefix / 설명 / 강점·약점 / 코치
 */
export default function ResultCard({ code, animal, mode }: ResultCardProps) {
  const fullName = `${mode.prefix} ${animal.name}`;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card">
      {/* 상단: 코드 + 모드 뱃지 */}
      <div className="flex items-center justify-between bg-gradient-to-br from-cream to-coral/10 px-6 py-4">
        <div className="font-accent text-sm tracking-wider text-coral-dark">
          DBTI · {code}
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            mode.key === "T"
              ? "bg-brand/15 text-brand-dark"
              : "bg-coral/15 text-coral-dark"
          }`}
        >
          {mode.label}
        </div>
      </div>

      {/* 메인: 이모지 + 이름 */}
      <div className="flex flex-col items-center px-6 py-8 text-center md:py-10">
        <div className="text-7xl md:text-8xl">{animal.emoji}</div>
        <h1 className="mt-4 font-display text-4xl text-slate-ink md:text-5xl">
          {fullName}
        </h1>
        <p className="mt-2 font-accent text-base text-coral-dark md:text-lg">
          {animal.tag}
        </p>
        <p className="mt-1 text-xs text-slate-mute">
          {animal.animal} · 코드 {code}
        </p>
      </div>

      {/* 설명 */}
      <div className="space-y-4 border-t border-line px-6 py-6 md:px-8">
        <p className="text-base leading-relaxed text-slate-soft md:text-lg">
          {animal.desc}
        </p>
        <p className="rounded-2xl bg-cream px-4 py-3 text-sm leading-relaxed text-slate-ink md:text-base">
          <span className="mr-2 font-accent text-coral-dark">
            {mode.prefix} 모드 ·
          </span>
          {mode.descAdd}
        </p>
      </div>

      {/* 강점 / 약점 */}
      <div className="grid grid-cols-1 gap-4 border-t border-line px-6 py-6 md:grid-cols-2 md:px-8">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl">💪</span>
            <h3 className="font-accent text-base text-slate-ink">강점</h3>
          </div>
          <ul className="space-y-1.5">
            {animal.pros.map((p, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-slate-soft md:text-base"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h3 className="font-accent text-base text-slate-ink">유의점</h3>
          </div>
          <ul className="space-y-1.5">
            {animal.cons.map((c, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-slate-soft md:text-base"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 오늘의 코치 */}
      <div className="border-t border-line bg-gradient-to-br from-coral/5 to-cream px-6 py-5 md:px-8">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xl">🧭</span>
          <h3 className="font-accent text-base text-coral-dark">
            오늘의 운전 코치
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-ink md:text-base">
          {animal.coach}
        </p>
      </div>
    </div>
  );
}
