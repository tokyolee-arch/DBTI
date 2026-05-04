import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Result, UserProfile } from "@/types";

/**
 * Supabase 클라이언트 + 적재 헬퍼
 *
 * 환경변수 (.env.local 또는 Vercel Project Settings):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  (신형 publishable key, sb_publishable_*)
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY         (구형 anon key — 호환용 fallback)
 *
 * 테이블: dbti_responses (supabase/schema.sql 참조)
 *
 * 정책:
 *   - 익명(anon) 사용자는 INSERT만 허용
 *   - SELECT는 service_role 키로만 (Vercel 서버사이드 또는 Supabase 콘솔)
 */

export const PROFILE_KEY = "dbti.profile";
export const RESULT_SAVED_KEY = "dbti.resultSaved";

function isBrowser() {
  return typeof window !== "undefined";
}

// ─────────────────────────────────────────────
// 로컬 프로필 캐시 (sessionStorage)
// ─────────────────────────────────────────────
export function saveProfileLocal(profile: UserProfile) {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* noop */
  }
}

export function loadProfileLocal(): UserProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function clearProfileLocal() {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(PROFILE_KEY);
  } catch {
    /* noop */
  }
}

// ─────────────────────────────────────────────
// Supabase 클라이언트 (싱글톤)
// ─────────────────────────────────────────────
let _client: SupabaseClient | null = null;

function getSupabaseEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const env = getSupabaseEnv();
  if (!env) return null;
  _client = createClient(env.url, env.key, {
    auth: { persistSession: false },
  });
  return _client;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

// ─────────────────────────────────────────────
// 결과 + 프로필 적재
// ─────────────────────────────────────────────
export interface SubmitPayload {
  profile: UserProfile;
  result: Result;
}

export interface SubmitOutcome {
  ok: boolean;
  mode: "supabase" | "local";
  error?: string;
  id?: string;
}

/**
 * profile + result 한 행을 dbti_responses에 insert.
 * 환경변수 미설정시 console.info 후 ok:true (local mode) 반환.
 */
export async function submitResponse(
  payload: SubmitPayload
): Promise<SubmitOutcome> {
  const supabase = getSupabase();
  if (!supabase) {
    if (typeof console !== "undefined") {
      console.info("[DBTI] Supabase keys missing — saved locally only.", {
        nickname: payload.profile.nickname,
        code: payload.result.code,
      });
    }
    return { ok: true, mode: "local" };
  }

  // 동일 세션 중복 적재 방지
  if (isBrowser()) {
    try {
      const flag = window.sessionStorage.getItem(RESULT_SAVED_KEY);
      if (flag === payload.result.code) {
        return { ok: true, mode: "supabase" };
      }
    } catch {
      /* noop */
    }
  }

  const row = {
    nickname: payload.profile.nickname,
    contact: payload.profile.contact,
    gender: payload.profile.gender,
    age_range: payload.profile.ageRange,
    driving_years: payload.profile.drivingYears,
    driving_level: payload.profile.drivingLevel,
    predicted_code: payload.profile.predictedCode ?? null,
    result_code: payload.result.code,
    base_code: payload.result.baseCode,
    mode_key: payload.result.modeKey,
    positions: payload.result.positions,
    scores: payload.result.scores,
    user_agent:
      typeof navigator !== "undefined" ? navigator.userAgent : null,
  };

  const { data, error } = await supabase
    .from("dbti_responses")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("[DBTI] Supabase insert error:", error);
    return { ok: false, mode: "supabase", error: error.message };
  }

  if (isBrowser()) {
    try {
      window.sessionStorage.setItem(RESULT_SAVED_KEY, payload.result.code);
    } catch {
      /* noop */
    }
  }

  return { ok: true, mode: "supabase", id: data?.id };
}
