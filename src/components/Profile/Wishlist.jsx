import { useAuth } from '../../context/AuthContext';
import { useProduct } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import Button from '../Common/Button';

export default function Wishlist() {
  const { user } = useAuth();
  const { getProductById } = useProduct();
  const { addToCart } = useCart();
  const wishlistIds = user?.wishlist || [];
  const products = wishlistIds.map((id) => getProductById(id)).filter(Boolean);

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ fontSize: '3rem', marginBottom: 16 }}>❤️</p>
        <p style={{ marginBottom: 16 }}>Your wishlist is empty.</p>
        <Link to="/products">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Wishlist ({products.length})</h2>
        <Button data-testid="btn-move-all-to-cart" onClick={() => products.forEach((p) => addToCart(p, 1))}>
          Move All to Cart
        </Button>
        <button type="button" data-testid="btn-share-wishlist" style={{ padding: '8px 16px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
          Share Wishlist
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
        {products.map((product) => (
          <div
            key={product.id}
            data-testid={`wishlist-item-${product.id}`}
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}
          >
            <Link to={`/product/${product.id}`}>
              <img src={product.images?.[0]} alt={product.name} style={{ width: '100%', aspectRatio: 1, objectFit: 'cover' }} />
            </Link>
            <div style={{ padding: 16 }}>
              <Link to={`/product/${product.id}`} style={{ fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>
                {product.name}
              </Link>
              <p style={{ margin: '8px 0' }}>{formatPrice(product.price)}</p>
              <p style={{ fontSize: '0.875rem', color: product.inStock ? 'var(--success)' : 'var(--error)' }}>{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Button size="small" data-testid={`btn-wishlist-add-to-cart-${product.id}`} onClick={() => addToCart(product, 1)} disabled={!product.inStock}>
                  Add to Cart
                </Button>
                <button type="button" data-testid={`btn-remove-wishlist-${product.id}`} style={{ padding: '8px 12px', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'none' }}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
