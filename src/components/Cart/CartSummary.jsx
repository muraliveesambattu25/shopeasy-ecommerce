import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { useState } from 'react';

export default function CartSummary() {
  const { subtotal, discount, shipping, tax, total, applyCoupon, removeCoupon, appliedCoupon, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode);
    setCouponMessage(result.success ? `Coupon applied! You saved ₹${discount}` : result.message);
    if (result.success) setCouponCode('');
  };

  return (
    <div
      style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        padding: 24,
        height: 'fit-content',
        position: 'sticky',
        top: 100,
      }}
    >
      <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal ({itemCount} items)</span>
          <span data-testid="cart-subtotal">{formatPrice(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Discount</span>
          <span data-testid="cart-discount">{discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Shipping</span>
          <span data-testid="cart-shipping" style={{ color: shipping === 0 ? 'var(--success)' : undefined }}>
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Tax (GST 18%)</span>
          <span data-testid="cart-tax">{formatPrice(tax)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.25rem', paddingTop: 12, borderTop: '1px solid var(--secondary)' }}>
          <span>Total</span>
          <span data-testid="cart-total">{formatPrice(total)}</span>
        </div>
      </div>
      <div style={{ marginBottom: 16 }} data-testid="coupon-section">
        {appliedCoupon ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, background: 'var(--bg)', borderRadius: 'var(--radius-md)' }} data-testid="applied-coupon">
            <span>{appliedCoupon.code}</span>
            <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
              Remove
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              data-testid="input-coupon-code"
              style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)' }}
            />
            <Button data-testid="btn-apply-coupon" onClick={handleApplyCoupon}>
              Apply
            </Button>
          </div>
        )}
        {couponMessage && <p style={{ fontSize: '0.875rem', marginTop: 8, color: couponMessage.includes('saved') ? 'var(--success)' : 'var(--error)' }}>{couponMessage}</p>}
        <details style={{ marginTop: 8 }} data-testid="available-coupons">
          <summary style={{ cursor: 'pointer', fontSize: '0.875rem', color: 'var(--primary)' }}>Available coupons</summary>
          <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: '0.875rem' }}>
            <li>SAVE10 - 10% off</li>
            <li>FLAT50 - ₹50 off (min ₹500)</li>
            <li>NEWUSER - 15% off for new users</li>
          </ul>
        </details>
      </div>
      <Link to="/checkout" style={{ display: 'block', textDecoration: 'none' }}>
        <Button data-testid="btn-proceed-to-checkout" fullWidth disabled={itemCount === 0}>
          Proceed to Checkout
        </Button>
      </Link>
      <Link to="/products" data-testid="link-continue-shopping" style={{ display: 'block', marginTop: 12, textAlign: 'center', fontSize: '0.875rem', color: 'var(--primary)' }}>
        Continue Shopping
      </Link>
    </div>
  );
}
