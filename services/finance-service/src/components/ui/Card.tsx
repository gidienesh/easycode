// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string; // Allow passing additional classes
  style?: React.CSSProperties; // Allow passing additional styles
}

export default function Card({ children, title, className, style }: CardProps) {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    margin: '15px 0', // Add some vertical margin
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    backgroundColor: 'white',
    ...style, // Merge with passed styles
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25em',
    fontWeight: 'bold',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  };

  return (
    <div style={cardStyle} className={className}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      {children}
    </div>
  );
}
