import { Todo } from '../../types/todo';
import { isWithinInterval, addDays, addMonths, parseISO, isAfter } from 'date-fns';

interface DateViewProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (todo: Todo) => void;
  getPriorityColor: (priority: Todo['priority']) => string;
  getCategoryColor: (category: Todo['category']) => string;
  editingTodo: number | null;
  editText: string;
  handleEditSubmit: (id: number) => void;
  handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startEditing: (todo: Todo) => void;
  showPriorityOptions: boolean;
  showCategoryOptions: boolean;
  showDateOptions: boolean;
}

export default function DateView({
  todos,
  onToggle,
  onDelete,
  onSelect,
  getPriorityColor,
  getCategoryColor,
  editingTodo,
  editText,
  handleEditSubmit,
  handleEditInputChange,
  startEditing,
  showPriorityOptions,
  showCategoryOptions,
  showDateOptions,
}: DateViewProps) {
  const today = new Date();
  const next7Days = addDays(today, 7);
  const nextMonth = addMonths(today, 1);

  const sections = [
    {
      title: 'Today',
      todos: todos.filter(todo => 
        !todo.archivedAt &&
        todo.dueDate && 
        new Date(todo.dueDate).toDateString() === today.toDateString()
      ),
    },
    {
      title: 'Next 7 Days',
      todos: todos.filter(todo => 
        !todo.archivedAt &&
        todo.dueDate && 
        isWithinInterval(parseISO(todo.dueDate), { 
          start: addDays(today, 1), 
          end: next7Days 
        })
      ),
    },
    {
      title: 'Next Month',
      todos: todos.filter(todo => 
        !todo.archivedAt &&
        todo.dueDate && 
        isWithinInterval(parseISO(todo.dueDate), { 
          start: addDays(next7Days, 1), 
          end: nextMonth 
        })
      ),
    },
    {
      title: 'Future Tasks',
      todos: todos.filter(todo => 
        !todo.archivedAt &&
        todo.dueDate && 
        isAfter(parseISO(todo.dueDate), nextMonth)
      ),
    },
    {
      title: 'Unassigned',
      todos: todos.filter(todo => !todo.archivedAt && !todo.dueDate),
    },
  ];

  return (
    <div className="space-y-8">
      {sections.map(({ title, todos }) => (
        <div key={title} className="mb-8">
          <div className="bg-gray-800/90 dark:bg-gray-800/90 rounded-t-xl">
            <div className="flex items-center gap-2 p-3">
              <h2 className="text-sm font-medium text-white">
                {title}
              </h2>
              <span className="text-sm text-gray-300">
                {todos.length}
              </span>
            </div>
          </div>

          <ul className="space-y-2 mt-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest('button, input, span')) {
                    onSelect(todo);
                  }
                }}
                className={`flex items-center gap-3 p-3 pr-12 group transition-colors ${getPriorityColor(todo.priority)} rounded-lg cursor-pointer relative`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggle(todo.id)}
                  className="w-4 h-4 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                />
                
                {editingTodo === todo.id ? (
                  <div className="flex-1 relative">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEditSubmit(todo.id);
                      }}
                    >
                      <input
                        type="text"
                        value={editText}
                        onChange={handleEditInputChange}
                        onBlur={() => handleEditSubmit(todo.id)}
                        autoFocus
                        className="w-full px-2 py-1 bg-transparent text-sm text-white border-b border-white/20 focus:outline-none focus:border-white/40"
                      />
                    </form>
                  </div>
                ) : (
                  <span 
                    className={`flex-1 text-sm text-white ${todo.completed ? 'line-through text-gray-300' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(todo);
                    }}
                  >
                    {todo.text}
                  </span>
                )}

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
                  className="opacity-0 group-hover:opacity-100 absolute right-3 px-2 py-1 text-gray-300 hover:text-red-300 transition-opacity"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 