"use client";

import type { InsuranceCard } from "@/lib/recommendations";

interface InsuranceRecommendationProps {
  cards: InsuranceCard[];
}

/**
 * 보험 추천 카드 — PRD §5.4
 * - 광고법 안전 영역: 카테고리·특약 유형만 안내
 * - 상품명·보험사명 직접 언급 없음
 */
export default function InsuranceRecommendation({
  cards,
}: InsuranceRecommendationProps) {
  if (cards.length === 0) return null;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
      <header className="mb-5 flex items-center gap-3">
        <span className="text-2xl">🛡️</span>
        <div>
          <h2 className="font-accent text-xl text-slate-ink md:text-2xl">
            나에게 맞는 보험 카테고리
          </h2>
          <p className="mt-0.5 text-xs text-slate-mute">
            성향 코드 기반 추천 · 카테고리 안내 (특정 상품 아님)
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {cards.map((c, i) => (
          <article
            key={i}
            className="rounded-2xl border border-line bg-cream/40 p-4 transition hover:border-coral/30 hover:bg-cream md:p-5"
          >
            <h3 className="font-accent text-base text-coral-dark md:text-lg">
              {c.category}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-soft md:text-base">
              {c.description}
            </p>
            <p className="mt-3 border-t border-line/70 pt-2 text-xs leading-relaxed text-slate-mute">
              💡 {c.reason}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-5 rounded-xl bg-line/30 px-4 py-3 text-xs leading-relaxed text-slate-mute">
        ※ 위 안내는 본인 성향에 따른 보험 카테고리 예시이며, 특정 상품·보험사
        추천이 아닙니다. 실제 가입 전 약관 비교가 필요합니다.
      </p>
    </section>
  );
}
