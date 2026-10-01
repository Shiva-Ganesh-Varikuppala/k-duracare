import { cn } from '@/utils';

export default function Badge({
  variant = 'light',
  color = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  children,
  className = '',
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-1 rounded-full font-medium transition-colors';

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const variants = {
    light: {
      primary: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400',
      success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
      error: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
      warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
      info: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
      purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
      light: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80',
      dark: 'bg-gray-700 text-gray-100 dark:bg-white/10 dark:text-white',
    },
    solid: {
      primary: 'bg-brand-500 text-white',
      success: 'bg-emerald-500 text-white',
      error: 'bg-rose-500 text-white',
      warning: 'bg-amber-500 text-white',
      info: 'bg-sky-500 text-white',
      purple: 'bg-purple-500 text-white',
      light: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white',
      dark: 'bg-gray-800 text-white',
    },
  };

  const chosenSize = sizeStyles[size] || sizeStyles.md;
  const chosenColor = variants[variant]?.[color] || variants.light.primary;

  return (
    <span className={cn(baseStyles, chosenSize, chosenColor, className)}>
      {startIcon && <span className="inline-flex shrink-0">{startIcon}</span>}
      {children}
      {endIcon && <span className="inline-flex shrink-0">{endIcon}</span>}
    </span>
  );
}
