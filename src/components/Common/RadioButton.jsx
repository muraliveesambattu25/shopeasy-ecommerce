export function RadioButton({ name, value, checked, onChange, label, disabled, 'data-testid': dataTestId, ...rest }) {
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
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        data-testid={dataTestId}
        style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
        {...rest}
      />
      {label && <span>{label}</span>}
    </label>
  );
}

export function RadioGroup({ name, value, onChange, options, disabled, 'data-testid': groupTestId }) {
  return (
    <div role="radiogroup" data-testid={groupTestId} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {options.map((opt) => (
        <RadioButton
          key={opt.value}
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={onChange}
          label={opt.label}
          disabled={disabled}
          data-testid={opt['data-testid']}
        />
      ))}
    </div>
  );
}
