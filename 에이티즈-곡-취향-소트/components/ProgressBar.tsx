import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 mb-2">
      <div className="flex justify-between text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">
        <span>진행 상황</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-zinc-900 h-1 overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};