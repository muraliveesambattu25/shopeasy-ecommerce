import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getStarRatingDisplay } from '../../utils/helpers';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { full, half, empty } = getStarRatingDisplay(product.rating || 0);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    // Toggle wishlist - would use context in full impl
    alert('Wishlist - Mock toggle');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/product/${product.id}`;
  };

  return (
    <Link
      to={`/product/${product.id}`}
      data-testid={`product-card-${product.id}`}
      style={{
        display: 'block',
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'var(--text)',
        transition: 'var(--transition)',
      }}
    >
      <div style={{ position: 'relative', paddingTop: '100%', background: 'var(--bg)' }}>
        <img
          src={product.images?.[0]}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {product.discount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: 'var(--error)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {product.discount}% OFF
          </span>
        )}
        {product.isNew && (
          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'var(--success)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            New
          </span>
        )}
        <button
          type="button"
          data-testid={`btn-wishlist-${product.id}`}
          onClick={handleWishlist}
          style={{ position: 'absolute', top: 8, right: 8, background: 'var(--white)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
          aria-label="Add to wishlist"
        >
          ❤️
        </button>
        <button
          type="button"
          data-testid={`btn-quick-view-${product.id}`}
          onClick={handleQuickView}
          style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', padding: '8px 16px', background: 'var(--white)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500, boxShadow: 'var(--shadow-sm)' }}
        >
          Quick View
        </button>
      </div>
      <div style={{ padding: 16 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          {[...Array(full)].map((_, i) => <span key={'f' + i}>★</span>)}
          {half ? <span>½</span> : null}
          {[...Array(empty)].map((_, i) => <span key={'e' + i} style={{ color: 'var(--secondary)' }}>★</span>)}
          <span style={{ marginLeft: 4, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>({product.reviewCount})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          data-testid={`btn-add-to-cart-${product.id}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '10px',
            background: product.inStock ? 'var(--primary-gradient)' : 'var(--secondary)',
            color: product.inStock ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: product.inStock ? 'pointer' : 'not-allowed',
            fontWeight: 600,
          }}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
