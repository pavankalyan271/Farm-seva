import React from "react";

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

const MACHINERY_OPTIONS = ["Tractor", "Harvester", "Rotavator", "Cultivator", "Sprayer", "Other"];

function validatePhone(phone: string) {
  const cleaned = phone.replace(/\s+/g, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}

export default function MachineryOwner(): React.ReactElement {
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

  // Location capture state
  const [locStatus, setLocStatus] = React.useState<string | null>(null);
  const [locBusy, setLocBusy] = React.useState<boolean>(false);

  const validate = React.useCallback((values: OwnerProfile) => {
    const e: Record<string, string> = {};

    if (!values.fullName.trim()) e.fullName = "Full name is required.";
    else if (values.fullName.trim().length < 3) e.fullName = "Full name must be at least 3 characters.";

    if (!values.phone.trim()) e.phone = "Phone number is required.";
    else if (!validatePhone(values.phone)) e.phone = "Enter a valid 10-digit Indian mobile number starting with 6-9.";

    if (!values.village.trim()) e.village = "Village or city is required.";
    else if (values.village.trim().length < 2) e.village = "Village or city must be at least 2 characters.";

    if (!values.location.trim()) e.location = "Location is required.";

    if (!values.machineryType) e.machineryType = "Select a machinery type.";
    if (!values.machineName.trim()) e.machineName = "Machine name or model is required.";
    else if (values.machineName.trim().length < 2) e.machineName = "Machine name must be at least 2 characters.";

    const rent = parseFloat(values.rentPrice);
    if (values.rentPrice.trim() === "") e.rentPrice = "Rent price per hour is required.";
    else if (Number.isNaN(rent) || rent <= 0) e.rentPrice = "Enter a positive number for rent price.";

    const op = parseFloat(values.operatorPrice);
    if (values.operatorPrice.trim() === "") e.operatorPrice = "Operator service price per hour is required.";
    else if (Number.isNaN(op) || op <= 0) e.operatorPrice = "Enter a positive number for operator service price.";

    if (!values.availability) e.availability = "Select availability.";

    if (!values.password) e.password = "Password is required.";
    else if (values.password.length < 6) e.password = "Password must be at least 6 characters.";

    if (!values.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (values.password !== values.confirmPassword) e.confirmPassword = "Passwords do not match.";

    return e;
  }, []);

  React.useEffect(() => {
    setErrors(validate(form));
  }, [form, validate]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
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
      if (el) (el as HTMLElement).focus();
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
    <section className="page page-owner">
      <div className="container">
        <h1>Machinery Owner Registration</h1>
        <p>Register as a machinery owner and add a machine you want to offer to farmers.</p>

        {!submitted && (
          <form className="form-card" onSubmit={handleSubmit} noValidate aria-describedby="owner-form-instructions">
            <p id="owner-form-instructions" className="sr-only">
              Fill in owner and machinery details. All fields are required. Use the keyboard to navigate.
            </p>

            <h2 className="section-title">Owner Information</h2>

            <div className="form-row">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" name="fullName" type="text" autoComplete="name" value={form.fullName} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined} placeholder="e.g., Suresh Patel" />
              {touched.fullName && errors.fullName && <div id="fullName-error" className="field-error" role="alert" aria-live="polite">{errors.fullName}</div>}
            </div>

            <div className="form-row">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} placeholder="10-digit mobile number" />
              {touched.phone && errors.phone && <div id="phone-error" className="field-error" role="alert" aria-live="polite">{errors.phone}</div>}
            </div>

            <div className="form-row">
              <label htmlFor="village">Village or City</label>
              <input id="village" name="village" type="text" autoComplete="address-level2" value={form.village} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.village} aria-describedby={errors.village ? "village-error" : undefined} placeholder="e.g., Ahmednagar" />
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

            <h2 className="section-title">Machinery Information</h2>

            <div className="form-row">
              <label htmlFor="machineryType">Machinery Type</label>
              <select id="machineryType" name="machineryType" value={form.machineryType} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.machineryType} aria-describedby={errors.machineryType ? "machineryType-error" : undefined}>
                <option value="">Select machinery type</option>
                {MACHINERY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              {touched.machineryType && errors.machineryType && <div id="machineryType-error" className="field-error" role="alert" aria-live="polite">{errors.machineryType}</div>}
            </div>

            <div className="form-row">
              <label htmlFor="machineName">Machine Name / Model</label>
              <input id="machineName" name="machineName" type="text" value={form.machineName} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.machineName} aria-describedby={errors.machineName ? "machineName-error" : undefined} placeholder="e.g., Mahindra 275 DI" />
              {touched.machineName && errors.machineName && <div id="machineName-error" className="field-error" role="alert" aria-live="polite">{errors.machineName}</div>}
            </div>

            <div className="form-row two-col">
              <div>
                <label htmlFor="rentPrice">Rent Machine (Farmer operates)</label>
                <input id="rentPrice" name="rentPrice" type="number" min="0" step="0.5" value={form.rentPrice} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.rentPrice} aria-describedby={errors.rentPrice ? "rentPrice-error" : undefined} placeholder="e.g., 800" />
                {touched.rentPrice && errors.rentPrice && <div id="rentPrice-error" className="field-error" role="alert" aria-live="polite">{errors.rentPrice}</div>}
                <div className="price-note"><div className="price-title">Rent Machine</div><div className="price-desc">Farmer operates the machine</div></div>
              </div>

              <div>
                <label htmlFor="operatorPrice">With Operator (Owner performs work)</label>
                <input id="operatorPrice" name="operatorPrice" type="number" min="0" step="0.5" value={form.operatorPrice} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.operatorPrice} aria-describedby={errors.operatorPrice ? "operatorPrice-error" : undefined} placeholder="e.g., 1200" />
                {touched.operatorPrice && errors.operatorPrice && <div id="operatorPrice-error" className="field-error" role="alert" aria-live="polite">{errors.operatorPrice}</div>}
                <div className="price-note"><div className="price-title">With Operator</div><div className="price-desc">Owner/operator performs the work</div></div>
              </div>
            </div>

            <div className="form-row">
              <label>Availability</label>
              <div className="availability-row" role="radiogroup" aria-labelledby="availability-label">
                <label className="radio"><input id="availability-available" name="availability" type="radio" value="available" checked={form.availability === "available"} onChange={handleChange} /> <span>Available</span></label>
                <label className="radio"><input id="availability-unavailable" name="availability" type="radio" value="unavailable" checked={form.availability === "unavailable"} onChange={handleChange} /> <span>Currently unavailable</span></label>
              </div>
              {touched.availability && errors.availability && <div id="availability-error" className="field-error" role="alert" aria-live="polite">{errors.availability}</div>}
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
              <button type="submit" className="btn-primary">Register Machinery</button>
              <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
            </div>
          </form>
        )}

        {submitted && (
          <div className="success-card" role="status" aria-live="polite">
            <h2>Registration Successful</h2>
            <p>Your owner profile and machinery details have been recorded for this session.</p>

            <div className="summary">
              <div><strong>Owner</strong><div>{form.fullName}</div></div>
              <div><strong>Phone</strong><div>{form.phone}</div></div>
              <div><strong>Village / City</strong><div>{form.village}</div></div>
              <div><strong>Location</strong><div>{form.location}</div></div>
              {form.latitude != null && form.longitude != null && (
                <div><strong>Coordinates</strong><div>Lat: {form.latitude.toFixed(6)}, Lon: {form.longitude.toFixed(6)}</div></div>
              )}
              <div><strong>Machinery Type</strong><div>{form.machineryType}</div></div>
              <div><strong>Machine Name / Model</strong><div>{form.machineName}</div></div>

              <div className="price-summary">
                <div className="price-card">
                  <div className="price-title">Rent Machine</div>
                  <div className="price-amount">₹{parseFloat(form.rentPrice || "0").toFixed(2)} / hour</div>
                  <div className="price-desc">Farmer operates the machine</div>
                </div>

                <div className="price-card">
                  <div className="price-title">With Operator</div>
                  <div className="price-amount">₹{parseFloat(form.operatorPrice || "0").toFixed(2)} / hour</div>
                  <div className="price-desc">Owner/operator performs the work</div>
                </div>
              </div>

              <div><strong>Availability</strong><div>{form.availability === "available" ? "Available" : "Currently unavailable"}</div></div>
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
            This is a frontend-only registration. No backend or authentication is used. Data is stored only in localStorage for this demo.
          </p>
        </div>
      </div>
    </section>
  );
}
