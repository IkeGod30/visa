import { useState } from 'react';
import { getService } from '../data/services.js';
import { BANK_ACCOUNT, CURRENCY, PAYSTACK_PUBLIC_KEY, SERVICE_FEE, bankConfigured, formatNaira } from '../data/payment.js';

// Paystack's checkout script is only downloaded when someone chooses to pay by card.
let paystackLoader = null;
function loadPaystack() {
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop);
  paystackLoader ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.onload = () => resolve(window.PaystackPop);
    script.onerror = () => {
      paystackLoader = null;
      reject(new Error('Could not load the card payment window. Check your connection and try again.'));
    };
    document.head.appendChild(script);
  });
  return paystackLoader;
}

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Payment step for one assistance request.
 * `request` = { requestId, ref, service, name, email }. `isNew` shows the "request received" intro.
 */
export default function PaymentPanel({ request, isNew, onRecorded, onClose }) {
  const [tab, setTab] = useState(PAYSTACK_PUBLIC_KEY ? 'card' : 'transfer');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null); // { method, reference? }
  const [transfer, setTransfer] = useState({ senderName: request.name || '', senderBank: '', paidOn: today() });
  const [transferErrors, setTransferErrors] = useState({});
  const [copied, setCopied] = useState('');

  const service = getService(request.service);
  const fee = formatNaira(SERVICE_FEE);
  const canPay = Boolean(request.requestId);

  const recorded = (method, reference) => {
    setDone({ method, reference });
    onRecorded?.(method);
  };

  const payByCard = async () => {
    setBusy(true);
    setError('');
    try {
      const PaystackPop = await loadPaystack();
      const reference = `${request.ref}-${Date.now().toString(36).toUpperCase()}`;
      new PaystackPop().newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: request.email,
        amount: SERVICE_FEE * 100, // kobo
        currency: CURRENCY,
        reference,
        metadata: {
          requestRef: request.ref,
          service: request.service,
          custom_fields: [
            { display_name: 'Request reference', variable_name: 'request_ref', value: request.ref },
            { display_name: 'Service', variable_name: 'service', value: service?.title || request.service },
          ],
        },
        onSuccess: async (tx) => {
          try {
            const { recordCardPayment } = await import('../services/payments.js');
            await recordCardPayment(request, tx.reference || reference);
            recorded('card', tx.reference || reference);
          } catch (err) {
            console.error('Card payment succeeded but could not be recorded', err);
            setError(
              `Your card payment went through, but we couldn’t record it automatically. Please send us your payment reference (${tx.reference || reference}) so we can confirm it.`
            );
          } finally {
            setBusy(false);
          }
        },
        onCancel: () => setBusy(false),
        onError: (err) => {
          setError(err?.message || 'The card payment could not be started.');
          setBusy(false);
        },
      });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

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
      recorded('transfer');
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
          <h3>{done.method === 'card' ? 'Card payment received' : 'Transfer details received'}</h3>
          <p>
            Thank you. Our team will confirm your payment of <strong>{fee}</strong>
            {done.method === 'transfer' ? ' once it reaches our account (usually within one working day)' : ' shortly'}, and an
            adviser will then contact you to start your {service?.title.toLowerCase() || 'request'}.
          </p>
          {done.reference && (
            <p className="small">
              Payment reference: <strong>{done.reference}</strong>
            </p>
          )}
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

          <div className="pay-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'card'} className={tab === 'card' ? 'active' : ''} onClick={() => setTab('card')}>
              💳 Debit card
            </button>
            <button role="tab" aria-selected={tab === 'transfer'} className={tab === 'transfer' ? 'active' : ''} onClick={() => setTab('transfer')}>
              🏦 Bank transfer
            </button>
          </div>

          {tab === 'card' ? (
            <div className="pay-pane" role="tabpanel">
              {PAYSTACK_PUBLIC_KEY ? (
                <>
                  <p>
                    Pay securely with your Verve, Mastercard or Visa debit card through Paystack. Your card details go
                    straight to Paystack, and we never see them.
                  </p>
                  <button className="btn btn-gold" onClick={payByCard} disabled={busy}>
                    {busy ? 'Opening secure checkout…' : `Pay ${fee} with card`}
                  </button>
                </>
              ) : (
                <p className="muted">Card payment is coming soon. Please use bank transfer for now.</p>
              )}
            </div>
          ) : (
            <div className="pay-pane" role="tabpanel">
              <p>Transfer exactly <strong>{fee}</strong> to the account below from your bank app, USSD or internet banking.</p>
              {!bankConfigured && (
                <div className="alert alert-warn small">Bank details have not been set up yet (site owner: see README → Payments).</div>
              )}
              <dl className="bank-details">
                <div><dt>Bank</dt><dd>{BANK_ACCOUNT.bankName}</dd></div>
                <div>
                  <dt>Account number</dt>
                  <dd>
                    <span className="account-number">{BANK_ACCOUNT.accountNumber}</span>
                    <button type="button" className="copy-btn" onClick={() => copy('account', BANK_ACCOUNT.accountNumber)}>
                      {copied === 'account' ? 'Copied ✓' : 'Copy'}
                    </button>
                  </dd>
                </div>
                <div><dt>Account name</dt><dd>{BANK_ACCOUNT.accountName}</dd></div>
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
                Use your reference <strong>{request.ref}</strong> as the narration so we can match your payment. Pay only into the
                account shown on this website. We will never ask you to pay into a personal account by phone or WhatsApp.
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
          )}

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
