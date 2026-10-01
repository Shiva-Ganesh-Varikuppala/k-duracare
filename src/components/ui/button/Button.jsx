import { cn } from '@/utils';

export default function Button({
  children,
  size = 'md',
  variant = 'primary',
  startIcon,
  endIcon,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-5 py-3 text-base rounded-xl',
  };

  const variantClasses = {
    primary:
      'bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs focus:ring-4 focus:ring-brand-500/20 active:bg-brand-700',
    outline:
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5',
    secondary:
      'border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    ghost:
      'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5',
    danger:
      'bg-rose-500 hover:bg-rose-600 text-white shadow-theme-xs focus:ring-4 focus:ring-rose-500/20',
    success:
      'bg-emerald-500 hover:bg-emerald-600 text-white shadow-theme-xs focus:ring-4 focus:ring-emerald-500/20',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
        sizeClasses[size] || sizeClasses.md,
        variantClasses[variant] || variantClasses.primary,
        className
      )}
    >
      {startIcon && <span className="shrink-0">{startIcon}</span>}
      {children}
      {endIcon && <span className="shrink-0">{endIcon}</span>}
    </button>
  );
}
