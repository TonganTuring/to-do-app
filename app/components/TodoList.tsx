'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TaskDetails from './TaskDetails';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low' | 'Unassigned';
  category: 'My God' | 'Myself' | 'My People' | 'My Work' | 'Maintenance' | 'Unassigned';
  dueDate?: string;
}

const slideUpVariants = {
  open: 'max-h-[1000px] opacity-100',
  closed: 'max-h-0 opacity-0'
};

const CATEGORIES = {
  'My God': 'green',
  'Myself': 'yellow',
  'My People': 'orange',
  'My Work': 'red',
  'Maintenance': 'blue',
  'Unassigned': 'gray'
} as const;

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<Todo['priority']>('Unassigned');
  const [newCategory, setNewCategory] = useState<Todo['category']>('Unassigned');
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [currentView, setCurrentView] = useState<'inbox' | 'priorities' | 'categories' | 'date'>('inbox');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTodo(value);

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

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: newPriority,
        category: newCategory,
        dueDate: 'Today', // You can make this dynamic
      },
    ]);
    setNewTodo('');
    setNewPriority('Unassigned');
    setNewCategory('Unassigned');
    setShowPriorityOptions(false);
    setShowCategoryOptions(false);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const groupedTodos = todos.reduce((acc, todo) => {
    const priority = todo.priority;
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(todo);
    return acc;
  }, {} as Record<Todo['priority'], Todo[]>);

  const getPriorityColor = (priority: Todo['priority'], isSection: boolean = false) => {
    switch (priority) {
      case 'High':
        return isSection 
          ? 'bg-green-900/90 dark:bg-green-900/90' 
          : 'bg-green-900/70 dark:bg-green-900/70 hover:bg-green-900/80';
      case 'Medium':
        return isSection 
          ? 'bg-yellow-900/90 dark:bg-yellow-900/90' 
          : 'bg-yellow-900/70 dark:bg-yellow-900/70 hover:bg-yellow-900/80';
      case 'Low':
        return isSection 
          ? 'bg-red-900/90 dark:bg-red-900/90' 
          : 'bg-red-900/70 dark:bg-red-900/70 hover:bg-red-900/80';
      default:
        return isSection 
          ? 'bg-gray-800/90 dark:bg-gray-800/90' 
          : 'bg-gray-800/70 dark:bg-gray-800/70 hover:bg-gray-800/80';
    }
  };

  const getCategoryColor = (category: Todo['category']) => {
    switch (category) {
      case 'My God':
        return 'bg-green-900/70 hover:bg-green-900/80';
      case 'Myself':
        return 'bg-yellow-900/70 hover:bg-yellow-900/80';
      case 'My People':
        return 'bg-orange-900/70 hover:bg-orange-900/80';
      case 'My Work':
        return 'bg-red-900/70 hover:bg-red-900/80';
      case 'Maintenance':
        return 'bg-blue-900/70 hover:bg-blue-900/80';
      case 'Unassigned':
      default:
        return 'bg-gray-800/70 hover:bg-gray-800/80';
    }
  };

  const toggleSection = (priority: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [priority]: !prev[priority]
    }));
  };

  const renderTasks = () => {
    switch (currentView) {
      case 'inbox':
        return (
          <div className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                onClick={() => setSelectedTodo(todo)}
                className={`flex items-center gap-3 p-3 group transition-colors ${getPriorityColor(todo.priority)} rounded-lg cursor-pointer`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
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
                      {todo.dueDate}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(todo.id);
                  }}
                  className="hidden group-hover:block px-2 py-1 text-gray-300 hover:text-red-300 transition-colors"
                >
                  ×
                </button>
              </li>
            ))}
          </div>
        );
      case 'priorities':
        return (
          <div className="space-y-8">
            {['High', 'Medium', 'Low', 'Unassigned'].map((priority) => (
              <div key={priority} className="mb-8">
                <div className={`rounded-t-xl ${getPriorityColor(priority as Todo['priority'], true)}`}>
                  <div className="flex items-center gap-2 p-3">
                    <button 
                      onClick={() => toggleSection(priority)}
                      className={`w-4 h-4 text-gray-300 hover:text-white transition-all duration-200 transform ${
                        collapsedSections[priority] ? 'rotate-[-90deg]' : ''
                      }`}
                    >
                      ▼
                    </button>
                    <h2 className="text-sm font-medium text-white">
                      {priority === 'Unassigned' ? 'Unassigned' : `${priority} Priority`}
                    </h2>
                    <span className="text-sm text-gray-300">
                      {groupedTodos[priority as Todo['priority']]?.length || 0}
                    </span>
                  </div>
                </div>

                <ul className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  collapsedSections[priority] 
                    ? slideUpVariants.closed
                    : slideUpVariants.open
                }`}>
                  {groupedTodos[priority as Todo['priority']]?.map((todo) => (
                    <li
                      key={todo.id}
                      className={`flex items-center gap-3 p-3 group transition-colors ${getPriorityColor(todo.priority)} rounded-lg`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
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
                            {todo.dueDate}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTodo(todo.id);
                        }}
                        className="hidden group-hover:block px-2 py-1 text-gray-300 hover:text-red-300 transition-colors"
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
      case 'categories':
        return (
          <div className="space-y-8">
            {['My God', 'Myself', 'My People', 'My Work', 'Maintenance', 'Unassigned'].map((category) => {
              const categoryTodos = todos.filter(todo => todo.category === category);
              
              return (
                <div key={category} className="mb-8">
                  <div className={`rounded-t-xl ${getCategoryColor(category as Todo['category'])}`}>
                    <div className="flex items-center gap-2 p-3">
                      <button 
                        onClick={() => toggleSection(category)}
                        className={`w-4 h-4 text-gray-300 hover:text-white transition-all duration-200 transform ${
                          collapsedSections[category] ? 'rotate-[-90deg]' : ''
                        }`}
                      >
                        ▼
                      </button>
                      <h2 className="text-sm font-medium text-white">
                        {category}
                      </h2>
                      <span className="text-sm text-gray-300">
                        {categoryTodos.length}
                      </span>
                    </div>
                  </div>

                  <ul className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    collapsedSections[category] 
                      ? slideUpVariants.closed
                      : slideUpVariants.open
                  }`}>
                    {categoryTodos.map((todo) => (
                      <li
                        key={todo.id}
                        className={`flex items-center gap-3 p-3 group transition-colors ${getCategoryColor(todo.category)} rounded-lg`}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="w-4 h-4 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                        />
                        <span className={`flex-1 text-sm text-white ${todo.completed ? 'line-through text-gray-300' : ''}`}>
                          {todo.text}
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={`flex items-center gap-1.5 text-gray-300 ${getPriorityColor(todo.priority)} px-2 py-1 rounded-md`}>
                            {todo.priority}
                          </span>
                          {todo.dueDate && (
                            <span className="text-blue-300 bg-black/30 px-2 py-1 rounded-md">
                              {todo.dueDate}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTodo(todo.id);
                          }}
                          className="hidden group-hover:block px-2 py-1 text-gray-300 hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        );
      // Add other view implementations as needed
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 overflow-auto p-6">
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex gap-2 mb-8 items-center relative">
            <input
              type="text"
              value={newTodo}
              onChange={handleInputChange}
              onFocus={() => {
                setNewPriority('Unassigned');
                setNewCategory('Unassigned');
              }}
              placeholder="Add task (use ! for priority, ~ for category)"
              className={`flex-1 px-4 py-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${getPriorityColor(newPriority)}`}
            />
            {showPriorityOptions && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                <div className="text-sm text-white-500">
                  Priority Options:
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewPriority('High');
                        setShowPriorityOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-green-200 hover:bg-green-300 dark:bg-green-900/70 dark:hover:bg-green-800/70 transition-colors"
                    >
                      High
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPriority('Medium');
                        setShowPriorityOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-900/70 dark:hover:bg-yellow-800/70 transition-colors"
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPriority('Low');
                        setShowPriorityOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-red-200 hover:bg-red-300 dark:bg-red-900/70 dark:hover:bg-red-800/70 transition-colors"
                    >
                      Low
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showCategoryOptions && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                <div className="text-sm text-white-500">
                  Category Options:
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setNewCategory('My God');
                        setShowCategoryOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-green-600/70 hover:bg-green-600/80 text-white transition-colors"
                    >
                      My God
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCategory('Myself');
                        setShowCategoryOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-yellow-600/70 hover:bg-yellow-600/80 text-white transition-colors"
                    >
                      Myself
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCategory('My People');
                        setShowCategoryOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-orange-600/70 hover:bg-orange-600/80 text-white transition-colors"
                    >
                      My People
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCategory('My Work');
                        setShowCategoryOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-red-600/70 hover:bg-red-600/80 text-white transition-colors"
                    >
                      My Work
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCategory('Maintenance');
                        setShowCategoryOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                    >
                      Maintenance
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCategory('Unassigned');
                        setShowCategoryOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-gray-600/70 hover:bg-gray-600/80 text-white transition-colors"
                    >
                      Unassigned
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
        
        {renderTasks()}
      </div>

      <TaskDetails 
        todo={selectedTodo} 
        onClose={() => setSelectedTodo(null)} 
      />
    </div>
  );
} 