'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import TaskDetails from './TaskDetails';
import DateView from './views/DateView';
import CategoryView from './views/CategoryView';
import ArchiveView from './views/ArchiveView';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { parseDateExpression } from '../utils/dateUtils';
import { useAuth } from '../lib/firebase/auth-context';
import { getUserTodos, addTodo, updateTodo, deleteTodo } from '../lib/firebase/todos';
import { Todo } from '../types/todo';

const slideUpVariants = {
  open: 'max-h-[1000px] opacity-100',
  closed: 'max-h-0 opacity-0'
};

export default function TodoList() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<Todo['priority']>('Unassigned');
  const [newCategory, setNewCategory] = useState<Todo['category']>('Unassigned');
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [currentView, setCurrentView] = useState<'inbox' | 'priorities' | 'categories' | 'date' | 'archive'>('inbox');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const loadTodos = useCallback(async () => {
    if (!user) return;
    try {
      const userTodos = await getUserTodos(user.uid);
      setTodos(userTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadTodos();
    } else {
      setTodos([]);
    }
  }, [user, loadTodos]);

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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditText(value);

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
        setEditText(value.replace(/!h\w*/, '').trim());
      } else if (priorityText.startsWith('m')) {
        setNewPriority('Medium');
        setEditText(value.replace(/!m\w*/, '').trim());
      } else if (priorityText.startsWith('l')) {
        setNewPriority('Low');
        setEditText(value.replace(/!l\w*/, '').trim());
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
        setEditText(value.replace(/~g\w*/, '').trim());
      } else if (categoryText.startsWith('m') && categoryText.length > 1) {
        if (categoryText[1] === 'a') {
          setNewCategory('Maintenance');
          setEditText(value.replace(/~ma\w*/, '').trim());
        } else {
          setNewCategory('Myself');
          setEditText(value.replace(/~m\w*/, '').trim());
        }
      } else if (categoryText.startsWith('p')) {
        setNewCategory('My People');
        setEditText(value.replace(/~p\w*/, '').trim());
      } else if (categoryText.startsWith('w')) {
        setNewCategory('My Work');
        setEditText(value.replace(/~w\w*/, '').trim());
      }
      setShowCategoryOptions(true);
    } else {
      setShowCategoryOptions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTodo.trim()) return;

    try {
      const todo = {
        text: newTodo,
        completed: false,
        priority: newPriority,
        category: newCategory,
        dueDate: null,
        archivedAt: null,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      const addedTodo = await addTodo(user.uid, todo);
      setTodos(prev => [addedTodo, ...prev]);
      setNewTodo('');
      setNewPriority('Unassigned');
      setNewCategory('Unassigned');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    try {
      await updateTodo(todoId, { completed: !todo.completed });
      setTodos(prev => prev.map(t => 
        t.id === todoId ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleEditSubmit = async (todoId: string) => {
    if (!editText.trim()) return;

    try {
      await updateTodo(todoId, { 
        text: editText,
        priority: newPriority,
        category: newCategory,
      });
      setTodos(prev => prev.map(t => 
        t.id === todoId ? { 
          ...t, 
          text: editText,
          priority: newPriority,
          category: newCategory,
        } : t
      ));
      setEditingTodo(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodoItem = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
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

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id.toString());
    setEditText(todo.text);
    setNewPriority(todo.priority);
    setNewCategory(todo.category);
  };

  const updateTodoItem = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

const getLatestTodo = (todoId: string | null) => {
    if (!todoId) return null;
    return todos.find(t => t.id === todoId) || null;
  };

  const renderTasks = () => {
    switch (currentView) {
      case 'archive':
        return (
          <ArchiveView
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodoItem}
            onSelect={setSelectedTodo}
            getPriorityColor={getPriorityColor}
            getCategoryColor={getCategoryColor}
          />
        );
      case 'inbox':
        const inboxTodos = todos.filter(todo => 
          !todo.archivedAt &&
          (todo.priority === 'Unassigned' || 
          todo.category === 'Unassigned' || 
          todo.dueDate === null)
        );
        
        return (
          <div className="space-y-4">
            {inboxTodos.map((todo) => (
              <li
                key={todo.id}
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest('button, input')) {
                    setSelectedTodo(todo);
                  }
                }}
                className={`flex items-center gap-3 p-3 group transition-colors ${getPriorityColor(todo.priority)} rounded-lg cursor-pointer relative`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id.toString())}
                  className="w-4 h-4 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                />
                {editingTodo === todo.id ? (
                  <div className="flex-1 relative">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEditSubmit(todo.id.toString());
                      }}
                    >
                      <input
                        type="text"
                        value={editText}
                        onChange={handleEditInputChange}
                        onBlur={() => handleEditSubmit(todo.id.toString())}
                        autoFocus
                        className="w-full px-2 py-1 bg-transparent text-sm text-white border-b border-white/20 focus:outline-none focus:border-white/40"
                      />
                    </form>
                    {showPriorityOptions && (
                      <div className="fixed mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
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
                      <div className="fixed mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
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
                    {showDateOptions && (
                      <div className="fixed mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                        <div className="text-sm text-white-500">
                          Date Options:
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                setNewTodo((prev) => {
                                  const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                                  return `${withoutDate} *today`.trim();
                                });
                                setShowDateOptions(false);
                              }}
                              className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                            >
                              Today
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewTodo((prev) => {
                                  const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                                  return `${withoutDate} *tomorrow`.trim();
                                });
                                setShowDateOptions(false);
                              }}
                              className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                            >
                              Tomorrow
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewTodo((prev) => {
                                  const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                                  return `${withoutDate} *next week`.trim();
                                });
                                setShowDateOptions(false);
                              }}
                              className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                            >
                              Next Week
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewTodo((prev) => {
                                  const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                                  return `${withoutDate} *next month`.trim();
                                });
                                setShowDateOptions(false);
                              }}
                              className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                            >
                              Next Month
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
                <div className="flex items-center gap-3 text-xs pr-8">
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
                    deleteTodoItem(todo.id.toString());
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute right-3 px-2 py-1 text-gray-300 hover:text-red-300 transition-opacity"
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
                      {groupedTodos[priority as Todo['priority']]?.filter(todo => !todo.archivedAt).length || 0}
                    </span>
                  </div>
                </div>

                <ul className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  collapsedSections[priority] 
                    ? slideUpVariants.closed
                    : slideUpVariants.open
                }`}>
                  {groupedTodos[priority as Todo['priority']]
                    ?.filter(todo => !todo.archivedAt)
                    .map((todo) => (
                    <li
                      key={todo.id}
                      onClick={(e) => {
                        if (!(e.target as HTMLElement).closest('button, input, span')) {
                          setSelectedTodo(todo);
                        }
                      }}
                      className={`flex items-center gap-3 p-3 group transition-colors ${getPriorityColor(todo.priority)} rounded-lg cursor-pointer relative`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id.toString())}
                        className="w-4 h-4 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                      />
                      {editingTodo === todo.id ? (
                        <div className="flex-1 relative">
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEditSubmit(todo.id.toString());
                            }}
                          >
                            <input
                              type="text"
                              value={editText}
                              onChange={handleEditInputChange}
                              onBlur={() => handleEditSubmit(todo.id.toString())}
                              autoFocus
                              className="w-full px-2 py-1 bg-transparent text-sm text-white border-b border-white/20 focus:outline-none focus:border-white/40"
                            />
                          </form>
                          {showPriorityOptions && (
                            <div className="fixed mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
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
                            <div className="fixed mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
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
                          {showDateOptions && (
                            <div className="fixed mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                              <div className="text-sm text-white-500">
                                Date Options:
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewTodo((prev) => {
                                        const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                                        return `${withoutDate} *today`.trim();
                                      });
                                      setShowDateOptions(false);
                                    }}
                                    className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                                  >
                                    Today
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewTodo((prev) => {
                                        const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                                        return `${withoutDate} *tomorrow`.trim();
                                      });
                                      setShowDateOptions(false);
                                    }}
                                    className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                                  >
                                    Tomorrow
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewTodo((prev) => {
                                        const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                                        return `${withoutDate} *next week`.trim();
                                      });
                                      setShowDateOptions(false);
                                    }}
                                    className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                                  >
                                    Next Week
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewTodo((prev) => {
                                        const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                                        return `${withoutDate} *next month`.trim();
                                      });
                                      setShowDateOptions(false);
                                    }}
                                    className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                                  >
                                    Next Month
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
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
                      <div className="flex items-center gap-3 text-xs pr-8">
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
                          deleteTodoItem(todo.id.toString());
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
      case 'categories':
        return (
          <CategoryView
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodoItem}
            onSelect={setSelectedTodo}
            getPriorityColor={getPriorityColor}
            getCategoryColor={getCategoryColor}
            editingTodo={editingTodo}
            editText={editText}
            handleEditSubmit={handleEditSubmit}
            handleEditInputChange={handleEditInputChange}
            startEditing={startEditing}
          />
        );
      case 'date':
        return (
          <DateView
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodoItem}
            onSelect={setSelectedTodo}
            getPriorityColor={getPriorityColor}
            getCategoryColor={getCategoryColor}
            editingTodo={editingTodo}
            editText={editText}
            handleEditSubmit={handleEditSubmit}
            handleEditInputChange={handleEditInputChange}
            startEditing={startEditing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 overflow-auto p-6">
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
              className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-800/70"
            />
            {!editingTodo && showPriorityOptions && (
              <div className="fixed mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
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
            {!editingTodo && showCategoryOptions && (
              <div className="fixed mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
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
            {!editingTodo && showDateOptions && (
              <div className="fixed mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                <div className="text-sm text-white-500">
                  Date Options:
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setNewTodo((prev) => {
                          const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                          return `${withoutDate} *today`.trim();
                        });
                        setShowDateOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewTodo((prev) => {
                          const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                          return `${withoutDate} *tomorrow`.trim();
                        });
                        setShowDateOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewTodo((prev) => {
                          const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                          return `${withoutDate} *next week`.trim();
                        });
                        setShowDateOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                    >
                      Next Week
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewTodo((prev) => {
                          const withoutDate = prev.replace(/\*[\w\s]+/, '').trim();
                          return `${withoutDate} *next month`.trim();
                        });
                        setShowDateOptions(false);
                      }}
                      className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
                    >
                      Next Month
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
        todo={getLatestTodo(selectedTodo?.id ?? null)}
        onClose={() => setSelectedTodo(null)} 
        onUpdate={updateTodoItem}
      />
    </div>
  );
} 