import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import Button from '../components/Common/Button';

export default function CartPage() {
  const { cartItems, itemCount, savedForLater, moveToCart } = useCart();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div
          data-testid="empty-cart"
          style={{
            textAlign: 'center',
            padding: 48,
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <p style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</p>
          <p style={{ marginBottom: 16, fontSize: '1.125rem' }}>Your cart is empty</p>
          <Link to="/products">
            <Button data-testid="btn-continue-shopping">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          <div>
            <p data-testid="cart-item-count" style={{ marginBottom: 16, fontWeight: 600 }}>
              Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </p>
            {cartItems.map((item) => (
              <CartItem key={`${item.productId}-${JSON.stringify(item.options)}`} item={item} />
            ))}
            {savedForLater.length > 0 && (
              <section style={{ marginTop: 32 }}>
                <h3 style={{ marginBottom: 16 }}>Saved for Later</h3>
                {savedForLater.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: 16,
                      background: 'var(--white)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 12,
                    }}
                  >
                    <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                    <div style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      <p style={{ marginTop: 4 }}>₹{item.price?.toLocaleString()}</p>
                      <button
                        type="button"
                        data-testid={`btn-move-to-cart-${item.productId}`}
                        onClick={() => moveToCart(item.productId)}
                        style={{ marginTop: 8, padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
          <CartSummary />
        </div>
      )}
    </div>
  );
}
