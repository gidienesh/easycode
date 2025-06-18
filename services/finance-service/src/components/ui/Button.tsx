// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
  // Add other props like size, etc. if needed
}

export default function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  // Basic styling for different variants
  const baseStyle: React.CSSProperties = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1em',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#0070f3',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#eaeaea',
      color: '#333',
      border: '1px solid #ccc',
    },
    destructive: {
      backgroundColor: '#f44336',
      color: 'white',
    },
  };

  return (
    <button style={{ ...baseStyle, ...variantStyles[variant] }} {...props}>
      {children}
    </button>
  );
}
