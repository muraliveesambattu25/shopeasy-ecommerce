import { useEffect } from 'react';

const typeClass = {
  success: 'alert alert-success',
  error: 'alert alert-error',
  warning: 'alert alert-warning',
  info: 'alert alert-info',
};

export default function Alert({
  type = 'info',
  message,
  onClose,
  autoDismissMs,
  'data-testid': dataTestId,
  style: customStyle,
}) {
  useEffect(() => {
    if (autoDismissMs && onClose) {
      const t = setTimeout(onClose, autoDismissMs);
      return () => clearTimeout(t);
    }
  }, [autoDismissMs, onClose]);

  return (
    <div
      role="alert"
      data-testid={dataTestId}
      className={typeClass[type] || typeClass.info}
      style={customStyle}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="alert-close"
        >
          ×
        </button>
      )}
    </div>
  );
}
