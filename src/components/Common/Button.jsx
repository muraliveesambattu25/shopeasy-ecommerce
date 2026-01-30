import { forwardRef } from 'react';

const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  text: 'btn-text',
};

const sizeClass = {
  small: 'btn-sm',
  medium: 'btn-md',
  large: 'btn-lg',
};

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      type = 'button',
      onClick,
      children,
      className = '',
      'data-testid': dataTestId,
      fullWidth,
      ...rest
    },
    ref
  ) => {
    const classes = [
      'btn',
      variantClass[variant] || variantClass.primary,
      sizeClass[size] || sizeClass.medium,
      fullWidth ? 'btn-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={classes}
        data-testid={dataTestId}
        aria-busy={loading}
        {...rest}
      >
        {loading ? (
          <>
            <span
              className="spinner"
              style={{
                width: 18,
                height: 18,
                border: '2px solid currentColor',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
export default Button;
