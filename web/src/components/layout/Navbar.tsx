import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Lang } from "../../models/i18n";
import type { Theme } from "../../models/theme";
import type { TDict } from "../../locales";

type Props = {
  t: TDict;
  logoSrc: string;
  subtitle: string;
  lang: Lang;
  theme: Theme;
  refreshing: boolean;
  onRefresh: () => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
};

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

export default function Navbar({
  t,
  logoSrc,
  subtitle,
  lang,
  theme,
  refreshing,
  onRefresh,
  onToggleLang,
  onToggleTheme,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [lastPath, setLastPath] = useState(location.pathname);

  // Close menu on route change
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    if (menuOpen) setMenuOpen(false);
    if (guidesOpen) setGuidesOpen(false);
  }

  // Close menu on outside click
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

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  const navLinks = [
    { to: "/", label: t.navHome },
    { to: "/about", label: t.navAbout },
    { to: "/contact", label: t.navContact },
  ];

  const guideLinks = [
    { to: "/europe-fuel-comparison", label: t.navEuropeComparison },
    { to: "/road-trip-fuel-guide", label: t.navRoadTripGuide },
    { to: "/methodology", label: t.navMethodology },
  ];

  const mobileLinks = [...navLinks, ...guideLinks];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav className="navbar" ref={menuRef}>
      <div className="navbarInner">
        <Link to="/" className="brand">
          <img className="logoImg" src={logoSrc} alt="" aria-hidden="true" />
          <div className="hgroup">
            <span className="h1">{t.title}</span>
            <p className="sub">{subtitle}</p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="navLinks">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navLink ${isActive(link.to) ? "navLinkActive" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="navMenuWrap">
            <button
              className={`navMenuBtn ${guideLinks.some((link) => isActive(link.to)) ? "navLinkActive" : ""}`}
              onClick={() => setGuidesOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={guidesOpen}
            >
              {t.navGuides}
            </button>

            {guidesOpen ? (
              <div className="navMenu" role="menu" aria-label="Guides menu">
                {guideLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    role="menuitem"
                    className={`navMenuLink ${isActive(link.to) ? "navMenuLinkActive" : ""}`}
                    onClick={() => setGuidesOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Desktop actions */}
        <div className="navActions">
          <button className="btn btn-primary" onClick={onRefresh} disabled={refreshing}>
            {refreshing ? t.refreshing : t.refresh}
          </button>

          <button
            className="btn btn-ghost"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* <button
            className="btn btn-ghost"
            onClick={onToggleLang}
            aria-label={lang === "en" ? "Switch to Albanian" : "Switch to English"}
            title={lang === "en" ? "Switch to Albanian" : "Switch to English"}
          >
            {lang === "en" ? t.langSQ : t.langEN}
          </button> */}
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className="hamburgerBtn"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobileMenu">
          <div className="mobileMenuLinks">
            {mobileLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`mobileMenuLink ${isActive(link.to) ? "mobileMenuLinkActive" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mobileMenuDivider" />

          <div className="mobileMenuActions">
            <button
              className="btn btn-primary mobileMenuBtn"
              onClick={() => {
                onRefresh();
                setMenuOpen(false);
              }}
              disabled={refreshing}
            >
              {refreshing ? t.refreshing : t.refresh}
            </button>

            <button
              className="btn btn-ghost mobileMenuBtn"
              onClick={() => {
                onToggleTheme();
                setMenuOpen(false);
              }}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </button>

            <button
              className="btn btn-ghost mobileMenuBtn"
              onClick={() => {
                onToggleLang();
                setMenuOpen(false);
              }}
            >
              {lang === "en" ? t.langSQ : t.langEN}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
