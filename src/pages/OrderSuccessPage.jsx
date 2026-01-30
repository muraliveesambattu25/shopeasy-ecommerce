import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Common/Button';
import { formatDate } from '../utils/helpers';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { user } = useAuth();

  const estimatedDelivery = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return formatDate(d.toISOString());
  })();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 48, textAlign: 'center' }}>
      <div data-testid="order-success-icon" style={{ fontSize: '4rem', marginBottom: 24 }}>✅</div>
      <h1 style={{ marginBottom: 16 }}>Order Placed Successfully!</h1>
      <p data-testid="order-id" style={{ marginBottom: 8, fontSize: '1.125rem' }}>
        Your order #{orderId || 'N/A'} has been placed.
      </p>
      <p data-testid="estimated-delivery" style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>
        Estimated delivery: {estimatedDelivery}
      </p>
      {user?.email && (
        <p style={{ marginBottom: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Order confirmation email sent to {user.email}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 32 }}>
        <Link to={orderId ? `/profile/orders` : '/'}>
          <Button data-testid="btn-track-order">Track Order</Button>
        </Link>
        <Link to="/products">
          <Button variant="secondary" data-testid="btn-continue-shopping">Continue Shopping</Button>
        </Link>
        <Button variant="outline" data-testid="btn-download-invoice" onClick={() => window.print()}>
          Download Invoice
        </Button>
      </div>
      <section style={{ textAlign: 'left', background: 'var(--bg)', padding: 16, borderRadius: 'var(--radius-md)' }}>
        <strong>What happens next?</strong>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>Order confirmation</li>
          <li>Processing</li>
          <li>Shipped</li>
          <li>Delivered</li>
        </ul>
      </section>
    </div>
  );
}
