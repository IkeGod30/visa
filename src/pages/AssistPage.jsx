import { useRef, useState } from 'react';
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

// `objective` pre-selects a travel purpose when the service is picked from its card.
const SERVICE_GROUPS = [
  {
    title: 'Get there: admission, jobs & more',
    services: [
      { id: 'admission', icon: '🎓', title: 'Secure admission', objective: 'study', text: 'We shortlist suitable schools, check entry requirements and guide your application until you receive an offer (CAS, I-20, LOA, CoE).' },
      { id: 'scholarship', icon: '🏅', title: 'Find scholarships', objective: 'study', text: 'Get matched to funding such as Chevening, Commonwealth, DAAD and Stipendium Hungaricum, with help on your essays.' },
      { id: 'job', icon: '💼', title: 'Find a job abroad', objective: 'work', text: 'Rewrite your CV for the destination, find legitimate job boards and check that employers are licensed to sponsor you.' },
      { id: 'credentials', icon: '📑', title: 'Credentials & tests', text: 'Help with WES/ECA, qualification recognition and preparing for IELTS, PTE or CELPIP.' },
      { id: 'arrival', icon: '🧳', title: 'Accommodation & arrival', text: 'Find student housing or short-let accommodation, and plan your first weeks abroad.' },
    ],
  },
  {
    title: 'Visa application support',
    services: [
      { id: 'documents', icon: '📋', title: 'Document review', text: 'An adviser checks your documents against the requirements and flags weak points.' },
      { id: 'route', icon: '🗺️', title: 'Route planning', text: 'Find the visa route that fits your goals, budget and profile.' },
      { id: 'letters', icon: '✍️', title: 'Letters & statements', text: 'Help writing cover letters, statements of purpose and letters of explanation.' },
      { id: 'interview', icon: '🎤', title: 'Interview preparation', text: 'Mock U.S. visa and credibility interviews with feedback.' },
      { id: 'refusal', icon: '🔁', title: 'Refusal review', text: 'Understand why you were refused and plan a stronger reapplication.' },
    ],
  },
];
const SERVICES = SERVICE_GROUPS.flatMap((g) => g.services);
const getService = (id) => SERVICES.find((s) => s.id === id);

const QUALIFICATIONS = ['WAEC / NECO', 'OND / NCE', 'HND', 'Bachelor’s degree', 'Master’s degree', 'PhD'];

// Extra questions shown for specific services.
const EXTRA_FIELDS = {
  level: { label: 'Level of study', options: ['Foundation / Diploma', 'Undergraduate', 'Master’s', 'PhD', 'Language course'] },
  field: { label: 'Course / field of study', placeholder: 'e.g. Nursing, Computer Science, MBA' },
  qualification: { label: 'Highest qualification', options: QUALIFICATIONS },
  intake: { label: 'Preferred intake', placeholder: 'e.g. September 2027' },
  budget: { label: 'Yearly tuition budget', options: ['Under ₦10m', '₦10m–₦25m', '₦25m–₦50m', 'Over ₦50m', 'Need full scholarship'] },
  profession: { label: 'Profession / job title', placeholder: 'e.g. Registered Nurse, Software Engineer' },
  experience: { label: 'Years of experience', options: ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', 'Over 10 years'] },
};
const SERVICE_FIELDS = {
  admission: ['level', 'field', 'qualification', 'intake', 'budget'],
  scholarship: ['level', 'field', 'qualification', 'intake'],
  job: ['profession', 'experience', 'qualification'],
};
const REQUIRED_EXTRAS = ['level', 'field', 'profession', 'experience'];

const empty = {
  name: '', email: '', phone: '', state: '', objective: '', country: '', service: '', timeline: '', message: '', consent: false,
  ...Object.fromEntries(Object.keys(EXTRA_FIELDS).map((k) => [k, ''])),
};

export default function AssistPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    ...empty,
    objective: params.get('objective') || '',
    country: params.get('country') || '',
    service: getService(params.get('service')) ? params.get('service') : '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [requests, setRequests] = useState(() => load(STORAGE_KEY, []));
  const formRef = useRef(null);

  const objective = getObjective(form.objective);
  const extraFields = SERVICE_FIELDS[form.service] || [];
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value, ...(field === 'objective' ? { country: '' } : {}) }));
  };

  // Picking a service card selects it in the form and suggests a matching travel purpose.
  const chooseService = (service) => {
    setSubmitted(null);
    setForm((f) => ({
      ...f,
      service: service.id,
      ...(service.objective && !f.objective ? { objective: service.objective, country: '' } : {}),
    }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!/^(\+?234|0)[789][01]\d{8}$/.test(form.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid Nigerian number, e.g. 0803 123 4567 or +234 803 123 4567.';
    if (!form.objective) e.objective = 'Select your purpose of travel.';
    if (!form.service) e.service = 'Select the help you need.';
    extraFields
      .filter((k) => REQUIRED_EXTRAS.includes(k) && !form[k].trim())
      .forEach((k) => (e[k] = `Please provide your ${EXTRA_FIELDS[k].label.toLowerCase()}.`));
    if (!form.consent) e.consent = 'Please confirm to continue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Keep only the extra answers that belong to the chosen service.
    const extras = Object.fromEntries(extraFields.map((k) => [k, form[k]]));
    const base = Object.fromEntries(Object.entries(form).filter(([k]) => !(k in EXTRA_FIELDS)));
    const request = {
      ...base,
      details: extras,
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
          <h1>Get Assistance</h1>
          <p className="lead">
            From securing admission or a job offer to submitting your visa application, tell us what you need and an
            adviser will contact you about the next steps.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.title} className="service-group">
              <h2 className="section-title">{group.title}</h2>
              <div className="grid services-grid">
                {group.services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`card service ${form.service === s.id ? 'selected' : ''}`}
                    onClick={() => chooseService(s)}
                    aria-pressed={form.service === s.id}
                  >
                    <span className="objective-icon">{s.icon}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <span className="link-arrow">{form.service === s.id ? 'Selected ✓' : 'Request this →'}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="alert alert-warn">
            <strong>How we help with admissions and jobs:</strong> we guide you to apply directly to real schools and
            employers. We never sell admission letters, job offers, Certificates of Sponsorship or LMIAs. Decisions are
            made only by the institution, employer or embassy.
          </div>

          <div className="guide-layout" ref={formRef}>
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
                        {SERVICE_GROUPS.map((g) => (
                          <optgroup key={g.title} label={g.title}>
                            {g.services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                          </optgroup>
                        ))}
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
                  {extraFields.length > 0 && (
                    <fieldset className="extra-fields">
                      <legend>{getService(form.service).title}: a few more details</legend>
                      <div className="form-grid">
                        {extraFields.map((k) => {
                          const def = EXTRA_FIELDS[k];
                          return (
                            <Field key={k} label={def.label} error={errors[k]}>
                              {def.options ? (
                                <select value={form[k]} onChange={set(k)}>
                                  <option value="">Select…</option>
                                  {def.options.map((o) => <option key={o}>{o}</option>)}
                                </select>
                              ) : (
                                <input value={form[k]} onChange={set(k)} placeholder={def.placeholder} />
                              )}
                            </Field>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}
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
                        <span>{getService(r.service)?.title || r.service}</span>
                        <span className="muted">{getObjective(r.objective)?.title}{r.country && ` · ${countries[r.country]?.name || r.country}`}</span>
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
