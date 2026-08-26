import React from "react";
import { useLanguage } from "../LanguageProvider";

type FarmerProfile = {
  fullName: string;
  phone: string;
  village: string;
  location: string;
  password: string;
  confirmPassword: string;
  latitude?: number | null;
  longitude?: number | null;
};

function validatePhone(phone: string) {
  const cleaned = phone.replace(/\s+/g, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}

export default function Farmer(): React.ReactElement {
  const { t } = useLanguage();

  const [form, setForm] = React.useState<FarmerProfile>({
    fullName: "",
    phone: "",
    village: "",
    location: "",
    password: "",
    confirmPassword: "",
    latitude: null,
    longitude: null,
  });

  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  // Location capture state
  const [locStatus, setLocStatus] = React.useState<string | null>(null);
  const [locBusy, setLocBusy] = React.useState<boolean>(false);

  const validate = React.useCallback(
    (values: FarmerProfile) => {
      const e: Record<string, string> = {};

      if (!values.fullName.trim()) {
        e.fullName = t("farmer_error_full_name_required");
      } else if (values.fullName.trim().length < 3) {
        e.fullName = t("farmer_error_full_name_length");
      }

      if (!values.phone.trim()) {
        e.phone = t("farmer_error_phone_required");
      } else if (!validatePhone(values.phone)) {
        e.phone = t("farmer_error_phone_invalid");
      }

      if (!values.village.trim()) {
        e.village = t("farmer_error_village_required");
      } else if (values.village.trim().length < 2) {
        e.village = t("farmer_error_village_length");
      }

      if (!values.location.trim()) {
        e.location = t("farmer_error_location_required");
      }

      if (!values.password) {
        e.password = t("farmer_error_password_required");
      } else if (values.password.length < 6) {
        e.password = t("farmer_error_password_length");
      }

      if (!values.confirmPassword) {
        e.confirmPassword = t("farmer_error_confirm_password");
      } else if (values.password !== values.confirmPassword) {
        e.confirmPassword = t("farmer_error_password_mismatch");
      }

      return e;
    },
    [t]
  );

  React.useEffect(() => {
    setErrors(validate(form));
  }, [form, validate]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
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

  function saveAccount(account: any) {
    const accounts = loadAccounts();

    // remove any existing account with same role+phone
    const filtered = accounts.filter(
      (a) =>
        !(
          a.role === account.role &&
          a.phone.replace(/\s+/g, "") ===
            account.phone.replace(/\s+/g, "")
        )
    );

    filtered.push(account);
    localStorage.setItem(
      "farmseva_accounts",
      JSON.stringify(filtered)
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = validate(form);
    setErrors(validation);

    setTouched({
      fullName: true,
      phone: true,
      village: true,
      location: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(validation).length === 0) {
      // Save account to localStorage (role: farmer)
      const account = {
        role: "farmer",
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        village: form.village.trim(),
        location: form.location.trim(),
        latitude: form.latitude ?? null,
        longitude: form.longitude ?? null,
        password: form.password,
      };

      saveAccount(account);
      setSubmitted(true);
      setLocStatus(null);
    } else {
      setSubmitted(false);

      const firstInvalid = Object.keys(validation)[0];
      const el = document.getElementById(firstInvalid);

      if (el) {
        (el as HTMLElement).focus();
      }
    }
  }

  function handleReset() {
    setForm({
      fullName: "",
      phone: "",
      village: "",
      location: "",
      password: "",
      confirmPassword: "",
      latitude: null,
      longitude: null,
    });

    setTouched({});
    setErrors({});
    setSubmitted(false);
    setLocStatus(null);
  }

  // Geolocation capture — only when user clicks the button
  function captureLocation() {
    setLocStatus(null);

    if (!("geolocation" in navigator)) {
      setLocStatus(t("farmer_location_not_supported"));
      return;
    }

    setLocBusy(true);
    setLocStatus(t("farmer_location_requesting"));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setForm((s) => ({
          ...s,
          latitude: lat,
          longitude: lon,
        }));

        setLocStatus(t("farmer_location_captured"));
        setLocBusy(false);
      },
      (err) => {
        // Friendly error messages
        if (err.code === err.PERMISSION_DENIED) {
          setLocStatus(
            t("farmer_location_permission_denied")
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocStatus(t("farmer_location_unavailable"));
        } else if (err.code === err.TIMEOUT) {
          setLocStatus(t("farmer_location_timeout"));
        } else {
          setLocStatus(t("farmer_location_error"));
        }

        setLocBusy(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  return (
    <section className="page page-farmer">
      <div className="container">
        <h1>{t("farmer_register_title")}</h1>

        <p>{t("farmer_registration_description")}</p>

        {!submitted && (
          <form
            className="form-card"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="form-instructions"
          >
            <p id="form-instructions" className="sr-only">
              {t("farmer_form_instructions")}
            </p>

            <div className="form-row">
              <label htmlFor="fullName">
                {t("farmer_full_name_label")}
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.fullName}
                aria-describedby={
                  errors.fullName
                    ? "fullName-error"
                    : undefined
                }
                placeholder={t(
                  "farmer_full_name_placeholder"
                )}
              />

              {touched.fullName && errors.fullName && (
                <div
                  id="fullName-error"
                  className="field-error"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.fullName}
                </div>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="phone">
                {t("shared_phone")}
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.phone}
                aria-describedby={
                  errors.phone
                    ? "phone-error"
                    : undefined
                }
                placeholder={t(
                  "farmer_phone_placeholder"
                )}
              />

              {touched.phone && errors.phone && (
                <div
                  id="phone-error"
                  className="field-error"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.phone}
                </div>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="village">
                {t("farmer_village_label")}
              </label>

              <input
                id="village"
                name="village"
                type="text"
                autoComplete="address-level2"
                value={form.village}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.village}
                aria-describedby={
                  errors.village
                    ? "village-error"
                    : undefined
                }
                placeholder={t(
                  "farmer_village_placeholder"
                )}
              />

              {touched.village && errors.village && (
                <div
                  id="village-error"
                  className="field-error"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.village}
                </div>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="location">
                {t("farmer_location_label")}
              </label>

              <input
                id="location"
                name="location"
                type="text"
                autoComplete="off"
                value={form.location}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.location}
                aria-describedby={
                  errors.location
                    ? "location-error"
                    : undefined
                }
                placeholder={t(
                  "farmer_location_placeholder"
                )}
              />

              {touched.location && errors.location && (
                <div
                  id="location-error"
                  className="field-error"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.location}
                </div>
              )}
            </div>

            {/* Use My Current Location */}
            <div
              className="form-row"
              style={{ marginTop: 6 }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={captureLocation}
                  disabled={locBusy}
                  aria-live="polite"
                >
                  {locBusy
                    ? t("farmer_detecting_location")
                    : t("farmer_use_current_location")}
                </button>

                <div
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                  }}
                >
                  {form.latitude != null &&
                  form.longitude != null ? (
                    <span aria-live="polite">
                      {t("farmer_location_detected")}
                    </span>
                  ) : (
                    <span aria-live="polite">
                      {t("farmer_no_coordinates")}
                    </span>
                  )}
                </div>
              </div>

              {locStatus && (
                <div
                  className="field-note"
                  role="status"
                  aria-live="polite"
                  style={{ marginTop: 8 }}
                >
                  {locStatus}
                </div>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="password">
                {t("auth_password_label")}
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password
                    ? "password-error"
                    : undefined
                }
                placeholder={t(
                  "auth_password_placeholder"
                )}
              />

              {touched.password && errors.password && (
                <div
                  id="password-error"
                  className="field-error"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="confirmPassword">
                {t("auth_password_confirm_label")}
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
                placeholder={t(
                  "auth_password_confirm_label"
                )}
              />

              {touched.confirmPassword &&
                errors.confirmPassword && (
                  <div
                    id="confirmPassword-error"
                    className="field-error"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.confirmPassword}
                  </div>
                )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
              >
                {t("farmer_register_button")}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
              >
                {t("farmer_reset_button")}
              </button>
            </div>
          </form>
        )}

        {submitted && (
          <div
            className="success-card"
            role="status"
            aria-live="polite"
          >
            <h2>
              {t("farmer_registration_success_title")}
            </h2>

            <p>
              {t(
                "farmer_registration_success_message"
              )}
            </p>

            <div className="summary">
              <div>
                <strong>
                  {t("shared_full_name")}
                </strong>
                <div>{form.fullName}</div>
              </div>

              <div>
                <strong>
                  {t("shared_phone")}
                </strong>
                <div>{form.phone}</div>
              </div>

              <div>
                <strong>
                  {t("shared_village_city")}
                </strong>
                <div>{form.village}</div>
              </div>

              <div>
                <strong>
                  {t("shared_location")}
                </strong>
                <div>{form.location}</div>
              </div>

              {form.latitude != null &&
                form.longitude != null && (
                  <div>
                    <strong>
                      {t("farmer_coordinates")}
                    </strong>
                    <div>
                      Lat:{" "}
                      {form.latitude.toFixed(6)}, Lon:{" "}
                      {form.longitude.toFixed(6)}
                    </div>
                  </div>
                )}
            </div>

            <div className="form-actions">
              <button
                className="btn-primary"
                onClick={() => setSubmitted(false)}
              >
                {t("farmer_edit_button")}
              </button>

              <button
                className="btn-secondary"
                onClick={handleReset}
              >
                {t(
                  "farmer_register_another_button"
                )}
              </button>
            </div>
          </div>
        )}

        <div
          className="placeholder-box"
          style={{ marginTop: 20 }}
        >
          <strong>
            {t("farmer_note_title")}
          </strong>

          <p style={{ margin: "8px 0 0" }}>
            {t("farmer_note_description")}
          </p>
        </div>
      </div>
    </section>
  );
}