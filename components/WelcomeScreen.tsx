"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ANIMALS } from "@/data/animals";
import type {
  AgeRange,
  DrivingLevel,
  DrivingYears,
  Gender,
  UserProfile,
} from "@/types";
import { loadProfileLocal, saveProfileLocal } from "@/lib/supabase";

/**
 * 인테이크 폼 — 시작 페이지 (PRD v2 보강)
 *
 * 1. 닉네임 / 연락처
 * 2. 성별 / 연령대
 * 3. 운전경력 (년수) / 수준
 * 4. 16 동물 그리드 → 예상 DBTI 선택
 *
 * 제출 시 sessionStorage(dbti.profile) 저장 후 /test 이동.
 */

const GENDERS: { value: Gender; label: string }[] = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "other", label: "선택 안 함" },
];
const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: "10s", label: "10대" },
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s", label: "40대" },
  { value: "50s", label: "50대" },
  { value: "60s+", label: "60대 이상" },
];
const DRIVING_YEARS: { value: DrivingYears; label: string }[] = [
  { value: "<1", label: "1년 미만" },
  { value: "1-3", label: "1~3년" },
  { value: "3-5", label: "3~5년" },
  { value: "5-10", label: "5~10년" },
  { value: "10+", label: "10년 이상" },
];
const DRIVING_LEVELS: { value: DrivingLevel; label: string; desc: string }[] = [
  { value: "beginner", label: "초보", desc: "고속도로·합류가 부담" },
  { value: "familiar", label: "익숙", desc: "일상 주행은 무리 없음" },
  { value: "expert", label: "전문가", desc: "악천후·장거리도 자신 있음" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const animals = Object.values(ANIMALS);

  const [nickname, setNickname] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [drivingYears, setDrivingYears] = useState<DrivingYears | "">("");
  const [drivingLevel, setDrivingLevel] = useState<DrivingLevel | "">("");
  const [predictedCode, setPredictedCode] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 저장된 프로필이 있으면 복원
  useEffect(() => {
    const saved = loadProfileLocal();
    if (saved) {
      setNickname(saved.nickname ?? "");
      setContact(saved.contact ?? "");
      setGender(saved.gender ?? "");
      setAgeRange(saved.ageRange ?? "");
      setDrivingYears(saved.drivingYears ?? "");
      setDrivingLevel(saved.drivingLevel ?? "");
      setPredictedCode(saved.predictedCode ?? "");
    }
  }, []);

  const required = [
    nickname.trim(),
    contact.trim(),
    gender,
    ageRange,
    drivingYears,
    drivingLevel,
  ];
  const allRequiredFilled = required.every((v) => v !== "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!allRequiredFilled) {
      setError("모든 필수 항목을 입력해 주세요.");
      return;
    }
    if (nickname.trim().length < 2) {
      setError("닉네임은 2자 이상 입력해 주세요.");
      return;
    }

    const profile: UserProfile = {
      nickname: nickname.trim(),
      contact: contact.trim(),
      gender: gender as Gender,
      ageRange: ageRange as AgeRange,
      drivingYears: drivingYears as DrivingYears,
      drivingLevel: drivingLevel as DrivingLevel,
      predictedCode: predictedCode || undefined,
      createdAt: new Date().toISOString(),
    };

    setSubmitting(true);
    saveProfileLocal(profile);
    router.push("/test");
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      {/* 헤더 */}
      <header className="mb-8 text-center md:mb-12">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-coral/10 px-4 py-1.5 text-xs font-medium text-coral-dark md:text-sm">
          <span className="h-2 w-2 rounded-full bg-coral" />
          Driving Behavior Type Indicator
        </span>
        <h1 className="font-display text-4xl leading-tight text-slate-ink md:text-6xl">
          DBTI Lab
        </h1>
        <p className="mt-2 font-accent text-lg text-slate-soft md:text-xl">
          나는 어떤 운전자일까?
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-soft md:text-base">
          간단한 정보를 입력한 뒤, 35개 문항으로 운전 성향을 진단합니다.
          <br className="hidden md:inline" />
          시작 전에 본인이 어떤 동물일지 한 번 예상해 보세요!
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl bg-white p-6 shadow-card md:space-y-8 md:p-8"
      >
        {/* 1. 닉네임 / 연락처 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <Field
            label="닉네임 또는 이름"
            required
            hint="결과 페이지에 표시됩니다"
          >
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 홍길동"
              maxLength={20}
              className="input"
              required
            />
          </Field>
          <Field
            label="연락처 또는 이메일"
            required
            hint="결과 안내용 (외부 공유 안 함)"
          >
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="example@mail.com 또는 010-..."
              className="input"
              required
            />
          </Field>
        </div>

        {/* 2. 성별 / 연령대 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <Field label="성별" required>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <Pill
                  key={g.value}
                  active={gender === g.value}
                  onClick={() => setGender(g.value)}
                >
                  {g.label}
                </Pill>
              ))}
            </div>
          </Field>
          <Field label="연령대" required>
            <div className="flex flex-wrap gap-2">
              {AGE_RANGES.map((a) => (
                <Pill
                  key={a.value}
                  active={ageRange === a.value}
                  onClick={() => setAgeRange(a.value)}
                >
                  {a.label}
                </Pill>
              ))}
            </div>
          </Field>
        </div>

        {/* 3. 운전경력 / 수준 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <Field label="운전 경력" required>
            <div className="flex flex-wrap gap-2">
              {DRIVING_YEARS.map((y) => (
                <Pill
                  key={y.value}
                  active={drivingYears === y.value}
                  onClick={() => setDrivingYears(y.value)}
                >
                  {y.label}
                </Pill>
              ))}
            </div>
          </Field>
          <Field label="운전 수준" required>
            <div className="flex flex-col gap-2">
              {DRIVING_LEVELS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setDrivingLevel(l.value)}
                  className={`rounded-2xl border-2 px-4 py-2.5 text-left transition ${
                    drivingLevel === l.value
                      ? "border-coral bg-coral/5"
                      : "border-line bg-white hover:border-coral/40"
                  }`}
                >
                  <div className="font-accent text-sm text-slate-ink">
                    {l.label}
                  </div>
                  <div className="text-xs text-slate-mute">{l.desc}</div>
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* 4. 동물 예상 선택 */}
        <Field
          label="나의 DBTI 예상 (선택)"
          hint="아래 16 캐릭터 중 본인일 것 같은 동물을 골라 보세요. 결과 비교에 사용됩니다."
        >
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {animals.map((a) => {
              const active = predictedCode === a.code;
              return (
                <button
                  key={a.code}
                  type="button"
                  onClick={() =>
                    setPredictedCode(active ? "" : a.code)
                  }
                  className={`group flex flex-col rounded-2xl border-2 p-3 text-left transition ${
                    active
                      ? "border-coral bg-coral/5 shadow-coral"
                      : "border-line bg-white hover:border-coral/40 hover:bg-coral/5"
                  }`}
                  title={a.tag}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{a.emoji}</span>
                    <div className="flex flex-col">
                      <span className="font-accent text-[11px] tracking-wider text-coral-dark">
                        {a.code}
                      </span>
                      <span className="text-[11px] text-slate-mute">
                        {a.english}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 font-accent text-sm text-slate-ink">
                    {a.name}
                  </div>
                  <div className="mt-1 text-[11px] leading-snug text-slate-soft">
                    {a.tag}
                  </div>
                </button>
              );
            })}
          </div>
          {predictedCode && (
            <p className="mt-3 rounded-xl bg-coral/10 px-3 py-2 text-xs text-coral-dark">
              예상 선택: <strong>{predictedCode}</strong> ·{" "}
              {ANIMALS[predictedCode].english} ({ANIMALS[predictedCode].name})
            </p>
          )}
        </Field>

        {/* 에러 / 제출 */}
        {error && (
          <div className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral-dark">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !allRequiredFilled}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-8 py-3.5 font-accent text-base text-white shadow-coral transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-40 md:text-lg"
          >
            테스트 시작하기
            <span aria-hidden>→</span>
          </button>
          <p className="text-xs text-slate-mute">
            약 5분 소요 · 35문항 · 결과는 친구와 공유 가능
          </p>
        </div>
      </form>

      <p className="mt-8 text-center text-xs leading-relaxed text-slate-mute">
        ※ 본 테스트는 재미용입니다. 의학적·법적 진단이 아니며, 입력하신 정보는
        DBTI Lab 통계·결과 안내 외 용도로 사용되지 않습니다.
      </p>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 2px solid #eae3d2;
          background: white;
          padding: 0.625rem 0.875rem;
          font-size: 0.95rem;
          color: #2d3142;
          transition: border-color 0.15s ease;
        }
        :global(.input:focus) {
          border-color: #ff7a45;
          outline: none;
        }
        :global(.input::placeholder) {
          color: #9094a8;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-baseline gap-2">
        <span className="font-accent text-sm text-slate-ink md:text-base">
          {label}
        </span>
        {required && (
          <span className="text-[10px] font-semibold text-coral">필수</span>
        )}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-[11px] leading-snug text-slate-mute">
          {hint}
        </p>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-4 py-1.5 text-sm transition ${
        active
          ? "border-coral bg-coral text-white shadow-coral"
          : "border-line bg-white text-slate-soft hover:border-coral/40 hover:text-coral-dark"
      }`}
    >
      {children}
    </button>
  );
}
