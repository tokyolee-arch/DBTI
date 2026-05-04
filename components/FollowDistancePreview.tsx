"use client";

import type { InteractiveKind } from "@/types";

/**
 * 운전석 시점 인터랙티브 프리뷰
 *
 * kind:
 *  - "follow-distance-stop"   Q1: 정지 시 차간 거리, 4단계 스케일 변화 (도심 정체 분위기)
 *  - "follow-distance-city"   Q2: 시내 주행 차간 거리, 4단계 스케일 변화
 *  - "yellow-light-approach"  Q10: 황색 신호 정지선 10m 접근 — 도심 교차로 고정 장면
 */

interface FollowDistancePreviewProps {
  selected: number | null;
  kind?: InteractiveKind;
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

const YELLOW_FIXED: DistanceConfig = {
  scale: 0.55,
  translateY: -55,
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
}

const SCENE: Record<InteractiveKind, SceneStyle> = {
  "follow-distance-stop": {
    skyTop: "#A8C8E8",
    skyBottom: "#E8F0F8",
    hudPrimary: "STOP · 0 km/h",
    hudSecondary: "신호 대기 · 도심 정체",
  },
  "follow-distance-city": {
    skyTop: "#7FB6E8",
    skyBottom: "#D9E9F5",
    hudPrimary: "50 km/h",
    hudSecondary: "시내 주행",
  },
  "yellow-light-approach": {
    skyTop: "#A6D2EF",
    skyBottom: "#E8F4FB",
    hudPrimary: "60 km/h",
    hudSecondary: "황색 신호 · 정지선 10m",
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

          {/* ─── 장면별 배경 ─── */}
          {kind === "yellow-light-approach" ? (
            <UrbanIntersectionBackdrop />
          ) : (
            <BusyCityBackdrop kind={kind} />
          )}

          {/* 도로 */}
          <polygon points="0,450 800,450 510,260 290,260" fill="url(#road)" />

          {/* 차로 가장자리 흰선 */}
          <polygon points="0,450 30,450 295,260 290,260" fill="white" opacity="0.45" />
          <polygon points="800,450 770,450 510,260 515,260" fill="white" opacity="0.45" />

          {/* 정지선 + 횡단보도 (yellow 전용) */}
          {kind === "yellow-light-approach" && <Crosswalk />}

          {/* 측면 보조 차량 (yellow 전용 — Q1/Q2는 주변차 제거) */}
          {kind === "yellow-light-approach" && <YellowSideCars />}

          {/* 메인 앞차 */}
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

        {/* 상단 HUD */}
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

/* ───────────────────────── 배경 (도심 정체 / 시내) ───────────────────────── */

function BusyCityBackdrop({ kind }: { kind: InteractiveKind }) {
  return (
    <g>
      {/* 좌측 큰 빌딩 군 */}
      <g>
        <rect x="0" y="90" width="115" height="170" fill="#9aa3aa" />
        <rect x="0" y="90" width="115" height="170" fill="#000" opacity="0.05" />
        {/* 창문 그리드 (좌측 빌딩) */}
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 5 }).map((__, c) => (
            <rect
              key={`L1-${r}-${c}`}
              x={10 + c * 20}
              y={105 + r * 20}
              width="12"
              height="12"
              fill="#d4dde2"
              opacity="0.7"
            />
          ))
        )}
        <rect x="115" y="120" width="55" height="140" fill="#b8bfc5" />
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 2 }).map((__, c) => (
            <rect
              key={`L2-${r}-${c}`}
              x={123 + c * 22}
              y={130 + r * 18}
              width="14"
              height="10"
              fill="#dfe4e8"
              opacity="0.7"
            />
          ))
        )}
        <rect x="170" y="170" width="40" height="90" fill="#a8b0b6" />
      </g>

      {/* 우측 큰 빌딩 군 */}
      <g>
        <rect x="630" y="80" width="170" height="180" fill="#a8b0b6" />
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 6 }).map((__, c) => (
            <rect
              key={`R1-${r}-${c}`}
              x={645 + c * 24}
              y={95 + r * 20}
              width="14"
              height="13"
              fill="#cfd6db"
              opacity="0.75"
            />
          ))
        )}
        <rect x="585" y="135" width="50" height="125" fill="#b5bcc1" />
        {Array.from({ length: 5 }).map((_, r) => (
          <rect
            key={`R2-${r}`}
            x={595}
            y={148 + r * 20}
            width="32"
            height="10"
            fill="#e0e5e9"
            opacity="0.7"
          />
        ))}
      </g>

      {/* 가로수 */}
      <g opacity="0.8">
        <circle cx="240" cy="225" r="22" fill="#3f6a4a" />
        <rect x="237" y="235" width="6" height="28" fill="#4a3a25" />
        <circle cx="560" cy="225" r="24" fill="#3f6a4a" />
        <rect x="557" y="235" width="6" height="28" fill="#4a3a25" />
      </g>

      {/* 가로등 */}
      <g fill="#4a4a4a" opacity="0.7">
        <rect x="218" y="170" width="3" height="60" />
        <rect x="218" y="167" width="20" height="3" />
        <rect x="579" y="170" width="3" height="60" />
        <rect x="561" y="167" width="20" height="3" />
      </g>

    </g>
  );
}

/* ───────────────────── 도심 교차로 (Q10) 배경 ───────────────────── */

function UrbanIntersectionBackdrop() {
  return (
    <g>
      {/* 좌측 빌딩 (사진 좌측의 흰색·베이지 빌딩 느낌) */}
      <g>
        <rect x="0" y="60" width="135" height="200" fill="#bcc3c8" />
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 5 }).map((__, c) => (
            <rect
              key={`YL-${r}-${c}`}
              x={10 + c * 24}
              y={75 + r * 20}
              width="16"
              height="13"
              fill="#dde3e7"
              opacity="0.85"
            />
          ))
        )}
        {/* 간판 */}
        <rect x="20" y="245" width="80" height="14" fill="#2d6cb0" opacity="0.8" />
        <rect x="105" y="245" width="25" height="14" fill="#c93030" opacity="0.8" />
      </g>

      {/* 우측 빌딩 (사진 우측의 큰 회색 사옥 느낌) */}
      <g>
        <rect x="640" y="40" width="160" height="220" fill="#9ca3a8" />
        {Array.from({ length: 11 }).map((_, r) =>
          Array.from({ length: 5 }).map((__, c) => (
            <rect
              key={`YR-${r}-${c}`}
              x={655 + c * 28}
              y={55 + r * 19}
              width="20"
              height="12"
              fill="#c4ccd1"
              opacity="0.85"
            />
          ))
        )}
        {/* 회사 로고 자리 */}
        <rect x="660" y="245" width="120" height="16" fill="#3a4248" opacity="0.7" />
      </g>

      {/* 중앙 원경 빌딩 */}
      <g opacity="0.6">
        <rect x="320" y="180" width="40" height="80" fill="#b7bdc2" />
        <rect x="365" y="195" width="35" height="65" fill="#aab0b5" />
        <rect x="405" y="170" width="50" height="90" fill="#b7bdc2" />
        <rect x="460" y="195" width="40" height="65" fill="#a4aaaf" />
      </g>

      {/* 가로수 */}
      <g opacity="0.85">
        <circle cx="200" cy="225" r="18" fill="#3f6a4a" />
        <rect x="198" y="235" width="5" height="25" fill="#4a3a25" />
        <circle cx="610" cy="220" r="22" fill="#3f6a4a" />
        <rect x="608" y="232" width="5" height="28" fill="#4a3a25" />
      </g>

      {/* 가로등 (사진 오른쪽 큰 가로등) */}
      <g fill="#5a5a5a">
        <rect x="690" y="100" width="3" height="160" />
        <path d="M 693 110 Q 720 95, 745 100" stroke="#5a5a5a" strokeWidth="3" fill="none" />
        <rect x="744" y="98" width="14" height="5" rx="2" />
      </g>

      {/* 신호등 가로 게이트(gantry) — 사진처럼 도로를 가로지르는 가로 암 */}
      {/* 좌측 지지대 */}
      <rect x="115" y="100" width="6" height="160" fill="#5a5a5a" />
      {/* 우측 지지대 */}
      <rect x="640" y="80" width="6" height="180" fill="#5a5a5a" />
      {/* 가로 암 */}
      <rect x="115" y="115" width="525" height="5" fill="#6a6a6a" />
      <rect x="115" y="113" width="525" height="2" fill="#8a8a8a" opacity="0.7" />

      {/* 신호등 4개 — 모두 황색 점등 */}
      <g>
        <SignalHead x={185} y={120} />
        <SignalHead x={325} y={120} />
        <SignalHead x={470} y={120} />
        <SignalHead x={580} y={120} />
      </g>

      {/* 표지판: U-턴 (좌측) */}
      <g transform="translate(165, 180)">
        <circle cx="0" cy="0" r="16" fill="#2d6cb0" />
        <path
          d="M -7 5 Q -7 -7, 2 -7 Q 9 -7, 9 0 L 9 4"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
        />
        <polygon points="6,4 12,4 9,9" fill="white" />
      </g>
      {/* 직진+좌회전 표지 */}
      <g transform="translate(202, 180)">
        <circle cx="0" cy="0" r="16" fill="#2d6cb0" />
        <path d="M 0 8 L 0 -7" stroke="white" strokeWidth="2.5" />
        <polygon points="-3,-5 0,-10 3,-5" fill="white" />
        <path d="M -2 -3 L -8 -3" stroke="white" strokeWidth="2.5" />
        <polygon points="-7,-6 -11,-3 -7,0" fill="white" />
      </g>

      {/* 속도제한 50 (가로 암 우측) */}
      <g transform="translate(540, 140)">
        <circle cx="0" cy="0" r="20" fill="white" stroke="#c93030" strokeWidth="5" />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontSize="18"
          fontWeight="800"
          fill="#222"
          fontFamily="Arial, sans-serif"
        >
          50
        </text>
      </g>

      {/* 속도제한 30 (우측 가로등 아래) */}
      <g transform="translate(665, 200)">
        <circle cx="0" cy="0" r="16" fill="white" stroke="#c93030" strokeWidth="4" />
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fill="#222"
          fontFamily="Arial, sans-serif"
        >
          30
        </text>
      </g>

      {/* 도로명 표지판 (우측 파란 표지) */}
      <g transform="translate(610, 175)">
        <rect width="55" height="20" fill="#2d6cb0" rx="2" />
        <text
          x="27.5"
          y="13"
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontFamily="Arial, sans-serif"
        >
          공항대로
        </text>
      </g>
    </g>
  );
}

/** 신호등 하우징 (가로형, 황색 점등) */
function SignalHead({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 짧은 지지 */}
      <rect x="-2" y="-3" width="4" height="6" fill="#5a5a5a" />
      {/* 하우징 (가로형) */}
      <rect
        x="-30"
        y="3"
        width="60"
        height="22"
        rx="3"
        fill="#1a1a1a"
        stroke="#444"
        strokeWidth="1"
      />
      {/* 빨강 (꺼짐) */}
      <circle cx="-19" cy="14" r="6.5" fill="#3a1a1a" />
      {/* 황색 (켜짐) + glow */}
      <circle cx="0" cy="14" r="11" fill="url(#yellowGlow)" />
      <circle cx="0" cy="14" r="6.5" fill="#FFC107" />
      <circle cx="0" cy="13" r="2.5" fill="#FFF6C4" />
      {/* 좌회전 화살표 (꺼짐) */}
      <circle cx="19" cy="14" r="6.5" fill="#1a3a1a" />
    </g>
  );
}

/** 정지선 + 횡단보도 */
function Crosswalk() {
  return (
    <g>
      {/* 정지선 (도로폭 사다리꼴) */}
      <polygon
        points="290,290 510,290 515,298 285,298"
        fill="white"
        opacity="0.95"
      />
      {/* 횡단보도 — 정지선 바로 앞 zebra (원근 적용) */}
      <g opacity="0.88">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const t = i / 7;
          // 위쪽 폭 좁고 아래쪽 폭 넓게 (원근)
          const yTop = 305 + t * 20;
          const yBot = 311 + t * 24;
          const xL = 285 - t * 18;
          const xR = 515 + t * 18;
          const w = (xR - xL) / 14;
          const stripes = [];
          for (let s = 0; s < 7; s++) {
            const x1 = xL + (xR - xL) * (s / 7);
            const x2 = x1 + w;
            stripes.push(
              <polygon
                key={`cw-${i}-${s}`}
                points={`${x1},${yTop} ${x2},${yTop} ${x2 + 1},${yBot} ${x1 + 1},${yBot}`}
                fill="white"
              />
            );
          }
          return <g key={`cw-row-${i}`}>{stripes}</g>;
        })}
      </g>
    </g>
  );
}

/* ───────────────────── 측면 보조 차량 (yellow 전용) ───────────────────── */

function YellowSideCars() {
  // 교차로 황색 신호 — 횡단보도 너머 멀리 차 한 대 정도, 좌측 차로에 옆 차
  return (
    <g>
      {/* 옆 차로 — 같이 정지하려는 차 */}
      <MiniCar cx={145} cy={355} scale={0.78} color="#8a929a" plate />
      <MiniCar cx={655} cy={355} scale={0.65} color="#3a3f48" />
    </g>
  );
}

/** 작은 차 (뒷모습 단순화) */
function MiniCar({
  cx,
  cy,
  scale = 1,
  color = "#4a5160",
  plate = false,
}: {
  cx: number;
  cy: number;
  scale?: number;
  color?: string;
  plate?: boolean;
}) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      <ellipse cx="0" cy="40" rx="55" ry="5" fill="black" opacity="0.4" />
      {/* 차체 */}
      <path
        d="M -45 25 Q -45 -10, -25 -18 L 25 -18 Q 45 -10, 45 25 L 45 38 Q 45 44, 38 44 L -38 44 Q -45 44, -45 38 Z"
        fill={color}
      />
      {/* 루프 + 뒷유리 */}
      <path
        d="M -28 -15 Q -22 -32, -8 -36 L 8 -36 Q 22 -32, 28 -15 Z"
        fill="#1a2330"
      />
      <path
        d="M -22 -16 Q -17 -27, -6 -30 L 6 -30 Q 17 -27, 22 -16 Z"
        fill="#3d6480"
        opacity="0.85"
      />
      {/* 후미등 */}
      <rect x="-40" y="3" width="20" height="5" rx="1.5" fill="#ff3b3b" />
      <rect x="20" y="3" width="20" height="5" rx="1.5" fill="#ff3b3b" />
      {/* 번호판 */}
      {plate && (
        <rect
          x="-14"
          y="22"
          width="28"
          height="10"
          rx="1.5"
          fill="#f3efe0"
          stroke="#444"
          strokeWidth="0.5"
        />
      )}
    </g>
  );
}

/* ───────────────────── 메인 앞차 (옵션 연동) ───────────────────── */

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
