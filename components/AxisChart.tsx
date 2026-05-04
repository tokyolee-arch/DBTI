"use client";

import type { AxisCode } from "@/types";
import { AXES } from "@/types";
import { AXIS_LABELS } from "@/data/axes";

interface AxisChartProps {
  positions: Record<AxisCode, number>; // 0..100
  code: string; // 5글자 코드 (강조 영역 결정용)
}

/**
 * 5축 시각화 — PRD §5.3
 * - 가로 진행바 5개
 * - 본인 성향 측에 강조 (coral)
 * - 마커는 position% 위치
 */
export default function AxisChart({ positions, code }: AxisChartProps) {
  return (
    <div className="space-y-5">
      {AXIS_LABELS.map((axis, i) => {
        const pos = positions[axis.code];
        const codeChar = code[i];
        const leftSelected = codeChar === axis.leftKey;

        return (
          <div key={axis.code}>
            {/* 라벨 줄 */}
            <div className="mb-2 flex items-center justify-between text-sm md:text-base">
              <div
                className={`font-accent transition ${
                  leftSelected
                    ? "text-coral-dark"
                    : "text-slate-mute"
                }`}
              >
                <span className="text-base md:text-lg">{axis.leftKor}</span>
                <span className="ml-1.5 text-xs">({axis.leftEng})</span>
              </div>
              <div
                className={`font-accent transition ${
                  !leftSelected
                    ? "text-coral-dark"
                    : "text-slate-mute"
                }`}
              >
                <span className="text-xs">({axis.rightEng})</span>
                <span className="ml-1.5 text-base md:text-lg">
                  {axis.rightKor}
                </span>
              </div>
            </div>

            {/* 진행바 */}
            <div className="relative h-3 w-full overflow-visible rounded-full bg-line/50">
              {/* 중앙 기준선 */}
              <div className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-slate-mute/30" />
              {/* 마커 */}
              <div
                className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-coral shadow-coral transition-all duration-700 ease-out"
                style={{ left: `${pos}%` }}
                aria-label={`${axis.code} = ${pos}%`}
              />
            </div>

            {/* 설명 */}
            <p className="mt-2 text-xs text-slate-mute md:text-sm">
              {axis.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
