import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartIcon() {
  const { itemCount } = useCart();
  return (
    <Link
      to="/cart"
      data-testid="cart-icon"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        textDecoration: 'none',
        color: 'var(--text)',
      }}
      aria-label={`Cart with ${itemCount} items`}
    >
      <span style={{ fontSize: '1.5rem' }}>🛒</span>
      {itemCount > 0 && (
        <span
          data-testid="cart-badge"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            minWidth: 18,
            height: 18,
            borderRadius: '50%',
            background: 'var(--error)',
            color: '#fff',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
          }}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
