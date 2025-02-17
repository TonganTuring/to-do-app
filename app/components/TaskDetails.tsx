import React, { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import PriorityOptions from './options/PriorityOptions';
import CategoryOptions from './options/CategoryOptions';
import DateOptions from './options/DateOptions';
import { parseDateExpression } from '../utils/dateUtils';

interface TaskDetailsProps {
  todo: Todo | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export default function TaskDetails({ todo, onClose, onUpdate }: TaskDetailsProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [newPriority, setNewPriority] = useState<Todo['priority']>('Unassigned');
  const [newCategory, setNewCategory] = useState<Todo['category']>('Unassigned');
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showDateOptions, setShowDateOptions] = useState(false);
  
  useEffect(() => {
    if (todo) {
      setTitleText(todo.text);
      setNewPriority(todo.priority);
      setNewCategory(todo.category);
    }
  }, [todo]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitleText(value);

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
        setTitleText(value.replace(/!h\w*/, '').trim());
      } else if (priorityText.startsWith('m')) {
        setNewPriority('Medium');
        setTitleText(value.replace(/!m\w*/, '').trim());
      } else if (priorityText.startsWith('l')) {
        setNewPriority('Low');
        setTitleText(value.replace(/!l\w*/, '').trim());
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
        setTitleText(value.replace(/~g\w*/, '').trim());
      } else if (categoryText.startsWith('m') && categoryText.length > 1) {
        if (categoryText[1] === 'a') {
          setNewCategory('Maintenance');
          setTitleText(value.replace(/~ma\w*/, '').trim());
        } else {
          setNewCategory('Myself');
          setTitleText(value.replace(/~m\w*/, '').trim());
        }
      } else if (categoryText.startsWith('p')) {
        setNewCategory('My People');
        setTitleText(value.replace(/~p\w*/, '').trim());
      } else if (categoryText.startsWith('w')) {
        setNewCategory('My Work');
        setTitleText(value.replace(/~w\w*/, '').trim());
      }
      setShowCategoryOptions(true);
    } else {
      setShowCategoryOptions(false);
    }
  };

  const handleTitleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!todo) return;
    
    let dueDate = todo.dueDate;
    let finalText = titleText;

    // Check for date pattern anywhere in the text
    const dateMatch = titleText.match(/\*([\w\s]+)/);
    if (dateMatch) {
      const datePart = dateMatch[1].trim();
      const newDate = parseDateExpression(datePart);
      if (newDate) {
        dueDate = newDate.toISOString();
      }
      finalText = titleText.replace(/\*[\w\s]+/, '').trim();
    }

    onUpdate(todo.id, { 
      text: finalText,
      priority: newPriority,
      category: newCategory,
      dueDate
    });
    setEditingTitle(false);
    setShowPriorityOptions(false);
    setShowCategoryOptions(false);
    setShowDateOptions(false);
  };

  if (!todo) {
    return (
      <div className="w-80 h-full border-l border-gray-200 dark:border-gray-800 p-4">
        <p className="text-gray-500 dark:text-gray-400">Select a task to view details</p>
      </div>
    );
  }

  return (
    <div className="w-80 h-full border-l border-gray-200 dark:border-gray-800 p-4">
      <div className="flex justify-between items-center mb-4">
        {editingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex-1 relative">
            <input
              type="text"
              value={titleText}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              autoFocus
              className="w-full px-2 py-1 text-lg font-semibold bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500"
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
                  setTitleText((prev) => {
                    const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                    return `${withoutDate} *${dateText}`.trim();
                  });
                  setShowDateOptions(false);
                }}
              />
            )}
          </form>
        ) : (
          <h2 
            className="text-lg font-semibold cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() => setEditingTitle(true)}
          >
            {todo.text}
          </h2>
        )}
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Priority</h3>
          <p className="mt-1">{todo.priority}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Category</h3>
          <p className="mt-1">{todo.category}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
          <p className="mt-1">{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date'}</p>
        </div>
      </div>
    </div>
  );
} 