import { useState, useMemo, useCallback, useEffect } from "react";
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
type GameState = "idle" | "picking" | "revealed";

type Round = {
  a: CountryPrices;
  b: CountryPrices;
  fuel: { key: FuelKey; label: string };
  cheaperCountry: string;
};

type Props = {
  data: LatestEurope | null;
  loading: boolean;
};

const FUELS: { key: FuelKey; label: string }[] = [
  { key: "gasoline95_eur", label: "Petrol 95" },
  { key: "diesel_eur", label: "Diesel" },
];

function pickTwo(arr: CountryPrices[]): [CountryPrices, CountryPrices] {
  const copy = [...arr];
  const iA = Math.floor(Math.random() * copy.length);
  const [a] = copy.splice(iA, 1);
  const iB = Math.floor(Math.random() * copy.length);
  return [a, copy[iB]];
}

const STREAK_MESSAGES: Record<number, string> = {
  3: "🔥 3 in a row!",
  5: "🔥🔥 5 in a row — you know your fuel markets!",
  7: "💥 7 in a row — seriously impressive!",
  10: "🏆 10 in a row — fuel price expert!",
};

export default function FuelQuizPage({ data, loading }: Props) {
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [selected, setSelected] = useState<string | null>(null);
  const [round, setRound] = useState<Round | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const eligible = useMemo(() => {
    if (!data) return [];
    return data.countries.filter(
      (c) => typeof c.gasoline95_eur === "number" && typeof c.diesel_eur === "number"
    );
  }, [data]);

  const newRound = useCallback(() => {
    if (eligible.length < 2) return;
    const [a, b] = pickTwo(eligible);
    const fuel = FUELS[Math.floor(Math.random() * FUELS.length)];
    const priceA = a[fuel.key] as number;
    const priceB = b[fuel.key] as number;
    setRound({ a, b, fuel, cheaperCountry: priceA <= priceB ? a.country : b.country });
    setGameState("picking");
    setSelected(null);
    setLastCorrect(null);
  }, [eligible]);

  // Start the first round once data arrives. Deferred a tick so the state
  // updates don't cascade synchronously inside the effect.
  useEffect(() => {
    if (eligible.length < 2 || gameState !== "idle") return;
    const id = setTimeout(newRound, 0);
    return () => clearTimeout(id);
  }, [eligible, gameState, newRound]);

  const handlePick = (country: string) => {
    if (gameState !== "picking" || !round) return;
    const correct = country === round.cheaperCountry;
    setSelected(country);
    setGameState("revealed");
    setLastCorrect(correct);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (correct) {
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const accuracy =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : null;

  const streakMessage =
    lastCorrect && streak >= 3
      ? STREAK_MESSAGES[streak] ?? `🔥 ${streak} in a row!`
      : null;

  if (loading) {
    return (
      <div className="quizPage">
        <div className="quizHeader">
          <h1 className="quizTitle">⛽ Fuel Price Quiz</h1>
          <p className="quizSubtitle">Loading live fuel data…</p>
        </div>
      </div>
    );
  }

  if (!data || eligible.length < 2) {
    return (
      <div className="quizPage">
        <div className="quizHeader">
          <h1 className="quizTitle">⛽ Fuel Price Quiz</h1>
          <p className="quizSubtitle">
            Could not load fuel data. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="quizPage">
      <div className="quizHeader">
        <h1 className="quizTitle">⛽ Fuel Price Quiz</h1>
        <p className="quizSubtitle">
          Guess which country has cheaper fuel — using live price data.
        </p>
      </div>

      <div className="quizStats">
        <div className="quizStat">
          <span className="quizStatValue">
            {score.correct}/{score.total}
          </span>
          <span className="quizStatLabel">Score</span>
        </div>
        <div className="quizStat">
          <span className="quizStatValue">
            {streak > 0 ? `🔥 ${streak}` : "—"}
          </span>
          <span className="quizStatLabel">Streak</span>
        </div>
        <div className="quizStat">
          <span className="quizStatValue">
            {accuracy !== null ? `${accuracy}%` : "—"}
          </span>
          <span className="quizStatLabel">Accuracy</span>
        </div>
        <div className="quizStat">
          <span className="quizStatValue">{bestStreak > 0 ? bestStreak : "—"}</span>
          <span className="quizStatLabel">Best streak</span>
        </div>
      </div>

      {round && (
        <div className="quizGame">
          <p className="quizQuestion">
            Which country has cheaper <strong>{round.fuel.label}</strong> right now?
          </p>

          <div className="quizBattle">
            {([round.a, round.b] as const).map((country, idx) => {
              const price = country[round.fuel.key] as number;
              const isCheaper = country.country === round.cheaperCountry;
              const isSelected = selected === country.country;
              const isRevealed = gameState === "revealed";

              let cardClass = "quizCard";
              if (isRevealed) {
                cardClass += isCheaper ? " quizCardCorrect" : " quizCardWrong";
              }
              if (isSelected) cardClass += " quizCardSelected";

              return (
                <>
                  {idx === 1 && (
                    <div key="vs" className="quizVs">VS</div>
                  )}
                  <button
                    key={country.country}
                    className={cardClass}
                    onClick={() => handlePick(country.country)}
                    disabled={isRevealed}
                    aria-label={`Pick ${country.country}`}
                  >
                    <span className="quizCardFlag">
                      {FLAGS[country.country] ?? "🏳️"}
                    </span>
                    <span className="quizCardName">{country.country}</span>
                    {isRevealed && (
                      <>
                        <span className="quizCardPrice">€{price.toFixed(3)}/L</span>
                        <span className="quizCardBadge">
                          {isCheaper ? "✓ Cheaper" : "✗ Pricier"}
                        </span>
                      </>
                    )}
                  </button>
                </>
              );
            })}
          </div>

          {gameState === "revealed" && (
            <div
              className={`quizFeedback ${lastCorrect ? "quizFeedbackCorrect" : "quizFeedbackWrong"}`}
            >
              {streakMessage ??
                (lastCorrect
                  ? "✓ Correct!"
                  : `✗ Wrong — ${round.cheaperCountry} is cheaper at €${(round[round.a.country === round.cheaperCountry ? "a" : "b"][round.fuel.key] as number).toFixed(3)}/L`)}
            </div>
          )}

          {gameState === "revealed" && (
            <button className="btn btn-primary quizNextBtn" onClick={newRound}>
              Next question →
            </button>
          )}
        </div>
      )}

      <AdBar adClient="ca-pub-2653462201538649" adSlot="5789581249" />

      <article className="contentPage">
        <section className="contentSection">
          <h2 className="contentHeading">How the quiz works</h2>
          <p className="contentBody">
            Each question shows two countries from the live fuel price data tracked
            on this site. Pick the one you think has cheaper fuel — petrol or diesel
            — and find out how well you know the European fuel market.
          </p>
          <p className="contentBody">
            Prices are country-level averages in EUR per liter, the same data shown
            in the comparison tools and rankings. Questions are randomized and use the
            most recently fetched prices, so the correct answer can change as fuel
            markets move.
          </p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">Why fuel prices differ so much between countries</h2>
          <p className="contentBody">
            The biggest surprise most people have when playing this quiz is discovering
            how wide the price gaps are — and that the differences are almost entirely
            driven by government tax policy, not the underlying cost of crude oil.
            Every country in Europe buys from the same global commodity markets, but
            excise duties and VAT rates vary enormously.
          </p>
          <p className="contentBody">
            A country like Kosovo or Albania tends to have very low excise rates,
            keeping pump prices below €1.50/L for diesel. A country like Italy or
            the United Kingdom layers decades of accumulated excise duties — some
            originally introduced as "temporary" levies — onto the same base product,
            pushing prices past €1.70–1.90/L. The crude oil cost is roughly the same.
            The tax wedge is not.
          </p>
          <p className="contentBody">
            LPG (autogas) is an even more extreme example: in countries that actively
            promote it as an alternative fuel, prices can be half or less of petrol.
            In countries with minimal LPG infrastructure, the fuel is barely sold at
            all. Tax incentives and infrastructure investment, not production costs,
            explain the variation.
          </p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">Tips to improve your score</h2>
          <p className="contentBody">
            A few rules of thumb that hold up well in this quiz:
          </p>
          <ul className="contentList">
            <li>
              <strong>Balkan countries are almost always cheaper than Western European ones.</strong>{" "}
              Albania, Kosovo, North Macedonia, and Montenegro consistently sit at the
              lower end of the European price range due to lower excise duties.
            </li>
            <li>
              <strong>Italy and the UK are usually expensive.</strong>{" "}
              Italy carries some of the highest excise duties in the EU. The UK has
              one of the highest fuel duty rates globally, at over 52p per liter
              before VAT is added.
            </li>
            <li>
              <strong>Switzerland surprises people.</strong>{" "}
              Despite its high cost of living, Swiss fuel is often moderately priced
              in EUR terms because its excise duty on fuel is lower than neighboring
              EU countries.
            </li>
            <li>
              <strong>Diesel and petrol don't always move together.</strong>{" "}
              Some countries tax diesel more lightly than petrol to support
              commercial transport. Others have equalized or reversed this, making
              diesel more expensive. Knowing which fuel type the question asks about
              matters.
            </li>
            <li>
              <strong>Kosovo uses the Euro directly.</strong>{" "}
              No exchange rate conversion is needed for Kosovo prices, which makes
              comparisons with Albania especially direct.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
