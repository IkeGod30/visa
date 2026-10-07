import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db, firebaseReady } from '../firebase.js';

export const STATUSES = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'closed', label: 'Closed' },
];

const requestsCol = () => collection(db, 'requests');

// Field names and limits here must stay in sync with firestore.rules.
export async function submitRequest(data) {
  if (!firebaseReady) throw new Error('Firebase is not configured.');
  return addDoc(requestsCol(), { ...data, status: 'new', createdAt: serverTimestamp() });
}

// Live, newest-first feed of all requests (admins only — enforced by security rules).
export function subscribeToRequests(onData, onError) {
  return onSnapshot(
    query(requestsCol(), orderBy('createdAt', 'desc')),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function updateRequest(id, changes) {
  return updateDoc(doc(db, 'requests', id), { ...changes, updatedAt: serverTimestamp() });
}
