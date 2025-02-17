'use client';

import { useState } from 'react';
import TodoList from './components/TodoList';
import LandingPage from './components/LandingPage';

export default function Home() {
  const [showTodoList, setShowTodoList] = useState(false);
  const [initialTask, setInitialTask] = useState('');

  const handleTaskSubmit = (task: string) => {
    setInitialTask(task);
    setShowTodoList(true);
  };

  if (!showTodoList) {
    return <LandingPage onTaskSubmit={handleTaskSubmit} />;
  }

  return (
    <div className="min-h-screen p-4">
      <main className="h-full">
        <TodoList initialTask={initialTask} />
      </main>
    </div>
  );
}
