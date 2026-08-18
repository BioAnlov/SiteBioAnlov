import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="cta">
      <div>
        <p className="eyebrow">
          <span />
          Parlons de vos besoins
        </p>
        <h2>Votre soumission commence par une visite</h2>
      </div>
      <Link className="button light" to="/soumission">
        Demander une soumission →
      </Link>
    </section>
  );
}
