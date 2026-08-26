import type { ReactElement } from "react";
import { useLanguage } from "../LanguageProvider";

export default function Home(): ReactElement {
  const { t } = useLanguage();

  return (
    <section className="page page-home">
      <div className="hero">
        <div className="hero-inner container">
          <div className="hero-text">
            <h1>{t("home_hero_title")}</h1>

            <p className="lead">{t("home_hero_description")}</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="entry-grid" style={{ marginTop: 18 }}>
          <a
            className="entry-card farmer"
            href="#/farmer"
            aria-label={t("home_farmer_card_aria")}
          >
            <div className="entry-icon">👩‍🌾</div>

            <h2>{t("home_cta_farmer")}</h2>

            <p>{t("home_farmer_card_description")}</p>
          </a>

          <a
            className="entry-card owner"
            href="#/owner"
            aria-label={t("home_owner_card_aria")}
          >
            <div className="entry-icon">🔧</div>

            <h2>{t("home_cta_owner")}</h2>

            <p>{t("home_owner_card_description")}</p>
          </a>
        </div>
      </div>
    </section>
  );
}