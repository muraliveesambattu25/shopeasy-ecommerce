export function Spinner({ size = 'medium', 'data-testid': dataTestId }) {
  const sizes = { small: 24, medium: 40, large: 56 };
  const s = sizes[size] || 40;
  return (
    <div
      data-testid={dataTestId || 'spinner-loader'}
      style={{
        width: s,
        height: s,
        border: '3px solid var(--secondary)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}

export function SkeletonLoader({ variant = 'card', 'data-testid': dataTestId }) {
  const base = {
    background: 'linear-gradient(90deg, var(--secondary) 25%, #eee 50%, var(--secondary) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 'var(--radius-md)',
  };
  if (variant === 'card') {
    return (
      <div data-testid={dataTestId || 'skeleton-loader'} style={{ ...base, height: 280, width: '100%' }} />
    );
  }
  if (variant === 'text') {
    return (
      <div data-testid={dataTestId || 'skeleton-loader'} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ ...base, height: 16, width: '80%' }} />
        <div style={{ ...base, height: 16, width: '60%' }} />
        <div style={{ ...base, height: 16, width: '40%' }} />
      </div>
    );
  }
  return <div data-testid={dataTestId || 'skeleton-loader'} style={{ ...base, height: 48, width: '100%' }} />;
}

export function ProgressLoader({ progress = 0, 'data-testid': dataTestId }) {
  return (
    <div data-testid={dataTestId || 'progress-loader'} style={{ width: '100%', height: 8, background: 'var(--secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          height: '100%',
          background: 'var(--primary-gradient)',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}
