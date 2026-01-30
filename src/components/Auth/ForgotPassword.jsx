import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validation';
import { getUsers, setUsers, getResetToken, setResetToken, removeResetToken } from '../../utils/localStorage';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Alert from '../Common/Alert';

const RESET_EXPIRY_MS = 15 * 60 * 1000;

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [step, setStep] = useState(token ? 'reset' : 'request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSendReset = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setErrors({ email: err });
      return;
    }
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      setErrors({ email: 'No account found with this email' });
      return;
    }
    const resetData = { email: user.email, expiry: Date.now() + RESET_EXPIRY_MS };
    setResetToken(resetData);
    setMessage('Password reset link sent to your email');
    setStep('sent');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const err1 = validatePassword(newPassword);
    const err2 = validateConfirmPassword(newPassword, confirmPassword);
    if (err1 || err2) {
      setErrors({ newPassword: err1, confirmPassword: err2 });
      return;
    }
    const reset = getResetToken();
    if (!reset || Date.now() > reset.expiry) {
      setMessage('Reset link expired. Please request again.');
      return;
    }
    const users = getUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === reset.email.toLowerCase());
    if (idx === -1) return;
    users[idx].password = newPassword;
    setUsers(users);
    removeResetToken();
    setMessage('Password updated successfully. Please login.');
    setTimeout(() => (window.location.href = '/login'), 1500);
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
        <h1 style={{ marginBottom: 24, textAlign: 'center', color: 'var(--text)' }}>Forgot Password</h1>
        {message && <Alert type="success" message={message} onClose={() => setMessage(null)} />}
        {step === 'request' && (
          <form onSubmit={handleSendReset}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              data-testid="input-email"
              placeholder="Enter your email"
            />
            <Button type="submit" data-testid="btn-send-reset" fullWidth>
              Send Reset Link
            </Button>
          </form>
        )}
        {step === 'sent' && (
          <p style={{ marginBottom: 16 }}>
            <Link to="/reset-password?token=mock_token" data-testid="link-reset-password">
              Click here to reset password
            </Link>
          </p>
        )}
        {(step === 'reset' || (step === 'sent' && token)) && (
          <form onSubmit={handleResetPassword}>
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              required
              data-testid="input-new-password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
              data-testid="input-confirm-new-password"
            />
            <Button type="submit" data-testid="btn-reset-password" fullWidth>
              Reset Password
            </Button>
          </form>
        )}
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: '0.875rem' }}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
