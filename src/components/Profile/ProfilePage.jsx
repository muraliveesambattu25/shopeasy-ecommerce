import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../Common/Input';
import Button from '../Common/Button';

const TABS = [
  { path: '/profile', label: 'Profile', testId: 'tab-profile' },
  { path: '/profile/orders', label: 'Order History', testId: 'tab-order-history' },
  { path: '/profile/wishlist', label: 'Wishlist', testId: 'tab-wishlist' },
  { path: '/profile/addresses', label: 'Saved Addresses', testId: 'tab-addresses' },
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    dob: user?.dob || '',
  });
  const [profilePic, setProfilePic] = useState(user?.profilePicture || null);
  const [message, setMessage] = useState(null);

  const handleSave = () => {
    updateProfile({ ...form, profilePicture: profilePic });
    setEditing(false);
    setMessage('Profile updated successfully');
    setTimeout(() => setMessage(null), 3000);
  };

  if (!user) return <p>Please log in to view profile.</p>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>My Account</h1>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <aside style={{ width: 220, flexShrink: 0 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TABS.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                data-testid={tab.testId}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  color: location.pathname === tab.path ? 'var(--primary)' : 'var(--text)',
                  fontWeight: location.pathname === tab.path ? 600 : 400,
                  background: location.pathname === tab.path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main style={{ flex: 1, minWidth: 0 }}>
          {location.pathname === '/profile' && (
            <div>
              {message && <p style={{ color: 'var(--success)', marginBottom: 16 }}>{message}</p>}
              <div style={{ marginBottom: 24 }}>
                <label>Profile Picture</label>
                <div
                  data-testid="input-profile-picture"
                  onClick={() => document.getElementById('profile-pic-input')?.click()}
                  style={{
                    width: 120,
                    height: 120,
                    border: '2px dashed var(--secondary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    marginTop: 8,
                  }}
                >
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>👤</span>
                  )}
                </div>
                <input
                  id="profile-pic-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 5 * 1024 * 1024) {
                      const reader = new FileReader();
                      reader.onload = () => setProfilePic(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <Input label="First Name" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} data-testid="input-profile-firstname" disabled={!editing} />
              <Input label="Last Name" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} data-testid="input-profile-lastname" disabled={!editing} />
              <Input label="Email" value={form.email} data-testid="input-profile-email" readOnly />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} data-testid="input-profile-phone" disabled={!editing} />
              <div style={{ marginBottom: 16 }}>
                <label>Gender</label>
                <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} data-testid="select-profile-gender" disabled={!editing} style={{ width: '100%', padding: '10px 12px', marginTop: 6, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)' }}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input label="Date of Birth" type="date" value={form.dob} data-testid="input-profile-dob" readOnly />
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <Button data-testid="btn-save-profile" onClick={editing ? handleSave : () => setEditing(true)}>
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </Button>
                {editing && (
                  <Button variant="secondary" data-testid="btn-cancel-profile" onClick={() => { setEditing(false); setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, gender: user.gender, dob: user.dob }); }}>
                    Cancel
                  </Button>
                )}
                <Link to="/forgot-password" data-testid="link-change-password" style={{ alignSelf: 'center', fontSize: '0.875rem', color: 'var(--primary)' }}>
                  Change Password
                </Link>
              </div>
            </div>
          )}
          {location.pathname !== '/profile' && <Outlet />}
        </main>
      </div>
    </div>
  );
}
