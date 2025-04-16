'use client';

import TodoList from '@/components/TodoList';
import PomodoroTimer from '@/components/PomodoroTimer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <div className="container mx-auto h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="p-8 border-r border-gray-800">
            <TodoList />
          </div>
          <div className="flex items-center justify-center">
            <PomodoroTimer />
          </div>
        </div>
      </div>
    </main>
  );
}
