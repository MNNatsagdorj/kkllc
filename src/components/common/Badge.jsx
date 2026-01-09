import { motion } from 'framer-motion';

export default function Badge({ 
  children, 
  variant = 'primary', 
  icon: Icon,
  className = '' 
}) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    orange: 'bg-primary text-white border-primary',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 
        text-xs font-semibold rounded-full border
        ${variants[variant]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </motion.span>
  );
}

