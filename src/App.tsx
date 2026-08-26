import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Farmer from "./pages/Farmer";
import MachineryOwner from "./pages/MachineryOwner";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import { useLanguage } from "./LanguageProvider";

/** small hash router */
function useHashRoute() {
  const [route, setRoute] = React.useState<string>(
    () => window.location.hash || "#/"
  );

  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return route;
}

/** read session from localStorage */
function getSession(): { role: string; phone: string } | null {
  try {
    const raw = localStorage.getItem("farmseva_session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App(): React.ReactElement {
  const route = useHashRoute();
  const session = getSession();
  const { t } = useLanguage();

  // Route guards for dashboards: check exact dashboard routes first
  if (route === "#/farmer-dashboard") {
    if (!session || session.role !== "farmer") {
      window.location.hash = "#/login";
      return <></>;
    }
  }

  if (route === "#/owner-dashboard") {
    if (!session || session.role !== "owner") {
      window.location.hash = "#/login";
      return <></>;
    }
  }

  // Route selection: check dashboard routes first, then other routes.
  let Page: React.ReactElement;

  if (route === "#/farmer-dashboard") Page = <FarmerDashboard />;
  else if (route === "#/owner-dashboard") Page = <OwnerDashboard />;
  else if (route === "#/login") Page = <Login />;
  else if (route === "#/farmer") Page = <Farmer />;
  else if (route === "#/owner") Page = <MachineryOwner />;
  else if (route === "#/" || route === "" || route === "#") Page = <Home />;
  else {
    // Fallback: unknown route -> Home
    Page = <Home />;
  }

  return (
    <div className="app-root">
      <Header />

      <main className="app-main">{Page}</main>

      <footer className="app-footer">
        <small>
          {t("footer_prototype")}
        </small>
      </footer>
    </div>
  );
}