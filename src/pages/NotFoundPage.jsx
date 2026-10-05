import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container center">
        <h1>Page not found</h1>
        <p className="lead">We could not find that page or visa guide.</p>
        <Link to="/" className="btn">Back to travel purposes</Link>
      </div>
    </section>
  );
}
