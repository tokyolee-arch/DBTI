# DBTI Lab

> 나는 어떤 운전자일까? — 35문항 운전 성향 테스트

5축 분석으로 32개 동물 캐릭터 중 본인에게 맞는 한 마리를 찾아주고, 성향 코드 기반 보험 카테고리·ADAS 추천까지 제공하는 Next.js 14 웹앱입니다.

## ✨ 기능

- **35개 문항 진단** — 5개 축(QM·CF·AD·PS·TH) × 7문항씩
- **5글자 성향 코드** — 예: `QFAPT` (전략 늑대 + 테크 모드)
- **5축 차트 시각화** — 가로 진행바 + 마커로 직관적 표시
- **32개 캐릭터** — 16 베이스 동물 × 2 모드(테크/핸드)
- **보험 카테고리 추천** — 성향 조합별 누적 룰 (광고법 안전 영역)
- **ADAS 추천** — 모드별 운전 보조 기능 우선순위
- **결과 공유** — `/result?code=XXXXX` URL 또는 Web Share API
- **진행 상태 자동 저장** — 새로고침해도 진행 중 답변 복구

## 🛠 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 폰트 | next/font · Black Han Sans / Gowun Dodum / Do Hyeon |
| 상태 | React useState + URL · localStorage · sessionStorage |
| 배포 | Vercel |

## 📂 프로젝트 구조

```
DBTI/
├── app/
│   ├── layout.tsx            # 루트 레이아웃 + 폰트
│   ├── globals.css
│   ├── page.tsx              # / 웰컴
│   ├── test/page.tsx         # /test 35문항
│   └── result/page.tsx       # /result?code=XXXXX
├── components/
│   ├── WelcomeScreen.tsx
│   ├── QuestionCard.tsx
│   ├── ProgressBar.tsx
│   ├── ResultCard.tsx
│   ├── AxisChart.tsx
│   ├── InsuranceRecommendation.tsx
│   └── AdasRecommendation.tsx
├── data/
│   ├── questions.ts          # 35 문항
│   ├── animals.ts            # 16 베이스 동물
│   ├── modes.ts              # T/H 모드
│   └── axes.ts               # 5축 라벨
├── lib/
│   ├── scoring.ts            # 점수 산출
│   └── recommendations.ts    # 보험 추천 룰
└── types/
    └── index.ts
```

## 🚀 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버
npm run dev
# → http://localhost:3000

# 3. 프로덕션 빌드
npm run build
npm start

# 4. 타입 체크 / 린트
npm run type-check
npm run lint
```

## 🗄 Supabase 연동

### 1. 환경변수

`.env.local` (로컬) 또는 Vercel Project Settings → Environment Variables 에 추가:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://duklpabxmoavawsgjvpw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

> 신형 publishable key (`sb_publishable_*`) 와 구형 anon key 둘 다 지원합니다.
> RLS 정책으로 익명 INSERT만 허용되므로 publishable 키를 클라이언트에 노출해도 안전합니다.

### 2. DB 스키마

Supabase 대시보드 → **SQL Editor** → New query → `supabase/schema.sql` 내용 복사 → **Run**.

생성되는 객체:
- `dbti_responses` — 메인 응답 테이블 (체크 제약 + 인덱스 + RLS)
- `dbti_code_distribution` — 코드 분포 뷰
- `dbti_predicted_match` — 예상 vs 실제 비교 뷰

### 3. 동작

- 첫 화면 폼 제출 → `sessionStorage(dbti.profile)` 저장
- 35문항 완료 → 결과 페이지 진입 시 `submitResponse()` 호출
- 환경변수가 있으면 Supabase로 INSERT, 없으면 로컬만 (`mode: "local"`)
- 동일 세션 중복 적재는 `sessionStorage(dbti.resultSaved)` 로 차단

### 4. 분석 쿼리 예시

```sql
-- 코드 분포 (서비스 롤)
select * from dbti_code_distribution;

-- 연령대 × 운전수준 매트릭스
select age_range, driving_level, count(*)
from dbti_responses
group by 1, 2
order by 1, 2;

-- 예측 적중률
select
  count(*) filter (where predicted_code = base_code) * 100.0 / count(*) as hit_pct
from dbti_responses
where predicted_code is not null;
```

## ☁️ Vercel 배포

```bash
# 한 번만
npm install -g vercel

# 배포
vercel        # 프리뷰
vercel --prod # 프로덕션
```

또는 GitHub에 푸시 후 [Vercel 대시보드](https://vercel.com/new)에서 import.

> 배포 시 Vercel → Project Settings → Environment Variables 에
> `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 추가 필수.

## 🧮 점수 산출 (PRD §4)

각 문항 답변 점수: `-2 / -1 / +1 / +2`

축별로 합계를 누적한 뒤:

```ts
sum <= 0 → 첫 글자 (Q / C / A / P / T)
sum >  0 → 둘째 글자 (M / F / D / S / H)
position[ax] = round(clamp(5, 95, ((sum + max) / (max*2)) * 100))
```

5축의 첫·둘째 글자를 합쳐 5글자 코드 완성 (예: `QFAPT`).

## 🎨 색상 팔레트

| 토큰 | 값 | 용도 |
|------|-----|------|
| `cream` | `#FFF8EE` | 배경 |
| `coral` | `#FF7A45` | 강조 (선택·마커·버튼) |
| `brand` | `#4F6BED` | 보조 (헤더·링크) |
| `slate` | `#2D3142` | 본문 텍스트 |

## 📝 주요 결정 사항

- **결과 데이터 전달**: URL `?code=` + `sessionStorage(positions)` 병행. 코드만 있으면 동물 카드는 정확, 차트는 코드 기반 fallback (25%/75%) 추정값.
- **법적 안전 영역**: 보험 추천은 카테고리·특약 유형만, 상품·보험사 직접 언급 없음.
- **진행 상태 복구**: 답변 진행 중에는 `localStorage`에 저장, 결과 조회 후 정리.

## 🔭 다음 단계 (out of scope)

- [ ] 운전 궁합 매칭 (PRD §5.6)
- [ ] OG 이미지 동적 생성
- [ ] Supabase 결과 DB 연동
- [ ] 캐릭터 일러스트 통합 (현재 이모지)
- [ ] 사진/시뮬 영상 자산 (현재 placeholder)

## ⚠️ 면책

본 테스트는 재미용입니다. 의학적·법적 진단이 아니며, 실제 보험 가입·차량 구매 결정의 단독 근거로 사용되지 않습니다.

## 📜 라이선스

이 프로젝트는 작성자의 개인 학습·시연 목적으로 만들어졌습니다.
