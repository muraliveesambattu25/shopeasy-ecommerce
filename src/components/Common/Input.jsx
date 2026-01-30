import { useState } from 'react';

export default function Input({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  label,
  error,
  helperText,
  'data-testid': dataTestId,
  maxLength,
  readOnly,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const inputClassName = ['input-field', error ? 'input-error' : ''].filter(Boolean).join(' ');

  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: 'block',
            marginBottom: '6px',
            fontWeight: 600,
            color: 'var(--text)',
            fontSize: '0.9375rem',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--error)', marginLeft: 2 }}> *</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          id={name}
          name={name}
          type={inputType}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          data-testid={dataTestId}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={inputClassName}
          style={{
            paddingRight: isPassword ? 44 : undefined,
            backgroundColor: readOnly ? 'var(--bg)' : undefined,
          }}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1,
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {maxLength && (
        <span className="validation-helper" style={{ display: 'block' }}>
          {(value ?? '').length}/{maxLength}
        </span>
      )}
      {error && (
        <p id={`${name}-error`} className="validation-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && <p className="validation-helper">{helperText}</p>}
    </div>
  );
}
