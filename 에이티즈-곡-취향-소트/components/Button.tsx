import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  const baseStyles = "cursor-pointer px-6 py-3 rounded-none font-bold transition-all duration-200 border text-sm tracking-wide disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-black text-white border-white hover:bg-white hover:text-black",
    secondary: "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white",
    accent: "bg-white text-black border-white hover:bg-zinc-200",
    ghost: "bg-transparent text-zinc-500 hover:text-white border-transparent py-2 px-3",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};