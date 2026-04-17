export default function Badge({
  children,
  variant = 'primary',
  icon: Icon,
  className = '',
}) {
  const variants = {
    primary: 'bg-primary-soft text-primary border-primary/20',
    secondary: 'bg-surface-sunken text-fg-strong border-line',
    success: 'bg-emerald-50 text-accent-emerald border-emerald-200',
    warning: 'bg-amber-50 text-accent-amber border-amber-200',
    orange: 'bg-primary text-white border-primary',
    outline: 'bg-transparent text-fg-muted border-line-strong',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        text-[10.5px] font-wide font-semibold uppercase tracking-[0.12em]
        rounded-sm border
        ${variants[variant]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3 h-3" strokeWidth={2.25} />}
      {children}
    </span>
  );
}
