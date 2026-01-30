import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import Button from '../Common/Button';
import Checkbox from '../Common/Checkbox';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSampleOrder } from '../../mockData/orders';
import { getUsers, setUsers } from '../../utils/localStorage';

export default function OrderSummary({ step, shippingAddressIndex, paymentMethod, onBack, onPlaceOrder }) {
  const { cartItems, subtotal, discount, shipping, tax, total, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [terms, setTerms] = useState(false);
  const [placing, setPlacing] = useState(false);

  const address = user?.addresses?.[shippingAddressIndex];

  const handlePlaceOrder = async () => {
    if (!terms) return;
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 2000));
    const order = createSampleOrder(
      user.id,
      cartItems.map((i) => ({ ...i, productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
      address,
      paymentMethod
    );
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx].orders = users[idx].orders || [];
      users[idx].orders.unshift(order);
      setUsers(users);
      updateProfile({ orders: users[idx].orders });
    }
    clearCart();
    onPlaceOrder(order.orderId);
    setPlacing(false);
    navigate(`/order-success?orderId=${order.orderId}`);
  };

  return (
    <div data-testid="step-review">
      <h3 style={{ marginBottom: 16 }}>Review Order</h3>
      <div style={{ marginBottom: 24 }} data-testid="review-shipping-address">
        <strong>Shipping Address</strong>
        <p style={{ margin: '8px 0', fontSize: '0.875rem' }}>{address?.name}, {address?.addressLine1}, {address?.city}, {address?.state} {address?.pincode}</p>
        <Link to="#" data-testid="link-change-shipping" onClick={(e) => { e.preventDefault(); onBack(1); }} style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Change</Link>
      </div>
      <div style={{ marginBottom: 24 }} data-testid="review-payment-method">
        <strong>Payment</strong>
        <p style={{ margin: '8px 0', fontSize: '0.875rem' }}>{paymentMethod === 'card' ? 'Card ****1234' : paymentMethod}</p>
        <Link to="#" data-testid="link-change-payment" onClick={(e) => { e.preventDefault(); onBack(2); }} style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Change</Link>
      </div>
      <div style={{ marginBottom: 24 }}>
        <strong>Items</strong>
        {cartItems.map((item) => (
          <div key={item.productId} data-testid={`review-item-${item.productId}`} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--secondary)' }}>
            <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 500 }}>{item.name}</p>
              <p style={{ margin: '4px 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity} × {formatPrice(item.price)}</p>
            </div>
            <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Subtotal</span><span data-testid="review-subtotal">{formatPrice(subtotal)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Discount</span><span data-testid="review-discount">-{formatPrice(discount)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Shipping</span><span data-testid="review-shipping">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Tax</span><span data-testid="review-tax">{formatPrice(tax)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.25rem', paddingTop: 12, borderTop: '1px solid var(--secondary)' }}><span>Total</span><span data-testid="review-total">{formatPrice(total)}</span></div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <Checkbox checked={terms} onChange={setTerms} label={<><a href="/terms" target="_blank" rel="noopener noreferrer">I agree to Terms & Conditions</a></>} data-testid="checkbox-terms" />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="secondary" data-testid="btn-back-to-payment" onClick={() => onBack(2)}>Back to Payment</Button>
        <Button data-testid="btn-place-order" disabled={!terms || placing} loading={placing} onClick={handlePlaceOrder}>{placing ? 'Processing...' : 'Place Order'}</Button>
      </div>
    </div>
  );
}
