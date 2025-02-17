import Image from "next/image";
import TodoList from './components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen p-4">
      <main className="h-full">
        <h1 className="mb-4 text-3xl font-bold text-center">Dean Uata's To-Do List</h1>
        <TodoList />
      </main>
    </div>
  );
}
