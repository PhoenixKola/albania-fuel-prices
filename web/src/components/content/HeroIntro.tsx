import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Lang } from "../../models/i18n";
import { FUEL_TYPES, type CountryPrices, type FuelType, type LatestEurope } from "../../models/fuel";
import type { TDict } from "../../locales";
import type { Currency } from "../../models/currency";
import type { FxRates } from "../../utils/currency";
import { fuelLabel, getEurPrice } from "../../utils/fuel";
import { formatFuelPrice } from "../../utils/priceDisplay";
import { getFlagImgUrl, getIso2ForCountry } from "../../utils/countryFlag";
import TripSelect from "./TripSelect";
import HeroSceneFallback from "./hero/HeroSceneFallback";
import type { HeroCta, HeroFocus, HeroMarker, HeroStage, HeroTheme, HeroVariant } from "./hero/heroSceneTypes";

// Client-only, loaded after first paint: the static hero and board never wait on WebGL.
const HeroScene = lazy(() => import("./hero/HeroScene"));

export type HomeHeroModel = {
  selectedPrice: number | null;
  country: string;
  fuelType: FuelType;
  rank: number | null;
  marketTotal: number;
  europeanAverage: number | null;
  averageDifference: number | null;
  weeklyDelta: number | null;
  updatedAt: string | null;
};

export type HomeFreshness = {
  state: "current" | "stale" | "unknown";
  shortLabel: string;
  detail: string;
};

type HeroIntroProps = {
  t: TDict;
  lang: Lang;
  model: HomeHeroModel;
  data: LatestEurope | null;
  selected: CountryPrices | null;
  countries: string[];
  currency: Currency;
  fxRates: FxRates | null;
  freshness: HomeFreshness;
  onSelectCountry: (country: string) => void;
  onSelectFuel: (fuel: FuelType) => void;
};

const copy = {
  en: {
    board: "Roadside price board",
    national: "National reference",
    dated: "Prices dated",
    source: "Source",
    scope: "Country-level reference values. Individual pump prices vary.",
    selectMarket: "Choose market",
    selected: "Selected",
    marketPosition: "European position",
    versusAverage: "vs Europe average",
    week: "7-day movement",
  },
  sq: {
    board: "Tabela e çmimeve në rrugë",
    national: "Vlerë orientuese kombëtare",
    dated: "Çmimet më",
    source: "Burimi",
    scope: "Vlera orientuese kombëtare. Çmimet në pompa të veçanta ndryshojnë.",
    selectMarket: "Zgjidh tregun",
    selected: "Zgjedhur",
    marketPosition: "Pozicioni në Evropë",
    versusAverage: "kundrejt mesatares evropiane",
    week: "Lëvizja 7-ditore",
  },
} as const;

/** Real neighbouring markets shown along the route, nearest first. Only those present in the dataset are used. */
const ROUTE_CONTEXT = ["Albania", "Kosovo", "Greece", "Italy", "Montenegro", "Serbia", "North Macedonia"];
const CONTEXT_COUNT: Record<HeroVariant, number> = { desktop: 2, tablet: 1, mobile: 0 };
/** If the 3D chunk hasn't started by then, the board resolves without the intro. */
const BOOT_TIMEOUT_MS = 900;

function formatDate(value: string | undefined, lang: Lang, fallback: string) {
  if (!value) return fallback;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString(lang === "sq" ? "sq-AL" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function signed(value: number | null) {
  if (value == null || !Number.isFinite(value)) return null;
  if (Math.abs(value) < 0.0005) return "0.000";
  return `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(3)}`;
}

function supportsWebGL() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

function useDocumentTheme(): HeroTheme {
  const read = () => (typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark");
  const [theme, setTheme] = useState<HeroTheme>(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/** A WebGL failure must never take the price board down with it. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroIntro({
  t,
  lang,
  model,
  data,
  selected,
  countries,
  currency,
  fxRates,
  freshness,
  onSelectCountry,
  onSelectFuel,
}: HeroIntroProps) {
  const c = copy[lang];
  const iso2 = getIso2ForCountry(model.country);
  const average = signed(model.averageDifference);
  const week = signed(model.weeklyDelta);
  const date = formatDate(data?.as_of, lang, t.notAvailable);

  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  const isMobile = useMedia("(max-width: 620px)");
  const isStacked = useMedia("(max-width: 1024px)");
  const variant: HeroVariant = isMobile ? "mobile" : isStacked ? "tablet" : "desktop";
  const theme = useDocumentTheme();

  const [webgl] = useState(supportsWebGL);
  const [cinematic] = useState(() => webgl && !(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches));
  const [stage, setStage] = useState<HeroStage>(cinematic ? "boot" : "settled");
  const [loadScene, setLoadScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [skipIntro, setSkipIntro] = useState(!cinematic);
  const [active, setActive] = useState(true);
  const [cta, setCta] = useState<HeroCta>(null);
  const [focus, setFocus] = useState<HeroFocus>({ x: 0.55, y: 0.45 });
  const [sceneSize, setSceneSize] = useState({ width: 0, height: 0 });
  // Sign panels are drawn in the page's own typeface.
  const [fontFamily] = useState(() => (typeof document !== "undefined" && getComputedStyle(document.body).fontFamily) || "system-ui, sans-serif");

  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const introStarted = useRef(false);

  // Load the scene once the page has painted, so text, CTAs and board come first.
  useEffect(() => {
    if (!webgl) return;
    let idle = 0;
    const raf = requestAnimationFrame(() => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idle = ric(() => setLoadScene(true), { timeout: 300 });
      else idle = window.setTimeout(() => setLoadScene(true), 60);
    });
    return () => {
      cancelAnimationFrame(raf);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(idle);
      else clearTimeout(idle);
    };
  }, [webgl]);

  useEffect(() => {
    if (stage !== "boot") return;
    const timer = window.setTimeout(() => {
      if (introStarted.current) return;
      setSkipIntro(true);
      setStage("settled");
    }, BOOT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The destination should land where the board resolves: behind it on
  // desktop, just above it when the hero stacks. Layout offsets ignore the
  // board's intro transform.
  useLayoutEffect(() => {
    const stageEl = stageRef.current;
    const scene = sceneRef.current;
    const board = boardRef.current;
    if (!stageEl || !scene || !board) return;
    const measure = () => {
      const w = scene.offsetWidth;
      const h = scene.offsetHeight;
      if (!w || !h) return;
      setSceneSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
      const bx = board.offsetLeft + board.offsetWidth / 2 - scene.offsetLeft;
      const by = variant === "desktop" ? board.offsetTop + board.offsetHeight * 0.38 - scene.offsetTop : h * 0.8;
      const next = { x: Math.min(0.92, Math.max(0.08, bx / w)), y: Math.min(0.92, Math.max(0.12, by / h)) };
      setFocus((prev) => (Math.abs(prev.x - next.x) < 0.004 && Math.abs(prev.y - next.y) < 0.004 ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stageEl);
    observer.observe(board);
    return () => observer.disconnect();
  }, [variant]);

  const onStage = useCallback((next: HeroStage) => {
    if (next !== "boot") introStarted.current = true;
    setStage((prev) => (prev === "settled" ? prev : next));
  }, []);

  const onHandoff = useCallback((point: { x: number; y: number }) => {
    const board = boardRef.current;
    const scene = sceneRef.current;
    if (!board || !scene) return;
    const hx = scene.offsetLeft + point.x - (board.offsetLeft + board.offsetWidth / 2);
    const hy = scene.offsetTop + point.y - (board.offsetTop + board.offsetHeight / 2);
    board.style.setProperty("--handoff-x", `${Math.round(hx)}px`);
    board.style.setProperty("--handoff-y", `${Math.round(hy)}px`);
  }, []);

  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const onSceneError = useCallback(() => {
    setSceneFailed(true);
    setSkipIntro(true);
    setStage("settled");
  }, []);

  const priceFor = useCallback(
    (row: CountryPrices | null | undefined, countryName: string) => {
      const value = getEurPrice(row ?? null, model.fuelType);
      return value == null ? null : formatFuelPrice(countryName, value, currency, fxRates);
    },
    [model.fuelType, currency, fxRates]
  );

  const destination = useMemo<HeroMarker>(() => {
    const price = priceFor(selected, model.country) ?? "—";
    const code = iso2 ?? model.country.slice(0, 2).toUpperCase();
    return { key: `${model.country}|${model.fuelType}|${price}`, code, price };
  }, [priceFor, selected, model.country, model.fuelType, iso2]);

  const contextMarkers = useMemo<HeroMarker[]>(() => {
    const count = CONTEXT_COUNT[variant];
    if (!count || !data) return [];
    const byName = new Map(data.countries.map((row) => [row.country, row]));
    return ROUTE_CONTEXT.filter((name) => name !== model.country && byName.has(name))
      .map((name) => ({ name, price: priceFor(byName.get(name), name) }))
      .filter((item): item is { name: string; price: string } => item.price != null)
      .slice(0, count)
      .map((item) => {
        const code = getIso2ForCountry(item.name) ?? item.name.slice(0, 2).toUpperCase();
        return { key: `${item.name}|${item.price}`, code, price: item.price };
      });
  }, [variant, data, model.country, priceFor]);

  const showScene = webgl && loadScene && !sceneFailed;
  // Reduced motion switched on mid-visit resolves the hero immediately.
  const shownStage: HeroStage = reducedMotion ? "settled" : stage;
  const sceneSkipsIntro = skipIntro || reducedMotion;
  const ctaHandlers = (value: Exclude<HeroCta, null>) => ({
    onPointerEnter: () => setCta(value),
    onPointerLeave: () => setCta(null),
    onFocus: () => setCta(value),
    onBlur: () => setCta(null),
  });
  const valueKey = `${model.country}|${model.fuelType}`;

  return (
    <section
      ref={heroRef}
      className={`homeJourneyHero${cinematic ? " is-cinematic" : ""}${sceneReady ? " is-scene-ready" : ""}`}
      data-stage={shownStage}
      aria-labelledby="home-hero-title"
    >
      <div className="homeJourneyGrid">
        <div className="homeHeroCopy">
          <div className="homeEyebrow homeHeroEyebrow">
            <span className={`homeStatusDot homeStatusDot-${freshness.state}`} aria-hidden="true" />
            {t.homeCockpitKicker}
          </div>
          <h1 id="home-hero-title" className="homeHeroTitle">{t.homeCockpitTitle}</h1>
          <p className="homeHeroText">{t.homeCockpitSubtitle}</p>
          <div className="homeHeroActions">
            <Link className="homeButton homeButtonPrimary" to="/trip-cost-calculator" {...ctaHandlers("trip")}>
              {t.homeCockpitPrimaryCta}<span aria-hidden="true">↗</span>
            </Link>
            <Link className="homeButton homeButtonGhost" to="/stations" {...ctaHandlers("stations")}>
              {t.homeCockpitSecondaryCta}<span aria-hidden="true">→</span>
            </Link>
          </div>
          <nav className="homeHeroQuickLinks" aria-label={t.homeQuickLinksLabel}>
            <a href="#price-tool">{t.homeAlbaniaPricesCta}</a>
            <Link to="/compare">{t.navCompare}</Link>
            <Link to="/rankings">{t.homeEuropeRankingsCta}</Link>
          </nav>
          <p className="homeHeroScope">{c.scope}</p>
        </div>

        <div ref={stageRef} className="homeHeroStage">
          <div ref={sceneRef} className="homeHeroScene" aria-hidden="true">
            <HeroSceneFallback width={sceneSize.width} height={sceneSize.height} focus={focus} destination={destination} />
            {showScene ? (
              <SceneBoundary onError={onSceneError}>
                <Suspense fallback={null}>
                  <HeroScene
                    variant={variant}
                    theme={theme}
                    reducedMotion={reducedMotion}
                    skipIntro={sceneSkipsIntro}
                    active={active}
                    fuelType={model.fuelType}
                    destination={destination}
                    context={contextMarkers}
                    cta={cta}
                    focus={focus}
                    fontFamily={fontFamily}
                    onStage={onStage}
                    onHandoff={onHandoff}
                    onReady={onSceneReady}
                  />
                </Suspense>
              </SceneBoundary>
            ) : null}
          </div>

          <div ref={boardRef} className="homeRoadBoard" aria-label={`${model.country} ${c.board}`}>
            <div className="homeRoadBoardHeader">
              <div>
                <span className="homeBoardEyebrow">{c.board}</span>
                <strong key={model.country} className="homeBoardResolve">{iso2 ? <img src={getFlagImgUrl(iso2)} alt="" aria-hidden="true" /> : null}{model.country}</strong>
              </div>
              <span className={`homeFreshnessBadge homeFreshnessBadge-${freshness.state}`}>{freshness.shortLabel}</span>
            </div>

            <div className="homeBoardCountrySelect">
              <TripSelect
                label={c.selectMarket}
                value={model.country}
                options={countries.map((country) => ({ value: country, label: country }))}
                onChange={onSelectCountry}
              />
            </div>

            <div className="homeBoardPrices" aria-label={c.national}>
              {FUEL_TYPES.map((fuel) => {
                const value = getEurPrice(selected, fuel);
                const active = fuel === model.fuelType;
                return (
                  <button
                    key={fuel}
                    type="button"
                    className={`homeBoardPrice${active ? " is-selected" : ""}`}
                    aria-pressed={active}
                    onClick={() => onSelectFuel(fuel)}
                  >
                    <span><i aria-hidden="true" />{fuelLabel(t, fuel)}{active ? <small>{c.selected}</small> : null}</span>
                    <strong key={model.country} className="homeBoardResolve">{value == null ? "—" : formatFuelPrice(model.country, value, currency, fxRates)}</strong>
                  </button>
                );
              })}
            </div>

            <dl className="homeBoardSignals">
              <div><dt>{c.marketPosition}</dt><dd key={valueKey} className="homeBoardResolve">{model.rank == null ? t.notAvailable : t.homeGaugeRankValue(model.rank, model.marketTotal)}</dd></div>
              <div><dt>{c.versusAverage}</dt><dd key={valueKey} className={`homeBoardResolve ${model.averageDifference != null && model.averageDifference <= 0 ? "is-good" : "is-warm"}`}>{average == null ? t.notAvailable : `${average} EUR/L`}</dd></div>
              <div><dt>{c.week}</dt><dd key={valueKey} className={`homeBoardResolve ${model.weeklyDelta != null && model.weeklyDelta <= 0 ? "is-good" : "is-warm"}`}>{week == null ? t.notAvailable : week === "0.000" ? t.homeGaugeWeekFlat : `${week} EUR/L`}</dd></div>
            </dl>

            <div className="homeBoardProvenance">
              <span><b>{c.dated}</b>{date}</span>
              <span><b>{c.source}</b>{data?.source_url ? <a href={data.source_url} target="_blank" rel="noopener noreferrer">{data.source ?? t.notAvailable} ↗</a> : data?.source ?? t.notAvailable}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
