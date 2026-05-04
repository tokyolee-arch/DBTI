"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { AxisCode, ModeKey, UserProfile } from "@/types";
import { ANIMALS } from "@/data/animals";
import { MODES } from "@/data/modes";
import { positionsFromCode } from "@/lib/scoring";
import { getInsuranceRecommendations } from "@/lib/recommendations";
import { loadProfileLocal, submitResponse } from "@/lib/supabase";
import ResultCard from "@/components/ResultCard";
import AxisChart from "@/components/AxisChart";
import InsuranceRecommendation from "@/components/InsuranceRecommendation";
import AdasRecommendation from "@/components/AdasRecommendation";

const POSITIONS_KEY = "dbti.positions";
const SCORES_KEY = "dbti.scores";
const VALID_CHARS = [
  ["Q", "M"],
  ["C", "F"],
  ["A", "D"],
  ["P", "S"],
  ["T", "H"],
];

function isValidCode(code: string | null): code is string {
  if (!code || code.length !== 5) return false;
  return code.split("").every((ch, i) => VALID_CHARS[i].includes(ch));
}

function ResultPageInner() {
  const params = useSearchParams();
  const code = params.get("code")?.toUpperCase() ?? null;

  const [positions, setPositions] = useState<Record<AxisCode, number> | null>(
    null
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [submitMode, setSubmitMode] = useState<"local" | "supabase" | null>(
    null
  );
  const [hydrated, setHydrated] = useState(false);

  // 정확한 positions를 sessionStorage에서 우선 시도, 없으면 코드 기반 fallback
  useEffect(() => {
    if (!isValidCode(code)) {
      setHydrated(true);
      return;
    }
    let pos: Record<AxisCode, number> | null = null;
    try {
      const saved = window.sessionStorage.getItem(POSITIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed === "object" &&
          ["QM", "CF", "AD", "PS", "TH"].every(
            (k) => typeof parsed[k] === "number"
          )
        ) {
          pos = parsed;
        }
      }
    } catch (e) {
      /* noop */
    }
    if (!pos) {
      pos = positionsFromCode(code);
    }
    setPositions(pos);

    // scores 복원 (있으면 사용, 없으면 0으로 채움)
    let scores: Record<AxisCode, number> = {
      QM: 0,
      CF: 0,
      AD: 0,
      PS: 0,
      TH: 0,
    };
    try {
      const savedScores = window.sessionStorage.getItem(SCORES_KEY);
      if (savedScores) {
        const parsed = JSON.parse(savedScores);
        if (
          parsed &&
          typeof parsed === "object" &&
          ["QM", "CF", "AD", "PS", "TH"].every(
            (k) => typeof parsed[k] === "number"
          )
        ) {
          scores = parsed;
        }
      }
    } catch (e) {
      /* noop */
    }

    // 프로필 로드 및 응답 적재
    const loadedProfile = loadProfileLocal();
    setProfile(loadedProfile);
    if (loadedProfile && code) {
      submitResponse({
        profile: loadedProfile,
        result: {
          code,
          baseCode: code.slice(0, 4),
          modeKey: code[4] as ModeKey,
          positions: pos,
          scores,
        },
      })
        .then((r) => setSubmitMode(r.mode))
        .catch(() => setSubmitMode("local"));
    }

    setHydrated(true);
  }, [code]);

  const animal = useMemo(() => {
    if (!isValidCode(code)) return null;
    const baseCode = code.slice(0, 4);
    return ANIMALS[baseCode] ?? null;
  }, [code]);

  const mode = useMemo(() => {
    if (!isValidCode(code)) return null;
    return MODES[code[4] as ModeKey];
  }, [code]);

  const insuranceCards = useMemo(() => {
    if (!isValidCode(code)) return [];
    return getInsuranceRecommendations(code);
  }, [code]);

  // 잘못된 코드 처리
  if (hydrated && (!isValidCode(code) || !animal || !mode)) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl">🤔</div>
        <h1 className="mt-4 font-display text-3xl text-slate-ink">
          결과를 찾을 수 없어요
        </h1>
        <p className="mt-2 text-sm text-slate-soft">
          유효하지 않은 코드입니다. 테스트를 처음부터 진행해 주세요.
        </p>
        <Link
          href="/test"
          className="mt-6 rounded-full bg-coral px-6 py-3 font-accent text-white shadow-coral transition hover:bg-coral-dark"
        >
          테스트 시작하기
        </Link>
      </section>
    );
  }

  if (!hydrated || !positions || !animal || !mode || !code) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="font-accent text-slate-mute">결과 분석 중…</div>
      </div>
    );
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/result?code=${code}`
      : "";

  function handleShare() {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator
        .share({
          title: `DBTI · ${mode!.prefix} ${animal!.name}`,
          text: `나의 운전 성향은 "${mode!.prefix} ${animal!.name}" (${code}) — DBTI Lab에서 확인해 보세요!`,
          url: shareUrl,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("결과 링크가 복사되었습니다.");
      });
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-10">
      {/* 상단 네비 */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs text-slate-mute transition hover:text-coral"
        >
          ← 처음으로
        </Link>
        <Link
          href="/test"
          className="text-xs text-slate-mute transition hover:text-coral"
        >
          다시 검사하기 ↻
        </Link>
      </div>

      {/* 닉네임 인사 */}
      {profile && (
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-coral/15 to-cream px-5 py-4 md:px-6">
          <p className="font-accent text-base text-slate-ink md:text-lg">
            <span className="text-coral-dark">{profile.nickname}</span>님,
            테스트가 완료됐어요! 🎉
          </p>
          {profile.predictedCode && (
            <p className="mt-1 text-sm text-slate-soft">
              {profile.predictedCode === code.slice(0, 4) ? (
                <>
                  <strong className="text-coral-dark">
                    예상 적중!
                  </strong>{" "}
                  예상하신 {ANIMALS[profile.predictedCode].emoji}{" "}
                  {ANIMALS[profile.predictedCode].name}이 결과로 나왔어요.
                </>
              ) : (
                <>
                  예상은 {ANIMALS[profile.predictedCode].emoji}{" "}
                  {ANIMALS[profile.predictedCode].name}({profile.predictedCode})
                  였지만, 결과는 다른 캐릭터예요!
                </>
              )}
            </p>
          )}
          {submitMode === "local" && (
            <p className="mt-1 text-[10px] text-slate-mute">
              · 결과가 로컬에 저장되었습니다 (Supabase 키 미설정)
            </p>
          )}
          {submitMode === "supabase" && (
            <p className="mt-1 text-[10px] text-slate-mute">
              · 결과가 안전하게 저장되었습니다
            </p>
          )}
        </div>
      )}

      {/* 결과 캐릭터 카드 */}
      <ResultCard code={code} animal={animal} mode={mode} />

      {/* 5축 차트 */}
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-card md:p-8">
        <header className="mb-5 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h2 className="font-accent text-xl text-slate-ink md:text-2xl">
              나의 5축 운전 성향
            </h2>
            <p className="mt-0.5 text-xs text-slate-mute">
              마커 위치가 본인 성향의 강도를 나타냅니다
            </p>
          </div>
        </header>
        <AxisChart positions={positions} code={code} />
      </section>

      {/* ADAS 추천 */}
      <div className="mt-6">
        <AdasRecommendation mode={mode} />
      </div>

      {/* 보험 추천 */}
      {insuranceCards.length > 0 && (
        <div className="mt-6">
          <InsuranceRecommendation cards={insuranceCards} />
        </div>
      )}

      {/* 공유 / 액션 */}
      <section className="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br from-coral/10 to-cream p-6 text-center md:p-8">
        <h3 className="font-accent text-lg text-slate-ink md:text-xl">
          친구의 운전 성향도 궁금하다면?
        </h3>
        <p className="text-xs text-slate-mute md:text-sm">
          링크를 공유하고 함께 결과를 비교해 보세요.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-coral px-5 py-2.5 font-accent text-sm text-white shadow-coral transition hover:bg-coral-dark md:text-base"
          >
            결과 공유하기
          </button>
          <Link
            href="/test"
            className="rounded-full border border-coral/40 bg-white px-5 py-2.5 font-accent text-sm text-coral-dark transition hover:bg-coral/10 md:text-base"
          >
            다시 검사하기
          </Link>
        </div>
      </section>

      {/* 면책 */}
      <p className="mt-8 rounded-xl bg-line/30 px-4 py-3 text-center text-xs leading-relaxed text-slate-mute">
        ※ 본 테스트는 재미용입니다. 의학적·법적 진단이 아니며, 실제 보험 가입·
        차량 구매 결정의 단독 근거로 사용되지 않습니다.
      </p>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="font-accent text-slate-mute">결과 분석 중…</div>
        </div>
      }
    >
      <ResultPageInner />
    </Suspense>
  );
}
