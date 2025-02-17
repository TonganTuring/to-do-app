import React from 'react';

type View = 'inbox' | 'priorities' | 'categories' | 'date';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 h-full border-r border-gray-200 dark:border-gray-800 p-4">
      <nav className="space-y-2">
        {(['inbox', 'priorities', 'categories', 'date'] as View[]).map((view) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`w-full px-4 py-2 text-left rounded-lg transition-colors ${
              currentView === view
                ? 'bg-gray-200 dark:bg-gray-800'
                : 'hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </nav>
    </div>
  );
} 