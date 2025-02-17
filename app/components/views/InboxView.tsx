import { Todo } from '../../types/todo';
import TodoItem from '../TodoItem';

interface InboxViewProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (todo: Todo) => void;
  getPriorityColor: (priority: Todo['priority']) => string;
  getCategoryColor: (category: Todo['category']) => string;
}

export default function InboxView({
  todos,
  onToggle,
  onDelete,
  onSelect,
  getPriorityColor,
  getCategoryColor,
}: InboxViewProps) {
  const inboxTodos = todos.filter(todo => 
    !todo.archivedAt &&
    (todo.priority === 'Unassigned' || 
    todo.category === 'Unassigned' || 
    todo.dueDate === null)
  );

  return (
    <div className="space-y-4">
      {inboxTodos.map((todo) => (
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
    </div>
  );
} 