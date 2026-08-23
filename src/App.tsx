import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Farmer from "./pages/Farmer";
import MachineryOwner from "./pages/MachineryOwner";

function useHashRoute() {
  const [route, setRoute] = React.useState<string>(() => window.location.hash || "#/");
  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

export default function App(): JSX.Element {
  const route = useHashRoute();

  let Page: JSX.Element;
  if (route.startsWith("#/farmer")) Page = <Farmer />;
  else if (route.startsWith("#/owner")) Page = <MachineryOwner />;
  else Page = <Home />;

  return (
    <div className="app-root">
      <Header />
      <main className="app-main">{Page}</main>
      <footer className="app-footer">
        <small>Farm Seva — Prototype shell</small>
      </footer>
    </div>
  );
}
