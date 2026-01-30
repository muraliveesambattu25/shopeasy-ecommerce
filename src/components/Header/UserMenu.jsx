import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    clearCart();
    setShowLogoutModal(false);
    setOpen(false);
    navigate('/');
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/login" data-testid="link-header-login" style={{ padding: '8px 16px', color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
          Login
        </Link>
        <Link to="/register" data-testid="link-header-register" style={{ padding: '8px 16px', background: 'var(--primary-gradient)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 500 }}>
          Register
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          data-testid="user-avatar"
          aria-label="User menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>
            {user.firstName?.[0] || 'U'}
          </span>
          <span style={{ fontWeight: 500 }}>{user.firstName}</span>
        </button>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} aria-hidden="true" />
            <ul
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                padding: 8,
                listStyle: 'none',
                background: 'var(--white)',
                border: '1px solid var(--secondary)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                minWidth: 180,
                zIndex: 11,
              }}
            >
              <li>
                <Link to="/profile" data-testid="menu-profile" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 12px', color: 'var(--text)', textDecoration: 'none', borderRadius: 4 }}>
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/profile/orders" data-testid="menu-orders" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 12px', color: 'var(--text)', textDecoration: 'none', borderRadius: 4 }}>
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/profile/wishlist" data-testid="menu-wishlist" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 12px', color: 'var(--text)', textDecoration: 'none', borderRadius: 4 }}>
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/profile" data-testid="menu-settings" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 12px', color: 'var(--text)', textDecoration: 'none', borderRadius: 4 }}>
                  Settings
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  data-testid="menu-logout"
                  onClick={() => setShowLogoutModal(true)}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', borderRadius: 4 }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </>
        )}
      </div>
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" data-testid="btn-cancel-logout" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button data-testid="btn-confirm-logout" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </>
  );
}
