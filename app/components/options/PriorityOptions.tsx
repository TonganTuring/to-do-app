import { Todo } from '../../types/todo';

interface PriorityOptionsProps {
  onSelect: (priority: Todo['priority']) => void;
}

export default function PriorityOptions({ onSelect }: PriorityOptionsProps) {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10 border border-gray-200 dark:border-gray-700 animate-fadeIn">
      <div className="text-sm text-white-500">
        Priority Options:
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => onSelect('High')}
            className="px-3 py-1.5 rounded-md bg-green-200 hover:bg-green-300 dark:bg-green-900/70 dark:hover:bg-green-800/70 transition-colors"
          >
            High
          </button>
          <button
            type="button"
            onClick={() => onSelect('Medium')}
            className="px-3 py-1.5 rounded-md bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-900/70 dark:hover:bg-yellow-800/70 transition-colors"
          >
            Medium
          </button>
          <button
            type="button"
            onClick={() => onSelect('Low')}
            className="px-3 py-1.5 rounded-md bg-red-200 hover:bg-red-300 dark:bg-red-900/70 dark:hover:bg-red-800/70 transition-colors"
          >
            Low
          </button>
        </div>
      </div>
    </div>
  );
} 