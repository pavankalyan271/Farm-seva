import type { ReactElement } from "react";
import { useLanguage } from "../LanguageProvider";

export default function Header(): ReactElement {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden>
            🚜
          </span>
          <span className="brand-text">{t("header_title")}</span>
        </a>

        {/* Mobile nav toggle (keeps existing behavior) */}
        <input id="nav-toggle" className="nav-toggle" type="checkbox" aria-hidden />

        <nav className="site-nav" role="navigation" aria-label="Main navigation">
          <a className="nav-link" href="#/">{t("nav_home")}</a>
          <a className="nav-link" href="#/farmer">{t("nav_farmer")}</a>
          <a className="nav-link" href="#/owner">{t("nav_owner")}</a>

          {/* Login link */}
          <a className="nav-link nav-link-login" href="#/login">
            {t("auth_login_title")}
          </a>
        </nav>

        {/* Language Selector */}
        <div className="language-selector" style={{ marginLeft: "12px" }}>
          <label
            htmlFor="lang-select"
            className="lang-label"
            style={{ marginRight: "6px" }}
          >
            {t("nav_language_label")}
          </label>

          <select
            id="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            aria-label={t("nav_language_label")}
            className="lang-dropdown"
            style={{ padding: "4px 6px" }}
          >
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        <label htmlFor="nav-toggle" className="nav-toggle-label" aria-hidden>
          <span className="hamburger" />
        </label>
      </div>
    </header>
  );
}
