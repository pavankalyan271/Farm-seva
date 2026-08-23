import React from "react";

export default function Header(): JSX.Element {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden>🚜</span>
          <span className="brand-text">Farm Seva</span>
        </a>

        <input id="nav-toggle" className="nav-toggle" type="checkbox" aria-hidden />
        <nav className="site-nav" role="navigation" aria-label="Main navigation">
          <a className="nav-link" href="#/">Home</a>
          <a className="nav-link" href="#/farmer">Farmer</a>
          <a className="nav-link" href="#/owner">Machinery Owner</a>
        </nav>

        <label htmlFor="nav-toggle" className="nav-toggle-label" aria-hidden>
          <span className="hamburger" />
        </label>
      </div>
    </header>
  );
}
