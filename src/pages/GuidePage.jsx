import { Link, useParams } from 'react-router-dom';
import { getObjective } from '../data/objectives.js';
import { getGuide, DATA_AS_OF } from '../data/guides.js';
import { countries } from '../data/countries.js';
import { documents } from '../data/documents.js';
import Checklist from '../components/Checklist.jsx';
import ScamAlert from '../components/ScamAlert.jsx';
import NotFoundPage from './NotFoundPage.jsx';

export default function GuidePage() {
  const { objectiveId, countryId } = useParams();
  const objective = getObjective(objectiveId);
  const guide = getGuide(objectiveId, countryId);
  const country = countries[countryId];
  if (!objective || !guide || !country) return <NotFoundPage />;

  const checklistItems = [
    ...objective.generalDocs.map((id) => ({ id, ...documents[id] })),
    ...guide.requirements.map((r, i) => ({ id: `req-${i}`, name: r })),
  ];

  return (
    <>
      <section className="page-head">
        <div className="container">
          <Link to={`/purpose/${objective.id}`} className="back">← {objective.title} destinations</Link>
          <h1>
            <span className="flag">{country.flag}</span> {guide.visa}
          </h1>
          <p className="lead">
            {objective.title} · {country.name}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container guide-layout">
          <div className="guide-main">
            <div className="facts-strip">
              <div><span>Approx. fee</span><strong>{guide.fee}</strong></div>
              <div><span>Processing</span><strong>{guide.processing}</strong></div>
              <div><span>Length of stay</span><strong>{guide.stay}</strong></div>
            </div>

            {country.notice && <div className="alert alert-warn">{country.notice}</div>}

            <h2>Where to apply from Nigeria</h2>
            <p>{country.applyVia}</p>

            <h2>Application steps</h2>
            <ol className="steps-list">
              {country.process.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>

            <h2>Your document checklist</h2>
            <p className="muted">Tick items as you prepare them. Your progress is saved in this browser.</p>
            <Checklist storageKey={`vs-check:${objective.id}:${country.id}`} items={checklistItems} />

            <h2>Expert tips</h2>
            <ul className="bullets bullets-tip">
              {guide.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            <h2>Avoid these refusal triggers</h2>
            <ul className="bullets bullets-warn">
              {objective.refusalReasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          <aside className="guide-side">
            <div className="card sticky">
              <h3>Official source</h3>
              <p className="muted">
                Figures are indicative ({DATA_AS_OF}) and change often. Always confirm on the official website.
              </p>
              <a href={country.officialUrl} target="_blank" rel="noreferrer" className="btn btn-block">
                {country.officialLabel} ↗
              </a>
              <hr />
              <h3>Need help?</h3>
              <p className="muted">Check how ready you are, or ask an adviser to review your documents.</p>
              <Link to={`/assessment?objective=${objective.id}&country=${country.id}`} className="btn btn-ghost-dark btn-block">
                Readiness check
              </Link>
              <Link to={`/assist?objective=${objective.id}&country=${country.id}`} className="btn btn-gold btn-block">
                Request assistance
              </Link>
              {objective.id === 'study' && (
                <Link to={`/assist?objective=study&country=${country.id}&service=admission`} className="btn btn-ghost-dark btn-block">
                  🎓 Help me secure admission
                </Link>
              )}
              {objective.id === 'work' && (
                <Link to={`/assist?objective=work&country=${country.id}&service=job`} className="btn btn-ghost-dark btn-block">
                  💼 Help me find a job
                </Link>
              )}
              <button className="btn btn-link btn-block" onClick={() => window.print()}>
                🖨 Print this guide
              </button>
            </div>
            <ScamAlert compact />
          </aside>
        </div>
      </section>
    </>
  );
}
