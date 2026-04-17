export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  href,
  className = '',
  ...props
}) {
  const variants = {
    primary:
      'bg-primary text-white border border-primary hover:bg-primary-dark hover:border-primary-dark',
    secondary:
      'bg-secondary text-white border border-secondary hover:bg-secondary-light hover:border-secondary-light',
    outline:
      'bg-transparent border border-line-strong text-fg-strong hover:border-primary hover:text-primary',
    ghost:
      'bg-transparent text-fg-strong hover:bg-surface-sunken border border-transparent',
    whatsapp:
      'bg-[#25D366] text-white border border-[#25D366] hover:bg-[#1EB955] hover:border-[#1EB955]',
    dark:
      'bg-ink text-white border border-ink hover:bg-secondary-light hover:border-secondary-light',
  };

  const sizes = {
    sm: 'h-9 px-4 text-[13px]',
    md: 'h-11 px-5 text-sm',
    lg: 'h-13 px-7 text-[15px]',
  };

  const Component = href ? 'a' : 'button';
  const externalProps = href
    ? {
        href,
        target: href.startsWith('http') ? '_blank' : undefined,
        rel: href.startsWith('http') ? 'noopener noreferrer' : undefined,
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`
        group relative inline-flex items-center justify-center gap-2.5
        font-sans font-medium tracking-tight
        rounded-sm
        transition-all duration-200 ease-out
        cursor-pointer select-none
        focus-visible:outline-offset-4
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...externalProps}
      {...props}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
      )}
      <span className="whitespace-nowrap">{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
      )}
    </Component>
  );
}
