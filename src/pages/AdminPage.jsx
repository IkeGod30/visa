import { useEffect, useMemo, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app, firebaseReady } from '../firebase.js';
import { STATUSES, subscribeToRequests, updateRequest } from '../services/requests.js';
import { SERVICES, getService, EXTRA_FIELDS } from '../data/services.js';
import { getObjective } from '../data/objectives.js';
import { countries } from '../data/countries.js';
import { subscribeToPayments, updatePayment } from '../services/payments.js';
import { PAYMENT_STATUSES, formatNaira } from '../data/payment.js';

const PAYMENT_FILTERS = [
  { id: 'all', label: 'All payments' },
  { id: 'awaiting-confirmation', label: 'Payment to confirm' },
  { id: 'confirmed', label: 'Paid' },
  { id: 'unpaid', label: 'Unpaid' },
  { id: 'rejected', label: 'Payment rejected' },
];

// One status per request from all its payment records: any confirmed payment wins, then pending, then rejected.
function paymentStatusOf(payments = []) {
  if (payments.some((p) => p.status === 'confirmed')) return 'confirmed';
  if (payments.some((p) => p.status === 'awaiting-confirmation')) return 'awaiting-confirmation';
  if (payments.some((p) => p.status === 'rejected')) return 'rejected';
  return 'unpaid';
}

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
            <Dashboard user={user} />
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

function Dashboard({ user }) {
  const [requests, setRequests] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [paymentsError, setPaymentsError] = useState('');
  const [status, setStatus] = useState('all');
  const [service, setService] = useState('all');
  const [payment, setPayment] = useState('all');
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

  useEffect(
    () =>
      subscribeToPayments(setPayments, (err) =>
        setPaymentsError(
          err.code === 'permission-denied'
            ? 'Payments could not be loaded. Make sure the latest firestore.rules (with the payments section) are published.'
            : `Could not load payments: ${err.message}`
        )
      ),
    []
  );

  const paymentsByRequest = useMemo(() => {
    const map = {};
    payments.forEach((p) => (map[p.requestId] ||= []).push(p));
    return map;
  }, [payments]);

  const counts = useMemo(() => {
    const c = { all: requests?.length || 0 };
    STATUSES.forEach((s) => (c[s.id] = requests?.filter((r) => r.status === s.id).length || 0));
    PAYMENT_FILTERS.forEach((f) => {
      if (f.id !== 'all') c[`pay:${f.id}`] = (requests || []).filter((r) => paymentStatusOf(paymentsByRequest[r.id]) === f.id).length;
    });
    return c;
  }, [requests, paymentsByRequest]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (requests || []).filter(
      (r) =>
        (status === 'all' || r.status === status) &&
        (service === 'all' || r.service === service) &&
        (payment === 'all' || paymentStatusOf(paymentsByRequest[r.id]) === payment) &&
        (!q || [r.name, r.email, r.ref, r.phone].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [requests, status, service, payment, search, paymentsByRequest]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!requests) return <p className="muted">Loading requests…</p>;

  const toConfirm = counts['pay:awaiting-confirmation'];

  return (
    <>
      {paymentsError && <div className="alert alert-error">{paymentsError}</div>}
      {toConfirm > 0 && payment !== 'awaiting-confirmation' && (
        <div className="alert alert-warn admin-pay-alert">
          <span>
            💰 <strong>{toConfirm}</strong> payment{toConfirm > 1 ? 's' : ''} waiting for confirmation.
          </span>
          <button className="btn btn-sm" onClick={() => setPayment('awaiting-confirmation')}>Review now</button>
        </div>
      )}
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
          <select value={payment} onChange={(e) => setPayment(e.target.value)} aria-label="Filter by payment">
            {PAYMENT_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}{f.id !== 'all' ? ` (${counts[`pay:${f.id}`]})` : ''}
              </option>
            ))}
          </select>
          <input type="search" placeholder="Search name, email, phone or ref…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No requests match these filters.</p>
      ) : (
        <ul className="admin-list">
          {visible.map((r) => (
            <RequestRow
              key={r.id}
              request={r}
              payments={paymentsByRequest[r.id] || []}
              reviewer={user?.email || ''}
              open={openId === r.id}
              onToggle={() => setOpenId(openId === r.id ? null : r.id)}
            />
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

function RequestRow({ request: r, payments, reviewer, open, onToggle }) {
  const payStatus = PAYMENT_STATUSES[paymentStatusOf(payments)];
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
          <span className={`pay-pill ${payStatus.cls}`}>{payStatus.label}</span>
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

          <PaymentsSection payments={payments} reviewer={reviewer} />

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

function PaymentsSection({ payments, reviewer }) {
  return (
    <section className="admin-payments">
      <h4>Payments</h4>
      {payments.length === 0 ? (
        <p className="muted small">No payment submitted yet.</p>
      ) : (
        <>
          <p className="muted small">
            Check your Paystack dashboard (card) or bank statement (transfer) before confirming. The client’s browser
            report alone is not proof of payment.
          </p>
          <ul className="payment-list">
            {payments.map((p) => (
              <PaymentItem key={p.id} payment={p} reviewer={reviewer} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function PaymentItem({ payment: p, reviewer }) {
  const [note, setNote] = useState(p.note || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const status = PAYMENT_STATUSES[p.status] || { label: p.status, cls: '' };

  const review = async (nextStatus) => {
    setSaving(true);
    setError('');
    try {
      await updatePayment(p.id, { status: nextStatus, note: note.trim(), reviewedBy: reviewer });
    } catch (err) {
      setError(`Could not save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="payment-item">
      <div className="payment-item-head">
        <span className={`pay-pill ${status.cls}`}>{status.label}</span>
        <strong>{formatNaira(p.amount)}</strong>
        <span>{p.method === 'card' ? '💳 Card (Paystack)' : '🏦 Bank transfer'}</span>
        <span className="muted small">{formatDate(p.createdAt)}</span>
      </div>
      <dl className="admin-details">
        {p.method === 'card' ? (
          <div>
            <dt>Paystack reference</dt>
            <dd><code>{p.reference}</code></dd>
          </div>
        ) : (
          <>
            <div><dt>Sender name</dt><dd>{p.senderName}</dd></div>
            <div><dt>Sender bank</dt><dd>{p.senderBank}</dd></div>
            <div><dt>Date paid</dt><dd>{p.paidOn}</dd></div>
            <div><dt>Expected narration</dt><dd><code>{p.requestRef}</code></dd></div>
          </>
        )}
        {p.reviewedAt && (
          <div><dt>Reviewed</dt><dd>{formatDate(p.reviewedAt)}{p.reviewedBy && ` by ${p.reviewedBy}`}</dd></div>
        )}
      </dl>
      <div className="admin-actions payment-actions">
        <label className="field admin-note">
          Payment note
          <input value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Seen on GTBank statement 7 Oct" />
        </label>
        <button className="btn btn-sm" disabled={saving || p.status === 'confirmed'} onClick={() => review('confirmed')}>
          ✓ Confirm paid
        </button>
        <button className="btn btn-sm btn-ghost-dark" disabled={saving || p.status === 'rejected'} onClick={() => review('rejected')}>
          ✕ Reject
        </button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
    </li>
  );
}
