'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/firebase/auth-context';
import { addTodo } from '../lib/firebase/todos';

export default function LandingPage() {
  const [task, setTask] = useState('');
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !task.trim()) return;

    try {
      const initialTodo = {
        text: task,
        completed: false,
        priority: 'Unassigned',
        category: 'Unassigned',
        dueDate: null,
        archivedAt: null,
      };

      await addTodo(user.uid, initialTodo);
      router.push('/todo');
    } catch (error) {
      console.error('Error creating initial todo:', error);
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
        
        {!user ? (
          <button
            onClick={signInWithGoogle}
            className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 
                     rounded-lg text-white transition-colors w-full"
          >
            Sign in with Google
          </button>
        ) : (
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
        )}
      </div>
    </div>
  );
} 