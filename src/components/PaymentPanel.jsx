import { useState } from 'react';
import { getService } from '../data/services.js';
import { BANK_ACCOUNT, SERVICE_FEE, formatNaira } from '../data/payment.js';

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Payment step for one assistance request — direct bank transfer only.
 * `request` = { requestId, ref, service, name, email }. `isNew` shows the "request received" intro.
 */
export default function PaymentPanel({ request, isNew, onRecorded, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [transfer, setTransfer] = useState({ senderName: request.name || '', senderBank: '', paidOn: today() });
  const [transferErrors, setTransferErrors] = useState({});
  const [copied, setCopied] = useState('');

  const service = getService(request.service);
  const fee = formatNaira(SERVICE_FEE);
  const canPay = Boolean(request.requestId);

  const submitTransfer = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!transfer.senderName.trim()) errs.senderName = 'Enter the name on the sending account.';
    if (!transfer.senderBank.trim()) errs.senderBank = 'Enter the bank you sent from.';
    if (!transfer.paidOn || transfer.paidOn > today()) errs.paidOn = 'Enter the date you made the transfer.';
    setTransferErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setError('');
    try {
      const { recordTransfer } = await import('../services/payments.js');
      await recordTransfer(request, {
        senderName: transfer.senderName.trim(),
        senderBank: transfer.senderBank.trim(),
        paidOn: transfer.paidOn,
      });
      setDone(true);
      onRecorded?.('transfer');
    } catch (err) {
      console.error('Could not record transfer', err);
      setError('We couldn’t save your transfer details. Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async (label, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      /* clipboard unavailable — the value is still visible to copy by hand */
    }
  };

  return (
    <div className="card payment-panel">
      {isNew && (
        <div className="payment-intro">
          <h2>✅ Request received</h2>
          <p>
            Thank you, {request.name?.split(' ')[0]}. Your reference number is <strong>{request.ref}</strong>. We will
            contact you at {request.email}.
          </p>
        </div>
      )}

      {!canPay ? (
        <button className="btn" onClick={onClose}>Done</button>
      ) : done ? (
        <div className="alert alert-success" role="status">
          <h3>Transfer details received</h3>
          <p>
            Thank you. Our team will confirm your payment of <strong>{fee}</strong> once it reaches our account (usually
            within one working day). An adviser will then contact you to start your{' '}
            {service?.title.toLowerCase() || 'request'}.
          </p>
          <button className="btn" onClick={onClose}>Done</button>
        </div>
      ) : (
        <>
          <div className="payment-summary">
            <div>
              <span className="muted small">{isNew ? 'Complete your payment' : `Pay for request ${request.ref}`}</span>
              <h3>{service?.title || 'Assistance service'}</h3>
            </div>
            <strong className="payment-amount">{fee}</strong>
          </div>

          <div className="pay-pane">
            <h4 className="pay-method">🏦 Pay by direct bank transfer</h4>
            <p>Transfer exactly <strong>{fee}</strong> to the account below from your bank app, USSD or internet banking.</p>
            <dl className="bank-details">
              <div><dt>Bank name</dt><dd>{BANK_ACCOUNT.bankName}</dd></div>
              <div><dt>Account name</dt><dd>{BANK_ACCOUNT.accountName}</dd></div>
              <div><dt>Account type</dt><dd>{BANK_ACCOUNT.accountType}</dd></div>
              <div>
                <dt>Account number</dt>
                <dd>
                  <span className="account-number">{BANK_ACCOUNT.accountNumber}</span>
                  <button type="button" className="copy-btn" onClick={() => copy('account', BANK_ACCOUNT.accountNumber)}>
                    {copied === 'account' ? 'Copied ✓' : 'Copy'}
                  </button>
                </dd>
              </div>
              <div><dt>Amount</dt><dd>{fee}</dd></div>
              <div>
                <dt>Narration / description</dt>
                <dd>
                  <strong>{request.ref}</strong>
                  <button type="button" className="copy-btn" onClick={() => copy('ref', request.ref)}>
                    {copied === 'ref' ? 'Copied ✓' : 'Copy'}
                  </button>
                </dd>
              </div>
            </dl>
            <p className="small muted">
              Use your reference <strong>{request.ref}</strong> as the narration so we can match your payment. Pay only into
              the {BANK_ACCOUNT.accountName} account shown on this website. We will never ask you to pay into a personal
              account by phone or WhatsApp.
            </p>

            <form className="transfer-form" onSubmit={submitTransfer} noValidate>
              <h4>I’ve made the transfer</h4>
              <div className="form-grid">
                <TransferField label="Name on sending account" error={transferErrors.senderName}>
                  <input value={transfer.senderName} onChange={(e) => setTransfer({ ...transfer, senderName: e.target.value })} maxLength={120} />
                </TransferField>
                <TransferField label="Bank you sent from" error={transferErrors.senderBank}>
                  <input value={transfer.senderBank} onChange={(e) => setTransfer({ ...transfer, senderBank: e.target.value })} placeholder="e.g. GTBank, Opay, Access" maxLength={80} />
                </TransferField>
                <TransferField label="Date of transfer" error={transferErrors.paidOn}>
                  <input type="date" value={transfer.paidOn} max={today()} onChange={(e) => setTransfer({ ...transfer, paidOn: e.target.value })} />
                </TransferField>
              </div>
              <button type="submit" className="btn" disabled={busy}>
                {busy ? 'Sending…' : 'Confirm my transfer'}
              </button>
            </form>
          </div>

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <button type="button" className="btn btn-link" onClick={onClose}>
            Pay later
          </button>
          <p className="small muted">You can come back to pay at any time from “Your requests”.</p>
        </>
      )}
    </div>
  );
}

function TransferField({ label, error, children }) {
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
