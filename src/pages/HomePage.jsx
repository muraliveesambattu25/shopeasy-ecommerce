import { Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/Products/ProductCard';
import { formatPrice } from '../utils/helpers';

export default function HomePage() {
  const { getFeaturedProducts } = useProduct();
  const featured = getFeaturedProducts();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <section style={{ marginBottom: 48, textAlign: 'center', padding: '48px 24px', background: 'var(--primary-gradient)', borderRadius: 'var(--radius-lg)', color: '#fff' }}>
        <h1 style={{ marginBottom: 16, fontSize: '2.5rem' }}>Welcome to ShopEase</h1>
        <p style={{ marginBottom: 24, fontSize: '1.125rem', opacity: 0.95 }}>Discover great deals on electronics, fashion, home & more.</p>
        <Link to="/products" style={{ display: 'inline-block', padding: '12px 24px', background: '#fff', color: 'var(--primary)', borderRadius: 'var(--radius-md)', fontWeight: 600, textDecoration: 'none' }}>
          Shop Now
        </Link>
      </section>
      <section>
        <h2 style={{ marginBottom: 24 }}>Featured Products</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
          {featured.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/products" style={{ padding: '12px 24px', background: 'var(--primary-gradient)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600, textDecoration: 'none' }}>
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
