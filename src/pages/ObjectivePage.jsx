import { Link, useParams } from 'react-router-dom';
import { getObjective, objectives } from '../data/objectives.js';
import { guides } from '../data/guides.js';
import { countries } from '../data/countries.js';
import { documents } from '../data/documents.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function ObjectivePage() {
  const { objectiveId } = useParams();
  const objective = getObjective(objectiveId);
  if (!objective) return <NotFoundPage />;

  const destinations = Object.entries(guides[objective.id]);

  return (
    <>
      <section className="page-head">
        <div className="container">
          <Link to="/" className="back">← All travel purposes</Link>
          <h1>
            <span className="objective-icon">{objective.icon}</span> {objective.title}
          </h1>
          <p className="lead">{objective.description}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Choose your destination</h2>
          <div className="grid dest-grid">
            {destinations.map(([cid, g]) => {
              const c = countries[cid];
              return (
                <Link key={cid} to={`/purpose/${objective.id}/${cid}`} className="card dest-card">
                  <div className="dest-head">
                    <span className="flag">{c.flag}</span>
                    <div>
                      <h3>{c.name}</h3>
                      {c.subtitle && <small className="muted">{c.subtitle}</small>}
                    </div>
                  </div>
                  <p className="visa-name">{g.visa}</p>
                  <dl className="facts">
                    <div><dt>Fee</dt><dd>{g.fee}</dd></div>
                    <div><dt>Processing</dt><dd>{g.processing}</dd></div>
                  </dl>
                  <span className="link-arrow">View full guide →</span>
                </Link>
              );
            })}
          </div>

          <div className="two-col">
            <div className="card">
              <h3>Documents you will usually need</h3>
              <ul className="bullets">
                {objective.generalDocs.map((d) => (
                  <li key={d}>{documents[d].name}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3>Common reasons for refusal</h3>
              <ul className="bullets bullets-warn">
                {objective.refusalReasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="other-objectives">
            <span className="muted">Other purposes:</span>
            {objectives
              .filter((o) => o.id !== objective.id)
              .map((o) => (
                <Link key={o.id} to={`/purpose/${o.id}`} className="chip">
                  {o.icon} {o.title}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
