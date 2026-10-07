import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { objectives, getObjective } from '../data/objectives.js';
import { countries } from '../data/countries.js';
import { destinationsFor } from '../data/guides.js';
import { load, save } from '../utils/storage.js';
import ScamAlert from '../components/ScamAlert.jsx';
import { SERVICE_GROUPS, getService, EXTRA_FIELDS, SERVICE_FIELDS, REQUIRED_EXTRAS } from '../data/services.js';

const STORAGE_KEY = 'vs-requests';

const STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi',
  'Edo', 'Ekiti', 'Enugu', 'FCT – Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'Outside Nigeria',
];

const empty = {
  name: '', email: '', phone: '', state: '', objective: '', country: '', service: '', timeline: '', message: '', consent: false,
  website: '', // honeypot — real users never see or fill this
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
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
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

  const submit = async (e) => {
    e.preventDefault();
    if (sending || !validate()) return;
    const ref = `VS-${Date.now().toString(36).toUpperCase()}`;
    const confirm = () => {
      setSubmitted({ ref, name: form.name, email: form.email, phone: form.phone });
      setForm(empty);
    };
    // Bots fill the hidden field; pretend success so they don't retry.
    if (form.website) return confirm();

    setSending(true);
    setSendError('');
    try {
      // Firebase is loaded on demand so it doesn't weigh down the public pages.
      const { submitRequest } = await import('../services/requests.js');
      await submitRequest({
        ref,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        state: form.state,
        objective: form.objective,
        country: form.country,
        service: form.service,
        timeline: form.timeline,
        message: form.message.trim(),
        // Keep only the extra answers that belong to the chosen service.
        details: Object.fromEntries(extraFields.map((k) => [k, form[k].trim()])),
        consentAt: new Date().toISOString(),
      });
      // A slim local copy powers the "Your requests" list for this visitor.
      const next = [
        { ref, service: form.service, objective: form.objective, country: form.country, createdAt: new Date().toISOString(), status: 'Sent' },
        ...requests,
      ];
      setRequests(next);
      save(STORAGE_KEY, next);
      confirm();
    } catch (err) {
      console.error('Failed to submit request', err);
      setSendError('We couldn’t send your request. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
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
                <form className="card form" onSubmit={submit} onFocus={preloadFirebase} noValidate>
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
                  <div className="honeypot" aria-hidden="true">
                    <label>
                      Website
                      <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
                    </label>
                  </div>
                  <label className="consent">
                    <input type="checkbox" checked={form.consent} onChange={set('consent')} />
                    I agree that VisaSolutions may store my details to contact me about this request, and I understand
                    that VisaSolutions provides guidance only and cannot guarantee any admission, job or visa decision.
                  </label>
                  {errors.consent && <span className="error">{errors.consent}</span>}
                  {sendError && <div className="alert alert-error" role="alert">{sendError}</div>}
                  <button type="submit" className="btn btn-gold" disabled={sending}>
                    {sending ? 'Sending…' : 'Submit request'}
                  </button>
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
                        <small className="muted">{new Date(r.createdAt).toLocaleDateString('en-NG')} · {r.status === 'Received' ? 'Saved on this device only' : r.status}</small>
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

// Start downloading Firebase once the visitor begins filling in the form (import() is cached).
const preloadFirebase = () => {
  import('../services/requests.js');
};

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
