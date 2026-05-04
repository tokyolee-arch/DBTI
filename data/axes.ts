import type { AxisLabel } from "@/types";

/** 5축 라벨 정의 — PRD §2.1 */
export const AXIS_LABELS: AxisLabel[] = [
  {
    code: "QM",
    leftKey: "Q",
    rightKey: "M",
    leftKor: "신속",
    rightKor: "여유",
    leftEng: "Quick",
    rightEng: "Mild",
    description: "평균 주행 속도, 가속·신호 반응, 빈 도로 행동",
  },
  {
    code: "CF",
    leftKey: "C",
    rightKey: "F",
    leftKor: "밀착",
    rightKor: "안전",
    leftEng: "Close",
    rightEng: "Far",
    description: "정지·시내·고속·정체·악천후 차간 거리",
  },
  {
    code: "AD",
    leftKey: "A",
    rightKey: "D",
    leftKor: "적극",
    rightKor: "방어",
    leftEng: "Aggressive",
    rightEng: "Defensive",
    description: "추월·차선변경, 끼어들기 대응, 갈등 상황",
  },
  {
    code: "PS",
    leftKey: "P",
    rightKey: "S",
    leftKor: "계획",
    rightKor: "즉흥",
    leftEng: "Planned",
    rightEng: "Spontaneous",
    description: "출발 전 준비, 합류·우회·악천후 대응",
  },
  {
    code: "TH",
    leftKey: "T",
    rightKey: "H",
    leftKor: "테크",
    rightKor: "핸드",
    leftEng: "Tech",
    rightEng: "Hand",
    description: "ADAS·자율주행·내비·인포테인먼트 활용도",
  },
];

export function getAxisLabel(code: string) {
  return AXIS_LABELS.find((a) => a.code === code);
}
