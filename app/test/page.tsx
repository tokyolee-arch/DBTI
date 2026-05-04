"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QUESTIONS } from "@/data/questions";
import { calculate, getCompletedCount, isComplete } from "@/lib/scoring";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";

const STORAGE_KEY = "dbti.answers";
const POSITIONS_KEY = "dbti.positions";
const SCORES_KEY = "dbti.scores";

export default function TestPage() {
  const router = useRouter();
  const total = QUESTIONS.length;

  // 답변 배열 초기화 (localStorage 복구 포함)
  const [answers, setAnswers] = useState<Array<number | null>>(() =>
    Array(total).fill(null)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // 마운트 후 localStorage 복구
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === total) {
          setAnswers(parsed);
          // 첫 미응답 문항 위치로 자동 이동
          const firstUnansweredIdx = parsed.findIndex(
            (a: unknown) => a === null || a === undefined
          );
          if (firstUnansweredIdx >= 0) {
            setCurrentIdx(firstUnansweredIdx);
          } else {
            setCurrentIdx(total - 1);
          }
        }
      }
    } catch (e) {
      // localStorage 사용 불가 환경 — 무시
    }
    setHydrated(true);
  }, [total]);

  // 답변 변경시 localStorage 동기화
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      /* noop */
    }
  }, [answers, hydrated]);

  const answeredCount = useMemo(() => getCompletedCount(answers), [answers]);
  const allDone = useMemo(() => isComplete(answers), [answers]);
  const currentQ = QUESTIONS[currentIdx];
  const currentAnswer = answers[currentIdx];

  function handleSelect(score: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = score;
      return next;
    });
    // 자동 진행 없음 — "다음" 버튼으로 직접 이동
  }

  function handlePrev() {
    setCurrentIdx((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    setCurrentIdx((i) => Math.min(total - 1, i + 1));
  }

  function handleSubmit() {
    if (!allDone) return;
    const result = calculate(answers);
    try {
      window.sessionStorage.setItem(
        POSITIONS_KEY,
        JSON.stringify(result.positions)
      );
      window.sessionStorage.setItem(
        SCORES_KEY,
        JSON.stringify(result.scores)
      );
      // 결과 후 진행상태 리셋 (재시도 시 처음부터)
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* noop */
    }
    router.push(`/result?code=${result.code}`);
  }

  function handleReset() {
    if (!confirm("진행 중인 답변을 모두 초기화할까요?")) return;
    setAnswers(Array(total).fill(null));
    setCurrentIdx(0);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* noop */
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <ProgressBar currentIdx={currentIdx} answeredCount={answeredCount} />

      {/* 상단 네비게이션 */}
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 pt-3 md:px-6">
        <Link
          href="/"
          className="text-xs text-slate-mute transition hover:text-coral"
        >
          ← 처음으로
        </Link>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-mute transition hover:text-coral"
        >
          초기화
        </button>
      </div>

      {/* 문항 카드 */}
      <QuestionCard
        question={currentQ}
        idx={currentIdx}
        total={total}
        selected={currentAnswer}
        onSelect={handleSelect}
      />

      {/* 하단 컨트롤 */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur-md md:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="rounded-full border border-line bg-white px-5 py-2.5 font-accent text-sm text-slate-soft transition hover:border-coral/40 hover:text-coral-dark disabled:opacity-40 disabled:hover:border-line disabled:hover:text-slate-soft md:px-6 md:text-base"
          >
            ← 이전
          </button>

          {currentIdx < total - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={currentAnswer === null}
              className="rounded-full bg-coral px-5 py-2.5 font-accent text-sm text-white shadow-coral transition hover:bg-coral-dark disabled:opacity-40 md:px-6 md:text-base"
            >
              다음 →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allDone}
              className="rounded-full bg-coral px-6 py-2.5 font-accent text-sm text-white shadow-coral transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-40 md:px-8 md:text-base"
            >
              결과 보기 ✨
            </button>
          )}
        </div>
        {!allDone && currentIdx === total - 1 && (
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-slate-mute">
            아직 답변하지 않은 문항이 있습니다 ({answeredCount}/{total})
          </p>
        )}
      </div>
    </div>
  );
}
