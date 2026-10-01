import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PageBreadcrumb({ pageTitle, items = [] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {pageTitle}
        </h2>
      </div>

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center gap-1 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </li>

          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-600" />
              {item.path ? (
                <Link
                  to={item.path}
                  className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}

          {!items.length && (
            <li className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-600" />
              <span className="text-brand-500 dark:text-brand-400 font-medium">
                {pageTitle}
              </span>
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
}
