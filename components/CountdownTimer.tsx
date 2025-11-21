import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  nextUpdate: number; // Timestamp
  totalDuration: number; // ms (10 mins)
  onComplete: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ nextUpdate, totalDuration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, nextUpdate - now);
      
      setTimeLeft(remaining);
      
      const percentage = (remaining / totalDuration) * 100;
      setProgress(percentage);

      if (remaining <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextUpdate, totalDuration, onComplete]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  // SVG Circle math
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-wealth-100/50 px-4 py-2 rounded-full border border-wealth-200 backdrop-blur-sm">
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Background circle */}
        <svg className="transform -rotate-90 w-10 h-10">
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-wealth-200"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-wealth-600 transition-all duration-1000 ease-linear"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-wealth-500 font-medium uppercase tracking-wide">Next Insight</span>
        <span className="text-sm font-mono font-semibold text-wealth-800">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};