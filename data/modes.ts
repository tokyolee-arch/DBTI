import type { Mode, ModeKey } from "@/types";

/**
 * T (Tech) / H (Hand) 모드 정의 — PRD §2.4
 * 16 베이스 동물 × 2 모드 = 32 캐릭터
 */
export const MODES: Record<ModeKey, Mode> = {
  T: {
    key: "T",
    label: "TECH MODE",
    prefix: "테크",
    descAdd:
      "ADAS·자율주행 보조·HUD를 적극 활용하며, 차량의 디지털 기술을 본인의 운전 능력의 일부로 받아들입니다.",
    adas: [
      {
        icon: "🛰",
        name: "HDA / 고속도로 주행 보조",
        desc: "이미 즐겨 쓰시는 기능 — 신형 HDA 2.0/3.0이 가치 있습니다.",
      },
      {
        icon: "🚗",
        name: "ACC / 어댑티브 크루즈",
        desc: "장거리에서 피로도와 사고 위험을 동시에 낮춥니다.",
      },
      {
        icon: "📡",
        name: "OTA 업데이트 가능 차종",
        desc: "구매 후에도 ADAS가 진화하는 차종을 적극 추천.",
      },
    ],
    insurance: "텔레매틱스 기반 운전점수 할인형 / 자율주행 보조기능 특약",
  },
  H: {
    key: "H",
    label: "HAND MODE",
    prefix: "핸드",
    descAdd:
      "운전의 손맛과 직접적인 컨트롤을 중시하며, 차량 보조 기술보다는 본인의 감각과 판단을 신뢰합니다.",
    adas: [
      {
        icon: "👁",
        name: "BSD / 사각지대 경고",
        desc: "자율성을 해치지 않으면서 안전망만 보강하는 기능.",
      },
      {
        icon: "🚨",
        name: "FCW·AEB / 전방추돌 경고",
        desc: "평소 운전엔 개입 안 하지만 위급시 작동.",
      },
      {
        icon: "🚙",
        name: "RCTA / 후방교차 경보",
        desc: "주차장 후진 시 사각 보완.",
      },
    ],
    insurance: "운전자 보험 강화형 / 자기차량손해 담보 우선",
  },
};

export function getMode(key: ModeKey): Mode {
  return MODES[key];
}
