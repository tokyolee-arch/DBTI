// DBTI Lab — 공통 타입 정의 (PRD §3.2, §4, §5)

export type AxisCode = "QM" | "CF" | "AD" | "PS" | "TH";
export type ModeKey = "T" | "H";
export type Score = -2 | -1 | 1 | 2;

export const AXES: AxisCode[] = ["QM", "CF", "AD", "PS", "TH"];

/** 각 축의 양극 라벨 (좌=음수쪽, 우=양수쪽) */
export interface AxisLabel {
  code: AxisCode;
  leftKey: string; // 'Q' | 'C' | 'A' | 'P' | 'T'
  rightKey: string; // 'M' | 'F' | 'D' | 'S' | 'H'
  leftKor: string;
  rightKor: string;
  leftEng: string;
  rightEng: string;
  description: string;
}

export interface QuestionOption {
  text: string;
  score: Score;
}

/** 인터랙티브 시뮬레이션 종류 — 옵션 선택과 연동되는 미디어 */
export type InteractiveKind =
  | "follow-distance-stop" // Q1: 신호 대기 차간 거리
  | "follow-distance-city" // Q2: 시내 주행 차간 거리
  | "yellow-light-approach"; // Q11: 황색 신호 정지선 접근

export interface Question {
  id: number; // 1..35
  axis: AxisCode;
  category: string;
  text: string;
  help?: string;
  media?: "photo" | "sim" | "none";
  /** 옵션 선택 시 그림이 함께 변하는 인터랙티브 미디어 */
  interactive?: InteractiveKind;
  options: QuestionOption[];
}

export interface BaseAnimal {
  code: string; // 4글자 DBTI 코드 (예: 'QFAP')
  animal: string; // 한글 동물명 (예: '늑대')
  english: string; // 영문 동물명 (예: 'Wolf')
  emoji: string;
  name: string; // 한글 닉네임 (예: '전략 늑대')
  tag: string; // 1줄 성향 요약
  desc: string;
  pros: string[];
  cons: string[];
  coach: string;
}

export interface AdasItem {
  icon: string;
  name: string;
  desc: string;
}

export interface Mode {
  key: ModeKey;
  label: string;
  prefix: string;
  descAdd: string;
  adas: AdasItem[];
  insurance: string;
}

export interface Result {
  code: string; // 5글자 (예: 'QFAPT')
  baseCode: string; // 4글자
  modeKey: ModeKey;
  positions: Record<AxisCode, number>; // 0..100
  scores: Record<AxisCode, number>; // 원점수 합 (-14..+14)
}

/** 사용자 인테이크 프로필 — 시작 페이지에서 수집 */
export type Gender = "male" | "female" | "other";
export type AgeRange = "10s" | "20s" | "30s" | "40s" | "50s" | "60s+";
export type DrivingYears = "<1" | "1-3" | "3-5" | "5-10" | "10+";
export type DrivingLevel = "beginner" | "familiar" | "expert";

export interface UserProfile {
  nickname: string;
  contact: string; // 이메일 또는 전화번호
  gender: Gender;
  ageRange: AgeRange;
  drivingYears: DrivingYears;
  drivingLevel: DrivingLevel;
  predictedCode?: string; // 4글자 DBTI 코드 (사용자 예상)
  createdAt?: string; // ISO 시간 (Supabase 적재 전 클라이언트 생성)
}
