import { Todo } from '../../types/todo';

interface CategoryOptionsProps {
  onSelect: (category: Todo['category']) => void;
}

export default function CategoryOptions({ onSelect }: CategoryOptionsProps) {
  const categories: Todo['category'][] = [
    'My God',
    'My People',
    'My Work',
    'Myself',
    'Maintenance',
    'Unassigned'
  ];

  return (
    <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg z-50">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
        >
          {category}
        </button>
      ))}
    </div>
  );
} 