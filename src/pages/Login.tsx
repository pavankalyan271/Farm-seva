import React from "react";

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
  const [state, setState] = React.useState<LoginState>({
    role: "farmer",
    phone: "",
    password: "",
  });
  const [error, setError] = React.useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
      setError("Enter a valid 10-digit Indian mobile number starting with 6-9.");
      return;
    }
    if (!state.password || state.password.length < 6) {
      setError("Password is required and must be at least 6 characters.");
      return;
    }

    const accounts = loadAccounts();
    const match = accounts.find(
      (a) => a.role === state.role && a.phone.replace(/\s+/g, "") === state.phone.replace(/\s+/g, "")
    );

    if (!match) {
      setError("No account found for this phone and role. Please register first.");
      return;
    }

    if (match.password !== state.password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // success: save session
    localStorage.setItem("farmseva_session", JSON.stringify({ role: state.role, phone: state.phone }));
    // redirect to dashboard
    if (state.role === "farmer") window.location.hash = "#/farmer-dashboard";
    else window.location.hash = "#/owner-dashboard";
  }

  return (
    <section className="page page-login">
      <div className="container">
        <h1>Login</h1>
        <p className="lead">Demo authentication only — production authentication requires a secure backend.</p>

        <form className="form-card" onSubmit={handleSubmit} noValidate aria-live="polite">
          <div className="form-row">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={state.role} onChange={handleChange}>
              <option value="farmer">Farmer</option>
              <option value="owner">Machinery Owner</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={state.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={state.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />
          </div>

          {error && (
            <div className="field-error" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">Login</button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                // navigate to registration based on selected role
                if (state.role === "farmer") window.location.hash = "#/farmer";
                else window.location.hash = "#/owner";
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
