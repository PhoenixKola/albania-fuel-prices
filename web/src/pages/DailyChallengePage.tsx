import { useState, useMemo, useEffect, useCallback } from "react";
import type { LatestEurope, CountryPrices } from "../models/fuel";
import AdBar from "../components/ads/AdBar";

const FLAGS: Record<string, string> = {
  Albania: "🇦🇱",
  Kosovo: "🇽🇰",
  Montenegro: "🇲🇪",
  "North Macedonia": "🇲🇰",
  Greece: "🇬🇷",
  Italy: "🇮🇹",
  Croatia: "🇭🇷",
  Portugal: "🇵🇹",
  Switzerland: "🇨🇭",
  "United Kingdom": "🇬🇧",
};

type FuelKey = "gasoline95_eur" | "diesel_eur";

const FUELS: { key: FuelKey; label: string }[] = [
  { key: "gasoline95_eur", label: "Petrol 95" },
  { key: "diesel_eur", label: "Diesel" },
];

const STORAGE_KEY = "fuel-daily-v1";
const QUESTIONS_PER_DAY = 5;

type DailyResult = {
  dayKey: number;
  answers: boolean[];
  streak: number;
};

type Question = {
  aIdx: number;
  bIdx: number;
  fuelIdx: number;
};

// Mulberry32 seeded RNG — deterministic per dayKey
function mulberry32(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDayKey(): number {
  return Math.floor(Date.now() / 86400000);
}

function generateQuestions(dayKey: number, countryCount: number): Question[] {
  const rng = mulberry32(dayKey * 9301 + 49297);
  const questions: Question[] = [];
  for (let i = 0; i < QUESTIONS_PER_DAY; i++) {
    const aIdx = Math.floor(rng() * countryCount);
    let bIdx = Math.floor(rng() * (countryCount - 1));
    if (bIdx >= aIdx) bIdx++;
    const fuelIdx = Math.floor(rng() * FUELS.length);
    questions.push({ aIdx, bIdx, fuelIdx });
  }
  return questions;
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function loadResult(): DailyResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DailyResult;
  } catch {
    return null;
  }
}

function saveResult(result: DailyResult) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {}
}

type Props = {
  data: LatestEurope | null;
  loading: boolean;
};

export default function DailyChallengePage({ data, loading }: Props) {
  const dayKey = useMemo(() => getDayKey(), []);

  const [savedResult, setSavedResult] = useState<DailyResult | null>(() => loadResult());
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(() => getSecondsUntilMidnight());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setCountdown(getSecondsUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  const eligible = useMemo(() => {
    if (!data) return [];
    return data.countries
      .filter((c) => typeof c.gasoline95_eur === "number" && typeof c.diesel_eur === "number")
      .map((c) => c.country)
      .sort();
  }, [data]);

  const questions = useMemo(
    () => (eligible.length >= 2 ? generateQuestions(dayKey, eligible.length) : []),
    [dayKey, eligible.length]
  );

  const countryMap = useMemo(() => {
    if (!data) return new Map<string, CountryPrices>();
    return new Map(data.countries.map((c) => [c.country, c]));
  }, [data]);

  const isAlreadyCompleted = savedResult?.dayKey === dayKey;

  const displayAnswers = isAlreadyCompleted
    ? savedResult.answers
    : showResults
    ? answers
    : null;

  const correctCount = displayAnswers ? displayAnswers.filter(Boolean).length : 0;
  const emojiGrid = displayAnswers
    ? displayAnswers.map((a) => (a ? "✅" : "❌")).join("")
    : "";

  const displayStreak = isAlreadyCompleted
    ? savedResult.streak
    : showResults
    ? (savedResult?.streak ?? 1)
    : 0;

  const shareText = `⛽ Fuel Daily Challenge — Day ${dayKey}\n${emojiGrid} — ${correctCount}/${QUESTIONS_PER_DAY}\nkarburantisot.com/daily-challenge`;

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [shareText]);

  const handlePick = (country: string) => {
    if (revealed || questions.length === 0) return;
    const q = questions[currentQ];
    const fuel = FUELS[q.fuelIdx];
    const cA = countryMap.get(eligible[q.aIdx]);
    const cB = countryMap.get(eligible[q.bIdx]);
    if (!cA || !cB) return;
    const priceA = cA[fuel.key] as number;
    const priceB = cB[fuel.key] as number;
    const cheaperCountry = priceA <= priceB ? cA.country : cB.country;
    const correct = country === cheaperCountry;

    setPicked(country);
    setRevealed(true);

    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);

    if (newAnswers.length === QUESTIONS_PER_DAY) {
      const prev = loadResult();
      const streak = prev?.dayKey === dayKey - 1 ? prev.streak + 1 : 1;
      const result: DailyResult = { dayKey, answers: newAnswers, streak };
      saveResult(result);
      setSavedResult(result);
    }
  };

  const handleNext = () => {
    setPicked(null);
    setRevealed(false);
    setCurrentQ((q) => q + 1);
  };

  if (loading) {
    return (
      <div className="quizPage">
        <div className="quizHeader">
          <h1 className="quizTitle">📅 Daily Challenge</h1>
          <p className="quizSubtitle">Loading live fuel data…</p>
        </div>
      </div>
    );
  }

  if (!data || eligible.length < 2) {
    return (
      <div className="quizPage">
        <div className="quizHeader">
          <h1 className="quizTitle">📅 Daily Challenge</h1>
          <p className="quizSubtitle">Could not load fuel data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  // Results screen
  if (isAlreadyCompleted || showResults) {
    return (
      <div className="quizPage">
        <div className="quizHeader">
          <h1 className="quizTitle">📅 Daily Challenge</h1>
          <p className="quizSubtitle">Come back tomorrow for a new set of questions.</p>
        </div>

        <div className="dailyResults">
          <div className="dailyResultEmoji">{emojiGrid}</div>
          <div className="dailyScore">
            {correctCount} / {QUESTIONS_PER_DAY} correct
          </div>
          {displayStreak > 1 && (
            <div className="dailyStreak">🔥 {displayStreak}-day streak!</div>
          )}
          <button className="btn btn-primary dailyShareBtn" onClick={handleShare}>
            {copied ? "✓ Copied to clipboard!" : "Share result"}
          </button>
          <div className="dailyCountdownWrap">
            <span className="dailyCountdownLabel">Next challenge in</span>
            <span className="dailyCountdown">{formatCountdown(countdown)}</span>
          </div>
        </div>

        {questions.length > 0 && displayAnswers && (
          <div className="dailyReview">
            <h2 className="dailyReviewTitle">Today's answers</h2>
            {displayAnswers.map((correct, i) => {
              const q = questions[i];
              if (!q) return null;
              const fuel = FUELS[q.fuelIdx];
              const cA = countryMap.get(eligible[q.aIdx]);
              const cB = countryMap.get(eligible[q.bIdx]);
              if (!cA || !cB) return null;
              const priceA = cA[fuel.key] as number;
              const priceB = cB[fuel.key] as number;
              const cheaperCountry = priceA <= priceB ? cA.country : cB.country;
              return (
                <div key={i} className={`dailyReviewRow ${correct ? "dailyReviewCorrect" : "dailyReviewWrong"}`}>
                  <span className="dailyReviewMark">{correct ? "✅" : "❌"}</span>
                  <span className="dailyReviewText">
                    <strong>{fuel.label}:</strong>{" "}
                    {FLAGS[cA.country] ?? ""} {cA.country} (€{priceA.toFixed(3)}) vs {FLAGS[cB.country] ?? ""} {cB.country} (€{priceB.toFixed(3)}) — cheaper: <strong>{cheaperCountry}</strong>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <AdBar adClient="ca-pub-2653462201538649" adSlot="5789581249" />

        <article className="contentPage">
          <section className="contentSection">
            <h2 className="contentHeading">How the daily challenge works</h2>
            <p className="contentBody">
              Every day at midnight UTC a fresh set of 5 questions is generated using a
              seeded algorithm tied to the day's date — so everyone who plays on the same
              day gets the exact same questions in the same order. Prices shown are the
              same live country-level averages used across the rest of the site.
            </p>
            <p className="contentBody">
              Your result is stored locally in your browser. A streak is awarded for
              completing the challenge on consecutive days. Results can be shared as an
              emoji grid — no scores are sent to a server.
            </p>
          </section>
        </article>
      </div>
    );
  }

  // Active challenge
  const q = questions[currentQ];
  const fuel = FUELS[q.fuelIdx];
  const cA = countryMap.get(eligible[q.aIdx]);
  const cB = countryMap.get(eligible[q.bIdx]);

  if (!cA || !cB) return null;

  const priceA = cA[fuel.key] as number;
  const priceB = cB[fuel.key] as number;
  const cheaperCountry = priceA <= priceB ? cA.country : cB.country;
  const isLastQ = currentQ + 1 === QUESTIONS_PER_DAY;

  return (
    <div className="quizPage">
      <div className="quizHeader">
        <h1 className="quizTitle">📅 Daily Challenge</h1>
        <p className="quizSubtitle">
          5 questions — same for everyone today, resets at midnight
        </p>
      </div>

      <div className="dailyProgress">
        {Array.from({ length: QUESTIONS_PER_DAY }).map((_, i) => {
          let cls = "dailyDot";
          if (i < answers.length) {
            cls += answers[i] ? " dailyDotCorrect" : " dailyDotWrong";
          } else if (i === currentQ) {
            cls += " dailyDotCurrent";
          }
          return <span key={i} className={cls} />;
        })}
      </div>

      <div className="quizGame">
        <p className="quizQuestion">
          Question {currentQ + 1} of {QUESTIONS_PER_DAY} — Which country has cheaper{" "}
          <strong>{fuel.label}</strong>?
        </p>

        <div className="quizBattle">
          <button
            className={`quizCard${revealed ? (cA.country === cheaperCountry ? " quizCardCorrect" : " quizCardWrong") : ""}${picked === cA.country ? " quizCardSelected" : ""}`}
            onClick={() => handlePick(cA.country)}
            disabled={revealed}
            aria-label={`Pick ${cA.country}`}
          >
            <span className="quizCardFlag">{FLAGS[cA.country] ?? "🏳️"}</span>
            <span className="quizCardName">{cA.country}</span>
            {revealed && (
              <>
                <span className="quizCardPrice">€{priceA.toFixed(3)}/L</span>
                <span className="quizCardBadge">
                  {cA.country === cheaperCountry ? "✓ Cheaper" : "✗ Pricier"}
                </span>
              </>
            )}
          </button>

          <div className="quizVs">VS</div>

          <button
            className={`quizCard${revealed ? (cB.country === cheaperCountry ? " quizCardCorrect" : " quizCardWrong") : ""}${picked === cB.country ? " quizCardSelected" : ""}`}
            onClick={() => handlePick(cB.country)}
            disabled={revealed}
            aria-label={`Pick ${cB.country}`}
          >
            <span className="quizCardFlag">{FLAGS[cB.country] ?? "🏳️"}</span>
            <span className="quizCardName">{cB.country}</span>
            {revealed && (
              <>
                <span className="quizCardPrice">€{priceB.toFixed(3)}/L</span>
                <span className="quizCardBadge">
                  {cB.country === cheaperCountry ? "✓ Cheaper" : "✗ Pricier"}
                </span>
              </>
            )}
          </button>
        </div>

        {revealed && (
          <div
            className={`quizFeedback ${picked === cheaperCountry ? "quizFeedbackCorrect" : "quizFeedbackWrong"}`}
          >
            {picked === cheaperCountry
              ? "✓ Correct!"
              : `✗ Wrong — ${cheaperCountry} is cheaper at €${Math.min(priceA, priceB).toFixed(3)}/L`}
          </div>
        )}

        {revealed && (
          <button
            className="btn btn-primary quizNextBtn"
            onClick={isLastQ ? () => setShowResults(true) : handleNext}
          >
            {isLastQ ? "See results →" : "Next question →"}
          </button>
        )}
      </div>
    </div>
  );
}
