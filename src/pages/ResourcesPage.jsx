import { useState } from 'react';
import { documents } from '../data/documents.js';
import { countries } from '../data/countries.js';
import ScamAlert from '../components/ScamAlert.jsx';

const faqs = [
  {
    q: 'Do I need a travel agent to apply for a visa?',
    a: 'No. You can apply for almost every visa yourself through official portals. An adviser can help you prepare a stronger application, but nobody can influence the embassy’s decision.',
  },
  {
    q: 'How much money should be in my bank account?',
    a: 'There is usually no fixed figure for visit visas. Your balance should comfortably cover the trip and match your income and lifestyle. Student and some work visas have specific minimums. See the guide for your destination.',
  },
  {
    q: 'Can someone else sponsor my trip?',
    a: 'Yes. Include a sponsorship letter, the sponsor’s bank statements and proof of income, and evidence of your relationship (such as a birth certificate). Embassies still assess your own ties to Nigeria.',
  },
  {
    q: 'I was refused before. Can I apply again?',
    a: 'Usually yes, unless you received a ban. Read the refusal reasons carefully, fix them, and always declare the previous refusal. Hiding it can lead to a ban for deception.',
  },
  {
    q: 'Should I pay for a flight ticket before getting the visa?',
    a: 'Generally no. Most embassies accept a flight reservation or itinerary. Buy the ticket once your visa is approved.',
  },
  {
    q: 'How early should I apply?',
    a: 'For visit visas, 2–3 months before travel. For study, apply as soon as you have your admission letter. Book U.S. interviews as early as possible because wait times can be very long.',
  },
  {
    q: 'Are naira bank statements accepted?',
    a: 'Yes. Embassies accept statements from Nigerian banks in naira. They convert using current exchange rates, so allow a buffer for exchange-rate changes.',
  },
];

export default function ResourcesPage() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Resources</h1>
          <p className="lead">Nigerian documents explained, official links and answers to common questions.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Getting your Nigerian documents ready</h2>
          <div className="grid doc-grid">
            {Object.entries(documents).map(([id, d]) => (
              <div key={id} className="card doc-card">
                <h3>{d.name}</h3>
                <p>{d.detail}</p>
                {d.where && <p className="where">📍 {d.where}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Official immigration websites</h2>
          <div className="grid link-grid">
            <a className="card link-card" href="https://immigration.gov.ng" target="_blank" rel="noreferrer">
              <span className="flag">🇳🇬</span>
              <span><strong>Nigeria Immigration Service</strong><small>Passport applications</small></span>
            </a>
            {Object.values(countries).map((c) => (
              <a key={c.id} className="card link-card" href={c.officialUrl} target="_blank" rel="noreferrer">
                <span className="flag">{c.flag}</span>
                <span><strong>{c.name}</strong><small>{c.officialLabel}</small></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2 className="section-title">Frequently asked questions</h2>
          <div className="faq">
            {faqs.map((f, i) => (
              <div key={f.q} className={`faq-item ${openIdx === i ? 'open' : ''}`}>
                <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} aria-expanded={openIdx === i}>
                  {f.q}
                  <span>{openIdx === i ? '−' : '+'}</span>
                </button>
                {openIdx === i && <p>{f.a}</p>}
              </div>
            ))}
          </div>
          <ScamAlert />
        </div>
      </section>
    </>
  );
}
