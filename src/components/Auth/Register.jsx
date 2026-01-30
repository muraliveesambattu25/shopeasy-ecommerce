import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUsers } from '../../utils/localStorage';
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  validateDOB,
} from '../../utils/validation';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Checkbox from '../Common/Checkbox';
import { RadioButton } from '../Common/RadioButton';
import Alert from '../Common/Alert';

const countryCodes = [
  { value: '+91', label: 'India +91' },
  { value: '+1', label: 'USA +1' },
  { value: '+44', label: 'UK +44' },
  { value: '+61', label: 'Australia +61' },
  { value: '+86', label: 'China +86' },
];

const genderOptions = [
  { value: 'male', label: 'Male', 'data-testid': 'radio-gender-male' },
  { value: 'female', label: 'Female', 'data-testid': 'radio-gender-female' },
  { value: 'other', label: 'Other', 'data-testid': 'radio-gender-other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say', 'data-testid': 'radio-gender-prefer-not-to-say' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, findUserByEmail } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+91',
    phone: '',
    gender: '',
    dob: '',
    terms: false,
    newsletter: false,
  });
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const e = {};
    e.firstName = validateFirstName(form.firstName);
    e.lastName = validateLastName(form.lastName);
    e.email = validateEmail(form.email);
    if (!e.email) {
      const users = getUsers();
      if (users.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) {
        e.email = 'Email already registered. Please login';
      }
    }
    e.password = validatePassword(form.password);
    e.confirmPassword = validateConfirmPassword(form.password, form.confirmPassword);
    e.phone = validatePhone(form.phone);
    e.gender = form.gender ? null : 'Please select your gender';
    e.dob = validateDOB(form.dob);
    e.terms = form.terms ? null : 'You must agree to Terms & Conditions';
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setAlert(null);
    try {
      register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.countryCode + form.phone.replace(/\D/g, ''),
        gender: form.gender,
        dob: form.dob,
        newsletter: form.newsletter,
        registeredAt: new Date().toISOString(),
        isVerified: true,
        addresses: [],
        orders: [],
        wishlist: [],
      });
      setAlert({ type: 'success', message: 'Registration successful! Please login with your credentials.' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Registration failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

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
          maxWidth: 520,
          width: '100%',
        }}
      >
        <h1 style={{ marginBottom: 24, textAlign: 'center', color: 'var(--text)' }}>Create Account</h1>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            data-testid="alert-register"
          />
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              onBlur={() => setErrors((e) => ({ ...e, firstName: validateFirstName(form.firstName) }))}
              error={errors.firstName}
              required
              data-testid="input-firstname"
              placeholder="First name"
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              onBlur={() => setErrors((e) => ({ ...e, lastName: validateLastName(form.lastName) }))}
              error={errors.lastName}
              required
              data-testid="input-lastname"
              placeholder="Last name"
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={() => setErrors((e) => ({ ...e, email: validateEmail(form.email) }))}
            error={errors.email}
            required
            data-testid="input-email"
            placeholder="Email"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            onBlur={() => setErrors((e) => ({ ...e, password: validatePassword(form.password) }))}
            error={errors.password}
            required
            data-testid="input-password"
            placeholder="Password"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            onBlur={() => setErrors((e) => ({ ...e, confirmPassword: validateConfirmPassword(form.password, form.confirmPassword) }))}
            error={errors.confirmPassword}
            required
            data-testid="input-confirm-password"
            placeholder="Confirm password"
          />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Phone</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={form.countryCode}
                onChange={(e) => update('countryCode', e.target.value)}
                data-testid="select-country-code"
                style={{ padding: '10px 12px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', minWidth: 100 }}
              >
                {countryCodes.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                onBlur={() => setErrors((e) => ({ ...e, phone: validatePhone(form.phone) }))}
                data-testid="input-phone"
                placeholder="10-digit phone"
                maxLength={10}
                style={{ flex: 1, padding: '10px 12px', border: `1px solid ${errors.phone ? 'var(--error)' : 'var(--secondary)'}`, borderRadius: 'var(--radius-md)' }}
              />
            </div>
            {errors.phone && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: 4 }}>{errors.phone}</p>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Gender *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {genderOptions.map((opt) => (
                <RadioButton
                  key={opt.value}
                  name="gender"
                  value={opt.value}
                  checked={form.gender === opt.value}
                  onChange={(v) => update('gender', v)}
                  label={opt.label}
                  data-testid={opt['data-testid']}
                />
              ))}
            </div>
            {errors.gender && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: 4 }}>{errors.gender}</p>}
          </div>
          <Input
            label="Date of Birth"
            type="date"
            value={form.dob}
            onChange={(e) => update('dob', e.target.value)}
            onBlur={() => setErrors((e) => ({ ...e, dob: validateDOB(form.dob) }))}
            error={errors.dob}
            required
            data-testid="input-dob"
            max={today}
          />
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              checked={form.terms}
              onChange={(v) => update('terms', v)}
              label={
                <>
                  I agree to{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    Terms & Conditions
                  </a>
                </>
              }
              data-testid="checkbox-terms"
            />
            {errors.terms && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: 4 }}>{errors.terms}</p>}
          </div>
          <div style={{ marginBottom: 24 }}>
            <Checkbox
              checked={form.newsletter}
              onChange={(v) => update('newsletter', v)}
              label="Subscribe to our newsletter for exclusive deals"
              data-testid="checkbox-newsletter"
            />
          </div>
          <Button
            type="submit"
            data-testid="btn-register"
            disabled={submitting}
            loading={submitting}
            fullWidth
          >
            {submitting ? 'Creating Account...' : 'Register'}
          </Button>
        </form>
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" data-testid="link-login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
