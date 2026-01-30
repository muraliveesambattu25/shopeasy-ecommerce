import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        background: 'var(--text)',
        color: '#fff',
        padding: '48px 24px 24px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
        <div>
          <h3 style={{ marginBottom: 16, fontSize: '1.125rem' }}>About Us</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            ShopEase - Your one-stop shop for electronics, fashion, home & more. Quality products, great prices.
          </p>
        </div>
        <div>
          <h3 style={{ marginBottom: 16, fontSize: '1.125rem' }}>Customer Service</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><Link to="/contact" style={{ color: '#fff', opacity: 0.9, fontSize: '0.875rem', textDecoration: 'none' }}>Contact Us</Link></li>
            <li><Link to="/faq" style={{ color: '#fff', opacity: 0.9, fontSize: '0.875rem', textDecoration: 'none' }}>FAQs</Link></li>
            <li><Link to="/shipping" style={{ color: '#fff', opacity: 0.9, fontSize: '0.875rem', textDecoration: 'none' }}>Shipping & Returns</Link></li>
            <li><Link to="/terms" style={{ color: '#fff', opacity: 0.9, fontSize: '0.875rem', textDecoration: 'none' }}>Terms & Conditions</Link></li>
            <li><Link to="/privacy" style={{ color: '#fff', opacity: 0.9, fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: 16, fontSize: '1.125rem' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><Link to="/products" style={{ color: '#fff', opacity: 0.9, fontSize: '0.875rem', textDecoration: 'none' }}>All Products</Link></li>
            <li><Link to="/products?featured=1" style={{ color: '#fff', opacity: 0.9, fontSize: '0.875rem', textDecoration: 'none' }}>Featured</Link></li>
            <li><Link to="/deals" style={{ color: '#fff', opacity: 0.9, fontSize: '0.875rem', textDecoration: 'none' }}>Deals</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: 16, fontSize: '1.125rem' }}>Newsletter</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: 12 }}>Subscribe for exclusive deals.</p>
          <form style={{ display: 'flex', gap: 8 }} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              data-testid="input-newsletter-email"
              style={{ flex: 1, padding: '10px 12px', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
            />
            <button type="submit" data-testid="btn-subscribe-newsletter" style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500 }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 24, textAlign: 'center', fontSize: '0.875rem', opacity: 0.9 }}>
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
}
