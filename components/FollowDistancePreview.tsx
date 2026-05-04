"use client";

import type { InteractiveKind } from "@/types";

/**
 * 운전석 시점 인터랙티브 프리뷰
 *
 * kind:
 *  - "follow-distance-stop"   Q1: 정지 시 차간 거리, 4단계 스케일 변화
 *  - "follow-distance-city"   Q2: 시내 주행 차간 거리, 4단계 스케일 변화
 *  - "yellow-light-approach"  Q11: 황색 신호 정지선 10m 접근, 고정 장면 + 신호등
 */

interface FollowDistancePreviewProps {
  selected: number | null; // -2 | -1 | 1 | 2 | null
  kind?: InteractiveKind; // 기본 stop
}

interface DistanceConfig {
  scale: number;
  translateY: number;
  showPlate: boolean;
  showWheels: boolean;
  label: string;
  sub: string;
}

const PLACEHOLDER: DistanceConfig = {
  scale: 1.0,
  translateY: 0,
  showPlate: true,
  showWheels: true,
  label: "옵션을 선택해 보세요",
  sub: "버튼을 누르면 앞차와의 거리가 그림으로 바뀝니다",
};

// Q1 정지 상태
const STOP_CFG: Record<number, DistanceConfig> = {
  [-2]: {
    scale: 2.1,
    translateY: 40,
    showPlate: false,
    showWheels: false,
    label: "초근접",
    sub: "앞차 트렁크 커버 정도가 보이는 거리",
  },
  [-1]: {
    scale: 1.7,
    translateY: 50,
    showPlate: true,
    showWheels: true,
    label: "근접",
    sub: "번호판까지 또렷하게 보임",
  },
  [1]: {
    scale: 0.95,
    translateY: -20,
    showPlate: true,
    showWheels: true,
    label: "여유",
    sub: "앞차 전체와 도로 일부가 보임",
  },
  [2]: {
    scale: 0.55,
    translateY: -55,
    showPlate: true,
    showWheels: true,
    label: "상당히 여유",
    sub: "앞차와 충분한 거리, 도로 시야 넓음",
  },
};

// Q2 시내 주행
const CITY_CFG: Record<number, DistanceConfig> = {
  [-2]: {
    scale: 1.55,
    translateY: 40,
    showPlate: true,
    showWheels: true,
    label: "차 한 대 정도",
    sub: "차 한 대만 들어갈 정도로 가까이",
  },
  [-1]: {
    scale: 1.05,
    translateY: -10,
    showPlate: true,
    showWheels: true,
    label: "차 1~2대 정도",
    sub: "도로 흐름에 맞춰 적당히 붙는 거리",
  },
  [1]: {
    scale: 0.65,
    translateY: -45,
    showPlate: false,
    showWheels: false,
    label: "차 2~3대 정도",
    sub: "여유 있게, 끼어들 자리도 약간 있음",
  },
  [2]: {
    scale: 0.4,
    translateY: -65,
    showPlate: false,
    showWheels: false,
    label: "차 3대 이상",
    sub: "충분한 안전거리, 시야 매우 넓음",
  },
};

// Q11 황색 신호 (고정 장면 — 옵션과 무관)
const YELLOW_FIXED: DistanceConfig = {
  scale: 0.95,
  translateY: -20,
  showPlate: true,
  showWheels: true,
  label: "황색 신호 — 정지선까지 약 10m",
  sub: "통과할까, 정지할까?",
};

interface SceneStyle {
  skyTop: string;
  skyBottom: string;
  hudPrimary: string;
  hudSecondary: string;
  showSignal: boolean;
  showStopLine: boolean;
}

const SCENE: Record<InteractiveKind, SceneStyle> = {
  "follow-distance-stop": {
    skyTop: "#FFB27A",
    skyBottom: "#FFE9C9",
    hudPrimary: "STOP · 0 km/h",
    hudSecondary: "신호 대기",
    showSignal: false,
    showStopLine: false,
  },
  "follow-distance-city": {
    skyTop: "#7FB6E8",
    skyBottom: "#D9E9F5",
    hudPrimary: "50 km/h",
    hudSecondary: "시내 주행",
    showSignal: false,
    showStopLine: false,
  },
  "yellow-light-approach": {
    skyTop: "#F2A24A",
    skyBottom: "#FFE0B0",
    hudPrimary: "60 km/h",
    hudSecondary: "황색 신호 · 정지선 10m",
    showSignal: true,
    showStopLine: true,
  },
};

export default function FollowDistancePreview({
  selected,
  kind = "follow-distance-stop",
}: FollowDistancePreviewProps) {
  const isPlaceholder = selected === null && kind !== "yellow-light-approach";

  let cfg: DistanceConfig;
  if (kind === "yellow-light-approach") {
    cfg = YELLOW_FIXED;
  } else if (selected === null) {
    cfg = PLACEHOLDER;
  } else {
    const table = kind === "follow-distance-city" ? CITY_CFG : STOP_CFG;
    cfg = table[selected] ?? PLACEHOLDER;
  }

  const scene = SCENE[kind];

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-line bg-slate-ink shadow-card">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <svg
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={scene.skyTop} />
              <stop offset="100%" stopColor={scene.skyBottom} />
            </linearGradient>
            <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3f4d" />
              <stop offset="100%" stopColor="#1f232c" />
            </linearGradient>
            <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a3140" />
              <stop offset="55%" stopColor="#1a1f2b" />
              <stop offset="100%" stopColor="#0d1018" />
            </linearGradient>
            <linearGradient id="rearGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d6480" />
              <stop offset="100%" stopColor="#1a2b3a" />
            </linearGradient>
            <radialGradient id="vignette" cx="50%" cy="60%" r="75%">
              <stop offset="60%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
            </radialGradient>
            <radialGradient id="yellowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE066" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 하늘 */}
          <rect x="0" y="0" width="800" height="260" fill={`url(#sky-${kind})`} />

          {/* 원경 건물 */}
          <g opacity="0.35" fill="#5b4a3a">
            <rect x="40" y="180" width="80" height="80" />
            <rect x="130" y="155" width="55" height="105" />
            <rect x="195" y="200" width="40" height="60" />
            <rect x="560" y="170" width="70" height="90" />
            <rect x="640" y="190" width="55" height="70" />
            <rect x="700" y="160" width="60" height="100" />
          </g>

          {/* 가로수 */}
          <g opacity="0.55">
            <circle cx="260" cy="225" r="20" fill="#3f6a4a" />
            <rect x="257" y="235" width="6" height="28" fill="#4a3a25" />
            <circle cx="540" cy="225" r="22" fill="#3f6a4a" />
            <rect x="537" y="235" width="6" height="28" fill="#4a3a25" />
          </g>

          {/* 황색 신호등 (yellow kind 전용) */}
          {scene.showSignal && (
            <g transform="translate(560, 70)">
              {/* 지지대 */}
              <rect x="-1.5" y="78" width="3" height="100" fill="#3a3a3a" />
              {/* 가로 암 */}
              <rect x="-50" y="78" width="50" height="3" fill="#3a3a3a" />
              {/* 신호등 하우징 */}
              <rect
                x="-14"
                y="0"
                width="28"
                height="78"
                rx="4"
                fill="#1a1a1a"
                stroke="#444"
                strokeWidth="1"
              />
              {/* 빨강 (꺼짐) */}
              <circle cx="0" cy="14" r="7.5" fill="#3a1a1a" />
              {/* 노랑 (켜짐) + glow */}
              <circle cx="0" cy="39" r="14" fill="url(#yellowGlow)" />
              <circle cx="0" cy="39" r="7.5" fill="#FFC107" />
              <circle cx="0" cy="38" r="3" fill="#FFF6C4" />
              {/* 초록 (꺼짐) */}
              <circle cx="0" cy="64" r="7.5" fill="#1a3a1a" />
            </g>
          )}

          {/* 도로 */}
          <polygon points="0,450 800,450 510,260 290,260" fill="url(#road)" />

          {/* 정지선 (yellow kind 전용) */}
          {scene.showStopLine && (
            <g>
              <polygon
                points="265,295 535,295 540,303 260,303"
                fill="white"
                opacity="0.9"
              />
            </g>
          )}

          {/* 차선 (중앙 점선) */}
          <g fill="#FFD66B" opacity="0.85">
            <polygon points="395,265 405,265 408,290 392,290" />
            <polygon points="389,300 411,300 415,335 385,335" />
            <polygon points="380,348 420,348 426,395 374,395" />
            <polygon points="368,410 432,410 442,450 358,450" />
          </g>

          {/* 차로 가장자리 흰선 */}
          <polygon points="0,450 30,450 295,260 290,260" fill="white" opacity="0.45" />
          <polygon points="800,450 770,450 510,260 515,260" fill="white" opacity="0.45" />

          {/* 앞 차량 */}
          <g
            style={{
              transition:
                "transform 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease",
              transformOrigin: "400px 320px",
              transform: `translate(0px, ${cfg.translateY}px) scale(${cfg.scale})`,
              opacity: isPlaceholder ? 0.35 : 1,
            }}
          >
            <CarBack showPlate={cfg.showPlate} showWheels={cfg.showWheels} />
          </g>

          {/* 비네트 */}
          <rect
            x="0"
            y="0"
            width="800"
            height="450"
            fill="url(#vignette)"
            pointerEvents="none"
          />
        </svg>

        {/* 상단 HUD 라벨 */}
        <div className="pointer-events-none absolute left-3 top-2 flex items-center gap-2 font-accent text-[10px] tracking-wider text-white/85 md:text-xs">
          <span className="rounded bg-black/35 px-2 py-0.5 backdrop-blur-sm">
            {scene.hudPrimary}
          </span>
          <span className="rounded bg-black/35 px-2 py-0.5 backdrop-blur-sm">
            {scene.hudSecondary}
          </span>
        </div>

        {/* 하단 라벨 */}
        <div className="pointer-events-none absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
          <div>
            <div
              className={`font-accent text-base md:text-lg ${
                isPlaceholder ? "text-white/60" : "text-white"
              }`}
            >
              {cfg.label}
            </div>
            <div className="text-[11px] text-white/70 md:text-xs">{cfg.sub}</div>
          </div>
          {!isPlaceholder && kind !== "yellow-light-approach" && (
            <div className="rounded-full bg-coral/90 px-2.5 py-0.5 font-accent text-[10px] text-white shadow-coral md:text-xs">
              미리보기
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** 운전석 시점에서 본 앞차 뒷모습 */
function CarBack({
  showPlate,
  showWheels,
}: {
  showPlate: boolean;
  showWheels: boolean;
}) {
  return (
    <g>
      <ellipse cx="400" cy="408" rx="180" ry="14" fill="black" opacity="0.45" />

      <path
        d="M 240 360 Q 240 295, 285 280 L 515 280 Q 560 295, 560 360 L 560 395 Q 560 405, 545 405 L 255 405 Q 240 405, 240 395 Z"
        fill="url(#carBody)"
      />

      <path
        d="M 295 280 Q 305 240, 350 232 L 450 232 Q 495 240, 505 280 Z"
        fill="#1a1f2b"
      />
      <path
        d="M 312 275 Q 322 250, 358 244 L 442 244 Q 478 250, 488 275 Z"
        fill="url(#rearGlass)"
      />
      <path
        d="M 322 270 Q 330 256, 358 252 L 410 252 Q 405 264, 380 268 Z"
        fill="white"
        opacity="0.18"
      />

      <path d="M 260 332 L 540 332" stroke="#000" strokeWidth="1.5" opacity="0.4" />

      <g>
        <rect x="260" y="338" width="80" height="14" rx="3" fill="#ff3b3b" opacity="0.95" />
        <rect x="262" y="340" width="76" height="3" rx="1.5" fill="#ffb0b0" opacity="0.9" />
        <rect x="460" y="338" width="80" height="14" rx="3" fill="#ff3b3b" opacity="0.95" />
        <rect x="462" y="340" width="76" height="3" rx="1.5" fill="#ffb0b0" opacity="0.9" />
      </g>

      <circle cx="400" cy="345" r="8" fill="#3a4050" />
      <circle cx="400" cy="345" r="5" fill="#6c7385" />

      {showPlate && (
        <g>
          <rect
            x="358"
            y="370"
            width="84"
            height="22"
            rx="3"
            fill="#f5f1e2"
            stroke="#444"
            strokeWidth="1"
          />
          <text
            x="400"
            y="386"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="13"
            fontWeight="700"
            fill="#222"
            letterSpacing="1"
          >
            12가 3456
          </text>
        </g>
      )}

      {showWheels && (
        <g fill="#0a0c12">
          <ellipse cx="278" cy="403" rx="22" ry="6" />
          <ellipse cx="522" cy="403" rx="22" ry="6" />
        </g>
      )}
    </g>
  );
}
