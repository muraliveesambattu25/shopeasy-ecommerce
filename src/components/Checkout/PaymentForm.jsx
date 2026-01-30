import { useState } from 'react';
import Input from '../Common/Input';
import Button from '../Common/Button';

const PAYMENT_TYPES = ['card', 'upi', 'netbanking', 'cod', 'wallet'];
const BANKS = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra'];

export default function PaymentForm({ onBack, onContinue }) {
  const [type, setType] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (type === 'card') {
      if (!cardNumber.replace(/\D/g, '').match(/^\d{16}$/)) e.cardNumber = 'Valid 16-digit card number required';
      if (!cardName?.trim()) e.cardName = 'Cardholder name required';
      if (!cardExpiry?.trim()) e.cardExpiry = 'Expiry required (MM/YY)';
      if (!cardCvv.replace(/\D/g, '').match(/^\d{3,4}$/)) e.cardCvv = 'Valid CVV required';
    }
    if (type === 'upi' && !upiId?.trim()) e.upiId = 'UPI ID required';
    if (type === 'netbanking' && !bank) e.bank = 'Select a bank';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    onContinue(type);
  };

  return (
    <div data-testid="step-payment">
      <h3 style={{ marginBottom: 16 }}>Payment Method</h3>
      <div style={{ marginBottom: 24 }}>
        {PAYMENT_TYPES.map((t) => (
          <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input
              type="radio"
              name="payment"
              value={t}
              checked={type === t}
              onChange={() => setType(t)}
              data-testid={`radio-payment-${t}`}
            />
            <span style={{ textTransform: 'capitalize' }}>{t === 'cod' ? 'Cash on Delivery' : t === 'netbanking' ? 'Net Banking' : t}</span>
          </label>
        ))}
      </div>
      {type === 'card' && (
        <div style={{ marginBottom: 24, padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
          <Input label="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} placeholder="XXXX XXXX XXXX XXXX" data-testid="input-card-number" error={errors.cardNumber} />
          <Input label="Cardholder Name" value={cardName} onChange={(e) => setCardName(e.target.value)} data-testid="input-card-name" error={errors.cardName} />
          <Input label="Expiry (MM/YY)" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} data-testid="input-card-expiry" error={errors.cardExpiry} placeholder="MM/YY" />
          <Input label="CVV" type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} data-testid="input-card-cvv" error={errors.cardCvv} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} data-testid="checkbox-save-card" />
            <span>Save card for future</span>
          </label>
        </div>
      )}
      {type === 'upi' && (
        <div style={{ marginBottom: 24, padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
          <Input label="UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="username@bank" data-testid="input-upi-id" error={errors.upiId} />
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button type="button" data-testid="btn-gpay" style={{ padding: '12px 20px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'var(--white)' }}>Google Pay</button>
            <button type="button" data-testid="btn-phonepe" style={{ padding: '12px 20px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'var(--white)' }}>PhonePe</button>
            <button type="button" data-testid="btn-paytm" style={{ padding: '12px 20px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'var(--white)' }}>Paytm</button>
          </div>
        </div>
      )}
      {type === 'netbanking' && (
        <div style={{ marginBottom: 24, padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
          <label>Select Bank</label>
          <select value={bank} onChange={(e) => setBank(e.target.value)} data-testid="select-bank" style={{ width: '100%', padding: '10px 12px', marginTop: 8, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)' }}>
            <option value="">Select</option>
            {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          {errors.bank && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: 4 }}>{errors.bank}</p>}
          <p style={{ marginTop: 12, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>You will be redirected to your bank&apos;s website</p>
        </div>
      )}
      {type === 'cod' && <p style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>Pay when you receive your order. COD charges: ₹50 if applicable.</p>}
      {type === 'wallet' && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button type="button" data-testid="btn-wallet-paytm" style={{ padding: '12px 20px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Paytm</button>
          <button type="button" data-testid="btn-wallet-amazon" style={{ padding: '12px 20px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Amazon Pay</button>
          <button type="button" data-testid="btn-wallet-phonepe" style={{ padding: '12px 20px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>PhonePe</button>
        </div>
      )}
      <p style={{ marginBottom: 24, fontSize: '0.875rem', color: 'var(--success)' }}>100% Secure Payment</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="secondary" data-testid="btn-back-to-shipping" onClick={onBack}>Back to Shipping</Button>
        <Button data-testid="btn-continue-to-review" onClick={handleContinue}>Continue to Review</Button>
      </div>
    </div>
  );
}
