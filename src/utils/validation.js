/**
 * Validation utilities for form fields
 */

export const validateEmail = (email) => {
  if (!email?.trim()) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Invalid email';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be 8+ characters with uppercase, lowercase, number and special character';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone?.trim()) return 'Phone number is required';
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10) return 'Please enter valid 10-digit phone number';
  return null;
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value, min, fieldName = 'This field') => {
  if (value && value.length < min) return `Minimum ${min} characters`;
  return null;
};

export const validateFirstName = (value) => {
  const required = validateRequired(value, 'First name');
  if (required) return required;
  return validateMinLength(value, 2, 'First name');
};

export const validateLastName = (value) => {
  return validateRequired(value, 'Last name');
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Confirm password is required';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateDOB = (dob) => {
  if (!dob) return 'Date of birth is required';
  const birthDate = new Date(dob);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (birthDate > today) return 'Date cannot be in the future';
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  if (age < 18) return 'You must be 18 or older to register';
  return null;
};

export const validatePincode = (pincode) => {
  if (!pincode?.trim()) return 'Pincode is required';
  const digits = pincode.replace(/\D/g, '');
  if (digits.length !== 6) return 'Please enter valid 6-digit pincode';
  return null;
};

export const validateCardNumber = (number) => {
  const digits = number.replace(/\D/g, '');
  if (digits.length !== 16) return 'Card number must be 16 digits';
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  if (sum % 10 !== 0) return 'Invalid card number';
  return null;
};

export const validateCardExpiry = (expiry) => {
  if (!expiry?.trim()) return 'Expiry date is required';
  const [month, year] = expiry.split('/').map((s) => s.trim());
  if (!month || !year) return 'Use MM/YY format';
  const m = parseInt(month, 10);
  const y = parseInt(year.length === 2 ? '20' + year : year, 10);
  if (m < 1 || m > 12) return 'Invalid month';
  const now = new Date();
  const expDate = new Date(y, m, 0);
  if (expDate < now) return 'Card has expired';
  return null;
};

export const validateCVV = (cvv, isAmex = false) => {
  const digits = cvv.replace(/\D/g, '');
  const len = isAmex ? 4 : 3;
  if (digits.length !== len) return `CVV must be ${len} digits`;
  return null;
};

export const validateUPI = (upiId) => {
  if (!upiId?.trim()) return 'UPI ID is required';
  const re = /^[\w.-]+@[\w.-]+$/;
  if (!re.test(upiId.trim())) return 'Invalid UPI ID format (e.g. username@bank)';
  return null;
};
