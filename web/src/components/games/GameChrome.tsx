import { getFlagImgUrl, getIso2ForCountry } from "../../utils/countryFlag";

type GameVariant = "quiz" | "daily";

export function GameCountryFlag({ name }: { name: string }) {
  const iso2 = getIso2ForCountry(name);
  if (!iso2) return <span className="quizCardFlag" aria-hidden="true" />;
  return <img className="quizCardFlagImg" src={getFlagImgUrl(iso2)} alt="" aria-hidden="true" />;
}

function GameGlyph({ variant }: { variant: GameVariant }) {
  return variant === "daily" ? (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="11" y="14" width="42" height="39" rx="11" />
      <path d="M20 9v11M44 9v11M11 25h42M22 34h6M36 34h6M22 43h6M36 43h6" />
    </svg>
  ) : (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M17 52V17a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v35M17 28h30M24 20h16M47 20h5l5 8v14a5 5 0 0 1-10 0v-8" />
      <path d="M11 52h42" />
    </svg>
  );
}

export function GameHeader({
  variant,
  eyebrow,
  title,
  subtitle,
  status,
}: {
  variant: GameVariant;
  eyebrow: string;
  title: string;
  subtitle: string;
  status: string;
}) {
  return (
    <header className={`gameHero gameHero-${variant}`}>
      <div className="gameHeroCopy">
        <span className="gameEyebrow"><i aria-hidden="true" />{eyebrow}</span>
        <h1 className="quizTitle">{title}</h1>
        <p className="quizSubtitle">{subtitle}</p>
        <div className="gameHeroMeta">
          <span><i aria-hidden="true" />{status}</span>
          <span>{variant === "daily" ? "One run every day" : "Unlimited live matchups"}</span>
        </div>
      </div>
      <div className="gameInstrument" aria-hidden="true">
        <svg className="gameInstrumentTrace" viewBox="0 0 260 180" fill="none">
          <path d="M6 132C52 132 50 73 90 73s42 46 78 46 38-78 86-78" />
          <path d="M7 151h246M22 20v138M68 20v138M114 20v138M160 20v138M206 20v138" />
        </svg>
        <span className="gameInstrumentHalo" />
        <span className="gameInstrumentCore"><GameGlyph variant={variant} /></span>
        <span className="gameInstrumentValue">{variant === "daily" ? "05" : "VS"}</span>
        <span className="gameInstrumentLabel">{variant === "daily" ? "DAILY RUN" : "PRICE IQ"}</span>
      </div>
    </header>
  );
}

export function GameChoice({
  country,
  price,
  option,
  revealed,
  cheaper,
  selected,
  onPick,
}: {
  country: string;
  price: number;
  option: string;
  revealed: boolean;
  cheaper: boolean;
  selected: boolean;
  onPick: () => void;
}) {
  const classes = [
    "quizCard",
    revealed && (cheaper ? "quizCardCorrect" : "quizCardWrong"),
    selected && "quizCardSelected",
  ].filter(Boolean).join(" ");

  return (
    <button className={classes} data-market={option.endsWith("B") ? "b" : "a"} onClick={onPick} disabled={revealed} aria-label={`Pick ${country}`}>
      <span className="quizCardTopline"><span>{option}</span><i aria-hidden="true" /></span>
      <span className="quizCardFlagFrame"><GameCountryFlag name={country} /></span>
      <span className="quizCardName">{country}</span>
      {revealed ? (
        <span className="quizCardReveal">
          <span className="quizCardPrice">€{price.toFixed(3)}<small>/L</small></span>
          <span className="quizCardBadge">{cheaper ? "✓ Cheaper" : "× Pricier"}</span>
        </span>
      ) : <span className="quizCardAction">Choose this market <i aria-hidden="true">→</i></span>}
    </button>
  );
}
