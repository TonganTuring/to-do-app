import React from 'react';
import { Todo } from './TodoList';

interface TaskDetailsProps {
  todo: Todo | null;
  onClose: () => void;
}

export default function TaskDetails({ todo, onClose }: TaskDetailsProps) {
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
        <h2 className="text-lg font-semibold">Task Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Task</h3>
          <p className="mt-1">{todo.text}</p>
        </div>
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
          <p className="mt-1">{todo.dueDate}</p>
        </div>
      </div>
    </div>
  );
} 