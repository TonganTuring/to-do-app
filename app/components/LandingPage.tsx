import { useState } from 'react';

interface LandingPageProps {
  onTaskSubmit: (task: string) => void;
}

export default function LandingPage({ onTaskSubmit }: LandingPageProps) {
  const [task, setTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onTaskSubmit(task);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
        What you tryna work on today?
      </h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Put your tasks here..."
          className="w-full px-6 py-4 text-xl rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 
                   placeholder:text-gray-400 text-gray-800 dark:text-white bg-transparent
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                   transition-all"
          autoFocus
        />
      </form>
    </div>
  );
} 