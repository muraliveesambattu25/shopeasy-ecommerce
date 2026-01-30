export default function Checkbox({ checked, onChange, label, disabled, 'data-testid': dataTestId, indeterminate, ...rest }) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        ref={(el) => el && (el.indeterminate = !!indeterminate)}
        data-testid={dataTestId}
        style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
        {...rest}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
