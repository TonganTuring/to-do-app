'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [task, setTask] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      // Store the initial task in localStorage
      const initialTodo = {
        id: Date.now(),
        text: task,
        completed: false,
        priority: 'Unassigned',
        category: 'Unassigned',
        dueDate: null,
        archivedAt: null,
      };
      localStorage.setItem('initialTodo', JSON.stringify(initialTodo));
      router.push('/todo');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-x">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl px-4">
        <h1 className="text-5xl font-bold mb-12 text-center text-white 
                     animate-fade-in animate-float">
          What you tryna work on today?
        </h1>
        
        <form onSubmit={handleSubmit} className="w-full animate-slide-up">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Put your tasks here..."
            className="w-full px-6 py-4 text-lg bg-gray-800/50 backdrop-blur-sm 
                     rounded-lg border border-gray-700/50 text-white
                     placeholder:text-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500/50 focus:border-transparent transition-all
                     shadow-lg animate-float-delayed"
          />
        </form>
      </div>
    </div>
  );
} 