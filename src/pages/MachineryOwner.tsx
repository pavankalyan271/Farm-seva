import React from "react";
import { useLanguage } from "../LanguageProvider";

type OwnerProfile = {
  fullName: string;
  phone: string;
  village: string;
  location: string;
  machineryType: string;
  machineName: string;
  rentPrice: string;
  operatorPrice: string;
  availability: "available" | "unavailable";
  password: string;
  confirmPassword: string;
  latitude?: number | null;
  longitude?: number | null;
};

const MACHINERY_OPTIONS = [
  "Tractor",
  "Harvester",
  "Rotavator",
  "Cultivator",
  "Sprayer",
  "Other",
];

function validatePhone(phone: string) {
  const cleaned = phone.replace(/\s+/g, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}

export default function MachineryOwner(): React.ReactElement {
  const { t } = useLanguage();

  const [form, setForm] = React.useState<OwnerProfile>({
    fullName: "",
    phone: "",
    village: "",
    location: "",
    machineryType: "",
    machineName: "",
    rentPrice: "",
    operatorPrice: "",
    availability: "available",
    password: "",
    confirmPassword: "",
    latitude: null,
    longitude: null,
  });

  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const [locStatus, setLocStatus] = React.useState<string | null>(null);
  const [locBusy, setLocBusy] = React.useState<boolean>(false);

  const validate = React.useCallback(
    (values: OwnerProfile) => {
      const e: Record<string, string> = {};

      if (!values.fullName.trim()) {
        e.fullName = t("owner_full_name_required");
      } else if (values.fullName.trim().length < 3) {
        e.fullName = t("owner_full_name_min");
      }

      if (!values.phone.trim()) {
        e.phone = t("owner_phone_required");
      } else if (!validatePhone(values.phone)) {
        e.phone = t("owner_phone_invalid");
      }

      if (!values.village.trim()) {
        e.village = t("owner_village_required");
      } else if (values.village.trim().length < 2) {
        e.village = t("owner_village_min");
      }

      if (!values.location.trim()) {
        e.location = t("owner_location_required");
      }

      if (!values.machineryType) {
        e.machineryType = t("owner_machinery_type_required");
      }

      if (!values.machineName.trim()) {
        e.machineName = t("owner_machine_name_required");
      } else if (values.machineName.trim().length < 2) {
        e.machineName = t("owner_machine_name_min");
      }

      const rent = parseFloat(values.rentPrice);

      if (values.rentPrice.trim() === "") {
        e.rentPrice = t("owner_rent_required");
      } else if (Number.isNaN(rent) || rent <= 0) {
        e.rentPrice = t("owner_rent_positive");
      }

      const op = parseFloat(values.operatorPrice);

      if (values.operatorPrice.trim() === "") {
        e.operatorPrice = t("owner_operator_required");
      } else if (Number.isNaN(op) || op <= 0) {
        e.operatorPrice = t("owner_operator_positive");
      }

      if (!values.availability) {
        e.availability = t("owner_availability_required");
      }

      if (!values.password) {
        e.password = t("owner_password_required");
      } else if (values.password.length < 6) {
        e.password = t("owner_password_min");
      }

      if (!values.confirmPassword) {
        e.confirmPassword = t("owner_confirm_password_required");
      } else if (values.password !== values.confirmPassword) {
        e.confirmPassword = t("owner_password_mismatch");
      }

      return e;
    },
    [t]
  );

  React.useEffect(() => {
    setErrors(validate(form));
  }, [form, validate]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name } = e.target;
    setTouched((current) => ({ ...current, [name]: true }));
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
      machineryType: true,
      machineName: true,
      rentPrice: true,
      operatorPrice: true,
      availability: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(validation).length === 0) {
      const account = {
        role: "owner",
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        village: form.village.trim(),
        location: form.location.trim(),
        machineryType: form.machineryType,
        machineName: form.machineName.trim(),
        rentPrice: parseFloat(form.rentPrice),
        operatorPrice: parseFloat(form.operatorPrice),
        availability: form.availability,
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
      machineryType: "",
      machineName: "",
      rentPrice: "",
      operatorPrice: "",
      availability: "available",
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

  function captureLocation() {
    setLocStatus(null);

    if (!("geolocation" in navigator)) {
      setLocStatus(t("owner_geolocation_unsupported"));
      return;
    }

    setLocBusy(true);
    setLocStatus(t("owner_requesting_location"));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setForm((s) => ({
          ...s,
          latitude: lat,
          longitude: lon,
        }));

        setLocStatus(t("owner_location_captured"));
        setLocBusy(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocStatus(t("owner_permission_denied"));
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocStatus(t("owner_location_unavailable"));
        } else if (err.code === err.TIMEOUT) {
          setLocStatus(t("owner_location_timeout"));
        } else {
          setLocStatus(t("owner_location_failed"));
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
    <section className="page page-owner">
      <div className="container">
        <h1>{t("owner_register_title")}</h1>

        <p>{t("owner_registration_description")}</p>

        {!submitted && (
          <form
            className="form-card"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="owner-form-instructions"
          >
            <p
              id="owner-form-instructions"
              className="sr-only"
            >
              {t("owner_form_instructions")}
            </p>

            <h2 className="section-title">
              {t("owner_information_title")}
            </h2>

            <div className="form-row">
              <label htmlFor="fullName">
                {t("owner_full_name_label")}
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
                placeholder="e.g., Suresh Patel"
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
                {t("owner_phone_label")}
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
                  errors.phone ? "phone-error" : undefined
                }
                placeholder="10-digit mobile number"
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
                {t("owner_village_label")}
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
                placeholder="e.g., Ahmednagar"
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
                {t("owner_location_label")}
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
                placeholder="Enter village, city, or nearby landmark"
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
                    ? t("owner_detecting_location")
                    : t("owner_use_current_location")}
                </button>

                <div
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                  }}
                >
                  {form.latitude != null &&
                  form.longitude != null ? (
                    <span
                      aria-live="polite"
                    >
                      {t("owner_location_detected")}
                    </span>
                  ) : (
                    <span
                      aria-live="polite"
                    >
                      {t("owner_no_coordinates")}
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

            <h2 className="section-title">
              {t("machinery_information_title")}
            </h2>

            <div className="form-row">
              <label htmlFor="machineryType">
                {t("owner_machinery_type_label")}
              </label>

              <select
                id="machineryType"
                name="machineryType"
                value={form.machineryType}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.machineryType}
                aria-describedby={
                  errors.machineryType
                    ? "machineryType-error"
                    : undefined
                }
              >
                <option value="">
                  {t("owner_select_machinery_type")}
                </option>

                {MACHINERY_OPTIONS.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                  >
                    {opt}
                  </option>
                ))}
              </select>

              {touched.machineryType &&
                errors.machineryType && (
                  <div
                    id="machineryType-error"
                    className="field-error"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.machineryType}
                  </div>
                )}
            </div>

            <div className="form-row">
              <label htmlFor="machineName">
                {t("owner_machine_name_label")}
              </label>

              <input
                id="machineName"
                name="machineName"
                type="text"
                value={form.machineName}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.machineName}
                aria-describedby={
                  errors.machineName
                    ? "machineName-error"
                    : undefined
                }
                placeholder="e.g., Mahindra 275 DI"
              />

              {touched.machineName &&
                errors.machineName && (
                  <div
                    id="machineName-error"
                    className="field-error"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.machineName}
                  </div>
                )}
            </div>

            <div className="form-row two-col">
              <div>
                <label htmlFor="rentPrice">
                  {t("owner_rent_machine")}
                </label>

                <input
                  id="rentPrice"
                  name="rentPrice"
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.rentPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.rentPrice}
                  aria-describedby={
                    errors.rentPrice
                      ? "rentPrice-error"
                      : undefined
                  }
                  placeholder="e.g., 800"
                />

                {touched.rentPrice &&
                  errors.rentPrice && (
                    <div
                      id="rentPrice-error"
                      className="field-error"
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.rentPrice}
                    </div>
                  )}

                <div className="price-note">
                  <div className="price-title">
                    {t("owner_rent_machine")}
                  </div>

                  <div className="price-desc">
                    {t("owner_farmer_operates")}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="operatorPrice">
                  {t("owner_with_operator")}
                </label>

                <input
                  id="operatorPrice"
                  name="operatorPrice"
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.operatorPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.operatorPrice}
                  aria-describedby={
                    errors.operatorPrice
                      ? "operatorPrice-error"
                      : undefined
                  }
                  placeholder="e.g., 1200"
                />

                {touched.operatorPrice &&
                  errors.operatorPrice && (
                    <div
                      id="operatorPrice-error"
                      className="field-error"
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.operatorPrice}
                    </div>
                  )}

                <div className="price-note">
                  <div className="price-title">
                    {t("owner_with_operator")}
                  </div>

                  <div className="price-desc">
                    {t("owner_owner_performs")}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <label>
                {t("owner_availability_label")}
              </label>

              <div
                className="availability-row"
                role="radiogroup"
                aria-labelledby="availability-label"
              >
                <label className="radio">
                  <input
                    id="availability-available"
                    name="availability"
                    type="radio"
                    value="available"
                    checked={
                      form.availability === "available"
                    }
                    onChange={handleChange}
                  />

                  <span>
                    {t("owner_available")}
                  </span>
                </label>

                <label className="radio">
                  <input
                    id="availability-unavailable"
                    name="availability"
                    type="radio"
                    value="unavailable"
                    checked={
                      form.availability ===
                      "unavailable"
                    }
                    onChange={handleChange}
                  />

                  <span>
                    {t("owner_currently_unavailable")}
                  </span>
                </label>
              </div>

              {touched.availability &&
                errors.availability && (
                  <div
                    id="availability-error"
                    className="field-error"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.availability}
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
                placeholder="Minimum 6 characters"
              />

              {touched.password &&
                errors.password && (
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
                aria-invalid={
                  !!errors.confirmPassword
                }
                aria-describedby={
                  errors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
                placeholder="Repeat password"
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
                {t("owner_register_machinery")}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
              >
                {t("owner_reset")}
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
              {t("owner_registration_success_title")}
            </h2>

            <p>
              {t(
                "owner_registration_success_message"
              )}
            </p>

            <div className="summary">
              <div>
                <strong>
                  {t("owner_summary_owner")}
                </strong>
                <div>{form.fullName}</div>
              </div>

              <div>
                <strong>
                  {t("owner_summary_phone")}
                </strong>
                <div>{form.phone}</div>
              </div>

              <div>
                <strong>
                  {t("owner_summary_village")}
                </strong>
                <div>{form.village}</div>
              </div>

              <div>
                <strong>
                  {t("owner_summary_location")}
                </strong>
                <div>{form.location}</div>
              </div>

              {form.latitude != null &&
                form.longitude != null && (
                  <div>
                    <strong>
                      {t(
                        "owner_summary_coordinates"
                      )}
                    </strong>

                    <div>
                      Lat:{" "}
                      {form.latitude.toFixed(6)}
                      , Lon:{" "}
                      {form.longitude.toFixed(6)}
                    </div>
                  </div>
                )}

              <div>
                <strong>
                  {t(
                    "owner_summary_machinery_type"
                  )}
                </strong>

                <div>
                  {form.machineryType}
                </div>
              </div>

              <div>
                <strong>
                  {t(
                    "owner_summary_machine_name"
                  )}
                </strong>

                <div>
                  {form.machineName}
                </div>
              </div>

              <div className="price-summary">
                <div className="price-card">
                  <div className="price-title">
                    {t("owner_rent_machine")}
                  </div>

                  <div className="price-amount">
                    ₹
                    {parseFloat(
                      form.rentPrice || "0"
                    ).toFixed(2)}{" "}
                    {t("owner_per_hour")}
                  </div>

                  <div className="price-desc">
                    {t(
                      "owner_farmer_operates"
                    )}
                  </div>
                </div>

                <div className="price-card">
                  <div className="price-title">
                    {t("owner_with_operator")}
                  </div>

                  <div className="price-amount">
                    ₹
                    {parseFloat(
                      form.operatorPrice || "0"
                    ).toFixed(2)}{" "}
                    {t("owner_per_hour")}
                  </div>

                  <div className="price-desc">
                    {t(
                      "owner_owner_performs"
                    )}
                  </div>
                </div>
              </div>

              <div>
                <strong>
                  {t("owner_availability_label")}
                </strong>

                <div>
                  {form.availability ===
                  "available"
                    ? t("owner_available")
                    : t(
                        "owner_currently_unavailable"
                      )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-primary"
                onClick={() =>
                  setSubmitted(false)
                }
              >
                {t("owner_edit")}
              </button>

              <button
                className="btn-secondary"
                onClick={handleReset}
              >
                {t("owner_register_another")}
              </button>
            </div>
          </div>
        )}

        <div
          className="placeholder-box"
          style={{ marginTop: 20 }}
        >
          <strong>
            {t("owner_note_title")}
          </strong>

          <p style={{ margin: "8px 0 0" }}>
            {t("owner_note")}
          </p>
        </div>
      </div>
    </section>
  );
}