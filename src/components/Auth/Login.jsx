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
        padding: 24,
      }}
    >
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: 32,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <h1 style={{ marginBottom: 24, textAlign: 'center', color: 'var(--text)' }}>Login</h1>
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        <form onSubmit={handleSubmit} noValidate>
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
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              checked={rememberMe}
              onChange={setRememberMe}
              label="Remember Me"
              data-testid="checkbox-remember-me"
            />
          </div>
          <p style={{ marginBottom: 16, fontSize: '0.875rem' }}>
            <Link to="/forgot-password" data-testid="link-forgot-password">
              Forgot Password?
            </Link>
          </p>
          <Button
            type="submit"
            data-testid="btn-login"
            disabled={!canSubmit}
            fullWidth
          >
            Login
          </Button>
        </form>
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: '0.875rem' }}>OR</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <Button
            variant="outline"
            data-testid="btn-google-login"
            fullWidth
            onClick={() => alert('Google login - Mock implementation')}
          >
            Continue with Google
          </Button>
          <Button
            variant="outline"
            data-testid="btn-facebook-login"
            fullWidth
            onClick={() => alert('Facebook login - Mock implementation')}
          >
            Continue with Facebook
          </Button>
        </div>
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" data-testid="link-register">Create New Account</Link>
        </p>
      </div>
    </div>
  );
}
