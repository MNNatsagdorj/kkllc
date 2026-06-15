export default function Badge({
  children,
  variant = 'primary',
  icon: Icon,
  className = '',
}) {
  const variants = {
    primary: 'bg-primary-soft text-primary border-primary/15',
    secondary: 'bg-surface-sunken text-fg border-line',
    success: 'bg-[#E7F6EF] text-success border-[#BFE6D4]',
    warning: 'bg-amber-50 text-accent-amber border-amber-200',
    accent: 'bg-accent text-white border-accent',
    orange: 'bg-accent text-white border-accent',
    brand: 'bg-accent-soft text-accent border-accent/20',
    outline: 'bg-transparent text-fg-muted border-line-strong',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        text-[11px] font-semibold tracking-tight
        rounded-full border
        ${variants[variant]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3 h-3" strokeWidth={2.25} />}
      {children}
    </span>
  );
}
