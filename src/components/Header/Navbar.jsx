import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { categories } = useProduct();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <header
      style={{
        background: 'var(--white)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ padding: '8px 12px', background: 'var(--primary)', color: '#fff', textAlign: 'center', fontSize: '0.875rem' }}>
        Free shipping on orders over ₹500
      </div>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          maxWidth: 1400,
          margin: '0 auto',
          gap: 16,
        }}
      >
        <Link to="/" data-testid="logo" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text)', fontWeight: 700, fontSize: '1.5rem' }}>
          ShopEase
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 600 }} className="hide-mobile">
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => setCategoryOpen(false)}
              data-testid="category-menu"
              style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              Categories ▼
            </button>
            {categoryOpen && (
              <div
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={() => setCategoryOpen(false)}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 4,
                  padding: 16,
                  background: 'var(--white)',
                  border: '1px solid var(--secondary)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  minWidth: 220,
                  zIndex: 50,
                }}
              >
                {categories.map((cat) => (
                  <div key={cat.id} style={{ marginBottom: 8 }}>
                    <Link
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setCategoryOpen(false)}
                      style={{ fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}
                    >
                      {cat.name}
                    </Link>
                    <div style={{ marginLeft: 12, marginTop: 4 }}>
                      {cat.subCategories?.slice(0, 4).map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/products?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub.name)}`}
                          onClick={() => setCategoryOpen(false)}
                          style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 2 }}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <SearchBar />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/profile/wishlist" data-testid="wishlist-icon" style={{ padding: 8, color: 'var(--text)', fontSize: '1.25rem' }} aria-label="Wishlist">
            ❤️
          </Link>
          <CartIcon />
          <UserMenu />
          <button
            type="button"
            data-testid="mobile-menu-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            className="show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, fontSize: '1.5rem' }}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div
          className="show-mobile"
          style={{
            padding: 16,
            borderTop: '1px solid var(--secondary)',
            background: 'var(--white)',
          }}
        >
          <SearchBar />
          <div style={{ marginTop: 16 }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '8px 0', color: 'var(--text)', textDecoration: 'none' }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
