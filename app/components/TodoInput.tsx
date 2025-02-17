import { useState } from 'react';
import { Todo } from '../types/todo';
import PriorityOptions from './options/PriorityOptions';
import CategoryOptions from './options/CategoryOptions';
import DateOptions from './options/DateOptions';

interface TodoInputProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'completed'>) => void;
  getPriorityColor: (priority: Todo['priority']) => string;
}

export default function TodoInput({ onSubmit, getPriorityColor }: TodoInputProps) {
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<Todo['priority']>('Unassigned');
  const [newCategory, setNewCategory] = useState<Todo['category']>('Unassigned');
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showDateOptions, setShowDateOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTodo(value);

    // Check for date command
    if (value.includes('*')) {
      setShowDateOptions(true);
    } else {
      setShowDateOptions(false);
    }

    // Check for priority command
    if (value.includes('!')) {
      const priorityText = value.toLowerCase().split('!')[1];
      if (priorityText.startsWith('h')) {
        setNewPriority('High');
        setNewTodo(value.replace(/!h\w*/, '').trim());
      } else if (priorityText.startsWith('m')) {
        setNewPriority('Medium');
        setNewTodo(value.replace(/!m\w*/, '').trim());
      } else if (priorityText.startsWith('l')) {
        setNewPriority('Low');
        setNewTodo(value.replace(/!l\w*/, '').trim());
      }
      setShowPriorityOptions(true);
    } else {
      setShowPriorityOptions(false);
    }

    // Check for category command
    if (value.includes('~')) {
      const categoryText = value.toLowerCase().split('~')[1];
      if (categoryText.startsWith('g')) {
        setNewCategory('My God');
        setNewTodo(value.replace(/~g\w*/, '').trim());
      } else if (categoryText.startsWith('m') && categoryText.length > 1) {
        if (categoryText[1] === 'a') {
          setNewCategory('Maintenance');
          setNewTodo(value.replace(/~ma\w*/, '').trim());
        } else {
          setNewCategory('Myself');
          setNewTodo(value.replace(/~m\w*/, '').trim());
        }
      } else if (categoryText.startsWith('p')) {
        setNewCategory('My People');
        setNewTodo(value.replace(/~p\w*/, '').trim());
      } else if (categoryText.startsWith('w')) {
        setNewCategory('My Work');
        setNewTodo(value.replace(/~w\w*/, '').trim());
      }
      setShowCategoryOptions(true);
    } else {
      setShowCategoryOptions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    let dueDate: Date | null = null;
    let todoText = newTodo;

    // Check for date pattern anywhere in the text
    const dateMatch = todoText.match(/\*([\w\s]+)/);
    if (dateMatch) {
      const datePart = dateMatch[1].trim();
      dueDate = parseDateExpression(datePart);
      todoText = todoText.replace(/\*[\w\s]+/, '').trim();
    }

    onSubmit({
      text: todoText,
      priority: newPriority,
      category: newCategory,
      dueDate: dueDate ? dueDate.toISOString() : null,
    });

    setNewTodo('');
    setNewPriority('Unassigned');
    setNewCategory('Unassigned');
    setShowPriorityOptions(false);
    setShowCategoryOptions(false);
    setShowDateOptions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2 mb-8 items-center relative">
        <input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          onFocus={() => {
            setNewPriority('Unassigned');
            setNewCategory('Unassigned');
          }}
          placeholder="Add task (use ! for priority, ~ for category, * for date)"
          className={`flex-1 px-4 py-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            newTodo ? getPriorityColor(newPriority) : 'bg-gray-800/70 dark:bg-gray-800/70'
          }`}
        />
        {showPriorityOptions && (
          <PriorityOptions
            onSelect={(priority) => {
              setNewPriority(priority);
              setShowPriorityOptions(false);
            }}
          />
        )}
        {showCategoryOptions && (
          <CategoryOptions
            onSelect={(category) => {
              setNewCategory(category);
              setShowCategoryOptions(false);
            }}
          />
        )}
        {showDateOptions && (
          <DateOptions
            onSelect={(dateText) => {
              setNewTodo((prev) => {
                const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                return `${withoutDate} *${dateText}`.trim();
              });
              setShowDateOptions(false);
            }}
          />
        )}
      </div>
    </form>
  );
} 