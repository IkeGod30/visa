import { Link } from 'react-router-dom';
import { objectives } from '../data/objectives.js';
import { destinationsFor } from '../data/guides.js';
import { countries } from '../data/countries.js';
import ScamAlert from '../components/ScamAlert.jsx';

const steps = [
  { n: 1, title: 'Choose your purpose', text: 'Tell us why you are travelling. Visa rules depend on it.' },
  { n: 2, title: 'Pick a destination', text: 'See the right visa type, fees, timelines and where to apply from Nigeria.' },
  { n: 3, title: 'Prepare your documents', text: 'Tick off a checklist built for Nigerian applicants and track your progress.' },
  { n: 4, title: 'Get assistance', text: 'Check your readiness, or ask an adviser to review your case.' },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">For Nigerians travelling abroad</p>
            <h1>Get the right visa, the right way.</h1>
            <p className="lead">
              Step-by-step advice on visas for the UK, USA, Canada, Western and Eastern Europe, Australia and more, written for
              applicants in Lagos, Abuja and across Nigeria.
            </p>
            <div className="hero-actions">
              <a href="#purpose" className="btn btn-gold">Choose travel purpose</a>
              <Link to="/assessment" className="btn btn-ghost">Check my readiness</Link>
            </div>
          </div>
          <div className="hero-card">
            <h3>Popular right now</h3>
            <ul>
              <li><Link to="/purpose/study/uk">🇬🇧 UK Student visa</Link></li>
              <li><Link to="/purpose/relocation/canada">🇨🇦 Canada Express Entry</Link></li>
              <li><Link to="/purpose/visit/schengen">🇪🇺 Schengen visit visa</Link></li>
              <li><Link to="/purpose/work/germany">🇩🇪 Germany Opportunity Card</Link></li>
              <li><Link to="/purpose/study/poland">🇵🇱 Poland student visa</Link></li>
              <li><Link to="/purpose/study/hungary">🇭🇺 Hungary study (Stipendium Hungaricum)</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section id="purpose" className="section">
        <div className="container">
          <h2 className="section-title">What is the purpose of your trip?</h2>
          <p className="section-sub">Select an option to see suitable visas and destinations.</p>
          <div className="grid objective-grid">
            {objectives.map((o) => (
              <Link key={o.id} to={`/purpose/${o.id}`} className="card objective-card">
                <span className="objective-icon">{o.icon}</span>
                <h3>{o.title}</h3>
                <p>{o.tagline}</p>
                <span className="flags">
                  {destinationsFor(o.id).map((c) => (
                    <span key={c} title={countries[c].name}>{countries[c].flag}</span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="grid steps-grid">
            {steps.map((s) => (
              <div key={s.n} className="step">
                <span className="step-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScamAlert />
        </div>
      </section>
    </>
  );
}
