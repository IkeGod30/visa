// Fee and payment settings for the Get Assistance service.
// SERVICE_FEE must match the amount enforced in firestore.rules.
export const SERVICE_FEE = 40000;
export const CURRENCY = 'NGN';

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });
export const formatNaira = (amount) => naira.format(amount);

// Payment is by direct bank transfer only. These details are shown publicly on the payment screen.
export const BANK_ACCOUNT = {
  bankName: 'Guaranty Trust Bank',
  accountName: 'Zillion Services',
  accountType: 'Current Account',
  accountNumber: '0043553214',
};

export const PAYMENT_STATUSES = {
  unpaid: { label: 'Unpaid', cls: 'pay-unpaid' },
  'awaiting-confirmation': { label: 'Awaiting confirmation', cls: 'pay-awaiting' },
  confirmed: { label: 'Paid', cls: 'pay-confirmed' },
  rejected: { label: 'Payment rejected', cls: 'pay-rejected' },
};
