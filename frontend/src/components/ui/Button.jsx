import RippleButton from '../../animations/RippleButton';

const variantMap = {
  primary: 'btn-premium',
  gold: 'btn-gold',
  outline: 'btn-outline',
  ghost: 'btn-ghost-light',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm tracking-wide bg-luxury-ivory text-luxury-charcoal border border-luxury-line hover:bg-white transition-all',
  danger:
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-all',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  className = '',
  type = 'button',
  magnetic = true,
  ...props
}) => {
  const sizeClass =
    variant in variantMap && size === 'sm'
      ? '!px-5 !py-2 !text-xs'
      : size === 'lg'
        ? '!px-10 !py-4'
        : '';

  if (variant in variantMap && ['primary', 'gold', 'outline', 'ghost'].includes(variant)) {
    return (
      <RippleButton
        type={type}
        magnetic={magnetic}
        disabled={disabled}
        onClick={onClick}
        variantClass={`${variantMap[variant]} ${sizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        {children}
      </RippleButton>
    );
  }

  return (
    <RippleButton
      type={type}
      magnetic={false}
      disabled={disabled}
      onClick={onClick}
      variantClass={`${variantMap[variant] || variantMap.primary} ${className}`}
      {...props}
    >
      {children}
    </RippleButton>
  );
};

export default Button;
