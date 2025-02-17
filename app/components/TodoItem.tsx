import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
  getPriorityColor: (priority: Todo['priority']) => string;
  getCategoryColor: (category: Todo['category']) => string;
}

export default function TodoItem({ 
  todo, 
  onToggle, 
  onDelete, 
  onClick,
  getPriorityColor,
  getCategoryColor 
}: TodoItemProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-3 p-3 group transition-colors ${getPriorityColor(todo.priority)} rounded-lg cursor-pointer`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-4 h-4 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
      />
      <span className={`flex-1 text-sm text-white ${todo.completed ? 'line-through text-gray-300' : ''}`}>
        {todo.text}
      </span>
      <div className="flex items-center gap-3 text-xs">
        <span className={`flex items-center gap-1.5 text-gray-300 ${getCategoryColor(todo.category)} px-2 py-1 rounded-md`}>
          {todo.category}
        </span>
        {todo.dueDate && (
          <span className="text-blue-300 bg-black/30 px-2 py-1 rounded-md">
            {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id);
        }}
        className="hidden group-hover:block px-2 py-1 text-gray-300 hover:text-red-300 transition-colors"
      >
        ×
      </button>
    </li>
  );
} 