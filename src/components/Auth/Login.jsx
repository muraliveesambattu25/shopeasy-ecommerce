import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Checkbox from '../Common/Checkbox';
import Alert from '../Common/Alert';

const LOCKOUT_MINUTES = 1; // demo: 1 min
const MAX_ATTEMPTS = 3;

const DEMO_CREDENTIALS = [
  { email: 'test@example.com', password: 'TestUser@12', label: 'Test User' },
  { email: 'demo@example.com', password: 'DemoUser@12', label: 'Demo Customer' },
];

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, findUserByEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  const isLocked = lockedUntil && Date.now() < lockedUntil;
  const isFormValid = email.trim().length > 0 && password.length > 0;
  const canSubmit = isFormValid && !isLocked;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setErrors({ email: emailErr || undefined, password: passErr || undefined });
      return;
    }
    if (isLocked) {
      setAlert({ type: 'error', message: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minute(s).` });
      return;
    }
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
        setAlert({ type: 'error', message: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minute(s).` });
      } else {
        setAlert({ type: 'error', message: `Invalid email or password. ${MAX_ATTEMPTS - next} attempts remaining.` });
      }
      return;
    }
    login(user, rememberMe);
    setAlert({ type: 'success', message: `Welcome back, ${user.firstName}!` });
    setTimeout(() => navigate(redirect), 800);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--primary-gradient)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          maxWidth: 840,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          minHeight: 520,
        }}
        className="login-card"
      >
        {/* Left: Welcome + Demo credentials */}
        <div
          style={{
            padding: '48px 40px',
            background: 'var(--bg)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h1 style={{ marginBottom: 12, color: 'var(--text)', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>
            Welcome back
          </h1>
          <p style={{ marginBottom: 32, color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
            Sign in to continue to ShopEase
          </p>
          <div data-testid="demo-credentials" style={{ marginTop: 24 }}>
            <p style={{ marginBottom: 16, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Demo credentials
            </p>
            {DEMO_CREDENTIALS.map((cred, i) => (
              <div
                key={cred.email}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginBottom: i < DEMO_CREDENTIALS.length - 1 ? 20 : 0,
                  padding: 16,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)' }}>{cred.label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {cred.email}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {cred.password}
                </div>
                <button
                  type="button"
                  data-testid={`btn-demo-login-${i}`}
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '8px 16px',
                    fontSize: '0.8125rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  Use this
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h2 style={{ marginBottom: 32, color: 'var(--text)', fontSize: '1.5rem', fontWeight: 600 }}>Login</h2>
          {alert && (
            <div style={{ marginBottom: 24 }}>
              <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ marginBottom: 8 }}>
              <Input
                label="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
                data-testid="input-email"
                placeholder="Enter your email"
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                data-testid="input-password"
                placeholder="Enter your password"
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 28,
                marginTop: 8,
              }}
            >
              <Checkbox
                checked={rememberMe}
                onChange={setRememberMe}
                label="Remember Me"
                data-testid="checkbox-remember-me"
              />
              <Link
                to="/forgot-password"
                data-testid="link-forgot-password"
                style={{ fontSize: '0.9375rem', color: 'var(--primary)', fontWeight: 500 }}
              >
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" data-testid="btn-login" disabled={!canSubmit} fullWidth style={{ marginBottom: 28, padding: '12px 24px' }}>
              Login
            </Button>
          </form>
          <p style={{ marginTop: 8, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            OR
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Button
              variant="outline"
              data-testid="btn-google-login"
              fullWidth
              onClick={() => alert('Google login - Mock implementation')}
            >
              Google
            </Button>
            <Button
              variant="outline"
              data-testid="btn-facebook-login"
              fullWidth
              onClick={() => alert('Facebook login - Mock implementation')}
            >
              Facebook
            </Button>
          </div>
          <p style={{ marginTop: 28, textAlign: 'center', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" data-testid="link-register" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .login-card {
            grid-template-columns: 1fr;
            max-width: 520px;
            min-height: auto;
          }
          .login-card > div:first-child {
            border-right: none;
            border-bottom: 1px solid var(--border);
            padding: 40px 32px 32px;
          }
          .login-card > div:last-child {
            padding: 40px 32px 48px;
          }
          .login-card > div:first-child [data-testid="demo-credentials"] {
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
}
