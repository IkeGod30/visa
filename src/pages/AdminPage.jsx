import { useEffect, useMemo, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app, firebaseReady } from '../firebase.js';
import { STATUSES, subscribeToRequests, updateRequest } from '../services/requests.js';
import { SERVICES, getService, EXTRA_FIELDS } from '../data/services.js';
import { getObjective } from '../data/objectives.js';
import { countries } from '../data/countries.js';

const auth = app ? getAuth(app) : null;

export default function AdminPage() {
  const [user, setUser] = useState(undefined); // undefined = still checking

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setUser);
  }, []);

  return (
    <>
      <section className="page-head">
        <div className="container admin-head">
          <div>
            <h1>Requests dashboard</h1>
            <p className="lead">Assistance requests submitted through the website.</p>
          </div>
          {user && (
            <div className="admin-user">
              <span className="muted">{user.email}</span>
              <button className="btn btn-ghost-dark btn-sm" onClick={() => signOut(auth)}>Sign out</button>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!firebaseReady ? (
            <div className="alert alert-warn">
              Firebase is not configured. Copy <code>.env.example</code> to <code>.env.local</code>, add your project keys and
              restart the dev server.
            </div>
          ) : user === undefined ? (
            <p className="muted">Loading…</p>
          ) : user === null ? (
            <LoginForm />
          ) : (
            <Dashboard />
          )}
        </div>
      </section>
    </>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(
        ['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(err.code)
          ? 'Incorrect email or password.'
          : 'Could not sign in. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form admin-login" onSubmit={submit}>
      <h2>Admin sign in</h2>
      <div className="field">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </label>
      </div>
      <div className="field">
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
      </div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <button className="btn btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}

function Dashboard() {
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('all');
  const [service, setService] = useState('all');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(
    () =>
      subscribeToRequests(setRequests, (err) =>
        setError(
          err.code === 'permission-denied'
            ? 'This account is not an admin. Ask the site owner to add your user ID to the admins collection.'
            : `Could not load requests: ${err.message}`
        )
      ),
    []
  );

  const counts = useMemo(() => {
    const c = { all: requests?.length || 0 };
    STATUSES.forEach((s) => (c[s.id] = requests?.filter((r) => r.status === s.id).length || 0));
    return c;
  }, [requests]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (requests || []).filter(
      (r) =>
        (status === 'all' || r.status === status) &&
        (service === 'all' || r.service === service) &&
        (!q || [r.name, r.email, r.ref, r.phone].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [requests, status, service, search]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!requests) return <p className="muted">Loading requests…</p>;

  return (
    <>
      <div className="admin-filters">
        <div className="chips">
          {[{ id: 'all', label: 'All' }, ...STATUSES].map((s) => (
            <button key={s.id} className={`chip ${status === s.id ? 'chip-active' : ''}`} onClick={() => setStatus(s.id)}>
              {s.label} <span className="chip-count">{counts[s.id]}</span>
            </button>
          ))}
        </div>
        <div className="admin-filter-row">
          <select value={service} onChange={(e) => setService(e.target.value)} aria-label="Filter by service">
            <option value="all">All services</option>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <input type="search" placeholder="Search name, email, phone or ref…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No requests match these filters.</p>
      ) : (
        <ul className="admin-list">
          {visible.map((r) => (
            <RequestRow key={r.id} request={r} open={openId === r.id} onToggle={() => setOpenId(openId === r.id ? null : r.id)} />
          ))}
        </ul>
      )}
    </>
  );
}

// Nigerian numbers (0803…, +234803…) → wa.me/234803…
const whatsappLink = (phone) => {
  const digits = (phone || '').replace(/\D/g, '');
  const intl = digits.startsWith('0') ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
};

const formatDate = (ts) => (ts?.toDate ? ts.toDate().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

function RequestRow({ request: r, open, onToggle }) {
  const [note, setNote] = useState(r.note || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNote(r.note || '');
  }, [r.note]);

  const save = async (changes) => {
    setSaving(true);
    setError('');
    try {
      await updateRequest(r.id, changes);
    } catch (err) {
      setError(`Could not save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const objective = getObjective(r.objective);
  const details = Object.entries(r.details || {}).filter(([, v]) => v);

  return (
    <li className={`card admin-row ${open ? 'open' : ''}`}>
      <button className="admin-row-head" onClick={onToggle} aria-expanded={open}>
        <span className={`status-pill status-${r.status}`}>{STATUSES.find((s) => s.id === r.status)?.label || r.status}</span>
        <span className="admin-row-main">
          <strong>{r.name}</strong>
          <span className="muted">
            {getService(r.service)?.title || r.service} · {objective?.title || r.objective}
            {r.country && ` · ${countries[r.country]?.name || r.country}`}
          </span>
        </span>
        <span className="admin-row-meta muted">
          <span>{r.ref}</span>
          <span>{formatDate(r.createdAt)}</span>
        </span>
      </button>

      {open && (
        <div className="admin-row-body">
          <dl className="admin-details">
            <div><dt>Email</dt><dd><a href={`mailto:${r.email}?subject=Your VisaSolutions request ${r.ref}`}>{r.email}</a></dd></div>
            <div><dt>Phone</dt><dd>{r.phone} · <a href={whatsappLink(r.phone)} target="_blank" rel="noreferrer">WhatsApp ↗</a></dd></div>
            {r.state && <div><dt>State</dt><dd>{r.state}</dd></div>}
            {r.timeline && <div><dt>Travel timeline</dt><dd>{r.timeline}</dd></div>}
            {details.map(([k, v]) => (
              <div key={k}><dt>{EXTRA_FIELDS[k]?.label || k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          {r.message && <blockquote className="admin-message">{r.message}</blockquote>}

          <div className="admin-actions">
            <label className="field">
              Status
              <select value={r.status} disabled={saving} onChange={(e) => save({ status: e.target.value })}>
                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <label className="field admin-note">
              Internal note
              <textarea rows={2} value={note} maxLength={2000} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Called on 6 Oct, sending school shortlist…" />
            </label>
            <button className="btn btn-sm" disabled={saving || note === (r.note || '')} onClick={() => save({ note })}>
              {saving ? 'Saving…' : 'Save note'}
            </button>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          {r.updatedAt && <p className="muted small">Last updated {formatDate(r.updatedAt)}</p>}
        </div>
      )}
    </li>
  );
}
