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
    accent:
      'bg-accent text-white border border-accent hover:bg-accent-dark hover:border-accent-dark shadow-[0_10px_24px_rgba(242,108,27,0.30)]',
    secondary:
      'bg-ink text-white border border-ink hover:bg-secondary-light hover:border-secondary-light',
    outline:
      'bg-white border border-line-strong text-primary hover:border-primary hover:bg-primary-soft',
    ghost:
      'bg-transparent text-fg-strong hover:bg-surface-sunken border border-transparent',
    whatsapp:
      'bg-[#25D366] text-white border border-[#25D366] hover:bg-[#1EB955] hover:border-[#1EB955]',
    dark:
      'bg-ink text-white border border-ink hover:bg-secondary-light hover:border-secondary-light',
  };

  const sizes = {
    sm: 'h-11 px-4 text-[13.5px] rounded-xl',
    md: 'h-12 px-6 text-[15px] rounded-xl',
    lg: 'h-13 px-7 text-base rounded-2xl',
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
        font-sans font-semibold tracking-tight
        transition-all duration-200 ease-out
        cursor-pointer select-none
        focus-visible:outline-offset-4
        disabled:opacity-60 disabled:cursor-not-allowed
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
