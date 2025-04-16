'use client';

import { useState, useEffect } from 'react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_MODES = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const PRESET_TIMES = {
  '25:00': 25 * 60,
  '15:00': 15 * 60,
  '05:00': 5 * 60,
  '01:00': 1 * 60,
} as const;

interface TimeSpinnerProps {
  value: number;
  onChange: (value: number) => void;
  isRunning: boolean;
}

function TimeSpinner({ value, onChange, isRunning }: TimeSpinnerProps) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const adjustTime = (type: 'minutes' | 'seconds', delta: number) => {
    if (isRunning) return;
    
    let newMinutes = minutes;
    let newSeconds = seconds;

    if (type === 'minutes') {
      newMinutes = Math.max(0, Math.min(99, minutes + delta));
    } else {
      newSeconds = seconds + delta;
      if (newSeconds >= 60) {
        newSeconds = 0;
        newMinutes = Math.min(99, minutes + 1);
      } else if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes = Math.max(0, minutes - 1);
      }
    }

    onChange(newMinutes * 60 + newSeconds);
  };

  return (
    <div className="flex items-center justify-center gap-4 text-8xl font-bold tracking-wider relative">
      <div className="flex flex-col items-center">
        <button 
          onClick={() => adjustTime('minutes', 1)}
          disabled={isRunning}
          className="text-2xl text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all"
        >
          ▲
        </button>
        <span className="w-32 text-center transition-all duration-300 ease-in-out">
          {minutes.toString().padStart(2, '0')}
        </span>
        <button 
          onClick={() => adjustTime('minutes', -1)}
          disabled={isRunning}
          className="text-2xl text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all"
        >
          ▼
        </button>
      </div>
      <span className={`animate-pulse ${isRunning ? 'opacity-50' : 'opacity-100'}`}>:</span>
      <div className="flex flex-col items-center">
        <button 
          onClick={() => adjustTime('seconds', 1)}
          disabled={isRunning}
          className="text-2xl text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all"
        >
          ▲
        </button>
        <span className="w-32 text-center transition-all duration-300 ease-in-out">
          {seconds.toString().padStart(2, '0')}
        </span>
        <button 
          onClick={() => adjustTime('seconds', -1)}
          disabled={isRunning}
          className="text-2xl text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all"
        >
          ▼
        </button>
      </div>
      {isRunning && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            animation: 'timerPulse 2s infinite'
          }}
        />
      )}
    </div>
  );
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const audio = new Audio('/notification.mp3');
      audio.play();
      setIsRunning(false);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (timeLeft === 0) return;
    setIsRunning(!isRunning);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const changeMode = (newMode: TimerMode) => {
    if (mode !== newMode) {
      setIsTransitioning(true);
      setTimeout(() => {
        setMode(newMode);
        setTimeLeft(TIMER_MODES[newMode]);
        setIsRunning(false);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const setTime = (seconds: number) => {
    if (!isRunning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setTimeLeft(seconds);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      <div className="flex space-x-4">
        <button 
          className={`mode-button transform transition-all duration-300 ${
            mode === 'focus' ? 'active scale-105' : 'hover:scale-105'
          }`}
          onClick={() => changeMode('focus')}
        >
          Focus
        </button>
        <button 
          className={`mode-button transform transition-all duration-300 ${
            mode === 'shortBreak' ? 'active scale-105' : 'hover:scale-105'
          }`}
          onClick={() => changeMode('shortBreak')}
        >
          Short Break
        </button>
        <button 
          className={`mode-button transform transition-all duration-300 ${
            mode === 'longBreak' ? 'active scale-105' : 'hover:scale-105'
          }`}
          onClick={() => changeMode('longBreak')}
        >
          Long Break
        </button>
      </div>

      <div className={`transform transition-all duration-300 ${isTransitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        <TimeSpinner 
          value={timeLeft}
          onChange={setTimeLeft}
          isRunning={isRunning}
        />
      </div>

      <div className="flex space-x-4">
        {Object.entries(PRESET_TIMES).map(([label, seconds]) => (
          <button 
            key={label}
            className={`time-button transform transition-all duration-300 ${
              timeLeft === seconds ? 'active scale-105' : 'hover:scale-105'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setTime(seconds)}
            disabled={isRunning}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={toggleTimer}
        disabled={timeLeft === 0}
        className={`px-12 py-2 bg-green-500 text-black rounded-full text-lg font-medium 
          transform transition-all duration-300
          ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-gray-200'} 
          ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          ${isTransitioning ? 'scale-95 opacity-50' : 'scale-100'}`}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  );
} 