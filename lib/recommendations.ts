import type { ModeKey } from "@/types";

/**
 * 보험 추천 룰 — PRD §5.4
 *
 * ⚠️ 광고법 안전 영역:
 *   - 상품명·보험사명을 직접 언급하지 않음
 *   - 카테고리·특약 유형만 안내
 */

export interface InsuranceCard {
  category: string;
  description: string;
  reason: string;
}

export function getInsuranceRecommendations(code: string): InsuranceCard[] {
  if (code.length < 5) return [];
  const recs: InsuranceCard[] = [];
  const mode = code[4] as ModeKey;

  // 모드 T
  if (mode === "T") {
    recs.push({
      category: "텔레매틱스 운전점수 할인형",
      description: "주행 데이터 기반으로 안전운전 점수에 따라 보험료가 할인되는 유형",
      reason: "테크 모드 — 디지털 기술 활용도가 높아 운전 데이터가 본인의 강점이 됩니다",
    });
    recs.push({
      category: "자율주행 보조기능 특약",
      description: "ADAS 장착 차량에 대한 사고 예방 효과를 반영한 특약형",
      reason: "테크 모드 — ADAS 사용 빈도가 높은 운전자에게 적합",
    });
  }

  // 모드 H
  if (mode === "H") {
    recs.push({
      category: "운전자보험 강화형",
      description: "상해·법률·교통사고 처리 비용 등 운전자 본인 보장에 집중한 유형",
      reason: "핸드 모드 — 직접 운전 비중이 높아 운전자 본인 보장이 중요",
    });
    recs.push({
      category: "자기차량손해 담보 우선",
      description: "본인 차량 손해 보장에 우선순위를 둔 유형",
      reason: "핸드 모드 — 차량과의 직접적 컨트롤을 중시하는 운전 스타일",
    });
  }

  // Q + A 조합 (빠르고 적극적)
  if (code[0] === "Q" && code[2] === "A") {
    recs.push({
      category: "자기차량손해 강화 + 운전자보험 우대",
      description: "고속·적극적 운전에 대비한 양면 보장 결합형",
      reason: "신속(Q) + 적극(A) 조합 — 빠른 결정 운전에 대한 안전망 보강",
    });
  }

  // M + D 조합 (여유있고 방어적)
  if (code[0] === "M" && code[2] === "D") {
    recs.push({
      category: "마일리지 할인형",
      description: "연간 주행거리에 따라 할인이 적용되는 유형",
      reason: "여유(M) + 방어(D) 조합 — 안전운전 패턴이 보험료에 직접 반영",
    });
    recs.push({
      category: "안전운전 점수 보험",
      description: "운전 패턴·습관 점수에 따른 추가 할인형",
      reason: "여유(M) + 방어(D) 조합 — 안정적 운전 스타일에 인센티브",
    });
  }

  // 코드[3] = P (계획성)
  if (code[3] === "P") {
    recs.push({
      category: "연납 할인형",
      description: "연간 일시납으로 보험료 할인을 받는 유형",
      reason: "계획(P) — 미리 준비하는 성향에 적합한 납부 구조",
    });
  }

  // 코드[3] = S (즉흥)
  if (code[3] === "S") {
    recs.push({
      category: "단기·일일 추가담보형",
      description: "여행·렌터카·단기 운전 시 가입 가능한 유연한 유형",
      reason: "즉흥(S) — 상황에 따라 유연하게 보장을 추가하는 스타일",
    });
  }

  return recs;
}
