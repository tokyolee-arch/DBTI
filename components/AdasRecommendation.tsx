"use client";

import type { Mode } from "@/types";

interface AdasRecommendationProps {
  mode: Mode;
}

/**
 * ADAS 추천 — PRD §5.5
 * - T(테크) 모드: HDA / ACC / OTA
 * - H(핸드) 모드: BSD / FCW·AEB / RCTA
 */
export default function AdasRecommendation({ mode }: AdasRecommendationProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
      <header className="mb-5 flex items-center gap-3">
        <span className="text-2xl">🚗</span>
        <div>
          <h2 className="font-accent text-xl text-slate-ink md:text-2xl">
            추천 ADAS · 운전 보조 기능
          </h2>
          <p className="mt-0.5 text-xs text-slate-mute">
            {mode.label} · {mode.prefix} 성향에 맞춘 보조 기능 우선순위
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {mode.adas.map((item, i) => (
          <article
            key={i}
            className="flex flex-col rounded-2xl border border-line bg-cream/40 p-4 transition hover:border-brand/30 hover:bg-cream md:p-5"
          >
            <div className="text-3xl">{item.icon}</div>
            <h3 className="mt-2 font-accent text-base text-brand-dark md:text-lg">
              {item.name}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-soft">
              {item.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
