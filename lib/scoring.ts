import type { AxisCode, ModeKey, Result } from "@/types";
import { AXES } from "@/types";
import { QUESTIONS } from "@/data/questions";

/**
 * 점수 산출 — PRD §4
 *
 * 알고리즘:
 *   - 각 축별 sums/counts 누적
 *   - sum <= 0 → 첫 글자 (Q,C,A,P,T)
 *   - sum > 0  → 둘째 글자 (M,F,D,S,H)
 *   - position[ax] = round(clamp(5, 95, ((sum + max) / (max*2)) * 100))
 */
export function calculate(answers: Array<number | null>): Result {
  const sums: Record<AxisCode, number> = {
    QM: 0,
    CF: 0,
    AD: 0,
    PS: 0,
    TH: 0,
  };
  const counts: Record<AxisCode, number> = {
    QM: 0,
    CF: 0,
    AD: 0,
    PS: 0,
    TH: 0,
  };

  QUESTIONS.forEach((q, i) => {
    const a = answers[i];
    if (a !== null && a !== undefined) {
      sums[q.axis] += a;
      counts[q.axis] += 1;
    }
  });

  // 5글자 코드 생성. 동률(sum=0)은 첫 글자(Q/C/A/P/T) 우선 — PRD §4.1
  const baseCode =
    (sums.QM <= 0 ? "Q" : "M") +
    (sums.CF <= 0 ? "C" : "F") +
    (sums.AD <= 0 ? "A" : "D") +
    (sums.PS <= 0 ? "P" : "S");
  const modeChar = sums.TH <= 0 ? "T" : "H";
  const code = baseCode + modeChar;

  // 시각화용 0~100 위치
  const positions = {} as Record<AxisCode, number>;
  AXES.forEach((ax) => {
    const max = counts[ax] * 2;
    if (max === 0) {
      positions[ax] = 50;
      return;
    }
    const norm = (sums[ax] + max) / (max * 2); // 0..1
    positions[ax] = Math.round(Math.max(5, Math.min(95, norm * 100)));
  });

  return {
    code,
    baseCode,
    modeKey: modeChar as ModeKey,
    positions,
    scores: sums,
  };
}

/** 코드(5글자)만 가지고 fallback positions 생성 (URL 직접 접근 시) */
export function positionsFromCode(code: string): Record<AxisCode, number> {
  if (code.length < 5) {
    return { QM: 50, CF: 50, AD: 50, PS: 50, TH: 50 };
  }
  // 첫 글자 쪽이면 ~25, 둘째 글자 쪽이면 ~75 (중간 정도 강도로 가정)
  const leftKeys: Record<AxisCode, string> = {
    QM: "Q",
    CF: "C",
    AD: "A",
    PS: "P",
    TH: "T",
  };
  const result = {} as Record<AxisCode, number>;
  AXES.forEach((ax, i) => {
    const ch = code[i];
    result[ax] = ch === leftKeys[ax] ? 25 : 75;
  });
  return result;
}

/** 응답 진척도 (몇 문항 완료) */
export function getCompletedCount(answers: Array<number | null>): number {
  return answers.filter((a) => a !== null && a !== undefined).length;
}

/** 모든 문항 응답 여부 */
export function isComplete(answers: Array<number | null>): boolean {
  return getCompletedCount(answers) === QUESTIONS.length;
}
