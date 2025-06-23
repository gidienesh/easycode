import React from 'react';
import { Button, Card, Text, Group, Badge, Alert } from '@mantine/core';

interface ExampleComponentProps {
  title?: string;
  description?: string;
}

export default function ExampleComponent({ 
  title = "Example Component", 
  description = "This component demonstrates the new styling approach" 
}: ExampleComponentProps) {
  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
        </div>
        
        <div className="card-content">
          <p>{description}</p>
          
          <Alert className="mt-4" color="blue" title="Info">
            This component uses a combination of Mantine components and CSS utility classes.
          </Alert>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Mantine Components</h3>
              <p className="text-gray-600 mb-4">Using Mantine for consistent UI elements</p>
              
              <Group>
                <Button variant="filled" color="blue" size="sm">
                  Primary
                </Button>
                <Button variant="outline" size="sm">
                  Secondary
                </Button>
                <Badge color="green">Success</Badge>
              </Group>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">CSS Classes</h3>
              <p className="text-gray-600 mb-4">Using utility classes for layout and styling</p>
              
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm">
                  Primary
                </button>
                <button className="btn btn-secondary btn-sm">
                  Secondary
                </button>
                <span className="badge badge-success">
                  Success
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Design System Colors</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: 'var(--radius-lg)', 
                    margin: '0 auto var(--space-2) auto',
                    backgroundColor: 'var(--primary-color)' 
                  }}
                ></div>
                <span className="text-sm text-gray-600">Primary</span>
              </div>
              <div className="text-center">
                <div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: 'var(--radius-lg)', 
                    margin: '0 auto var(--space-2) auto',
                    backgroundColor: 'var(--success-color)' 
                  }}
                ></div>
                <span className="text-sm text-gray-600">Success</span>
              </div>
              <div className="text-center">
                <div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: 'var(--radius-lg)', 
                    margin: '0 auto var(--space-2) auto',
                    backgroundColor: 'var(--warning-color)' 
                  }}
                ></div>
                <span className="text-sm text-gray-600">Warning</span>
              </div>
              <div className="text-center">
                <div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: 'var(--radius-lg)', 
                    margin: '0 auto var(--space-2) auto',
                    backgroundColor: 'var(--error-color)' 
                  }}
                ></div>
                <span className="text-sm text-gray-600">Error</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 