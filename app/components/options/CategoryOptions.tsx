import { Todo } from '../../types/todo';

interface CategoryOptionsProps {
  onSelect: (category: Todo['category']) => void;
}

export default function CategoryOptions({ onSelect }: CategoryOptionsProps) {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10 border border-gray-200 dark:border-gray-700 animate-fadeIn">
      <div className="text-sm text-white-500">
        Category Options:
        <div className="flex gap-2 mt-2 flex-wrap">
          {[
            ['My God', 'bg-green-600/70 hover:bg-green-600/80'],
            ['Myself', 'bg-yellow-600/70 hover:bg-yellow-600/80'],
            ['My People', 'bg-orange-600/70 hover:bg-orange-600/80'],
            ['My Work', 'bg-red-600/70 hover:bg-red-600/80'],
            ['Maintenance', 'bg-blue-600/70 hover:bg-blue-600/80'],
            ['Unassigned', 'bg-gray-600/70 hover:bg-gray-600/80'],
          ].map(([category, className]) => (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category as Todo['category'])}
              className={`px-3 py-1.5 rounded-md ${className} text-white transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 