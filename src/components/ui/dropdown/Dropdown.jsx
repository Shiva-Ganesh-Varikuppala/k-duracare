import { cn } from '@/utils';
import { useEffect, useRef } from 'react';

export function Dropdown({
  isOpen,
  onClose,
  children,
  className = '',
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('.dropdown-toggle')
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'absolute right-0 z-50 mt-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownItem({
  onItemClick,
  tag = 'button',
  to,
  children,
  className = '',
  ...props
}) {
  const Component = tag;
  return (
    <Component
      onClick={onItemClick}
      to={to}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white text-left',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Dropdown;
