import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { formatPrice, getStarRatingDisplay } from '../utils/helpers';
import Button from '../components/Common/Button';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { getProductById, getRelatedProducts } = useProduct();
  const { addToCart } = useCart();
  const product = getProductById(productId);
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const related = getRelatedProducts(productId, 6);

  // Scroll to top and reset view when product changes (e.g. clicking a related product)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMainImage(0);
    setQuantity(1);
    setActiveTab('description');
  }, [productId]);

  if (!product) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24, textAlign: 'center' }}>
        <p>Product not found.</p>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  const { full, half, empty } = getStarRatingDisplay(product.rating || 0);
  const maxQty = Math.min(product.stockCount || 99, 99);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 48 }}>
        <div>
          <img
            src={product.images?.[mainImage] || product.images?.[0]}
            alt={product.name}
            data-testid="product-main-image"
            style={{ width: '100%', aspectRatio: 1, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 12 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            {product.images?.map((img, i) => (
              <button
                key={i}
                type="button"
                data-testid={`product-thumbnail-${i}`}
                onClick={() => setMainImage(i)}
                style={{
                  width: 64,
                  height: 64,
                  padding: 0,
                  border: mainImage === i ? '2px solid var(--primary)' : '1px solid var(--secondary)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'none',
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h1 data-testid="product-name" style={{ marginBottom: 12 }}>{product.name}</h1>
          <div data-testid="product-rating" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {[...Array(full)].map((_, i) => <span key={i}>★</span>)}
            {half ? <span>½</span> : null}
            {[...Array(empty)].map((_, i) => <span key={i} style={{ color: 'var(--secondary)' }}>★</span>)}
            <span style={{ marginLeft: 4, color: 'var(--text-secondary)' }}>({product.reviewCount} reviews)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <span data-testid="product-price" style={{ fontWeight: 700, fontSize: '1.5rem' }}>{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span data-testid="product-original-price" style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>{formatPrice(product.originalPrice)}</span>
            )}
            {product.discount > 0 && (
              <span data-testid="product-discount" style={{ background: 'var(--error)', color: '#fff', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                {product.discount}% OFF
              </span>
            )}
          </div>
          <p data-testid="product-stock-status" style={{ marginBottom: 16, color: product.inStock ? 'var(--success)' : 'var(--error)' }}>
            {product.inStock ? (product.stockCount < 10 ? `Only ${product.stockCount} left!` : 'In Stock') : 'Out of Stock'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }} data-testid="quantity-selector">
            <button
              type="button"
              data-testid="btn-quantity-minus"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              style={{ width: 36, height: 36, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', cursor: quantity <= 1 ? 'not-allowed' : 'pointer' }}
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
              min={1}
              max={maxQty}
              data-testid="input-quantity"
              style={{ width: 60, padding: '8px', textAlign: 'center', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)' }}
            />
            <button
              type="button"
              data-testid="btn-quantity-plus"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty}
              style={{ width: 36, height: 36, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', cursor: quantity >= maxQty ? 'not-allowed' : 'pointer' }}
            >
              +
            </button>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button
              data-testid="btn-add-to-cart"
              disabled={!product.inStock}
              onClick={() => addToCart(product, quantity)}
            >
              Add to Cart
            </Button>
            <Button
              variant="secondary"
              data-testid="btn-buy-now"
              disabled={!product.inStock}
              onClick={() => {
                addToCart(product, quantity);
                window.location.href = '/checkout';
              }}
            >
              Buy Now
            </Button>
            <button
              type="button"
              data-testid="btn-add-to-wishlist"
              style={{ padding: '10px 16px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', background: 'var(--white)', cursor: 'pointer' }}
            >
              ❤️ Add to Wishlist
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--secondary)', marginBottom: 16 }}>
          <button
            type="button"
            data-testid="tab-description"
            onClick={() => setActiveTab('description')}
            style={{
              padding: '12px 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'description' ? 600 : 400,
              borderBottom: activeTab === 'description' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            Description
          </button>
          <button
            type="button"
            data-testid="tab-specifications"
            onClick={() => setActiveTab('specifications')}
            style={{
              padding: '12px 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'specifications' ? 600 : 400,
              borderBottom: activeTab === 'specifications' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            Specifications
          </button>
          <button
            type="button"
            data-testid="tab-reviews"
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '12px 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'reviews' ? 600 : 400,
              borderBottom: activeTab === 'reviews' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            Reviews
          </button>
        </div>
        {activeTab === 'description' && (
          <div>
            <p>{product.description}</p>
            {product.features?.length > 0 && (
              <ul style={{ marginTop: 16, paddingLeft: 20 }}>
                {product.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {activeTab === 'specifications' && (
          <table data-testid="specifications-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {product.specifications && Object.entries(product.specifications).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid var(--secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{k}</td>
                  <td style={{ padding: '12px 16px' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'reviews' && (
          <div>
            <div data-testid="reviews-summary" style={{ marginBottom: 16 }}>
              <p>Overall rating: {product.rating} ★ ({product.reviewCount} reviews)</p>
            </div>
            <div data-testid="review-item-0" style={{ padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
              <strong>Customer</strong>
              <p style={{ margin: '8px 0' }}>Great product, would recommend!</p>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>5 ★ · Jan 2025</span>
            </div>
            <button type="button" data-testid="btn-write-review" style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              Write a Review
            </button>
          </div>
        )}
      </div>
      {related.length > 0 && (
        <section>
          <h2 style={{ marginBottom: 16 }}>Related Products</h2>
          <div data-testid="related-products-carousel" style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16 }}>
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ flexShrink: 0, width: 200, textDecoration: 'none', color: 'var(--text)' }}
              >
                <img src={p.images?.[0]} alt={p.name} style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <p style={{ marginTop: 8, fontWeight: 500 }}>{p.name}</p>
                <p>{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
