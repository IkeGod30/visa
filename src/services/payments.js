import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, firebaseReady } from '../firebase.js';
import { CURRENCY, SERVICE_FEE } from '../data/payment.js';

const paymentsCol = () => collection(db, 'payments');

// Visitors can only *create* payment records; field names and limits must stay in sync with firestore.rules.
function recordPayment(request, fields) {
  if (!firebaseReady) throw new Error('Firebase is not configured.');
  return addDoc(paymentsCol(), {
    requestId: request.requestId,
    requestRef: request.ref,
    service: request.service,
    amount: SERVICE_FEE,
    currency: CURRENCY,
    ...fields,
    status: 'awaiting-confirmation',
    createdAt: serverTimestamp(),
  });
}

export const recordCardPayment = (request, reference) => recordPayment(request, { method: 'card', reference });

export const recordTransfer = (request, { senderName, senderBank, paidOn }) =>
  recordPayment(request, { method: 'transfer', senderName, senderBank, paidOn });

// Admin-only (enforced by security rules).
export function subscribeToPayments(onData, onError) {
  return onSnapshot(
    query(paymentsCol(), orderBy('createdAt', 'desc')),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function updatePayment(id, { status, note, reviewedBy }) {
  return updateDoc(doc(db, 'payments', id), {
    status,
    ...(note !== undefined ? { note } : {}),
    reviewedBy,
    reviewedAt: serverTimestamp(),
  });
}
