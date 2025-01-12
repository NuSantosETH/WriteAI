import React from 'react';
import { clsx } from 'clsx';

interface ThemeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick: () => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  title,
  description,
  icon,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02]',
        'border-2 hover:shadow-lg relative group overflow-hidden',
        selected
          ? 'border-blue-500 bg-blue-900/30'
          : 'border-gray-700 hover:border-blue-500/50 bg-gray-800/50',
        'dark:bg-gray-800/30 backdrop-blur-sm'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
      
      <div className="relative flex items-center gap-4">
        <div className={clsx(
          "text-blue-400 w-12 h-12 flex items-center justify-center rounded-lg",
          "bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300",
          selected && "animate-pulse"
        )}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};