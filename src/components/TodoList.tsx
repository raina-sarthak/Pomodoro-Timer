'use client';

import { useState, useMemo } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  return (
    <div className="mb-6 relative">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span 
            className="text-sm font-medium transition-all duration-500"
            style={{ 
              color: percentage === 100 ? '#10B981' : '#9CA3AF'
            }}
          >
            {percentage}%
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {completed}/{total} tasks completed
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: percentage === 100 ? '#10B981' : '#FFFFFF',
            boxShadow: `0 0 10px ${percentage === 100 ? '#10B98155' : '#FFFFFF33'}`
          }}
        />
      </div>
      {percentage === 100 && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
            animation: 'pulse 2s infinite'
          }}
        />
      )}
    </div>
  );
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'pending' | 'completed'>('pending');

  const { completedCount, filteredTodos } = useMemo(() => {
    const completed = todos.filter(todo => todo.completed).length;
    const filtered = todos.filter(todo => 
      filter === 'pending' ? !todo.completed : todo.completed
    );
    return { completedCount: completed, filteredTodos: filtered };
  }, [todos, filter]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const resetCompletedTasks = () => {
    setTodos(todos.filter(todo => !todo.completed));
    if (filter === 'completed') {
      setFilter('pending');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <button 
            className={`text-gray-400 hover:text-white transition-colors ${filter === 'pending' ? 'text-white' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`text-gray-400 hover:text-white transition-colors ${filter === 'completed' ? 'text-white' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <div className="flex items-center gap-4">
          {filter === 'completed' && completedCount > 0 && (
            <button 
              onClick={resetCompletedTasks}
              className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Reset Tasks
            </button>
          )}
          <span className="text-gray-400">
            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>{filter === 'pending' ? 'No pending tasks' : 'No completed tasks'}</p>
          {filter === 'pending' && (
            <button 
              onClick={() => document.getElementById('todo-input')?.focus()}
              className="mt-2 text-gray-500 hover:text-white transition-colors"
            >
              Add a new task
            </button>
          )}
        </div>
      ) : (
        <ul className="flex-1 space-y-2 overflow-y-auto">
          {filteredTodos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg group"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5 rounded-full border-2 border-gray-600 checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0 bg-transparent"
                />
                <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <ProgressBar completed={completedCount} total={todos.length} />
      )}

      <form onSubmit={addTodo}>
        <input
          id="todo-input"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-4 py-3 bg-gray-800/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
        />
      </form>
    </div>
  );
} 