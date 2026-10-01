import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggleButton({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400 animate-fade-in" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600 animate-fade-in" />
      )}
    </button>
  );
}
