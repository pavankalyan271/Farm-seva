import React from "react";
import { useLanguage } from "../LanguageProvider";

/**
 * Login page (frontend-only). Uses localStorage to verify accounts saved during registration.
 * Session saved to localStorage key: farmseva_session
 */

function validatePhone(phone: string) {
  const cleaned = phone.replace(/\s+/g, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}

type LoginState = {
  role: "farmer" | "owner";
  phone: string;
  password: string;
};

export default function Login(): React.ReactElement {
  const { t } = useLanguage();

  const [state, setState] = React.useState<LoginState>({
    role: "farmer",
    phone: "",
    password: "",
  });

  const [error, setError] = React.useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  }

  function loadAccounts(): any[] {
    try {
      const raw = localStorage.getItem("farmseva_accounts");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validatePhone(state.phone)) {
      setError(t("auth_error_phone"));
      return;
    }

    if (!state.password || state.password.length < 6) {
      setError(t("auth_error_password"));
      return;
    }

    const accounts = loadAccounts();

    const match = accounts.find(
      (a) =>
        a.role === state.role &&
        a.phone.replace(/\s+/g, "") === state.phone.replace(/\s+/g, "")
    );

    if (!match) {
      setError(t("auth_error_account_not_found"));
      return;
    }

    if (match.password !== state.password) {
      setError(t("auth_error_incorrect_password"));
      return;
    }

    // success: save session
    localStorage.setItem(
      "farmseva_session",
      JSON.stringify({
        role: state.role,
        phone: state.phone,
      })
    );

    // redirect to dashboard
    if (state.role === "farmer") {
      window.location.hash = "#/farmer-dashboard";
    } else {
      window.location.hash = "#/owner-dashboard";
    }
  }

  return (
    <section className="page page-login">
      <div className="container">
        <h1>{t("auth_login_title")}</h1>

        <p className="lead">{t("auth_demo_note")}</p>

        <form
          className="form-card"
          onSubmit={handleSubmit}
          noValidate
          aria-live="polite"
        >
          <div className="form-row">
            <label htmlFor="role">{t("auth_role_label")}</label>

            <select
              id="role"
              name="role"
              value={state.role}
              onChange={handleChange}
            >
              <option value="farmer">{t("auth_role_farmer")}</option>
              <option value="owner">{t("auth_role_owner")}</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="phone">{t("auth_phone_label")}</label>

            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={state.phone}
              onChange={handleChange}
              placeholder={t("auth_phone_placeholder")}
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">{t("auth_password_label")}</label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={state.password}
              onChange={handleChange}
              placeholder={t("auth_password_placeholder")}
            />
          </div>

          {error && (
            <div
              className="field-error"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {t("auth_login_button")}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                // navigate to registration based on selected role
                if (state.role === "farmer") {
                  window.location.hash = "#/farmer";
                } else {
                  window.location.hash = "#/owner";
                }
              }}
            >
              {t("auth_register_button")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}