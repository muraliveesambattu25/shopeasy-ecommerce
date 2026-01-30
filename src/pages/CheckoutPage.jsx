import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ShippingForm from '../components/Checkout/ShippingForm';
import PaymentForm from '../components/Checkout/PaymentForm';
import OrderSummary from '../components/Checkout/OrderSummary';

const STEPS = [
  { id: 1, label: 'Shipping', testId: 'step-shipping' },
  { id: 2, label: 'Payment', testId: 'step-payment' },
  { id: 3, label: 'Review', testId: 'step-review' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [shippingAddressIndex, setShippingAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!isAuthenticated) {
    navigate('/login?redirect=/checkout');
    return <p>Redirecting to login...</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Checkout</h1>
      <div data-testid="checkout-steps" style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        {STEPS.map((s) => (
          <div
            key={s.id}
            data-testid={s.testId}
            style={{
              flex: 1,
              padding: '12px 16px',
              textAlign: 'center',
              background: step >= s.id ? 'var(--primary)' : 'var(--secondary)',
              color: step >= s.id ? '#fff' : 'var(--text)',
              borderRadius: 'var(--radius-md)',
              fontWeight: step === s.id ? 700 : 400,
            }}
          >
            {s.id}. {s.label}
          </div>
        ))}
      </div>
      {step === 1 && (
        <ShippingForm onContinue={() => setStep(2)} />
      )}
      {step === 2 && (
        <PaymentForm
          onBack={() => setStep(1)}
          onContinue={(method) => { setPaymentMethod(method || 'card'); setStep(3); }}
        />
      )}
      {step === 3 && (
        <OrderSummary
          step={3}
          shippingAddressIndex={shippingAddressIndex}
          paymentMethod={paymentMethod}
          onBack={(s) => setStep(s)}
          onPlaceOrder={(orderId) => {}}
        />
      )}
    </div>
  );
}
