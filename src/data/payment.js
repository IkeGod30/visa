// Fee and payment settings for the Get Assistance service.
// SERVICE_FEE must match the amount enforced in firestore.rules.
export const SERVICE_FEE = 15000;
export const CURRENCY = 'NGN';

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });
export const formatNaira = (amount) => naira.format(amount);

// Bank details are shown publicly on the payment screen; set them in .env.local.
const env = import.meta.env;
export const BANK_ACCOUNT = {
  bankName: env.VITE_BANK_NAME || '[Bank name]',
  accountNumber: env.VITE_BANK_ACCOUNT_NUMBER || '0000000000',
  accountName: env.VITE_BANK_ACCOUNT_NAME || '[Account name]',
};
export const bankConfigured = Boolean(env.VITE_BANK_NAME && env.VITE_BANK_ACCOUNT_NUMBER && env.VITE_BANK_ACCOUNT_NAME);

// Paystack *public* key only — the secret key must never be put in the front end.
export const PAYSTACK_PUBLIC_KEY = env.VITE_PAYSTACK_PUBLIC_KEY || '';

export const PAYMENT_STATUSES = {
  unpaid: { label: 'Unpaid', cls: 'pay-unpaid' },
  'awaiting-confirmation': { label: 'Awaiting confirmation', cls: 'pay-awaiting' },
  confirmed: { label: 'Paid', cls: 'pay-confirmed' },
  rejected: { label: 'Payment rejected', cls: 'pay-rejected' },
};
