import { cn } from '@/utils';

export default function ComponentCard({
  title,
  children,
  className = '',
  desc = '',
  action = null,
  headerClassName = '',
  bodyClassName = '',
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200 bg-white transition-colors duration-200 dark:border-gray-800 dark:bg-white/[0.03]',
        className
      )}
    >
      {/* Card Header */}
      {(title || action || desc) && (
        <div
          className={cn(
            'flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-gray-800',
            headerClassName
          )}
        >
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                {title}
              </h3>
            )}
            {desc && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {desc}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={cn('p-5 sm:p-6', bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
