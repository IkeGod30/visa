import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Unlike theFlipChal we don't throw here: the public guides must keep working without Firebase.
// Only the request form and /admin depend on it, and they check `firebaseReady`.
export const firebaseReady = Boolean(config.apiKey && config.projectId);

if (!firebaseReady) {
  console.error(
    'Firebase is not configured, so assistance requests cannot be sent. Copy .env.example to .env.local, ' +
      'fill in your Firebase project keys, and restart the dev server.'
  );
}

export const app = firebaseReady ? initializeApp(config) : null;
export const db = app ? getFirestore(app) : null;
// Auth is only needed on the lazy-loaded /admin page, so it is initialised there to keep it out of the public bundle.
