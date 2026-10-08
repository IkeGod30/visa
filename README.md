# VisaSolutions NG

A Vite + React app that guides Nigerians through visas, admissions and jobs abroad. Requests submitted on **Get Assistance** (`/assist`) are stored in Cloud Firestore and managed on the private **`/admin`** dashboard.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Firebase setup (one-time, about 10 minutes)

Without this setup the site still works, but the request form shows an error when someone submits it.

1. **Create the project.** In the [Firebase console](https://console.firebase.google.com), create a project (e.g. `visasolutions`). Then go to *Project settings → General → Your apps* and add a **Web app**.
2. **Add the keys.** Copy `.env.example` to `.env.local` and fill in the 4 values from the web app's SDK config. Restart `npm run dev`, because Vite only reads env files at startup.
3. **Create Firestore.** Go to *Build → Firestore Database → Create database*, choose **production mode**, and pick a location. `africa-south1` (Johannesburg) is the closest to Nigeria. You can't change the location later.
4. **Enable admin sign-in.** Go to *Build → Authentication → Sign-in method* and enable **Email/Password**. Then, under *Users → Add user*, create your admin account. There is no public sign-up.
5. **Make that user an admin.** Copy the user's **UID** from the Users table. In Firestore, create the collection `admins` with a document whose **ID is that UID**; any field will do, e.g. `name: "Tony"`. Repeat for each staff member.
6. **Deploy the security rules** in [`firestore.rules`](firestore.rules). Either:
   - paste them into *Firestore → Rules* and click **Publish** (simplest), or
   - use the CLI. Current `firebase-tools` needs **Node 20+**. First set your real project ID in [`.firebaserc`](.firebaserc), then run:
     ```bash
     npx firebase-tools login
     npx firebase-tools deploy --only firestore:rules
     ```

Then submit a test request on `/assist` and sign in at `/admin` to see it.

## How it works

| Piece | File |
|---|---|
| Firebase init (no-op if keys are missing) | `src/firebase.js` |
| Submit / live list / update requests | `src/services/requests.js` |
| Public request form (loads Firebase on demand) | `src/pages/AssistPage.jsx` |
| Admin dashboard (lazy-loaded, includes Firebase Auth) | `src/pages/AdminPage.jsx` |
| Who can read and write what | `firestore.rules` |

- **Anyone** can *create* a request, but only if it has the expected fields and sizes.
- **Only admins** can read, update (status and note only) or delete requests.
- If you add a field to the form, add it to the `hasOnly([...])` list in `firestore.rules` too. Otherwise submissions will be rejected.
- Each request has a `status`: `new → contacted → in-progress → closed`.
- `firebase.json` also configures local emulators (Firestore on 8080, Auth on 9099) for testing the rules.

## Payments (₦15,000 per service)

After a client submits a request, they're asked to pay the service fee by **debit card** (Paystack) or **direct bank transfer**. They can also choose *Pay later* and use **Pay now** under "Your requests".

**Setup:**
1. Add to `.env.local` and restart `npm run dev`:
   ```
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_...     # Paystack → Settings → API Keys & Webhooks
   VITE_BANK_NAME=...
   VITE_BANK_ACCOUNT_NUMBER=...
   VITE_BANK_ACCOUNT_NAME=...
   ```
   - Only ever use the **public** key (`pk_…`). Never put the secret key (`sk_…`) in this app.
   - Without a Paystack key, the card tab says "coming soon" and clients use bank transfer.
2. Re-publish [`firestore.rules`](firestore.rules). It now includes a `payments` section. Without it, payments are rejected and `/admin` can't load them.

**Confirming payments (daily routine):**
1. Open `/admin`. The banner shows how many payments are waiting. Click **Review now**.
2. Check each payment:
   - **Card:** look up the Paystack reference in your Paystack dashboard → Transactions. Check it shows *Success* for ₦15,000.
   - **Transfer:** find the credit in your bank app. Match the amount, the sender name and the narration (the `VS-…` reference).
3. Click **Confirm paid**, or **Reject** with a note. The request then shows *Paid*, and you can start the work.

Clients can only *submit* payment claims. They can never mark themselves as paid, change the amount, or read other people's payments; `firestore.rules` enforces this. The fee is fixed at ₦15,000 in both `src/data/payment.js` and `firestore.rules`. Change both together.

**Going live with cards:** complete Paystack's business verification, then swap `pk_test_…` for `pk_live_…`.

To mark card payments as paid automatically, you would need a Cloud Function that verifies each Paystack reference with your secret key, plus Paystack webhooks. That requires the Firebase Blaze plan.

## Before going live

- Turn on [App Check](https://firebase.google.com/docs/app-check) (reCAPTCHA Enterprise) to block scripted spam. The form already has a honeypot field.
- If you want an email for each new request, install the *Trigger Email* extension. This needs the Blaze (pay-as-you-go) plan.
- Visa fees and rules in `src/data/` are indicative. Review them regularly against official sources.
