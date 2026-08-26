import type { ReactElement } from "react";

export default function Home(): ReactElement {
  return (
    <section className="page page-home">
      <div className="hero">
        <div className="hero-inner container">
          <div className="hero-text">
            <h1>Farm Seva</h1>
            <p className="lead">
              Farm Seva helps farmers find nearby agricultural machinery and helps machinery owners connect with farmers who need their services.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="entry-grid" style={{ marginTop: 18 }}>
          <a className="entry-card farmer" href="#/farmer" aria-label="Enter as Farmer">
            <div className="entry-icon">👩‍🌾</div>
            <h2>I'm a Farmer</h2>
            <p>Find nearby machinery, rent equipment, or hire an operator to do the work.</p>
          </a>

          <a className="entry-card owner" href="#/owner" aria-label="Enter as Machinery Owner">
            <div className="entry-icon">🔧</div>
            <h2>I'm a Machinery Owner</h2>
            <p>List and manage your machinery and connect with local farmers.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
