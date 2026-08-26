import React from "react";

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

  const validate = React.useCallback((values: FarmerProfile) => {
    const e: Record<string, string> = {};
    if (!values.fullName.trim()) e.fullName = "Full name is required.";
    else if (values.fullName.trim().length < 3) e.fullName = "Full name must be at least 3 characters.";

    if (!values.phone.trim()) e.phone = "Phone number is required.";
    else if (!validatePhone(values.phone)) e.phone = "Enter a valid 10-digit Indian mobile number starting with 6-9.";

    if (!values.village.trim()) e.village = "Village or city is required.";
    else if (values.village.trim().length < 2) e.village = "Village or city must be at least 2 characters.";

    if (!values.location.trim()) e.location = "Location is required.";

    if (!values.password) e.password = "Password is required.";
    else if (values.password.length < 6) e.password = "Password must be at least 6 characters.";

    if (!values.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (values.password !== values.confirmPassword) e.confirmPassword = "Passwords do not match.";

    return e;
  }, []);

  React.useEffect(() => {
    setErrors(validate(form));
  }, [form, validate]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
      (a) => !(a.role === account.role && a.phone.replace(/\s+/g, "") === account.phone.replace(/\s+/g, ""))
    );
    filtered.push(account);
    localStorage.setItem("farmseva_accounts", JSON.stringify(filtered));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    setTouched({ fullName: true, phone: true, village: true, location: true, password: true, confirmPassword: true });

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
        password: form.password, // stored in localStorage for prototype only
      };
      saveAccount(account);
      setSubmitted(true);
      setLocStatus(null);
    } else {
      setSubmitted(false);
      const firstInvalid = Object.keys(validation)[0];
      const el = document.getElementById(firstInvalid);
      if (el) (el as HTMLElement).focus();
    }
  }

  function handleReset() {
    setForm({ fullName: "", phone: "", village: "", location: "", password: "", confirmPassword: "", latitude: null, longitude: null });
    setTouched({});
    setErrors({});
    setSubmitted(false);
    setLocStatus(null);
  }

  // Geolocation capture — only when user clicks the button
  function captureLocation() {
    setLocStatus(null);

    if (!("geolocation" in navigator)) {
      setLocStatus("Geolocation is not supported by your browser.");
      return;
    }

    setLocBusy(true);
    setLocStatus("Requesting location permission...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setForm((s) => ({ ...s, latitude: lat, longitude: lon }));
        setLocStatus("Location captured successfully.");
        setLocBusy(false);
      },
      (err) => {
        // Friendly error messages
        if (err.code === err.PERMISSION_DENIED) {
          setLocStatus("Permission denied. You can continue using text location or try again.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocStatus("Location unavailable. Please try again later.");
        } else if (err.code === err.TIMEOUT) {
          setLocStatus("Location request timed out. Please try again.");
        } else {
          setLocStatus("Unable to capture location. Please try again.");
        }
        setLocBusy(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 }
    );
  }

  return (
    <section className="page page-farmer">
      <div className="container">
        <h1>Farmer Registration</h1>
        <p>
          Create a basic Farm Seva profile so we can use your location later to find nearby machinery.
        </p>

        {!submitted && (
          <form className="form-card" onSubmit={handleSubmit} noValidate aria-describedby="form-instructions">
            <p id="form-instructions" className="sr-only">
              All fields are required. Use the keyboard to navigate. Validation messages appear below fields.
            </p>

            <div className="form-row">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" name="fullName" type="text" autoComplete="name" value={form.fullName} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined} placeholder="e.g., Ramesh Kumar" />
              {touched.fullName && errors.fullName && <div id="fullName-error" className="field-error" role="alert" aria-live="polite">{errors.fullName}</div>}
            </div>

            <div className="form-row">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} placeholder="10-digit mobile number" />
              {touched.phone && errors.phone && <div id="phone-error" className="field-error" role="alert" aria-live="polite">{errors.phone}</div>}
            </div>

            <div className="form-row">
              <label htmlFor="village">Village or City</label>
              <input id="village" name="village" type="text" autoComplete="address-level2" value={form.village} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.village} aria-describedby={errors.village ? "village-error" : undefined} placeholder="e.g., Kheda" />
              {touched.village && errors.village && <div id="village-error" className="field-error" role="alert" aria-live="polite">{errors.village}</div>}
            </div>

            <div className="form-row">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" type="text" autoComplete="off" value={form.location} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.location} aria-describedby={errors.location ? "location-error" : undefined} placeholder="Enter village, city, or nearby landmark" />
              {touched.location && errors.location && <div id="location-error" className="field-error" role="alert" aria-live="polite">{errors.location}</div>}
            </div>

            {/* Use My Current Location */}
            <div className="form-row" style={{ marginTop: 6 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={captureLocation}
                  disabled={locBusy}
                  aria-live="polite"
                >
                  {locBusy ? "Detecting location…" : "Use My Current Location"}
                </button>

                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  {form.latitude != null && form.longitude != null ? (
                    <span aria-live="polite">Location detected</span>
                  ) : (
                    <span aria-live="polite">No coordinates captured</span>
                  )}
                </div>
              </div>

              {locStatus && (
                <div className="field-note" role="status" aria-live="polite" style={{ marginTop: 8 }}>
                  {locStatus}
                </div>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} placeholder="Minimum 6 characters" />
              {touched.password && errors.password && <div id="password-error" className="field-error" role="alert" aria-live="polite">{errors.password}</div>}
            </div>

            <div className="form-row">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined} placeholder="Repeat password" />
              {touched.confirmPassword && errors.confirmPassword && <div id="confirmPassword-error" className="field-error" role="alert" aria-live="polite">{errors.confirmPassword}</div>}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Register</button>
              <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
            </div>
          </form>
        )}

        {submitted && (
          <div className="success-card" role="status" aria-live="polite">
            <h2>Registration Successful</h2>
            <p>Your farmer profile has been created locally in this session.</p>

            <div className="summary">
              <div><strong>Full Name</strong><div>{form.fullName}</div></div>
              <div><strong>Phone</strong><div>{form.phone}</div></div>
              <div><strong>Village / City</strong><div>{form.village}</div></div>
              <div><strong>Location</strong><div>{form.location}</div></div>
              {form.latitude != null && form.longitude != null && (
                <div><strong>Coordinates</strong><div>Lat: {form.latitude.toFixed(6)}, Lon: {form.longitude.toFixed(6)}</div></div>
              )}
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={() => setSubmitted(false)}>Edit</button>
              <button className="btn-secondary" onClick={handleReset}>Register Another</button>
            </div>
          </div>
        )}

        <div className="placeholder-box" style={{ marginTop: 20 }}>
          <strong>Note</strong>
          <p style={{ margin: "8px 0 0" }}>
            This is a frontend-only registration. No backend or authentication is used. The profile is stored only in localStorage for this demo.
          </p>
        </div>
      </div>
    </section>
  );
}
