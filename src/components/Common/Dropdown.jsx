import { useState } from 'react';

const triggerStyle = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '1rem',
  border: '1px solid var(--secondary)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--white)',
  cursor: 'pointer',
  textAlign: 'left',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  required,
  disabled,
  'data-testid': dataTestId,
  searchable,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selected = options.find((o) => o.value === value);
  const filtered = searchable && search
    ? options.filter((o) => o.label?.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div style={{ marginBottom: '16px', width: '100%', position: 'relative' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: 'var(--error)' }}> *</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        data-testid={dataTestId}
        style={{
          ...triggerStyle,
          borderColor: error ? 'var(--error)' : undefined,
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 1 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              margin: 0,
              padding: 0,
              listStyle: 'none',
              background: 'var(--white)',
              border: '1px solid var(--secondary)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              maxHeight: 240,
              overflow: 'auto',
              zIndex: 2,
            }}
          >
            {searchable && (
              <li style={{ padding: 8, borderBottom: '1px solid var(--secondary)' }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--secondary)', borderRadius: 4 }}
                />
              </li>
            )}
            {filtered.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                  setSearch('');
                }}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  background: value === opt.value ? 'var(--secondary)' : undefined,
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </>
      )}
      {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: 4 }}>{error}</p>}
    </div>
  );
}
