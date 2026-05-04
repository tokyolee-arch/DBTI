-- DBTI Lab — Supabase 스키마 (PRD §6.2)
--
-- 실행 방법:
--   1. Supabase 대시보드 → SQL Editor → New query
--   2. 본 파일 내용 붙여넣기 → Run
--
-- 또는 CLI:
--   supabase db push   (supabase init / link 후)
--
-- 기준 환경:
--   - 익명(publishable / anon) 키로 INSERT 만 허용
--   - SELECT/UPDATE/DELETE 는 service_role 키 (서버사이드)에서만
-- ──────────────────────────────────────────────

-- 1. 메인 응답 테이블
create table if not exists public.dbti_responses (
  id              uuid          primary key default gen_random_uuid(),
  created_at      timestamptz   not null default now(),

  -- 인테이크 폼
  nickname        text          not null check (char_length(nickname) between 1 and 40),
  contact         text          not null check (char_length(contact) between 1 and 120),
  gender          text          not null check (gender in ('male','female','other')),
  age_range       text          not null check (age_range in ('10s','20s','30s','40s','50s','60s+')),
  driving_years   text          not null check (driving_years in ('<1','1-3','3-5','5-10','10+')),
  driving_level   text          not null check (driving_level in ('beginner','familiar','expert')),
  predicted_code  text          check (predicted_code ~ '^[QM][CF][AD][PS]$' or predicted_code is null),

  -- 결과
  result_code     text          not null check (result_code ~ '^[QM][CF][AD][PS][TH]$'),
  base_code       text          not null check (base_code ~ '^[QM][CF][AD][PS]$'),
  mode_key        text          not null check (mode_key in ('T','H')),
  positions       jsonb         not null,
  scores          jsonb         not null,

  -- 메타
  user_agent      text
);

-- 2. 인덱스
create index if not exists idx_dbti_responses_created_at
  on public.dbti_responses (created_at desc);
create index if not exists idx_dbti_responses_result_code
  on public.dbti_responses (result_code);
create index if not exists idx_dbti_responses_predicted_code
  on public.dbti_responses (predicted_code);

-- 3. Row Level Security
alter table public.dbti_responses enable row level security;

-- 익명 INSERT 허용 (publishable/anon 키)
drop policy if exists "anon can insert" on public.dbti_responses;
create policy "anon can insert"
  on public.dbti_responses
  for insert
  to anon
  with check (true);

-- 인증 사용자 (필요시) INSERT 허용
drop policy if exists "authenticated can insert" on public.dbti_responses;
create policy "authenticated can insert"
  on public.dbti_responses
  for insert
  to authenticated
  with check (true);

-- SELECT는 RLS로 막힘 → service_role 키로만 접근 가능

-- ──────────────────────────────────────────────
-- 분석용 뷰 (예시) — service_role 만 조회 가능
-- ──────────────────────────────────────────────

-- 코드 분포 카운트
create or replace view public.dbti_code_distribution as
select
  result_code,
  count(*) as n,
  round(100.0 * count(*) / sum(count(*)) over (), 2) as pct
from public.dbti_responses
group by result_code
order by n desc;

-- 예측 vs 실제 일치 통계 (4글자 base_code 기준)
create or replace view public.dbti_predicted_match as
select
  predicted_code,
  base_code,
  count(*) as n
from public.dbti_responses
where predicted_code is not null
group by predicted_code, base_code
order by predicted_code, n desc;
