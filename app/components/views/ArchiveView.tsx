import { Todo } from '../../types/todo';
import TodoItem from '../TodoItem';

interface ArchiveViewProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (todo: Todo) => void;
  getPriorityColor: (priority: Todo['priority']) => string;
  getCategoryColor: (category: Todo['category']) => string;
}

export default function ArchiveView({
  todos,
  onToggle,
  onDelete,
  onSelect,
  getPriorityColor,
  getCategoryColor,
}: ArchiveViewProps) {
  const archivedTodos = todos
    .filter(todo => todo.archivedAt)
    .sort((a, b) => new Date(b.archivedAt!).getTime() - new Date(a.archivedAt!).getTime());

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Archived Tasks</h2>
      {archivedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onClick={() => onSelect(todo)}
          getPriorityColor={getPriorityColor}
          getCategoryColor={getCategoryColor}
        />
      ))}
      {archivedTodos.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No archived tasks</p>
      )}
    </div>
  );
} 