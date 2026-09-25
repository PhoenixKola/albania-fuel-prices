import { layoutCopy } from "../../config/layoutCopy";
import { ALBANIAN_ENABLED } from "../../config/features";
import { travelLabels } from "../../config/travelLabels";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Lang } from "../../models/i18n";
import type { Theme } from "../../models/theme";
import type { Currency } from "../../models/currency";
import type { TDict } from "../../locales";

type Props = {
  t: TDict;
  logoSrc: string;
  subtitle: string;
  lang: Lang;
  theme: Theme;
  currency: Currency;
  onSetCurrency: (c: Currency) => void;
  refreshing: boolean;
  onRefresh: () => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
};

type DropdownId = "plan" | "explore";

type NavIconName =
  | "prices" | "roads" | "calculator" | "car" | "route" | "station"
  | "compare" | "ranking" | "report" | "insights" | "quiz" | "challenge"
  | "method" | "guide" | "europe" | "about" | "contact";

type NavItem = { to: string; label: string; icon: NavIconName };
type NavGroup = { label?: string; links: NavItem[] };

function NavItemIcon({ name }: { name: NavIconName }) {
  const paths: Record<NavIconName, React.ReactNode> = {
    prices: <><path d="M5 6.5h14v11H5z" /><path d="M8 10h8M8 14h5" /></>,
    roads: <><path d="M9 3 7 21M15 3l2 18" /><path d="M12 5v3m0 4v3m0 4v2" /></>,
    calculator: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h1m3 0h1m3 0h.01M8 15h1m3 0h1m3 0h.01M8 18h5" /></>,
    car: <><path d="m5 11 1.6-4h10.8l1.6 4" /><path d="M4 11h16v6H4zM7 17v2m10-2v2M7 14h.01M17 14h.01" /></>,
    route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" /></>,
    station: <><path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h15M8 7h5v5H8z" /><path d="m16 7 3 3v7a2 2 0 0 0 2 2V9l-2-2" /></>,
    compare: <><path d="M4 8h14m0 0-3-3m3 3-3 3M20 16H6m0 0 3 3m-3-3 3-3" /></>,
    ranking: <><path d="M5 20v-5h4v5M10 20V9h4v11M15 20V4h4v16M3 20h18" /></>,
    report: <><path d="M6 3h9l3 3v15H6zM15 3v4h4M9 11h6M9 15h6" /></>,
    insights: <><path d="M4 18 9 12l4 3 7-9" /><path d="M16 6h4v4" /></>,
    quiz: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2.9-1.2 1.8M12 17h.01" /></>,
    challenge: <><path d="M13 2c1 4-2 5-2 8 0 1.7 1.3 3 3 3 2.5 0 4-2.1 3.5-5 2.2 2 3.5 4.5 3.5 7a9 9 0 0 1-18 0c0-3.8 2.3-7.2 6-9-.3 3.2 1.2 4.8 3 5" /></>,
    method: <><path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" /></>,
    guide: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5a3.5 3.5 0 0 1 3.5 3z" /></>,
    europe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    about: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    contact: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  };

  return <svg className="navItemIcon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12Zm0-14.5a1 1 0 0 1 1 1V6a1 1 0 1 1-2 0V4.5a1 1 0 0 1 1-1Zm0 16a1 1 0 0 1 1 1V22a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM3.5 11a1 1 0 0 1 1-1H6a1 1 0 1 1 0 2H4.5a1 1 0 0 1-1-1Zm16 0a1 1 0 0 1 1-1H22a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM6.05 5.64a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41L6.05 7.05a1 1 0 0 1 0-1.41Zm10.78 10.78a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41ZM18.36 5.64a1 1 0 0 1 0 1.41L17.3 8.11a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0ZM8.11 15.89a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21 14.6A8.9 8.9 0 0 1 9.4 3a1 1 0 0 0-1.1 1.4A10 10 0 1 0 20.6 15.7a1 1 0 0 0 .4-1.1Z"
      />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.12 5.71a1 1 0 0 0-1.42 1.42L10.59 12l-4.89 4.88a1 1 0 1 0 1.42 1.42L12 13.41l4.88 4.89a1 1 0 0 0 1.42-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41Z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 6v5h-5M4 18v-5h5M6.1 9a7 7 0 0 1 11.7-2.6L20 11M4 13l2.2 4.6A7 7 0 0 0 17.9 15" />
    </svg>
  );
}

export default function Navbar({
  t,
  lang,
  onToggleLang,
  logoSrc,
  subtitle,
  theme,
  currency,
  onSetCurrency,
  refreshing,
  onRefresh,
  onToggleTheme,
}: Props) {
  const c = layoutCopy[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const planButtonRef = useRef<HTMLButtonElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const [lastPath, setLastPath] = useState(location.pathname);

  // Close everything on route change
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    if (menuOpen) setMenuOpen(false);
    if (openDropdown) setOpenDropdown(null);
  }

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  // Close any open dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const refs: Record<DropdownId, React.RefObject<HTMLDivElement | null>> = {
      plan: planRef,
      explore: exploreRef,
    };
    const ref = refs[openDropdown];
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown]);

  // Close any open dropdown on Escape
  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const buttons: Record<DropdownId, React.RefObject<HTMLButtonElement | null>> = {
          plan: planButtonRef,
          explore: exploreButtonRef,
        };
        const button = buttons[openDropdown].current;
        setOpenDropdown(null);
        button?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openDropdown]);

  const toggle = (id: DropdownId) =>
    setOpenDropdown((prev) => (prev === id ? null : id));

  // Direct destinations come first; expandable planning and discovery menus
  // form a separate group beside them.
  const navLinks = [
    { to: "/", label: c.prices, icon: "prices" },
    { to: "/road-status", label: c.roads, icon: "roads" },
  ] satisfies NavItem[];

  const planLinks = [
    { to: "/trip-cost-calculator", label: c.tripCalculator, icon: "calculator" },
    { to: "/albania-car-rental-guide", label: travelLabels[lang].guide, icon: "car" },
    { to: "/road-trip-fuel-guide", label: t.navRoadTripGuide, icon: "route" },
    { to: "/stations", label: t.navStations, icon: "station" },
  ] satisfies NavItem[];

  const exploreGroups = [
    { label: c.market, links: [
      { to: "/compare", label: t.navCompare, icon: "compare" },
      { to: "/rankings", label: t.navRankings, icon: "ranking" },
      { to: "/market-report", label: c.marketReport, icon: "report" },
      { to: "/insights", label: c.insights, icon: "insights" },
    ] },
    { label: c.games, links: [
      { to: "/fuel-quiz", label: t.navFuelQuiz, icon: "quiz" },
      { to: "/daily-challenge", label: t.navDailyChallenge, icon: "challenge" },
    ] },
    { label: c.guides, links: [
      { to: "/methodology", label: t.navMethodology, icon: "method" },
      { to: "/how-fuel-prices-work", label: t.navHowPricesWork, icon: "guide" },
      { to: "/europe-fuel-comparison", label: t.navEuropeComparison, icon: "europe" },
    ] },
    { label: c.company, links: [
      { to: "/about", label: t.navAbout, icon: "about" },
      { to: "/contact", label: t.navContact, icon: "contact" },
    ] },
  ] satisfies NavGroup[];

  // Grouped rather than one long flat list, so the drawer stays scannable.
  const mobileGroups = [
    { title: null, links: navLinks },
    { title: c.plan, links: planLinks },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const renderDropdown = (
    id: DropdownId,
    label: string,
    groups: NavGroup[],
    ref: React.RefObject<HTMLDivElement | null>,
    buttonRef: React.RefObject<HTMLButtonElement | null>,
    ariaLabel: string
  ) => {
    const links = groups.flatMap((group) => group.links);
    return (
      <div className="navMenuWrap" ref={ref}>
        <button
          ref={buttonRef}
          className={`navMenuBtn ${links.some((l) => isActive(l.to)) ? "navLinkActive" : ""}`}
          onClick={() => toggle(id)}
          aria-expanded={openDropdown === id}
          aria-controls={`nav-${id}-links`}
        >
          {label}
        </button>
        {openDropdown === id && (
          <div className={`navMenu navMenu${id === "explore" ? "Explore" : "Plan"}`} id={`nav-${id}-links`} aria-label={ariaLabel}>
            {groups.map((group, index) => (
              <div className="navMenuGroup" key={group.label ?? `group-${index}`}>
                {group.label ? <span className="navMenuGroupTitle">{group.label}</span> : null}
                <div className="navMenuGroupLinks">
                  {group.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`navMenuLink ${isActive(link.to) ? "navMenuLinkActive" : ""}`}
                      onClick={() => setOpenDropdown(null)}
                    >
                      <NavItemIcon name={link.icon} />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`navbar${lang === "sq" ? " navbarSq" : ""}`} ref={menuRef}>
      <div className="navbarInner">
        <Link to="/" className="brand">
          <img className="logoImg" src={logoSrc} alt="" aria-hidden="true" width="44" height="44" decoding="async" />
          <div className="hgroup">
            <span className="h1">{t.title}</span>
            <p className="sub">
              <span className="subDot" aria-hidden="true" />
              {subtitle}
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="navLinks">
          <div className="navPrimaryLinks">
            {navLinks.map((link) => <Link key={link.to} to={link.to} className={`navLink ${isActive(link.to) ? "navLinkActive" : ""}`}>{link.label}</Link>)}
          </div>
          <div className="navDropdownLinks">
            {renderDropdown("plan", c.plan, [{ links: planLinks }], planRef, planButtonRef, c.planMenu)}
            {renderDropdown("explore", c.explore, exploreGroups, exploreRef, exploreButtonRef, c.exploreMenu)}
          </div>
        </div>

        {/* Desktop actions */}
        <div className="navActions">
          <div className="segRow navCurrencySeg" role="group" aria-label={t.currencyMode}>
            <button
              type="button"
              className={`seg ${currency === "eur" ? "segActive" : ""}`}
              onClick={() => onSetCurrency("eur")}
            >
              {t.currencyEUR}
            </button>
            <button
              type="button"
              className={`seg ${currency === "local" ? "segActive" : ""}`}
              onClick={() => onSetCurrency("local")}
            >
              {t.currencyLocal}
            </button>
          </div>

          <button className={`btn btn-ghost navRefreshButton${refreshing ? " is-refreshing" : ""}`} onClick={onRefresh} disabled={refreshing} aria-label={refreshing ? t.refreshing : t.refresh} title={refreshing ? t.refreshing : t.refresh}>
            <RefreshIcon />
          </button>

          <button
            className="btn btn-ghost"
            onClick={onToggleTheme}
            aria-label={c.toggleTheme}
            title={c.toggleTheme}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          {ALBANIAN_ENABLED && <button
            className="btn btn-ghost"
            onClick={onToggleLang}
            aria-label={lang === "en" ? "Switch to Albanian" : "Switch to English"}
            title={lang === "en" ? "Switch to Albanian" : "Switch to English"}
          >
            {lang === "en" ? t.langSQ : t.langEN}
          </button>}
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="hamburgerBtn"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label={c.toggleMenu}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </div>

      {/* Mobile drawer — actions first so Refresh is reachable without scrolling */}
      {menuOpen && (
        <div className="mobileMenu">
          <div className="mobileMenuActions">
            <div className="segRow mobileMenuCurrencySeg" role="group" aria-label={t.currencyMode}>
              <button
                type="button"
                className={`seg ${currency === "eur" ? "segActive" : ""}`}
                onClick={() => onSetCurrency("eur")}
              >
                {t.currencyEUR}
              </button>
              <button
                type="button"
                className={`seg ${currency === "local" ? "segActive" : ""}`}
                onClick={() => onSetCurrency("local")}
              >
                {t.currencyLocal}
              </button>
            </div>

            <button
              className="btn btn-primary mobileMenuBtn"
              onClick={() => { onRefresh(); setMenuOpen(false); }}
              disabled={refreshing}
            >
              {refreshing ? t.refreshing : t.refresh}
            </button>

            <button
              className="btn btn-ghost mobileMenuBtn"
              onClick={() => { onToggleTheme(); setMenuOpen(false); }}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              <span>{theme === "dark" ? c.light : c.dark}</span>
            </button>

            {ALBANIAN_ENABLED && <button
              className="btn btn-ghost mobileMenuBtn"
              onClick={() => { onToggleLang(); setMenuOpen(false); }}
            >
              {lang === "en" ? t.langSQ : t.langEN}
            </button>}
          </div>

          <div className="mobileMenuDivider" />

          <div className="mobileMenuScroll">
            {mobileGroups.map((group, i) => (
              <div className="mobileMenuGroup" key={group.title ?? `group-${i}`}>
                {group.title ? (
                  <span className="mobileMenuGroupTitle">{group.title}</span>
                ) : null}
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`mobileMenuLink ${isActive(link.to) ? "mobileMenuLinkActive" : ""}`}
                  >
                    <NavItemIcon name={link.icon} />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            ))}
            <div className="mobileMenuGroup mobileExploreGroup">
              <span className="mobileMenuGroupTitle">{c.explore}</span>
              {exploreGroups.map((group) => (
                <div className="mobileMenuSubgroup" key={group.label}>
                  <span className="mobileMenuSubgroupTitle">{group.label}</span>
                  {group.links.map((link) => (
                    <Link key={link.to} to={link.to} className={`mobileMenuLink ${isActive(link.to) ? "mobileMenuLinkActive" : ""}`}>
                      <NavItemIcon name={link.icon} />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
