import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { objectives, getObjective } from '../data/objectives.js';
import { countries } from '../data/countries.js';
import { destinationsFor } from '../data/guides.js';
import { load, save } from '../utils/storage.js';
import ScamAlert from '../components/ScamAlert.jsx';

const STORAGE_KEY = 'vs-requests';

const STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi',
  'Edo', 'Ekiti', 'Enugu', 'FCT – Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'Outside Nigeria',
];

const SERVICES = [
  { icon: '📋', title: 'Document review', text: 'An adviser checks your documents against the requirements and flags weak points.' },
  { icon: '🗺️', title: 'Route planning', text: 'Find the visa route that fits your goals, budget and profile.' },
  { icon: '✍️', title: 'Letters & statements', text: 'Help writing cover letters, statements of purpose and letters of explanation.' },
  { icon: '🎤', title: 'Interview preparation', text: 'Mock U.S. visa and credibility interviews with feedback.' },
  { icon: '🔁', title: 'Refusal review', text: 'Understand why you were refused and plan a stronger reapplication.' },
];

const empty = { name: '', email: '', phone: '', state: '', objective: '', country: '', service: '', timeline: '', message: '', consent: false };

export default function AssistPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ ...empty, objective: params.get('objective') || '', country: params.get('country') || '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [requests, setRequests] = useState(() => load(STORAGE_KEY, []));

  const objective = getObjective(form.objective);
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value, ...(field === 'objective' ? { country: '' } : {}) }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!/^(\+?234|0)[789][01]\d{8}$/.test(form.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid Nigerian number, e.g. 0803 123 4567 or +234 803 123 4567.';
    if (!form.objective) e.objective = 'Select your purpose of travel.';
    if (!form.service) e.service = 'Select the help you need.';
    if (!form.consent) e.consent = 'Please confirm to continue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const request = {
      ...form,
      ref: `VS-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'Received',
    };
    const next = [request, ...requests];
    setRequests(next);
    save(STORAGE_KEY, next);
    setSubmitted(request);
    setForm(empty);
  };

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Get Visa Assistance</h1>
          <p className="lead">Tell us about your plans and an adviser will contact you about the next steps.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid services-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="card service">
                <span className="objective-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>

          <div className="guide-layout">
            <div className="guide-main">
              {submitted ? (
                <div className="card success">
                  <h2>✅ Request received</h2>
                  <p>
                    Thank you, {submitted.name.split(' ')[0]}. Your reference number is <strong>{submitted.ref}</strong>.
                  </p>
                  <p className="muted">
                    We will contact you at {submitted.email} or {submitted.phone}. We will never ask you to pay visa fees
                    into a personal account.
                  </p>
                  <button className="btn" onClick={() => setSubmitted(null)}>Submit another request</button>
                </div>
              ) : (
                <form className="card form" onSubmit={submit} noValidate>
                  <h2>Request assistance</h2>
                  <div className="form-grid">
                    <Field label="Full name" error={errors.name}>
                      <input value={form.name} onChange={set('name')} autoComplete="name" />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                    </Field>
                    <Field label="Phone / WhatsApp" error={errors.phone}>
                      <input type="tel" value={form.phone} onChange={set('phone')} placeholder="0803 123 4567" autoComplete="tel" />
                    </Field>
                    <Field label="State of residence">
                      <select value={form.state} onChange={set('state')}>
                        <option value="">Select…</option>
                        {STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Purpose of travel" error={errors.objective}>
                      <select value={form.objective} onChange={set('objective')}>
                        <option value="">Select…</option>
                        {objectives.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                      </select>
                    </Field>
                    <Field label="Destination">
                      <select value={form.country} onChange={set('country')} disabled={!objective}>
                        <option value="">Not sure yet</option>
                        {objective && destinationsFor(objective.id).map((c) => (
                          <option key={c} value={c}>{countries[c].name}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Help needed" error={errors.service}>
                      <select value={form.service} onChange={set('service')}>
                        <option value="">Select…</option>
                        {SERVICES.map((s) => <option key={s.title}>{s.title}</option>)}
                      </select>
                    </Field>
                    <Field label="When do you plan to travel?">
                      <select value={form.timeline} onChange={set('timeline')}>
                        <option value="">Select…</option>
                        <option>Within 1 month</option>
                        <option>1–3 months</option>
                        <option>3–6 months</option>
                        <option>6–12 months</option>
                        <option>Over a year / just exploring</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Tell us about your situation">
                    <textarea rows={5} value={form.message} onChange={set('message')} placeholder="e.g. I have a UK master's offer starting January, sponsored by my parents. I was refused once in 2024…" />
                  </Field>
                  <label className="consent">
                    <input type="checkbox" checked={form.consent} onChange={set('consent')} />
                    I understand that VisaSolutions provides guidance only and cannot guarantee a visa decision.
                  </label>
                  {errors.consent && <span className="error">{errors.consent}</span>}
                  <button type="submit" className="btn btn-gold">Submit request</button>
                </form>
              )}
            </div>

            <aside className="guide-side">
              {requests.length > 0 && (
                <div className="card">
                  <h3>Your requests</h3>
                  <ul className="request-list">
                    {requests.map((r) => (
                      <li key={r.ref}>
                        <strong>{r.ref}</strong>
                        <span>{getObjective(r.objective)?.title}{r.country && ` · ${countries[r.country]?.name}`}</span>
                        <small className="muted">{new Date(r.createdAt).toLocaleDateString('en-NG')} · {r.status}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <ScamAlert />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label>
        {label}
        {children}
      </label>
      {error && <span className="error">{error}</span>}
    </div>
  );
}
