import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import type { Lang } from "../models/i18n";
import { i18n } from "../locales";
import { STORAGE_LANG_KEY } from "../config/constants";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useTheme } from "../hooks/useTheme";

import TopBar from "../components/layout/TopBar";
import Footer from "../components/layout/Footer";

import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";
import NotFoundPage from "../pages/NotFoundPage";

import logo from "../assets/logo.png";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [lang, setLang] = useLocalStorageState<Lang>(STORAGE_LANG_KEY, "en", {
    // deserialize: (raw) => (raw === "sq" ? "sq" : "en"),
    deserialize: () => "en",
  });

  useEffect(() => {
    document.documentElement.lang = lang === "sq" ? "sq" : "en";
  }, [lang]);

  const t = i18n[lang];

  const [subtitle, setSubtitle] = useState<string>(t.subtitleLoading);

  const toggleLang = () => setLang(lang === "en" ? "sq" : "en");

  return (
    <div className="page">
      <div className="container">
        <TopBar
          t={t}
          logoSrc={logo}
          subtitle={subtitle}
          lang={lang}
          theme={theme}
          refreshing={false}
          onRefresh={() => {}}
          onToggleLang={toggleLang}
          onToggleTheme={toggleTheme}
        />

        <Routes>
          <Route path="/" element={<HomePage t={t} lang={lang} setSubtitle={setSubtitle} />} />
          <Route path="/about" element={<AboutPage t={t} />} />
          <Route path="/contact" element={<ContactPage t={t} />} />
          <Route path="/privacy" element={<PrivacyPage t={t} />} />
          <Route path="/terms" element={<TermsPage t={t} />} />
          <Route path="*" element={<NotFoundPage t={t} />} />
        </Routes>

        <Footer t={t} />
      </div>
    </div>
  );
}