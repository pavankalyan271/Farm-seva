import React from "react";

export default function Farmer(): JSX.Element {
  return (
    <section className="page page-farmer">
      <div className="container">
        <h1>Farmer</h1>
        <p>
          This is the Farmer entry point. In later steps you will be able to find nearby machinery,
          request rentals, or hire operators.
        </p>
        <div className="placeholder-box">
          <strong>Farmer tools and search will appear here in later steps.</strong>
        </div>
      </div>
    </section>
  );
}
